import React, { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { biometricService } from "../../services/biometrics/biometricService";
import { useAppStore } from "../../store/useAppStore";

export function UnlockScreen() {
  const [loading, setLoading] = useState(false);
  const setUnlocked = useAppStore((state) => state.setUnlocked);

  const handleUnlock = async () => {
    try {
      setLoading(true);

      const available = await biometricService.isAvailable();
      if (!available) {
        Alert.alert(
          "Unavailable",
          "Biometric authentication is not available on this device."
        );
        return;
      }

      const result = await biometricService.authenticate();

      if (result.success) {
        setUnlocked(true);
      } else {
        Alert.alert("Unlock failed", "Authentication was cancelled or failed.");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to authenticate.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Wallet locked</Text>
      <Text style={styles.subtitle}>
        Biometric unlock is enabled. Authenticate to continue.
      </Text>

      <Pressable
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleUnlock}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Authenticating..." : "Unlock with biometrics"}
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
    lineHeight: 22,
    marginBottom: 24,
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
