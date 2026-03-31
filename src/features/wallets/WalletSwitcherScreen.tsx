import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useWalletStore } from "../../store/useWalletStore";
import { appStorage } from "../../services/storage/appStorage";
import type { WalletSummary } from "../../types/wallet";

function maskAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function WalletSwitcherScreen({ navigation }: any) {
  const wallets = useWalletStore((state) => state.wallets);
  const activeWalletId = useWalletStore((state) => state.activeWalletId);
  const setActiveWalletId = useWalletStore((state) => state.setActiveWalletId);

  const handleSelectWallet = async (wallet: WalletSummary) => {
    await appStorage.setActiveWalletId(wallet.id);
    setActiveWalletId(wallet.id);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select wallet</Text>

      {wallets.map((wallet) => {
        const isActive = wallet.id === activeWalletId;

        return (
          <Pressable
            key={wallet.id}
            style={[styles.card, isActive && styles.activeCard]}
            onPress={() => handleSelectWallet(wallet)}
          >
            <Text style={styles.name}>{wallet.name}</Text>
            <Text style={styles.address}>{maskAddress(wallet.address)}</Text>
            {isActive ? <Text style={styles.badge}>Active</Text> : null}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B1220",
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#111827",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  activeCard: {
    borderWidth: 1,
    borderColor: "#2563EB",
  },
  name: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
  },
  address: {
    color: "#94A3B8",
    fontSize: 14,
  },
  badge: {
    marginTop: 10,
    color: "#60A5FA",
    fontSize: 13,
    fontWeight: "600",
  },
});
