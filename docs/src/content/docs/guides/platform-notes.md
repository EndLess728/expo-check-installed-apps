---
title: Platform notes
description: How Android package visibility and iOS canOpenURL rules affect checking installed apps, including the iOS 50-scheme limit and app store review considerations.
---

## Android

- Checks use `PackageManager.getPackageInfo()`. If Android says the package doesn't exist (or isn't visible to your app), the result is `false`.
- Since **Android 11 (API 30)**, apps can only see other apps they declare in `<queries>`. The config plugin adds a `<package>` entry for each name in its `android` list.
- The library's own manifest also includes a `<queries>` entry for the `android.intent.action.MAIN` intent, which is merged into your app. In practice this makes most apps with a launchable screen visible even if you didn't list them. Declaring every app you check explicitly is still the reliable approach, and it documents your intent for Play Store review.
- You don't need the `QUERY_ALL_PACKAGES` permission. Google Play restricts that permission to a small set of app categories.

## iOS

- Checks use `UIApplication.canOpenURL("<scheme>://")`.
- A scheme **must be listed in `LSApplicationQueriesSchemes`**. For unlisted schemes, iOS always returns `false` and logs `This app is not allowed to query for scheme …` in the Xcode console.
- iOS only allows **50 schemes** in `LSApplicationQueriesSchemes` for apps built against iOS 15 or later. Keep the list to what you actually need.
- A `true` result means *some* app can open the scheme, not necessarily the one you expected. See [Finding package names & schemes](../finding-identifiers/).

## Both platforms

| Behaviour | Android | iOS |
| --- | :---: | :---: |
| Identifier type | Package name | URL scheme |
| Needs declaring ahead of time | ✅ | ✅ |
| Works in Expo Go | ❌ | ❌ |
| Works in a development build | ✅ | ✅ |
| Rebuild needed after changing the list | ✅ | ✅ |

## Privacy

Both stores care about why an app looks at other installed apps. Only check apps that power a real feature (sharing, opening a partner app, choosing a navigation app), and don't collect or send the list of installed apps off the device without disclosing it.
