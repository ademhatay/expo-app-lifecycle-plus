import * as React from 'react';

import { ExpoAppLifecyclePlusViewProps } from './ExpoAppLifecyclePlus.types';

export default function ExpoAppLifecyclePlusView(props: ExpoAppLifecyclePlusViewProps) {
  return (
    <div>
      <iframe
        style={{ flex: 1 }}
        src={props.url}
        onLoad={() => props.onLoad({ nativeEvent: { url: props.url } })}
      />
    </div>
  );
}
