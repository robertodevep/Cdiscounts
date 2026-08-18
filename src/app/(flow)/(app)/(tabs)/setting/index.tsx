import Header from "@/src/components/Header";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function SettingScreen() {
  return (
    <View style={styles.container}>
      <Header title="Paramètres" showBack={false} showCart={false} />
      <View style={styles.content}>
        <Text style={styles.title}>Paramètres</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f2f2f2" },
  content: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 20, fontWeight: "bold", color: "#111" },
});
