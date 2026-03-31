import React, { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useAppStore } from "../../store/useAppStore";
import { useWalletStore } from "../../store/useWalletStore";
import { appStorage } from "../../services/storage/appStorage";
import type { WalletSummary } from "../../types/wallet";

function generateFakeCreatedWallet(name: string): WalletSummary {
  const timestamp = Date.now();

  return {
    id: `wallet-${timestamp}`,
    name: name.trim() || "Main Wallet",
    address: "0x8ba1f109551bD432803012645Ac136ddd64DBA72",
    chain: "evm",
    createdAt: timestamp,
  };
}

export function CreateWalletScreen() {
  const [walletName, setWalletName] = useState("");
  const [loading, setLoading] = useState(false);

  const wallets = useWalletStore((state) => state.wallets);
  const addWallet = useWalletStore((state) => state.addWallet);
  const setActiveWalletId = useWalletStore((state) => state.setActiveWalletId);
  const setHasSeenOnboarding = useAppStore(
    (state) => state.setHasSeenOnboarding
  );

  const handleCreateWallet = async () => {
    try {
      setLoading(true);

      const newWallet = generateFakeCreatedWallet(walletName);
      const nextWallets = [...wallets, newWallet];

      await appStorage.setWallets(nextWallets);
      await appStorage.setActiveWalletId(newWallet.id);
      await appStorage.setHasSeenOnboarding(true);

      addWallet(newWallet);
      setActiveWalletId(newWallet.id);
      setHasSeenOnboarding(true);
    } catch (error) {
      console.log("Failed to create wallet", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create wallet</Text>
      <Text style={styles.subtitle}>
        For now this uses local demo wallet data. Real WDK creation comes next.
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
          {loading ? "Creating..." : "Create wallet"}
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
