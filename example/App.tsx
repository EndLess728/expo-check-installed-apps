import { Platform, StyleSheet, Text, View } from "react-native";
import { checkInstalledApps, hello } from "expo-check-installed-apps";
import { useEffect } from "react";

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

  useEffect(() => {
    const checkInstalled = async () => {
      const checkApp = await checkInstalledApps(packageNames);
      console.log(
        "🚀 ~ file: App.tsx:15 ~ checkInstalled ~ checkApp ===> ",
        checkApp
      );
    };
    checkInstalled();
  }, []);

  return (
    <View style={styles.container}>
      <Text>{hello()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
