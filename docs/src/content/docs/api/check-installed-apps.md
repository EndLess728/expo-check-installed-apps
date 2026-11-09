---
title: checkInstalledApps
description: API reference for checkInstalledApps, including parameters, input normalisation, validation rules, return value and errors.
---

```ts
import { checkInstalledApps } from 'expo-check-installed-apps';

function checkInstalledApps(targets: string[]): Promise<Record<string, boolean>>;
```

Checks whether each target app is installed on the device.

## Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `targets` | `string[]` | Android package names (on Android) or iOS URL schemes (on iOS). |

## Returns

A promise for an object mapping each **normalised** target to `true` (installed) or `false`:

```ts
{ "com.android.chrome": true, "com.facebook.katana": false }
```

If `targets` is an empty array, it resolves to `{}` without calling native code.

## Normalisation

Before anything reaches native code, each target is:

1. **Trimmed** of surrounding whitespace.
2. **On iOS only:** stripped of `://` and anything after it, or a trailing `:`. So `twitter://`, `twitter:` and `twitter://home` all become `twitter`.
3. **De-duplicated.** Each target appears once in the result.

## Validation

Targets are validated for the platform the code is running on:

| Platform | Must match | Valid examples |
| --- | --- | --- |
| Android | `^[A-Za-z0-9_]+(\.[A-Za-z0-9_]+)+$` | `com.whatsapp`, `com.google.android.apps.maps` |
| iOS | `^[A-Za-z][A-Za-z0-9+.-]*$` (after normalisation) | `fb`, `comgooglemaps`, `twitter://` |

## Errors

Validation errors are thrown before any native call, so the returned promise rejects:

| When | Error | Message |
| --- | --- | --- |
| `targets` isn't an array | `TypeError` | `checkInstalledApps expects an array of package names or URL schemes.` |
| An item isn't a string | `TypeError` | `checkInstalledApps targets must be strings.` |
| An item is empty after trimming | `Error` | `checkInstalledApps targets cannot be empty.` |
| Bad Android package name | `Error` | `Invalid Android package name: <value>` |
| Bad iOS scheme | `Error` | `Invalid iOS URL scheme: <value>` |

An app that isn't installed, or isn't declared, is **not** an error. It just comes back as `false`.

## Example

```ts
import { Platform } from 'react-native';
import { checkInstalledApps } from 'expo-check-installed-apps';

const targets = Platform.select({
  android: ['com.whatsapp', 'com.android.chrome'],
  ios: ['whatsapp', 'googlechrome'],
  default: [],
});

try {
  const installed = await checkInstalledApps(targets);
  console.log(installed);
} catch (e) {
  console.error('Bad identifier:', (e as Error).message);
}
```
