<a id="readme-top"></a>

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

<br />
<div align="center">
  <h3 align="center">expo-app-lifecycle-plus</h3>

  <p align="center">
    Native app lifecycle event module for Expo / React Native on Android and iOS.
    <br />
    Android: Process lifecycle + optional activity focus/blur signals
    <br />
    iOS: UIApplication + UIScene notifications with inferred termination support
    <br />
    <a href="https://github.com/ademhatay/expo-app-lifecycle-plus"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/ademhatay/expo-app-lifecycle-plus/issues/new?labels=bug">Report Bug</a>
    ·
    <a href="https://github.com/ademhatay/expo-app-lifecycle-plus/issues/new?labels=enhancement">Request Feature</a>
  </p>
</div>

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#event-reference">Event Reference</a></li>
    <li><a href="#api-reference">API Reference</a></li>
    <li><a href="#platform-notes">Platform Notes</a></li>
    <li><a href="#troubleshooting">Troubleshooting</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
  </ol>
</details>

## About The Project

`expo-app-lifecycle-plus` exposes a single event channel and typed payloads so you can observe app state transitions consistently from JavaScript.

It is designed for real-world lifecycle analytics and debugging:

- `addListener((event) => ...)` to stream lifecycle events
- `getCurrentState()` to read current native state snapshot
- iOS launch/scene signals and inferred termination support
- Android process foreground/background and optional activity focus/blur

### Built With

- [Expo Modules](https://docs.expo.dev/modules/overview/)
- [React Native](https://reactnative.dev/)
- [AndroidX Lifecycle](https://developer.android.com/topic/libraries/architecture/lifecycle)
- [UIKit UIApplication Notifications](https://developer.apple.com/documentation/uikit/uiapplication)
- [UIKit UIScene Notifications](https://developer.apple.com/documentation/uikit/uiscene)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Getting Started

### Prerequisites

- Node.js LTS (`20` or `22` recommended)
- Expo / React Native app

### Installation

Expo managed or prebuild:

```bash
npx expo install expo-app-lifecycle-plus
```

Bare React Native / Expo bare:

```bash
npm install expo-app-lifecycle-plus
# or
bun add expo-app-lifecycle-plus
```

Rebuild native apps after install:

```bash
npx expo run:android
npx expo run:ios
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Usage

```ts
import * as Lifecycle from 'expo-app-lifecycle-plus';

const current = Lifecycle.getCurrentState();
console.log('current state', current);

const sub = Lifecycle.addListener((event) => {
  console.log('lifecycle event', event);
});

// later
sub.remove();
```

### Example Event Payload

```json
{
  "type": "foreground",
  "state": "foreground",
  "timestamp": 1700000000000,
  "platform": "ios"
}
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Event Reference

### Common Events

- `jsReload`
- `coldStart`
- `foreground`
- `background`

### iOS Events

- `appLaunch`
- `active`
- `inactive`
- `sceneActive`
- `sceneInactive`
- `willTerminate` (best-effort; not guaranteed)
- `inferredTermination` (emitted on next launch if app was previously backgrounded and appears to have been killed)

### Android Events

- `focusActivity`
- `blurActivity`

### Event Type

```ts
type LifecycleEvent = {
  type:
    | 'jsReload'
    | 'coldStart'
    | 'appLaunch'
    | 'inferredTermination'
    | 'foreground'
    | 'background'
    | 'active'
    | 'inactive'
    | 'willTerminate'
    | 'sceneActive'
    | 'sceneInactive'
    | 'focusActivity'
    | 'blurActivity';
  state: 'unknown' | 'foreground' | 'background' | 'active' | 'inactive';
  timestamp: number;
  platform: 'ios' | 'android';
  activity?: string;
  source?: 'didFinishLaunching' | 'observerStart';
  inferredFrom?: 'previousBackground';
  previousBackgroundTimestamp?: number;
  elapsedSinceBackgroundMs?: number;
};
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## API Reference

### `addListener(listener): EventSubscription`

Subscribes to native lifecycle updates on `onLifecycleEvent`.

```ts
addListener(listener: (event: LifecycleEvent) => void): EventSubscription
```

### `getCurrentState(): LifecycleState`

Returns current native lifecycle state snapshot.

```ts
getCurrentState(): 'unknown' | 'foreground' | 'background' | 'active' | 'inactive'
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Platform Notes

- `willTerminate` is not guaranteed on mobile OSes.
- On iOS, app kills in background may not emit a terminate callback. Use `inferredTermination` for practical analytics.
- On Android, process lifecycle (`foreground`/`background`) is generally the most reliable signal.
- `jsReload` can happen during development due to fast refresh/reload and does not always mean a fresh process launch.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Troubleshooting

### I only see `inactive -> background -> foreground -> active`

This is normal lifecycle flow on iOS when app moves between foreground/background.

### `willTerminate` is not emitted

Expected on many real-device scenarios. Mobile OS may kill apps without firing terminate callbacks.

### `coldStart` appears more than once in development

Development reload / fast refresh can recreate JS/runtime state. Use `jsReload` and `appLaunch` together to interpret startup behavior.

### TypeScript import errors

Rebuild package and restart Metro:

```bash
npm run build
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Contributing

PRs and issues are welcome.

1. Fork the project
2. Create branch
3. Commit changes
4. Push branch
5. Open PR

## License

MIT © Adem Hatay

<!-- MARKDOWN LINKS & IMAGES -->
[contributors-shield]: https://img.shields.io/github/contributors/ademhatay/expo-app-lifecycle-plus.svg?style=for-the-badge
[contributors-url]: https://github.com/ademhatay/expo-app-lifecycle-plus/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/ademhatay/expo-app-lifecycle-plus.svg?style=for-the-badge
[forks-url]: https://github.com/ademhatay/expo-app-lifecycle-plus/network/members
[stars-shield]: https://img.shields.io/github/stars/ademhatay/expo-app-lifecycle-plus.svg?style=for-the-badge
[stars-url]: https://github.com/ademhatay/expo-app-lifecycle-plus/stargazers
[issues-shield]: https://img.shields.io/github/issues/ademhatay/expo-app-lifecycle-plus.svg?style=for-the-badge
[issues-url]: https://github.com/ademhatay/expo-app-lifecycle-plus/issues
[license-shield]: https://img.shields.io/github/license/ademhatay/expo-app-lifecycle-plus.svg?style=for-the-badge
[license-url]: https://github.com/ademhatay/expo-app-lifecycle-plus/blob/main/LICENSE
