# Expo Check Installed Apps

<div style="display: flex; gap: 10px; align-items: center;">
  <img src="https://img.shields.io/npm/v/expo-check-installed-apps?color=orange&style=flat-square&logo=npm" alt="npm version"/>
  <img src="https://img.shields.io/npm/dt/expo-check-installed-apps?color=darkgreen&style=flat-square&logo=npm" alt="npm downloads"/>
  <img src="https://img.shields.io/npm/dw/expo-check-installed-apps?color=darkgreen&style=flat-square&logo=npm" alt="npm downloads"/>
</div>

A config plugin and native module for checking whether apps are installed on Android and iOS.

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

Install the package and configure the plugin in your Expo app config before running `npx expo prebuild` or a native build.

### Installation in Bare React Native Projects

For bare React Native projects, ensure you have [installed and configured the `expo` package](https://docs.expo.dev/bare/installing-expo-modules/) before proceeding.

Install the package via npm:

```bash
npm install expo-check-installed-apps
```

---

## Setup

### Automatic Configuration

If using Expo's prebuild flow, configure the plugin in your `app.json` or `app.config.js` file.

- `android`: Android package names such as `com.twitter.android`
- `ios`: iOS URL schemes such as `twitter` or `fb`

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

- **`targets`** (`Array<string>`):
  An array of Android package names or iOS URL schemes.

On iOS, pass raw schemes like `fb` or `twitter`. The library also accepts `fb://` style input and normalizes it.

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

const targetsByPlatform: { android: string[]; ios: string[] } = {
  android: ["com.google.android.apps.fitness", "com.android.chrome"],
  ios: ["fb", "twitter"],
};

const targets =
  Platform.OS === "android"
    ? targetsByPlatform.android
    : Platform.OS === "ios"
      ? targetsByPlatform.ios
      : [];

checkInstalledApps(targets)
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
  "fb": true,
  "twitter": false
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
