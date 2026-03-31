import React from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";

type Props = {
  navigation: any;
};

export function WelcomeScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tether Wallet Take Home</Text>
      <Text style={styles.subtitle}>
        Start by creating a new wallet or importing an existing one.
      </Text>

      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate("CreateWallet")}
      >
        <Text style={styles.buttonText}>Create wallet</Text>
      </Pressable>

      <Pressable
        style={[styles.button, styles.secondaryButton]}
        onPress={() => navigation.navigate("ImportWallet")}
      >
        <Text style={styles.buttonText}>Import wallet</Text>
      </Pressable>
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
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: "#A0AEC0",
    marginBottom: 24,
    lineHeight: 22,
  },
  button: {
    backgroundColor: "#2563EB",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  secondaryButton: {
    backgroundColor: "#1D4ED8",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
