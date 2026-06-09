<h1 align="center">expo-check-installed-apps</h1>

<p align="center">
  Check whether apps are installed on Android and iOS from your Expo or React Native project.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/expo-check-installed-apps">
    <img src="https://img.shields.io/npm/v/expo-check-installed-apps?style=flat-square&color=f97316&logo=npm&label=npm" alt="npm version" />
  </a>
  <a href="https://www.npmjs.com/package/expo-check-installed-apps">
    <img src="https://img.shields.io/npm/dt/expo-check-installed-apps?style=flat-square&color=22c55e&logo=npm&label=downloads" alt="npm total downloads" />
  </a>
  <a href="https://www.npmjs.com/package/expo-check-installed-apps">
    <img src="https://img.shields.io/npm/dw/expo-check-installed-apps?style=flat-square&color=22c55e&logo=npm&label=weekly" alt="npm weekly downloads" />
  </a>
  <a href="https://github.com/EndLess728/expo-check-installed-apps/blob/main/LICENSE">
    <img src="https://img.shields.io/npm/l/expo-check-installed-apps?style=flat-square&color=3b82f6" alt="MIT License" />
  </a>
  <a href="https://docs.expo.dev/versions/latest/">
    <img src="https://img.shields.io/badge/Expo%20SDK-%E2%89%A551-000020?style=flat-square&logo=expo" alt="Expo SDK 51+" />
  </a>
</p>

---

## Overview

**expo-check-installed-apps** is a native Expo module and config plugin that lets you query — at runtime — whether specific apps are present on the user's device.

- **Android** — check by package name (e.g. `com.android.chrome`)
- **iOS** — check by URL scheme (e.g. `twitter`, `fb`)

The library normalises and deduplicates your input before hitting the native layer, so you can pass raw schemes like `twitter://` and they will work just fine.

