---
title: Open an app or fall back to the store
description: Open another app via deep link if it's installed, otherwise send the user to the Play Store or App Store, using expo-check-installed-apps and React Native Linking.
---

A common pattern: if the app is installed, open it; if not, open its store page. `checkInstalledApps` decides which branch to take, and React Native's `Linking` does the opening.

```ts title="openOrInstall.ts"
import { Linking, Platform } from 'react-native';
import { checkInstalledApps } from 'expo-check-installed-apps';

type TargetApp = {
  androidPackage: string;   // e.g. 'com.whatsapp'
  iosScheme: string;        // e.g. 'whatsapp'
  iosAppStoreId: string;    // numeric ID from the App Store URL, e.g. apps.apple.com/app/id123456789
  deepLink: string;         // URL to open in the app, e.g. 'whatsapp://send?text=Hello'
};

export async function openOrInstall(app: TargetApp) {
  const id = Platform.OS === 'ios' ? app.iosScheme : app.androidPackage;
  const result = await checkInstalledApps([id]);

  if (result[id]) {
    await Linking.openURL(app.deepLink);
    return;
  }

  const storeUrl =
    Platform.OS === 'ios'
      ? `itms-apps://apps.apple.com/app/id${app.iosAppStoreId}`
      : `market://details?id=${app.androidPackage}`;

  await Linking.openURL(storeUrl);
}
```

Use it from a button:

```tsx
<Button
  title="Share on WhatsApp"
  onPress={() =>
    openOrInstall({
      androidPackage: 'com.whatsapp',
      iosScheme: 'whatsapp',
      iosAppStoreId: 'YOUR_APP_STORE_ID',
      deepLink: `whatsapp://send?text=${encodeURIComponent('Check this out!')}`,
    })
  }
/>
```

Remember to declare the app in the config plugin (`android: ['com.whatsapp']`, `ios: ['whatsapp']`).

## Hide UI for apps that aren't installed

Check once when the screen mounts, then render only the options that will work:

```tsx
const [hasWhatsApp, setHasWhatsApp] = useState(false);

useEffect(() => {
  const id = Platform.OS === 'ios' ? 'whatsapp' : 'com.whatsapp';
  checkInstalledApps([id]).then((r) => setHasWhatsApp(!!r[id]));
}, []);

return hasWhatsApp ? <ShareToWhatsAppButton /> : null;
```

:::tip
Users can install or delete apps while yours is in the background. If it matters, re-check when the app returns to the foreground using `AppState`.
:::
