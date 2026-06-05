import ExpoCheckInstalledAppsModule from "./ExpoCheckInstalledAppsModule";
import { normalizeTargets } from "./normalizeTargets";

export async function checkInstalledApps(
  targets: string[],
): Promise<Record<string, boolean>> {
  const normalizedTargets = normalizeTargets(targets);

  if (normalizedTargets.length === 0) {
    return {};
  }

  return ExpoCheckInstalledAppsModule.checkInstalledApps(normalizedTargets);
}
