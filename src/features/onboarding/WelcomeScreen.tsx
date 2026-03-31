import React, { useState } from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import { useAppStore } from "../../store/useAppStore";
import { useWalletStore } from "../../store/useWalletStore";
import { appStorage } from "../../services/storage/appStorage";
import type { WalletSummary } from "../../types/wallet";

function generateFakeWallet(): WalletSummary {
  const timestamp = Date.now();

  return {
    id: `wallet-${timestamp}`,
    name: "Main Wallet",
    address: "0x8ba1f109551bD432803012645Ac136ddd64DBA72",
    chain: "evm",
    createdAt: timestamp,
  };
}

export function WelcomeScreen() {
  const [loading, setLoading] = useState(false);

  const setHasSeenOnboarding = useAppStore(
    (state) => state.setHasSeenOnboarding
  );
  const wallets = useWalletStore((state) => state.wallets);
  const addWallet = useWalletStore((state) => state.addWallet);
  const setActiveWalletId = useWalletStore((state) => state.setActiveWalletId);

  const handleCreateDemoWallet = async () => {
    try {
      setLoading(true);

      const newWallet = generateFakeWallet();
      const nextWallets = [...wallets, newWallet];

      await appStorage.setHasSeenOnboarding(true);
      await appStorage.setWallets(nextWallets);
      await appStorage.setActiveWalletId(newWallet.id);

      addWallet(newWallet);
      setActiveWalletId(newWallet.id);
      setHasSeenOnboarding(true);
    } catch (error) {
      console.log("Failed to create demo wallet", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tether Wallet Take Home</Text>
      <Text style={styles.subtitle}>
        For this step, we create a fake wallet locally to prove the app flow
        works.
      </Text>

      <Pressable
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleCreateDemoWallet}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Creating..." : "Create demo wallet"}
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
