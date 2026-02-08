import { NativeModule, requireNativeModule } from 'expo';

import { ExpoAppLifecyclePlusModuleEvents, LifecycleState } from './ExpoAppLifecyclePlus.types';

declare class ExpoAppLifecyclePlusModule extends NativeModule<ExpoAppLifecyclePlusModuleEvents> {
  getCurrentState(): LifecycleState;
}

export default requireNativeModule<ExpoAppLifecyclePlusModule>('ExpoAppLifecyclePlus');
