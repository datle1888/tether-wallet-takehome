import React from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import { useAppStore } from "../../store/useAppStore";

export function WelcomeScreen() {
  const completeOnboarding = useAppStore((state) => state.completeOnboarding);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tether Wallet Take Home</Text>
      <Text style={styles.subtitle}>
        This is the onboarding entry. Next we will replace this with
        create/import wallet flow.
      </Text>

      <Pressable style={styles.button} onPress={completeOnboarding}>
        <Text style={styles.buttonText}>Finish onboarding</Text>
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
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
