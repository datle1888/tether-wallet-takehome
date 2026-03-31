import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useWalletStore } from "../../store/useWalletStore";

export function SetupScreen() {
  const wallets = useWalletStore((state) => state.wallets);
  const activeWalletId = useWalletStore((state) => state.activeWalletId);

  const activeWallet = wallets.find((wallet) => wallet.id === activeWalletId);

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
});
