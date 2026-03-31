import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

export function SplashScreen() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#2563EB" />
      <Text style={styles.text}>Bootstrapping app...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B1220",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    marginTop: 12,
    color: "#A0AEC0",
    fontSize: 16,
  },
});
