import { requireNativeModule } from "expo-modules-core";

export type NativeCheckInstalledAppsModule = {
  checkInstalledApps(targets: string[]): Promise<Record<string, boolean>>;
};

export default requireNativeModule<NativeCheckInstalledAppsModule>(
  "ExpoCheckInstalledApps",
);
