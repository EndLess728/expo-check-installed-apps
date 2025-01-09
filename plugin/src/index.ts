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

    // Get the first `<queries>` block or create one if none exists
    let queriesBlock = manifest.queries.find((query) => query.package);

    if (!queriesBlock) {
      // If no `<queries>` block exists, create one
      queriesBlock = { package: [] };
      manifest.queries.push(queriesBlock);
    }

    // Ensure `queriesBlock.package` exists
    if (!queriesBlock.package) {
      queriesBlock.package = [];
    }

    // Extract current packages from the manifest
    const currentPackages = new Set(
      queriesBlock.package?.map((pkg: any) => pkg.$["android:name"]) || []
    );

    // Convert the `android` array from `app.json` into a Set for easy comparison
    const desiredPackages = new Set(android || []);

    // Determine packages to add and remove
    const packagesToAdd = Array.from(desiredPackages).filter(
      (pkg) => !currentPackages.has(pkg)
    );
    const packagesToRemove = Array.from(currentPackages).filter(
      (pkg) => !desiredPackages.has(pkg)
    );

    // Add new packages
    packagesToAdd.forEach((pkg) => {
      queriesBlock!.package!.push({ $: { "android:name": pkg } });
    });

    // Remove packages no longer in `app.json`
    queriesBlock.package = queriesBlock.package!.filter(
      (pkg: any) => !packagesToRemove.includes(pkg.$["android:name"])
    );

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