> **Requirements**
>
> - Expo SDK **51** or higher
> - This package uses native code and **does not work inside Expo Go**. Use a [development build](https://docs.expo.dev/develop/development-builds/introduction/), `expo prebuild`, or a bare React Native project.

---

## Table of Contents

- [Quick Start](#quick-start)
- [Installation](#installation)
  - [Managed Expo Projects](#managed-expo-projects)
  - [Bare React Native Projects](#bare-react-native-projects)
- [Configuration](#configuration)
  - [Automatic (Config Plugin)](#automatic-config-plugin)
  - [Manual (Native Files)](#manual-native-files)
- [API Reference](#api-reference)
  - [`checkInstalledApps`](#checkinstalledapps)
- [Usage Examples](#usage-examples)
- [Error Handling](#error-handling)
- [Platform Behaviour](#platform-behaviour)
- [Contributing](#contributing)
- [Support the Project](#support-the-project)
- [License](#license)

---

## Quick Start

```bash
npx expo install expo-check-installed-apps
```

```json
// app.json
{
  "expo": {
    "plugins": [
      [
        "expo-check-installed-apps",
        {
          "android": ["com.android.chrome"],
          "ios": ["twitter"]
        }
      ]
    ]
  }
}
```

```bash
npx expo prebuild
```

```ts
import { checkInstalledApps } from "expo-check-installed-apps";

const result = await checkInstalledApps(["com.android.chrome"]);
// → { "com.android.chrome": true }
```

---

## Installation

### Managed Expo Projects

Use the Expo CLI installer to get the correct version pinned automatically:

```bash
npx expo install expo-check-installed-apps
```

Then follow the [Automatic Config Plugin](#automatic-config-plugin) setup and rebuild your app.

### Bare React Native Projects

Make sure the `expo` package is [installed and configured](https://docs.expo.dev/bare/installing-expo-modules/) in your project first, then:

```bash
npm install expo-check-installed-apps
# or
yarn add expo-check-installed-apps
```

If you are not using Expo config plugins, follow the [Manual Native Files](#manual-native-files) setup.

---

## Configuration

### Automatic (Config Plugin)

Add the plugin to `app.json` or `app.config.js` and list every package/scheme you want to query at runtime. You **must** declare them ahead of time — this is an OS-level requirement, not a library limitation.

```json
{
  "expo": {
    "plugins": [
      [
        "expo-check-installed-apps",
        {
          "android": ["com.facebook.katana", "com.twitter.android"],
          "ios": ["fb", "twitter"]
        }
      ]
    ]
  }
}
```

**Plugin options**

| Option    | Platform | Type       | Description                                                           | Example                   |
| --------- | -------- | ---------- | --------------------------------------------------------------------- | ------------------------- |
| `android` | Android  | `string[]` | Package names added under `<queries>` in `AndroidManifest.xml`        | `["com.facebook.katana"]` |
| `ios`     | iOS      | `string[]` | URL schemes added under `LSApplicationQueriesSchemes` in `Info.plist` | `["fb", "twitter"]`       |

> **Rebuilding required** — any time you change the plugin options you must run `npx expo prebuild` (and rebuild your native app) for the changes to take effect.

The plugin automatically:

- Adds `<package android:name="…"/>` entries inside `<queries>` in `AndroidManifest.xml`
- Appends strings to `LSApplicationQueriesSchemes` in `Info.plist`

### Manual (Native Files)

#### Android — `AndroidManifest.xml`

Add a `<queries>` block inside `<manifest>`:

```xml
<manifest>
  <queries>
    <package android:name="com.facebook.katana" />
    <package android:name="com.twitter.android" />
  </queries>

  <!-- ... rest of your manifest -->
</manifest>
```

#### iOS — `Info.plist`

Add the schemes you want to query:

```xml
<key>LSApplicationQueriesSchemes</key>
<array>
  <string>fb</string>
  <string>twitter</string>
</array>
```

---

## API Reference

### `checkInstalledApps`

Queries the OS to determine whether specific apps are installed on the device.

```ts
function checkInstalledApps(
  targets: string[],
): Promise<Record<string, boolean>>;
```

#### Parameters

| Parameter | Type       | Description                                                                                    |
| --------- | ---------- | ---------------------------------------------------------------------------------------------- |
| `targets` | `string[]` | Android package names (e.g. `com.android.chrome`) or iOS URL schemes (e.g. `twitter`, `fb://`) |

**Input normalisation**

Before calling the native layer, the library:

1. Trims whitespace from every target
2. Strips trailing `://` or `:` from iOS schemes (e.g. `twitter://` → `twitter`)
3. Removes duplicate entries

**Validation rules**

| Platform | Accepted format                                            | Example              |
| -------- | ---------------------------------------------------------- | -------------------- |
| Android  | Valid Java package name: `[a-zA-Z0-9_]+(\.[a-zA-Z0-9_]+)+` | `com.android.chrome` |
| iOS      | Valid URL scheme: `[A-Za-z][A-Za-z0-9+.-]*`                | `twitter`, `fb://`   |

Passing an empty string or an invalid identifier throws synchronously before any native call is made.

#### Returns

`Promise<Record<string, boolean>>`

Resolves to a plain object keyed by the (normalised) identifier:

```ts
{
  "com.android.chrome": true,   // app is installed
  "com.facebook.katana": false  // app is not installed
}
```

Returns an **empty object** `{}` when the `targets` array is empty.

---

## Usage Examples

### Basic — check a single app

```ts
import { checkInstalledApps } from "expo-check-installed-apps";

const result = await checkInstalledApps(["com.android.chrome"]);

if (result["com.android.chrome"]) {
  console.log("Chrome is installed");
}
```

### Platform-aware check

```ts
import { checkInstalledApps } from "expo-check-installed-apps";
import { Platform } from "react-native";

const targets = Platform.select({
  android: ["com.google.android.apps.fitness", "com.android.chrome"],
  ios: ["fb", "twitter"],
  default: [],
});

const installedApps = await checkInstalledApps(targets);
console.log(installedApps);
```

**Example response (Android)**

```json
{
  "com.google.android.apps.fitness": false,
  "com.android.chrome": true
}
```

**Example response (iOS)**

```json
{
  "fb": true,
  "twitter": false
}
```

### Check multiple social apps

```ts
import { checkInstalledApps } from "expo-check-installed-apps";
import { Platform } from "react-native";

const SOCIAL_APPS = {
  android: [
    "com.facebook.katana",
    "com.twitter.android",
    "com.instagram.android",
    "com.whatsapp",
  ],
  ios: ["fb", "twitter", "instagram", "whatsapp"],
};

async function getInstalledSocialApps() {
  const targets =
    Platform.OS === "android" ? SOCIAL_APPS.android : SOCIAL_APPS.ios;

  const result = await checkInstalledApps(targets);

  return Object.entries(result)
    .filter(([, installed]) => installed)
    .map(([app]) => app);
}

const installed = await getInstalledSocialApps();
console.log("Installed social apps:", installed);
// → ["com.facebook.katana", "com.whatsapp"]
```

---

## Error Handling

The library throws for invalid input **before** making any native call:

```ts
import { checkInstalledApps } from "expo-check-installed-apps";

try {
  const result = await checkInstalledApps(["com.android.chrome"]);
  console.log(result);
} catch (error) {
  if (error instanceof TypeError) {
    // Invalid targets array or non-string element
    console.error("Invalid input:", error.message);
  } else {
    // Invalid package name / URL scheme format
    console.error("Validation error:", error.message);
  }
}
```

| Condition                                  | Error type  | Message                                                                |
| ------------------------------------------ | ----------- | ---------------------------------------------------------------------- |
| `targets` is not an array                  | `TypeError` | `checkInstalledApps expects an array of package names or URL schemes.` |
| An element is not a string                 | `TypeError` | `checkInstalledApps targets must be strings.`                          |
| An element is an empty string (after trim) | `Error`     | `checkInstalledApps targets cannot be empty.`                          |
| Invalid Android package name               | `Error`     | `Invalid Android package name: <value>`                                |
| Invalid iOS URL scheme                     | `Error`     | `Invalid iOS URL scheme: <value>`                                      |

---

## Platform Behaviour

| Behaviour                            | Android | iOS |
| ------------------------------------ | :-----: | :-: |
| Check by package name                |   ✅    | ❌  |
| Check by URL scheme                  |   ❌    | ✅  |
| Requires pre-declaration in manifest |   ✅    | ✅  |
| Works in Expo Go                     |   ❌    | ❌  |
| Works in development build           |   ✅    | ✅  |
| Requires rebuild after config change |   ✅    | ✅  |

---

## Contributing

Contributions, bug reports, and feature requests are welcome!

1. **Fork** the repository and create a new branch from `main`.
2. **Make your changes** — please include tests for new behaviour.
3. **Open a Pull Request** with a clear description of the problem and your solution.

For substantial changes, please open an issue first to discuss the approach.

- **Bug reports** → [GitHub Issues](https://github.com/EndLess728/expo-check-installed-apps/issues)
- **Source code** → [GitHub Repository](https://github.com/EndLess728/expo-check-installed-apps)

---

## Support the Project

If this library has saved you time, consider supporting its development:

[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-Support%20the%20author-f97316?style=for-the-badge&logo=buy-me-a-coffee&logoColor=white)](https://www.buymeacoffee.com/mantu.728)
[![Donate via PayPal](https://img.shields.io/badge/Donate-PayPal-003087?style=for-the-badge&logo=paypal&logoColor=white)](https://paypal.me/Monty728)

---

## License

MIT © [EndLess728](https://github.com/EndLess728)

See [LICENSE](./LICENSE) for the full text.
