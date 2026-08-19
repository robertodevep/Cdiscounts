
import { useRouter } from "expo-router";
import { useEffect } from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  View,
  Text,
} from "react-native";

import { LOGO } from "@/src/constants";

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/(flow)/(app)/(tabs)/welcome");
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View style={styles.container}>
      <View style={styles.center}>
        <Image
          source={LOGO}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.tagline}>
          Votre shopping, simplement.
        </Text>

        <ActivityIndicator
          size="small"
          color="#F59E0B"
          style={styles.loader}
        />
      </View>

      <Text style={styles.version}>Version 1.0.0</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  center: {
    alignItems: "center",
  },

  logo: {
    width: 220,
    height: 140,
  },

  tagline: {
    marginTop: 12,
    fontSize: 16,
    color: "#555555",
    fontWeight: "500",
  },

  loader: {
    marginTop: 28,
  },

  version: {
    position: "absolute",
    bottom: 30,
    fontSize: 12,
    color: "#999999",
  },
});

// import { useRouter } from "expo-router";
// import { useEffect } from "react";
// import { Image, StyleSheet, View, Text } from "react-native";

// import { LOGO } from "@/src/constants";

// export default function SplashScreen() {
//   const router = useRouter();

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       router.replace("/(flow)/(app)/(tabs)/welcome");
//     }, 3000);

//     return () => clearTimeout(timer);
//   }, [router]);

//   return (
//     <View style={styles.container}>
//       <Image source={LOGO} style={styles.logo} resizeMode="contain" />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#FFFFFF",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   logo: {
//     width: 220,
//     height: 100,
//   },
// });
