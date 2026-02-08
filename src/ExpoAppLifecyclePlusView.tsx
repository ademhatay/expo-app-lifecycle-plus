import { requireNativeView } from 'expo';
import * as React from 'react';

import { ExpoAppLifecyclePlusViewProps } from './ExpoAppLifecyclePlus.types';

const NativeView: React.ComponentType<ExpoAppLifecyclePlusViewProps> =
  requireNativeView('ExpoAppLifecyclePlus');

export default function ExpoAppLifecyclePlusView(props: ExpoAppLifecyclePlusViewProps) {
  return <NativeView {...props} />;
}
