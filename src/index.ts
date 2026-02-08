// Reexport the native module. On web, it will be resolved to ExpoAppLifecyclePlusModule.web.ts
// and on native platforms to ExpoAppLifecyclePlusModule.ts
export { default } from './ExpoAppLifecyclePlusModule';
export { default as ExpoAppLifecyclePlusView } from './ExpoAppLifecyclePlusView';
export * from  './ExpoAppLifecyclePlus.types';
