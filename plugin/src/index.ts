import {
  withAndroidManifest,
  withInfoPlist,
  ConfigPlugin,
} from "@expo/config-plugins";

interface PluginOptions {
  android?: string[];
  ios?: string[];
}

const withAndroid: ConfigPlugin<PluginOptions> = (config, { android }) => {
  if (!android || android.length === 0) {
    return config;
  }

  config = withAndroidManifest(config, (config) => {
    const manifest = config.modResults.manifest;

    // Ensure `manifest` exists and is valid
    if (!manifest) {
      throw new Error("AndroidManifest.xml is invalid or missing!");
    }

    // Ensure `queries` exists
    if (!manifest.queries) {
      manifest.queries = [];
    }

    // Use the first <queries> block in the manifest
    const existingQueries = manifest.queries.find(
      (query) => query.intent || query.package
    );

    if (existingQueries) {
      // Add packages to the existing <queries> block
      if (!existingQueries.package) {
        existingQueries.package = [];
      }

      const existingPackageNames = new Set(
        existingQueries.package.map((pkg: any) => pkg.$["android:name"])
      );

      const newPackages = android
        .filter((packageName) => !existingPackageNames.has(packageName))
        .map((packageName) => ({
          $: { "android:name": packageName },
        }));

      if (newPackages.length > 0) {
        existingQueries.package.push(...newPackages);
      }
    } else {
      // Create a new <queries> block if none exists
      const newPackages = android.map((packageName) => ({
        $: { "android:name": packageName },
      }));

      manifest.queries.push({
        package: newPackages,
      });
    }

    return config;
  });

  return config;
};

const withIos: ConfigPlugin<PluginOptions> = (config, { ios }) => {
  if (!ios || ios.length === 0) {
    return config;
  }

  config = withInfoPlist(config, (config) => {
    const plist = config.modResults;

    // Ensure `LSApplicationQueriesSchemes` exists
    if (!plist.LSApplicationQueriesSchemes) {
      plist.LSApplicationQueriesSchemes = [];
    }

    // Avoid duplicates by adding only new schemes
    plist.LSApplicationQueriesSchemes = Array.from(
      new Set([...plist.LSApplicationQueriesSchemes, ...ios])
    );

    return config;
  });

  return config;
};

/**
 * Apply all above plugins
 */
const withExpoCheckInstalledApps: ConfigPlugin<PluginOptions> = (
  config,
  opts
) => {
  config = withAndroid(config, opts);
  config = withIos(config, opts);
  return config;
};

export default withExpoCheckInstalledApps;
