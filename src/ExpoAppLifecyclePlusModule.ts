import { NativeModule, requireNativeModule } from 'expo';

import { ExpoAppLifecyclePlusModuleEvents } from './ExpoAppLifecyclePlus.types';

declare class ExpoAppLifecyclePlusModule extends NativeModule<ExpoAppLifecyclePlusModuleEvents> {
  PI: number;
  hello(): string;
  setValueAsync(value: string): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ExpoAppLifecyclePlusModule>('ExpoAppLifecyclePlus');
