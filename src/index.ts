import ExpoCheckInstalledAppsModule from "./ExpoCheckInstalledAppsModule";

// Get the native constant value.
export const PI = ExpoCheckInstalledAppsModule.PI;

export function hello(): string {
  return ExpoCheckInstalledAppsModule.hello();
}

export async function checkInstalledApps(
  packageNames: Array<string>
): Promise<Record<string, boolean>> {
  return ExpoCheckInstalledAppsModule.checkAppsInstalled(packageNames);
}

export function checkInstalledAppsSync(
  packageNames: Array<string>
): Record<string, boolean> {
  return ExpoCheckInstalledAppsModule.checkAppsInstalledSync(packageNames);
}

export async function setValueAsync(value: string) {
  return await ExpoCheckInstalledAppsModule.setValueAsync(value);
}
