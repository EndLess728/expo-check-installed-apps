# expo-check-installed-apps

An Expo module config plugin to check for the existence of installed apps on Android and iOS.

> **Note:** This library supports Expo SDK 51 and above.

## API Documentation

- [Documentation for the main branch](https://github.com/expo/expo/blob/main/docs/pages/versions/unversioned/sdk/android-check-installed-apps.md)
- [Documentation for the latest stable release](https://docs.expo.dev/versions/latest/sdk/android-check-installed-apps/)

## Installation in Managed Expo Projects

For [managed](https://docs.expo.dev/archive/managed-vs-bare/) Expo projects, please follow the installation instructions in the [API documentation for the latest stable release](#api-documentation). If the link does not provide documentation, this library is not yet usable within managed projects and is likely to be included in an upcoming Expo SDK release.

## Installation in Bare React Native Projects

For bare React Native projects, ensure that you have [installed and configured the `expo` package](https://docs.expo.dev/bare/installing-expo-modules/) before proceeding.

### Add the package to your npm dependencies

```bash
npm install expo-check-installed-apps
```

## Methods

### `checkInstalledApps`

This asynchronous function accepts an array of package names and URL schemes and returns a promise that resolves with an object containing the installation status of each app.

#### Parameters

- **`packageNames`** (`Array<string>`): An array of package names (strings) for Android or URL schemes (strings) for iOS that you want to check for installation on the device.

#### Returns

- **`Promise<Record<string, boolean>>`**: A promise that resolves to an object where the keys are package names or URL schemes and the values are booleans:
  - `true`: The app with the specified package name or URL scheme is installed.
  - `false`: The app with the specified package name or URL scheme is not installed.

## iOS Configuration

To check if an iOS app is installed, you need to add the app's url schema entries to your `app.json` file:

```xml
{
  "expo": {
    // other configurations...
    "ios": {
      "infoPlist": {
        "LSApplicationQueriesSchemes": [
          "fb",
          "twitter"
        ]
      }
    }
  }
}

```

#### Example Usage

```typescript
import { checkInstalledApps } from "expo-check-installed-apps";
import { Platform } from "react-native";

const packageNames: string[] =
  Platform.select({
    android: ["com.google.android.apps.fitness", "com.android.chrome"],
    ios: ["fb://", "twitter://"],
  }) || [];

checkInstalledApps(packageNames)
  .then((installedApps) => {
    console.log(installedApps);
    // Output: { "com.google.android.apps.fitness": false, "com.android.chrome": true, "fb://": true, ... }
  })
  .catch((error) => {
    console.error("Error checking installed apps:", error);
  });
```

#### Example Response

```json
{
  "com.google.android.apps.fitness": false,
  "com.android.chrome": true,
  "fb://": true,
  "twitter://": false
}
```

## Contributing

Contributions are very welcome! Please refer to the guidelines described in the [contributing guide](https://github.com/expo/expo#contributing).
