export type LifecycleEventType =
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

export type LifecycleState = 'unknown' | 'foreground' | 'background' | 'active' | 'inactive';

export type LifecycleEvent = {
  type: LifecycleEventType;
  state: LifecycleState;
  timestamp: number;
  platform: 'ios' | 'android';
  activity?: string;
  source?: 'didFinishLaunching' | 'observerStart';
  inferredFrom?: 'previousBackground';
  previousBackgroundTimestamp?: number;
  elapsedSinceBackgroundMs?: number;
};

export type ExpoAppLifecyclePlusModuleEvents = {
  onLifecycleEvent: (event: LifecycleEvent) => void;
};
