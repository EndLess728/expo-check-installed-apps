import {
  ConfigPlugin,
  withAndroidManifest,
  withInfoPlist,
} from "@expo/config-plugins";

const IOS_SCHEME_PATTERN = /^[A-Za-z][A-Za-z0-9+.-]*$/;

interface PluginOptions {
  android?: string[];
  ios?: string[];
}

type AndroidQueriesBlock = {
  package?: { $: { "android:name": string } }[];
};

export function normalizeAndroidPackageNames(
  packageNames: string[] = [],
): string[] {
  return Array.from(
    new Set(packageNames.map((value) => value.trim()).filter(Boolean)),
  );
}

export function normalizeIosSchemes(schemes: string[] = []): string[] {
  return Array.from(
    new Set(
      schemes.map((value) => {
        const normalizedValue = value
          .trim()
          .replace(/:\/\/.*/, "")
          .replace(/:$/, "");

        if (!normalizedValue || !IOS_SCHEME_PATTERN.test(normalizedValue)) {
          throw new Error(`Invalid iOS URL scheme: ${value}`);
        }

        return normalizedValue;
      }),
    ),
  );
}

export function applyAndroidQueries(
  manifest: { queries?: AndroidQueriesBlock[] },
  packageNames: string[],
) {
  const normalizedPackageNames = normalizeAndroidPackageNames(packageNames);

  if (normalizedPackageNames.length === 0) {
    return manifest;
  }

  if (!manifest.queries) {
    manifest.queries = [];
  }

  let queriesBlock = manifest.queries[0];

  if (!queriesBlock) {
    queriesBlock = { package: [] };
    manifest.queries.push(queriesBlock);
  }

  if (!queriesBlock.package) {
    queriesBlock.package = [];
  }

  const currentPackages = new Set(
    queriesBlock.package.map((pkg) => pkg.$["android:name"]),
  );

  normalizedPackageNames.forEach((packageName) => {
    if (!currentPackages.has(packageName)) {
      queriesBlock!.package!.push({ $: { "android:name": packageName } });
    }
  });

  return manifest;
}

export function applyIosSchemes(
  plist: { LSApplicationQueriesSchemes?: string[] },
  schemes: string[],
) {
  const normalizedSchemes = normalizeIosSchemes(schemes);

  if (normalizedSchemes.length === 0) {
    return plist;
  }

  plist.LSApplicationQueriesSchemes = Array.from(
    new Set([
      ...(plist.LSApplicationQueriesSchemes ?? []),
      ...normalizedSchemes,
    ]),
  );

  return plist;
}

const withAndroid: ConfigPlugin<PluginOptions> = (config, { android = [] }) => {
  return withAndroidManifest(config, (config) => {
    const manifest = config.modResults.manifest;

    if (!manifest) {
      throw new Error("AndroidManifest.xml is invalid or missing!");
    }

    applyAndroidQueries(manifest, android);
    return config;
  });
};

const withIos: ConfigPlugin<PluginOptions> = (config, { ios = [] }) => {
  return withInfoPlist(config, (config) => {
    applyIosSchemes(config.modResults, ios);
    return config;
  });
};

const withExpoCheckInstalledApps: ConfigPlugin<PluginOptions> = (
  config,
  opts = {},
) => {
  config = withAndroid(config, opts);
  config = withIos(config, opts);
  return config;
};

export default withExpoCheckInstalledApps;
