import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useAppStore } from "../../store/useAppStore";
import { useWalletStore } from "../../store/useWalletStore";
import { appStorage } from "../../services/storage/appStorage";
import type { WalletSummary } from "../../types/wallet";

type Props = {
  route: {
    params: {
      walletName: string;
      seedPhrase: string;
    };
  };
};

function generateWalletFromBackupStep(name: string): WalletSummary {
  const timestamp = Date.now();

  return {
    id: `wallet-${timestamp}`,
    name,
    address: "0x8ba1f109551bD432803012645Ac136ddd64DBA72",
    chain: "evm",
    createdAt: timestamp,
  };
}

export function BackupSeedScreen({ route }: Props) {
  const { walletName, seedPhrase } = route.params;
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);

  const wallets = useWalletStore((state) => state.wallets);
  const addWallet = useWalletStore((state) => state.addWallet);
  const setActiveWalletId = useWalletStore((state) => state.setActiveWalletId);
  const setHasSeenOnboarding = useAppStore(
    (state) => state.setHasSeenOnboarding
  );

  const handleEnterWallet = async () => {
    try {
      setLoading(true);

      const newWallet = generateWalletFromBackupStep(walletName);
      const nextWallets = [...wallets, newWallet];

      await appStorage.setWallets(nextWallets);
      await appStorage.setActiveWalletId(newWallet.id);
      await appStorage.setHasSeenOnboarding(true);

      addWallet(newWallet);
      setActiveWalletId(newWallet.id);
      setHasSeenOnboarding(true);
    } catch (error) {
      console.log("Failed to finish wallet creation", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Back up your seed phrase</Text>
      <Text style={styles.warning}>
        Never share this phrase. Anyone with it can access your wallet.
      </Text>

      <View style={styles.seedCard}>
        <Text style={styles.seedText}>{seedPhrase}</Text>
      </View>

      <Pressable
        style={[styles.checkboxRow, confirmed && styles.checkboxRowActive]}
        onPress={() => setConfirmed((prev) => !prev)}
      >
        <View style={[styles.checkbox, confirmed && styles.checkboxActive]} />
        <Text style={styles.checkboxText}>
          I have securely saved this seed phrase
        </Text>
      </Pressable>

      <Pressable
        style={[
          styles.button,
          (!confirmed || loading) && styles.buttonDisabled,
        ]}
        onPress={handleEnterWallet}
        disabled={!confirmed || loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Saving..." : "Enter wallet"}
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
  warning: {
    fontSize: 15,
    color: "#FBBF24",
    lineHeight: 22,
    marginBottom: 20,
  },
  seedCard: {
    backgroundColor: "#111827",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  seedText: {
    color: "#FFFFFF",
    fontSize: 16,
    lineHeight: 24,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#111827",
  },
  checkboxRowActive: {
    borderWidth: 1,
    borderColor: "#2563EB",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#94A3B8",
    marginRight: 12,
  },
  checkboxActive: {
    backgroundColor: "#2563EB",
    borderColor: "#2563EB",
  },
  checkboxText: {
    color: "#FFFFFF",
    flex: 1,
    fontSize: 15,
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
