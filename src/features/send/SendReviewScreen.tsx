import React, { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  navigation: any;
  route: {
    params: {
      recipient: string;
      amount: string;
      estimatedFee: string;
    };
  };
};

function maskAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function SendReviewScreen({ navigation, route }: Props) {
  const { recipient, amount, estimatedFee } = route.params;
  const [submitting, setSubmitting] = useState(false);

  const handleConfirm = async () => {
    try {
      setSubmitting(true);

      setTimeout(() => {
        setSubmitting(false);
        Alert.alert(
          "Transfer submitted",
          "Demo send flow completed successfully.",
          [
            {
              text: "OK",
              onPress: () => navigation.navigate("Setup"),
            },
          ]
        );
      }, 600);
    } catch (error) {
      setSubmitting(false);
      Alert.alert("Error", "Failed to submit transaction.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Review transfer</Text>
      <Text style={styles.subtitle}>
        Confirm the transfer details before sending.
      </Text>

      <View style={styles.card}>
        <Text style={styles.label}>Recipient</Text>
        <Text style={styles.value}>{maskAddress(recipient)}</Text>
        <Text style={styles.fullValue}>{recipient}</Text>

        <Text style={styles.label}>Amount</Text>
        <Text style={styles.value}>{amount} USDT</Text>

        <Text style={styles.label}>Estimated fee</Text>
        <Text style={styles.value}>{estimatedFee}</Text>
      </View>

      <Pressable
        style={[styles.button, submitting && styles.buttonDisabled]}
        onPress={handleConfirm}
        disabled={submitting}
      >
        <Text style={styles.buttonText}>
          {submitting ? "Submitting..." : "Confirm send"}
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
  card: {
    backgroundColor: "#111827",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  label: {
    color: "#94A3B8",
    fontSize: 13,
    marginTop: 10,
    marginBottom: 4,
  },
  value: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  fullValue: {
    color: "#CBD5E1",
    fontSize: 14,
    lineHeight: 22,
    marginTop: 6,
  },
  button: {
    backgroundColor: "#2563EB",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
