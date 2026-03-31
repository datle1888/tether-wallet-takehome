import React, { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import * as Clipboard from "expo-clipboard";
import { useWalletStore } from "../../store/useWalletStore";

function maskAddress(address: string) {
  if (!address) return "-";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function ReceiveScreen() {
  const [copied, setCopied] = useState(false);

  const wallets = useWalletStore((state) => state.wallets);
  const activeWalletId = useWalletStore((state) => state.activeWalletId);

  const activeWallet = wallets.find((wallet) => wallet.id === activeWalletId);

  const handleCopyAddress = async () => {
    if (!activeWallet?.address) {
      Alert.alert("No wallet", "No active wallet address found.");
      return;
    }

    await Clipboard.setStringAsync(activeWallet.address);
    setCopied(true);
    Alert.alert("Copied", "Wallet address copied to clipboard.");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Receive funds</Text>
      <Text style={styles.subtitle}>
        Share this address to receive assets into your wallet.
      </Text>

      <View style={styles.card}>
        <Text style={styles.label}>Wallet</Text>
        <Text style={styles.value}>{activeWallet?.name ?? "-"}</Text>

        <Text style={styles.label}>Short address</Text>
        <Text style={styles.value}>
          {maskAddress(activeWallet?.address ?? "")}
        </Text>

        <Text style={styles.label}>Full address</Text>
        <Text style={styles.fullAddress}>{activeWallet?.address ?? "-"}</Text>
      </View>

      <Pressable style={styles.button} onPress={handleCopyAddress}>
        <Text style={styles.buttonText}>
          {copied ? "Copy again" : "Copy address"}
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
    fontSize: 15,
  },
  fullAddress: {
    color: "#FFFFFF",
    fontSize: 14,
    lineHeight: 22,
  },
  button: {
    backgroundColor: "#2563EB",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
