package expo.modules.applifecycleplus

import android.app.Activity
import android.app.Application
import android.os.Bundle
import androidx.lifecycle.DefaultLifecycleObserver
import androidx.lifecycle.LifecycleOwner
import androidx.lifecycle.ProcessLifecycleOwner
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class ExpoAppLifecyclePlusModule : Module(), DefaultLifecycleObserver, Application.ActivityLifecycleCallbacks {
  private var didSendStartupEvents = false
  private var currentState: String = "unknown"
  private var application: Application? = null

  override fun definition() = ModuleDefinition {
    Name("ExpoAppLifecyclePlus")

    Events("onLifecycleEvent")

    OnCreate {
      ProcessLifecycleOwner.get().lifecycle.addObserver(this@ExpoAppLifecyclePlusModule)

      val app = appContext.reactContext?.applicationContext as? Application
      application = app
      app?.registerActivityLifecycleCallbacks(this@ExpoAppLifecyclePlusModule)
    }

    OnStartObserving {
      if (!didSendStartupEvents) {
        didSendStartupEvents = true
        send("jsReload")
        send("coldStart")
      }
    }

    Function("getCurrentState") {
      currentState
    }

    OnDestroy {
      ProcessLifecycleOwner.get().lifecycle.removeObserver(this@ExpoAppLifecyclePlusModule)
      application?.unregisterActivityLifecycleCallbacks(this@ExpoAppLifecyclePlusModule)
      application = null
    }
  }

  private fun send(type: String, extra: Map<String, Any?> = emptyMap()) {
    currentState = when (type) {
      "foreground", "active" -> "foreground"
      "background", "inactive" -> "background"
      else -> currentState
    }

    val payload = mutableMapOf<String, Any?>(
      "type" to type,
      "state" to currentState,
      "timestamp" to System.currentTimeMillis(),
      "platform" to "android"
    )
    payload.putAll(extra)
    sendEvent("onLifecycleEvent", payload)
  }

  override fun onStart(owner: LifecycleOwner) {
    send("foreground")
  }

  override fun onStop(owner: LifecycleOwner) {
    send("background")
  }

  override fun onActivityResumed(activity: Activity) {
    send("focusActivity", mapOf("activity" to activity.javaClass.simpleName))
  }

  override fun onActivityPaused(activity: Activity) {
    send("blurActivity", mapOf("activity" to activity.javaClass.simpleName))
  }

  override fun onActivityCreated(activity: Activity, savedInstanceState: Bundle?) {}

  override fun onActivityStarted(activity: Activity) {}

  override fun onActivityStopped(activity: Activity) {}

  override fun onActivitySaveInstanceState(activity: Activity, outState: Bundle) {}

  override fun onActivityDestroyed(activity: Activity) {}
}
