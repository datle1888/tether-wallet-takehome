import React from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { useWalletStore } from "../../store/useWalletStore";
import { useAppStore } from "../../store/useAppStore";
import { appStorage } from "../../services/storage/appStorage";
import type { WalletSummary } from "../../types/wallet";

type Props = {
  navigation: any;
};

function generateSecondFakeWallet(): WalletSummary {
  const timestamp = Date.now();

  return {
    id: `wallet-${timestamp}`,
    name: `Wallet ${timestamp.toString().slice(-4)}`,
    address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    chain: "evm",
    createdAt: timestamp,
  };
}

export function SetupScreen({ navigation }: Props) {
  const wallets = useWalletStore((state) => state.wallets);
  const activeWalletId = useWalletStore((state) => state.activeWalletId);
  const addWallet = useWalletStore((state) => state.addWallet);
  const resetWalletState = useWalletStore((state) => state.resetWalletState);

  const resetAppState = useAppStore((state) => state.resetAppState);

  const activeWallet = wallets.find((wallet) => wallet.id === activeWalletId);

  const handleAddSecondWallet = async () => {
    const newWallet = generateSecondFakeWallet();
    const nextWallets = [...wallets, newWallet];

    await appStorage.setWallets(nextWallets);
    addWallet(newWallet);
  };

  const handleResetApp = async () => {
    Alert.alert("Reset app", "Clear onboarding and wallet data?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Reset",
        style: "destructive",
        onPress: async () => {
          await appStorage.clearAppData();
          resetWalletState();
          resetAppState();
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home placeholder</Text>
      <Text style={styles.subtitle}>Wallet state is now connected.</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Wallet name</Text>
        <Text style={styles.value}>{activeWallet?.name ?? "-"}</Text>

        <Text style={styles.label}>Address</Text>
        <Text style={styles.value}>{activeWallet?.address ?? "-"}</Text>

        <Text style={styles.label}>Chain</Text>
        <Text style={styles.value}>{activeWallet?.chain ?? "-"}</Text>
      </View>

      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate("Receive")}
      >
        <Text style={styles.buttonText}>Receive</Text>
      </Pressable>

      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate("Send")}
      >
        <Text style={styles.buttonText}>Send</Text>
      </Pressable>

      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate("WalletSwitcher")}
      >
        <Text style={styles.buttonText}>Switch wallet</Text>
      </Pressable>

      <Pressable
        style={[styles.button, styles.secondaryButton]}
        onPress={handleAddSecondWallet}
      >
        <Text style={styles.buttonText}>Add another demo wallet</Text>
      </Pressable>

      <Pressable
        style={[styles.button, styles.dangerButton]}
        onPress={handleResetApp}
      >
        <Text style={styles.buttonText}>Reset app data</Text>
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
    fontSize: 24,
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
    fontSize: 15,
  },
  button: {
    backgroundColor: "#2563EB",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  secondaryButton: {
    backgroundColor: "#1D4ED8",
  },
  dangerButton: {
    backgroundColor: "#DC2626",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
