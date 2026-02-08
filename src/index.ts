import { EventSubscription } from 'expo-modules-core';

import Module from './ExpoAppLifecyclePlusModule';
import { LifecycleEvent, LifecycleState } from './ExpoAppLifecyclePlus.types';

export * from './ExpoAppLifecyclePlus.types';

export function addListener(listener: (event: LifecycleEvent) => void): EventSubscription {
  return Module.addListener('onLifecycleEvent', listener);
}

export function getCurrentState(): LifecycleState {
  return Module.getCurrentState();
}
