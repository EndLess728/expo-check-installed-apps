---
title: Quick start
description: A complete, copy-paste React Native component that checks for installed apps on Android and iOS and shows the results.
---

This screen checks for a few common apps and lists which are installed. It assumes you've added the same apps to the config plugin, see [Configuration](../configuration/).

```tsx title="InstalledAppsScreen.tsx"
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Platform, StyleSheet, Text, View } from 'react-native';
import { checkInstalledApps } from 'expo-check-installed-apps';

const APPS = [
  { name: 'WhatsApp', android: 'com.whatsapp', ios: 'whatsapp' },
  { name: 'Instagram', android: 'com.instagram.android', ios: 'instagram' },
  { name: 'Google Maps', android: 'com.google.android.apps.maps', ios: 'comgooglemaps' },
  { name: 'Spotify', android: 'com.spotify.music', ios: 'spotify' },
];

type Row = { name: string; installed: boolean };

export default function InstalledAppsScreen() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ids = APPS.map((app) => (Platform.OS === 'ios' ? app.ios : app.android));

    checkInstalledApps(ids)
      .then((result) => {
        setRows(APPS.map((app, i) => ({ name: app.name, installed: result[ids[i]] ?? false })));
      })
      .catch((e: Error) => setError(e.message));
  }, []);

  if (error) return <Text style={styles.center}>Error: {error}</Text>;
  if (!rows) return <ActivityIndicator style={styles.center} />;

  return (
    <FlatList
      data={rows}
      keyExtractor={(row) => row.name}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <View style={styles.row}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={item.installed ? styles.yes : styles.no}>
            {item.installed ? 'Installed' : 'Not installed'}
          </Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, textAlign: 'center', marginTop: 48 },
  list: { padding: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12 },
  name: { fontSize: 16 },
  yes: { color: '#16a34a', fontWeight: '600' },
  no: { color: '#9ca3af' },
});
```

## What to notice

- You pass **different identifiers per platform**. Keeping both in one object, like `APPS` above, makes that easy.
- The result is keyed by the identifier you passed, after normalisation. On iOS, `whatsapp://` comes back as `whatsapp`.
- `checkInstalledApps` throws for malformed identifiers, so wrap it in `try/catch` or `.catch()`.

Next: [open an app if it's installed, or send people to the store](../../guides/open-or-fallback/).
