---
title: Config plugin
description: Reference for the expo-check-installed-apps Expo config plugin, which writes Android queries and iOS LSApplicationQueriesSchemes during prebuild.
---

```json title="app.json"
{
  "expo": {
    "plugins": [
      [
        "expo-check-installed-apps",
        {
          "android": ["com.whatsapp"],
          "ios": ["whatsapp"]
        }
      ]
    ]
  }
}
```

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `android` | `string[]` | `[]` | Package names to declare in `AndroidManifest.xml`. |
| `ios` | `string[]` | `[]` | URL schemes to declare in `Info.plist`. |

Both are optional. Leave one out if you only check apps on one platform.

## What it changes

**Android:** in `AndroidManifest.xml`, it adds one `<package android:name="…" />` per entry inside the first `<queries>` block, creating the block if needed. Names are trimmed and de-duplicated, and packages already listed aren't added twice.

```xml
<queries>
  <package android:name="com.whatsapp" />
</queries>
```

**iOS:** in `Info.plist`, it merges the schemes into `LSApplicationQueriesSchemes`, keeping anything already there. Schemes are trimmed, `://…` or a trailing `:` is removed, and duplicates are dropped.

```xml
<key>LSApplicationQueriesSchemes</key>
<array>
  <string>whatsapp</string>
</array>
```

## Errors during prebuild

- `Invalid iOS URL scheme: <value>`: an `ios` entry is empty or not a valid scheme after trimming.
- `AndroidManifest.xml is invalid or missing!`: prebuild couldn't read the Android manifest.

:::note
The plugin only runs during prebuild. Run `npx expo prebuild --clean` (or start a new EAS build) after changing these lists.
:::
