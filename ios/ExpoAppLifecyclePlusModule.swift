import ExpoModulesCore
import UIKit

public class ExpoAppLifecyclePlusModule: Module {
  private var didSendStartupEvents = false
  private var didSendAppLaunch = false
  private var observers: [NSObjectProtocol] = []
  private var currentState = "unknown"
  private let defaults = UserDefaults.standard
  private let pendingBackgroundKey = "expo.appLifecyclePlus.pendingBackground"
  private let backgroundTimestampKey = "expo.appLifecyclePlus.backgroundTimestamp"

  public func definition() -> ModuleDefinition {
    Name("ExpoAppLifecyclePlus")

    Events("onLifecycleEvent")

    OnCreate {
      self.currentState = self.readApplicationState()
      let center = NotificationCenter.default

      self.observers.append(center.addObserver(
        forName: UIApplication.didBecomeActiveNotification,
        object: nil,
        queue: .main
      ) { _ in
        self.clearBackgroundMarker()
        self.send(type: "active", nextState: "active")
      })

      self.observers.append(center.addObserver(
        forName: UIApplication.willResignActiveNotification,
        object: nil,
        queue: .main
      ) { _ in self.send(type: "inactive", nextState: "inactive") })

      self.observers.append(center.addObserver(
        forName: UIApplication.willEnterForegroundNotification,
        object: nil,
        queue: .main
      ) { _ in self.send(type: "foreground", nextState: "foreground") })

      self.observers.append(center.addObserver(
        forName: UIApplication.didEnterBackgroundNotification,
        object: nil,
        queue: .main
      ) { _ in
        self.markEnteredBackground()
        self.send(type: "background", nextState: "background")
      })

      self.observers.append(center.addObserver(
        forName: UIApplication.willTerminateNotification,
        object: nil,
        queue: .main
      ) { _ in
        self.clearBackgroundMarker()
        self.send(type: "willTerminate")
      })

      self.observers.append(center.addObserver(
        forName: UIApplication.didFinishLaunchingNotification,
        object: nil,
        queue: .main
      ) { _ in
        self.emitAppLaunch(source: "didFinishLaunching")
      })

      self.observers.append(center.addObserver(
        forName: UIScene.didActivateNotification,
        object: nil,
        queue: .main
      ) { _ in self.send(type: "sceneActive") })

      self.observers.append(center.addObserver(
        forName: UIScene.willDeactivateNotification,
        object: nil,
        queue: .main
      ) { _ in self.send(type: "sceneInactive") })
    }

    OnStartObserving {
      if !self.didSendStartupEvents {
        self.didSendStartupEvents = true
        self.send(type: "jsReload")
        self.send(type: "coldStart")
        self.emitAppLaunch(source: "observerStart")
      }
    }

    Function("getCurrentState") {
      self.currentState
    }

    OnDestroy {
      let center = NotificationCenter.default
      self.observers.forEach { center.removeObserver($0) }
      self.observers.removeAll()
    }
  }

  private func emitAppLaunch(source: String) {
    if didSendAppLaunch {
      return
    }
    didSendAppLaunch = true
    send(type: "appLaunch", extra: ["source": source])
    emitInferredTerminationIfNeeded()
  }

  private func markEnteredBackground() {
    defaults.set(true, forKey: pendingBackgroundKey)
    defaults.set(Int(Date().timeIntervalSince1970 * 1000), forKey: backgroundTimestampKey)
  }

  private func clearBackgroundMarker() {
    defaults.set(false, forKey: pendingBackgroundKey)
  }

  private func emitInferredTerminationIfNeeded() {
    guard defaults.bool(forKey: pendingBackgroundKey) else {
      return
    }

    let nowMs = Int(Date().timeIntervalSince1970 * 1000)
    let lastBackgroundAt = defaults.integer(forKey: backgroundTimestampKey)
    let elapsedMs = lastBackgroundAt > 0 ? nowMs - lastBackgroundAt : nil

    send(
      type: "inferredTermination",
      extra: [
        "inferredFrom": "previousBackground",
        "previousBackgroundTimestamp": lastBackgroundAt > 0 ? lastBackgroundAt : nil,
        "elapsedSinceBackgroundMs": elapsedMs
      ]
    )
    clearBackgroundMarker()
  }

  private func readApplicationState() -> String {
    switch UIApplication.shared.applicationState {
    case .active:
      return "active"
    case .inactive:
      return "inactive"
    case .background:
      return "background"
    @unknown default:
      return "unknown"
    }
  }

  private func send(type: String, nextState: String? = nil, extra: [String: Any?] = [:]) {
    if let nextState {
      self.currentState = nextState
    }

    var payload: [String: Any?] = [
      "type": type,
      "state": self.currentState,
      "timestamp": Int(Date().timeIntervalSince1970 * 1000),
      "platform": "ios"
    ]
    extra.forEach { payload[$0.key] = $0.value }
    sendEvent("onLifecycleEvent", payload)
  }
}
