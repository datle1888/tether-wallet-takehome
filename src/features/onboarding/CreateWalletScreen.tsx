import React, { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

type Props = {
  navigation: any;
};

function generateFakeSeedPhrase() {
  return "twelve seed phrase demo wallet words for backup testing only";
}

export function CreateWalletScreen({ navigation }: Props) {
  const [walletName, setWalletName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateWallet = async () => {
    try {
      setLoading(true);

      const finalWalletName = walletName.trim() || "Main Wallet";
      const seedPhrase = generateFakeSeedPhrase();

      navigation.navigate("BackupSeed", {
        walletName: finalWalletName,
        seedPhrase,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create wallet</Text>
      <Text style={styles.subtitle}>
        Next we show a backup screen before the wallet is added to the app.
      </Text>

      <TextInput
        value={walletName}
        onChangeText={setWalletName}
        placeholder="Wallet name"
        placeholderTextColor="#64748B"
        style={styles.input}
      />

      <Pressable
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleCreateWallet}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Creating..." : "Continue"}
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
  input: {
    backgroundColor: "#111827",
    color: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 16,
    fontSize: 16,
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
