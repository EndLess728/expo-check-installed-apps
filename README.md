# Expo Check Installed Apps

<div style="display: flex; gap: 10px; align-items: center;">
  <img src="https://img.shields.io/npm/v/expo-check-installed-apps?color=orange&style=flat-square&logo=npm" alt="npm version"/>
  <img src="https://img.shields.io/npm/dt/expo-check-installed-apps?color=darkgreen&style=flat-square&logo=npm" alt="npm downloads"/>
  <img src="https://img.shields.io/npm/dw/expo-check-installed-apps?color=darkgreen&style=flat-square&logo=npm" alt="npm downloads"/>
</div>


A **config plugin** for Expo to check for the existence of installed apps on Android and iOS.

> **Note:** This library supports **Expo SDK 51 and above**.

---

## Table of Contents

- [Installation](#installation)
  - [For Managed Expo Projects](#installation-in-managed-expo-projects)
  - [For Bare React Native Projects](#installation-in-bare-react-native-projects)
- [Setup](#setup)
  - [Automatic Configuration](#automatic-configuration)
  - [Manual Configuration](#manual-configuration)
- [API Documentation](#api-documentation)
  - [`checkInstalledApps`](#checkinstalledapps)
- [Example Usage](#example-usage)
- [Contributing](#contributing)
- [Support the Project](#support-the-project)

---

## Installation

You can find the package on npm: [expo-check-installed-apps](https://www.npmjs.com/package/expo-check-installed-apps).

### Installation in Managed Expo Projects

For [managed Expo projects](https://docs.expo.dev/archive/managed-vs-bare/), follow the installation instructions in the [API documentation for the latest stable release](https://docs.expo.dev/versions/latest/sdk/android-check-installed-apps/).

> If documentation for managed projects is unavailable, this library may not yet be supported within managed workflows and is likely to be included in an upcoming Expo SDK release.

### Installation in Bare React Native Projects

For bare React Native projects, ensure you have [installed and configured the `expo` package](https://docs.expo.dev/bare/installing-expo-modules/) before proceeding.

Install the package via npm:

```bash
npm install expo-check-installed-apps
```

---

## Setup

### Automatic Configuration

If using Expo's **prebuild method**, you can configure the plugin automatically in your `app.json` or `app.config.js` file. Specify the package names and URL schemes for the apps you want to check:

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

### Manual Configuration

If you are not using `app.json` or `app.config.js`, you'll need to manually update your native project files.

#### Android

Add the package names to your `AndroidManifest.xml`:

```xml
<manifest>
    <queries>
        <package android:name="com.facebook.katana"/>
        <package android:name="com.twitter.android"/>
    </queries>
</manifest>
```

#### iOS

Add the URL schemes to your `Info.plist`:

```xml
<key>LSApplicationQueriesSchemes</key>
<array>
    <string>fb</string>
    <string>twitter</string>
</array>
```

---

## API Documentation

### `checkInstalledApps`

Checks whether specific apps are installed on the user's device.

#### Parameters

- **`packageNames`** (`Array<string>`):  
  An array of package names (for Android) or URL schemes (for iOS) to check.

#### Returns

- **`Promise<Record<string, boolean>>`**:  
  Resolves to an object where keys are package names or URL schemes, and values are booleans:
  - `true`: App is installed.
  - `false`: App is not installed.

---

## Example Usage

```typescript
import { checkInstalledApps } from "expo-check-installed-apps";
import { Platform } from "react-native";

const packageNames: string[] =
  Platform.select({
    android: ["com.google.android.apps.fitness", "com.android.chrome"], // Use package name of android apps
    ios: ["fb://", "twitter://"], // Use proper url scheme of ios apps
  }) || [];

checkInstalledApps(packageNames)
  .then((installedApps) => {
    console.log(installedApps);
  })
  .catch((error) => {
    console.error("Error checking installed apps:", error);
  });
```

### Example Response

```json
{
  "com.google.android.apps.fitness": false,
  "com.android.chrome": true,
  "fb://": true,
  "twitter://": false
}
```

---

## Contributing

Contributions are welcome!

---

## Support the Project

If you find this library helpful, consider supporting it:

[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-Support%20Me-orange?logo=buymeacoffee)](https://www.buymeacoffee.com/mantu.728)  
[![Donate via PayPal](https://img.shields.io/badge/Donate-PayPal-blue?logo=paypal)](https://paypal.me/Monty728)
