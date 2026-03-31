import React from "react";
import { StyleSheet, Text, View } from "react-native";

export function SetupScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Step 3 is working</Text>
      <Text style={styles.subtitle}>
        Stack navigation works. Next we will add app state and bootstrap flow.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "#0B1220",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: "#A0AEC0",
    lineHeight: 22,
  },
});
