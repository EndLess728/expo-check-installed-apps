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

    // Create a single new <queries> block with all new packages
    const newPackages = android.map((packageName) => ({
      $: { "android:name": packageName },
    }));

    const newQueriesBlock = {
      package: newPackages,
    };

    // Check if the new query block already exists
    const queryExists = manifest.queries.some(
      (query) => JSON.stringify(query) === JSON.stringify(newQueriesBlock)
    );

    if (!queryExists) {
      // Append the new <queries> block while preserving existing blocks
      manifest.queries.push(newQueriesBlock);
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
