import { Platform, StyleSheet, Text, View } from "react-native";
import {
  checkInstalledApps,
  hello,
  checkInstalledAppsSync,
} from "expo-check-installed-apps";
import { useEffect, useState } from "react";

export default function App() {
  const packageNames: string[] =
    Platform.select({
      android: [
        "com.google.android.apps.fitness",
        "com.android.chrome",
        "com.expo.flash.qr",
      ],
      ios: ["fb://", "twitter://"],
    }) || [];

  const [result, setResult] = useState(checkInstalledAppsSync(packageNames));

  useEffect(() => {
    const checkInstalled = async () => {
      const checkInstalledAppsResult = await checkInstalledApps(packageNames);
      setResult(checkInstalledAppsResult);
      console.log(
        "🚀 ~ file: App.tsx:15 ~ checkInstalled ~ checkApp ===> ",
        checkInstalledAppsResult
      );
    };
    checkInstalled();
  }, []);

  return (
    <View style={styles.container}>
      <Text>{hello()}</Text>
      <Text style={styles.resultText}>
        {JSON.stringify(result, null, 2)} {/* Pretty print JSON */}
      </Text>
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
  resultText: {
    fontWeight: "bold",
    fontSize: 15,
    marginTop: 20,
  },
});
