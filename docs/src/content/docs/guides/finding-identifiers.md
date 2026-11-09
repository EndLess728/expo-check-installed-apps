---
title: Finding package names & URL schemes
description: How to find an app's Android package name and iOS URL scheme to use with expo-check-installed-apps, plus identifiers for popular apps.
---

## Android package names

The package name is the app's unique ID. Easy ways to find it:

- **Play Store URL:** open the app's page on [play.google.com](https://play.google.com/store). The `id=` value in the URL is the package name. For example `play.google.com/store/apps/details?id=com.whatsapp` → `com.whatsapp`.
- **On a connected device:** `adb shell pm list packages | grep -i whatsapp`

## iOS URL schemes

iOS doesn't let you look up apps by bundle ID. You check whether some installed app can open a **URL scheme**, so you need a scheme the target app registers.

- **The app's developer docs.** Many apps document their deep links (for example Google Maps uses `comgooglemaps`).
- **The app's `Info.plist`.** If you can get the `.ipa`, look under `CFBundleURLTypes → CFBundleURLSchemes`.
- **Trial and error on a device.** Type `scheme://` into Safari's address bar. If the app opens, the scheme works.

Pass the scheme alone, like `whatsapp`. `whatsapp://` and `whatsapp:` are accepted too and trimmed for you.

## Popular apps

These are commonly used identifiers. Apps can change them, so test on a real device before you ship.

| App | Android package | iOS scheme |
| --- | --- | --- |
| WhatsApp | `com.whatsapp` | `whatsapp` |
| Instagram | `com.instagram.android` | `instagram` |
| Facebook | `com.facebook.katana` | `fb` |
| X (Twitter) | `com.twitter.android` | `twitter` |
| YouTube | `com.google.android.youtube` | `youtube` |
| Spotify | `com.spotify.music` | `spotify` |
| Google Maps | `com.google.android.apps.maps` | `comgooglemaps` |
| Google Chrome | `com.android.chrome` | `googlechrome` |
| Waze | `com.waze` | `waze` |

:::caution[A scheme isn't proof of a specific app]
On iOS, `canOpenURL` only tells you that *some* installed app handles the scheme. If two apps register the same scheme, you can't tell which one is installed. Prefer schemes that are unique to the app you care about.
:::
