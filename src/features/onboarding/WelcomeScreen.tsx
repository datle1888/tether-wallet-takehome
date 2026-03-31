import React, { useState } from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import { useAppStore } from "../../store/useAppStore";
import { appStorage } from "../../services/storage/appStorage";

export function WelcomeScreen() {
  const [loading, setLoading] = useState(false);
  const setHasSeenOnboarding = useAppStore(
    (state) => state.setHasSeenOnboarding
  );

  const handleFinishOnboarding = async () => {
    try {
      setLoading(true);
      await appStorage.setHasSeenOnboarding(true);
      setHasSeenOnboarding(true);
    } catch (error) {
      console.log("Failed to save onboarding state", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tether Wallet Take Home</Text>
      <Text style={styles.subtitle}>
        This onboarding state will now persist even after app reload.
      </Text>

      <Pressable
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleFinishOnboarding}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Saving..." : "Finish onboarding"}
        </Text>
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
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
