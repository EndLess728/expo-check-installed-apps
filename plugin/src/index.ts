import {
  withAndroidManifest,
  withInfoPlist,
  ConfigPlugin,
} from "@expo/config-plugins";

interface PluginOptions {
  android?: string[];
  ios?: string[];
}

const withAndroid: ConfigPlugin<PluginOptions> = (
  config,
  {
    android
  }
) => {
  if (!android) {
    return config;
  }

  config = withAndroidManifest(config, (config) => {
    config.modResults.manifest.queries = android.map(packageName => ({
      package: [{ $: { 'android:name': packageName } }], 
    }));

    return config;
  });

  return config;
};

const withIos: ConfigPlugin<PluginOptions> = (
  config,
  {
    ios
  }
) => {
  if (!ios) {
    return config;
  }

  config = withInfoPlist(config, (config) => {
    config.modResults.LSApplicationQueriesSchemes?.push(...ios);

    return config;
  })

  return config;
};

/**
 * Apply all above plugins
 */
const withExpoCheckInstalledApps: ConfigPlugin<PluginOptions> = (config, opts) => {
  config = withAndroid(config, opts);
  config = withIos(config, opts);
  return config;
};

export default withExpoCheckInstalledApps;

