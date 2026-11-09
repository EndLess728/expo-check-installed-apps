---
title: Introduction
description: What expo-check-installed-apps does, how it checks apps on Android and iOS, and what you need to use it.
---

`expo-check-installed-apps` is a native Expo module with a config plugin. It answers one question at runtime: **is this other app installed on the device?**

```ts
const result = await checkInstalledApps(['com.android.chrome', 'com.whatsapp']);
// { "com.android.chrome": true, "com.whatsapp": false }
```

## How it works

The two platforms identify apps differently, so you pass a different kind of identifier on each:

| Platform | You pass | Under the hood |
| --- | --- | --- |
| Android | A **package name**, like `com.whatsapp` | `PackageManager.getPackageInfo()` |
| iOS | A **URL scheme**, like `whatsapp` | `UIApplication.canOpenURL()` |

Both operating systems restrict which apps you're allowed to ask about, for privacy. You declare the apps you'll check ahead of time (Android `<queries>`, iOS `LSApplicationQueriesSchemes`), and the config plugin writes those declarations for you. See [Configuration](../configuration/).

## Requirements

| | |
| --- | --- |
| Expo SDK | 51 or newer |
| iOS | 13.4+ |
| Android | Any version supported by your Expo SDK |
| Expo Go | **Not supported.** Use a [development build](https://docs.expo.dev/develop/development-builds/introduction/), `npx expo prebuild`, or a bare React Native app with Expo modules installed. |

## Next

Head to [Installation](../installation/).
