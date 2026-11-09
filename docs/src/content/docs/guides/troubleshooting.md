---
title: Troubleshooting
description: Fixes for common expo-check-installed-apps problems, like always getting false, native module not found, and invalid package name or URL scheme errors.
---

## "Cannot find native module 'ExpoCheckInstalledApps'"

The native code isn't in the app you're running.

- You're probably in **Expo Go**. Use a development build instead (`npx expo run:android` / `npx expo run:ios` or EAS).
- In a dev build, rebuild after installing: `npx expo prebuild --clean`, then run again.
- In bare React Native, make sure Expo modules are set up and run `pod install`.

## Always returns `false` on iOS

1. Check the scheme is in `LSApplicationQueriesSchemes`. Open `ios/<App>/Info.plist` after prebuild and look.
2. Rebuild after changing the plugin config. Reloading JS isn't enough.
3. Make sure it's the right scheme. Test it by typing `scheme://` into Safari on the device.
4. Look in the Xcode console for `This app is not allowed to query for scheme`. That means the scheme isn't declared.
5. Check you're not over the 50-scheme limit.
6. The iOS Simulator only has a few apps installed, so test on a real device.

## Always returns `false` on Android

1. Check the package name is exactly right, for example from the Play Store URL.
2. Check `android/app/src/main/AndroidManifest.xml` after prebuild has a `<package android:name="…" />` inside `<queries>`.
3. Rebuild the app.
4. Confirm the app really is installed for the current user: `adb shell pm list packages | grep <name>`.

## "Invalid Android package name: …"

On Android, every identifier must look like a package name: at least two dot-separated segments of letters, numbers and underscores, such as `com.example.app`. You'll see this if you pass an iOS scheme like `whatsapp` on Android. Pick identifiers with `Platform.OS` or `Platform.select`.

## "Invalid iOS URL scheme: …"

On iOS, a scheme must start with a letter and contain only letters, numbers, `+`, `-` and `.`. You'll see this if you pass an Android package name containing an underscore on iOS, or a full URL with an invalid scheme.

## Result object is missing a key

Results are keyed by the **normalised** identifier. On iOS `twitter://` becomes `twitter`, and surrounding spaces are trimmed. Look up results with the normalised value.

## Still stuck?

[Open an issue](https://github.com/EndLess728/expo-check-installed-apps/issues) with your Expo SDK version, platform, device, config plugin settings and the full error.
