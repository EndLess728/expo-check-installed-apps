import { Platform } from "react-native";

const ANDROID_PACKAGE_NAME_PATTERN = /^[A-Za-z0-9_]+(\.[A-Za-z0-9_]+)+$/;
const IOS_SCHEME_PATTERN = /^[A-Za-z][A-Za-z0-9+.-]*$/;

function normalizeAndroidPackageName(value: string): string {
  if (!ANDROID_PACKAGE_NAME_PATTERN.test(value)) {
    throw new Error(`Invalid Android package name: ${value}`);
  }

  return value;
}

function normalizeIosScheme(value: string): string {
  const scheme = value.replace(/:\/\/.*/, "").replace(/:$/, "");

  if (!IOS_SCHEME_PATTERN.test(scheme)) {
    throw new Error(`Invalid iOS URL scheme: ${value}`);
  }

  return scheme;
}

export function normalizeTargets(targets: string[]): string[] {
  if (!Array.isArray(targets)) {
    throw new TypeError(
      "checkInstalledApps expects an array of package names or URL schemes.",
    );
  }

  const normalizedTargets = targets.map((target) => {
    if (typeof target !== "string") {
      throw new TypeError("checkInstalledApps targets must be strings.");
    }

    const trimmedTarget = target.trim();

    if (!trimmedTarget) {
      throw new Error("checkInstalledApps targets cannot be empty.");
    }

    return Platform.OS === "ios"
      ? normalizeIosScheme(trimmedTarget)
      : normalizeAndroidPackageName(trimmedTarget);
  });

  return Array.from(new Set(normalizedTargets));
}
