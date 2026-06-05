import { checkInstalledApps } from "expo-check-installed-apps";
import { useEffect, useState } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";

const targetsByPlatform: { android: string[]; ios: string[] } = {
  android: [
    "com.google.android.apps.fitness",
    "com.android.chrome",
    "com.expo.flash.qr",
  ],
  ios: ["fb", "twitter"],
};

export default function App() {
  const [result, setResult] = useState<Record<string, boolean>>({});
  const targets =
    Platform.OS === "android"
      ? targetsByPlatform.android
      : Platform.OS === "ios"
        ? targetsByPlatform.ios
        : [];

  useEffect(() => {
    const checkInstalled = async () => {
      const checkInstalledAppsResult = await checkInstalledApps(targets);
      setResult(checkInstalledAppsResult);
    };

    checkInstalled();
  }, [targets]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Installed app check</Text>
      <Text style={styles.resultText}>{JSON.stringify(result, null, 2)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
  },
  resultText: {
    fontSize: 15,
    marginTop: 20,
  },
});
