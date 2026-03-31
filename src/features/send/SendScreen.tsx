import React, { useMemo, useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

function isValidEvmAddress(value: string) {
  return /^0x[a-fA-F0-9]{40}$/.test(value.trim());
}

function isValidAmount(value: string) {
  const amount = Number(value);
  return value.trim().length > 0 && !Number.isNaN(amount) && amount > 0;
}

export function SendScreen() {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");

  const recipientError = useMemo(() => {
    if (!recipient) return "";
    return isValidEvmAddress(recipient) ? "" : "Enter a valid EVM address";
  }, [recipient]);

  const amountError = useMemo(() => {
    if (!amount) return "";
    return isValidAmount(amount) ? "" : "Enter a valid amount greater than 0";
  }, [amount]);

  const isFormValid = isValidEvmAddress(recipient) && isValidAmount(amount);

  const handleContinue = () => {
    if (!isFormValid) {
      Alert.alert(
        "Invalid form",
        "Please fix the recipient and amount fields."
      );
      return;
    }

    Alert.alert("Step 13 success", "Send form validation passed.");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Send funds</Text>
      <Text style={styles.subtitle}>
        Enter a recipient wallet address and the amount to send.
      </Text>

      <View style={styles.card}>
        <Text style={styles.label}>Recipient address</Text>
        <TextInput
          value={recipient}
          onChangeText={setRecipient}
          placeholder="0x..."
          placeholderTextColor="#64748B"
          style={styles.input}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {!!recipientError && (
          <Text style={styles.errorText}>{recipientError}</Text>
        )}

        <Text style={styles.label}>Amount</Text>
        <TextInput
          value={amount}
          onChangeText={setAmount}
          placeholder="0.00"
          placeholderTextColor="#64748B"
          style={styles.input}
          keyboardType="decimal-pad"
        />
        {!!amountError && <Text style={styles.errorText}>{amountError}</Text>}
      </View>

      <Pressable
        style={[styles.button, !isFormValid && styles.buttonDisabled]}
        onPress={handleContinue}
      >
        <Text style={styles.buttonText}>Continue</Text>
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
    marginTop: 8,
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#0F172A",
    color: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 15,
  },
  errorText: {
    color: "#F87171",
    fontSize: 13,
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
    opacity: 0.5,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
