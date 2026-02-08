import { registerWebModule, NativeModule } from 'expo';

import { ExpoAppLifecyclePlusModuleEvents } from './ExpoAppLifecyclePlus.types';

class ExpoAppLifecyclePlusModule extends NativeModule<ExpoAppLifecyclePlusModuleEvents> {
  PI = Math.PI;
  async setValueAsync(value: string): Promise<void> {
    this.emit('onChange', { value });
  }
  hello() {
    return 'Hello world! 👋';
  }
}

export default registerWebModule(ExpoAppLifecyclePlusModule, 'ExpoAppLifecyclePlusModule');
