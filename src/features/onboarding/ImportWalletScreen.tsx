import React, { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useAppStore } from "../../store/useAppStore";
import { useWalletStore } from "../../store/useWalletStore";
import { appStorage } from "../../services/storage/appStorage";
import type { WalletSummary } from "../../types/wallet";

function generateFakeImportedWallet(name: string): WalletSummary {
  const timestamp = Date.now();

  return {
    id: `wallet-${timestamp}`,
    name: name.trim() || "Imported Wallet",
    address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    chain: "evm",
    createdAt: timestamp,
  };
}

export function ImportWalletScreen() {
  const [walletName, setWalletName] = useState("");
  const [seedPhrase, setSeedPhrase] = useState("");
  const [loading, setLoading] = useState(false);

  const wallets = useWalletStore((state) => state.wallets);
  const addWallet = useWalletStore((state) => state.addWallet);
  const setActiveWalletId = useWalletStore((state) => state.setActiveWalletId);
  const setHasSeenOnboarding = useAppStore(
    (state) => state.setHasSeenOnboarding
  );

  const handleImportWallet = async () => {
    if (!seedPhrase.trim()) {
      return;
    }

    try {
      setLoading(true);

      const newWallet = generateFakeImportedWallet(walletName);
      const nextWallets = [...wallets, newWallet];

      await appStorage.setWallets(nextWallets);
      await appStorage.setActiveWalletId(newWallet.id);
      await appStorage.setHasSeenOnboarding(true);

      addWallet(newWallet);
      setActiveWalletId(newWallet.id);
      setHasSeenOnboarding(true);
    } catch (error) {
      console.log("Failed to import wallet", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Import wallet</Text>
      <Text style={styles.subtitle}>
        Enter a seed phrase. Validation and real wallet import come next.
      </Text>

      <TextInput
        value={walletName}
        onChangeText={setWalletName}
        placeholder="Wallet name"
        placeholderTextColor="#64748B"
        style={styles.input}
      />

      <TextInput
        value={seedPhrase}
        onChangeText={setSeedPhrase}
        placeholder="Seed phrase"
        placeholderTextColor="#64748B"
        style={[styles.input, styles.multilineInput]}
        multiline
      />

      <Pressable
        style={[
          styles.button,
          (!seedPhrase.trim() || loading) && styles.buttonDisabled,
        ]}
        onPress={handleImportWallet}
        disabled={!seedPhrase.trim() || loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Importing..." : "Import wallet"}
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
  multilineInput: {
    minHeight: 110,
    textAlignVertical: "top",
    paddingTop: 14,
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
