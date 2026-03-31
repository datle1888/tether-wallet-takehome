import React, { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { useWalletStore } from "../../store/useWalletStore";
import { useAppStore } from "../../store/useAppStore";
import { appStorage } from "../../services/storage/appStorage";
import { biometricService } from "../../services/biometrics/biometricService";
import { balanceService } from "../../services/wdk/balanceService";
import { LoadingCard } from "../../components/LoadingCard";
import { EmptyState } from "../../components/EmptyState";
import type { WalletSummary } from "../../types/wallet";
import type { BalanceItem } from "../../types/balance";

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

function maskAddress(address?: string) {
  if (!address) return "-";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function SetupScreen({ navigation }: Props) {
  const [balances, setBalances] = useState<BalanceItem[]>([]);
  const [loadingBalances, setLoadingBalances] = useState(true);

  const wallets = useWalletStore((state) => state.wallets);
  const activeWalletId = useWalletStore((state) => state.activeWalletId);
  const addWallet = useWalletStore((state) => state.addWallet);
  const resetWalletState = useWalletStore((state) => state.resetWalletState);

  const biometricEnabled = useAppStore((state) => state.biometricEnabled);
  const setBiometricEnabled = useAppStore((state) => state.setBiometricEnabled);
  const setUnlocked = useAppStore((state) => state.setUnlocked);
  const resetAppState = useAppStore((state) => state.resetAppState);

  const activeWallet = wallets.find((wallet) => wallet.id === activeWalletId);

  useEffect(() => {
    let mounted = true;

    const loadBalances = async () => {
      try {
        setLoadingBalances(true);
        const nextBalances = await balanceService.getBalances(
          activeWallet?.address
        );

        if (mounted) {
          setBalances(nextBalances);
        }
      } catch (error) {
        if (mounted) {
          setBalances([]);
        }
      } finally {
        if (mounted) {
          setLoadingBalances(false);
        }
      }
    };

    loadBalances();

    return () => {
      mounted = false;
    };
  }, [activeWallet?.address]);

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

  const handleToggleBiometric = async (value: boolean) => {
    if (value) {
      const available = await biometricService.isAvailable();

      if (!available) {
        Alert.alert(
          "Unavailable",
          "Biometric authentication is not available on this device."
        );
        return;
      }
    }

    await appStorage.setBiometricEnabled(value);
    setBiometricEnabled(value);

    if (!value) {
      setUnlocked(true);
    }
  };

  const handleLockNow = () => {
    if (!biometricEnabled) {
      Alert.alert("Biometric lock is off", "Enable biometric lock first.");
      return;
    }

    setUnlocked(false);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Wallet Home</Text>
      <Text style={styles.subtitle}>
        A simple wallet flow with local state and security controls.
      </Text>

      <View style={styles.walletCard}>
        <View style={styles.walletHeaderRow}>
          <Text style={styles.walletName}>{activeWallet?.name ?? "-"}</Text>
          <Text style={styles.chainBadge}>{activeWallet?.chain ?? "-"}</Text>
        </View>

        <Text style={styles.cardLabel}>Address</Text>
        <Text style={styles.address}>{maskAddress(activeWallet?.address)}</Text>

        <Text style={styles.cardHint}>
          Full wallet details are available in Receive.
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Balances</Text>
      {loadingBalances ? (
        <LoadingCard text="Loading balances..." />
      ) : balances.length === 0 ? (
        <EmptyState
          title="No balances available"
          description="Balances will appear here after wallet data is loaded."
        />
      ) : (
        <View style={styles.balanceCard}>
          {balances.map((item) => (
            <View key={item.symbol} style={styles.balanceRow}>
              <View>
                <Text style={styles.balanceSymbol}>{item.symbol}</Text>
                <Text style={styles.balanceName}>{item.name}</Text>
              </View>
              <Text style={styles.balanceAmount}>{item.amountFormatted}</Text>
            </View>
          ))}
        </View>
      )}

      <Text style={styles.sectionTitle}>Quick actions</Text>
      <View style={styles.actionRow}>
        <Pressable
          style={styles.primaryAction}
          onPress={() => navigation.navigate("Receive")}
        >
          <Text style={styles.primaryActionText}>Receive</Text>
        </Pressable>

        <Pressable
          style={styles.primaryAction}
          onPress={() => navigation.navigate("Send")}
        >
          <Text style={styles.primaryActionText}>Send</Text>
        </Pressable>
      </View>

      <View style={styles.actionRow}>
        <Pressable
          style={styles.secondaryAction}
          onPress={() => navigation.navigate("Activity")}
        >
          <Text style={styles.secondaryActionText}>Activity</Text>
        </Pressable>

        <Pressable
          style={styles.secondaryAction}
          onPress={() => navigation.navigate("WalletSwitcher")}
        >
          <Text style={styles.secondaryActionText}>Wallets</Text>
        </Pressable>
      </View>

      <Text style={styles.sectionTitle}>Security</Text>
      <View style={styles.settingCard}>
        <Text style={styles.settingText}>Enable biometric lock</Text>
        <Switch
          value={biometricEnabled}
          onValueChange={handleToggleBiometric}
        />
      </View>

      <Pressable style={styles.outlineButton} onPress={handleLockNow}>
        <Text style={styles.outlineButtonText}>Lock now</Text>
      </Pressable>

      <Text style={styles.sectionTitle}>Testing tools</Text>

      <Pressable style={styles.mutedButton} onPress={handleAddSecondWallet}>
        <Text style={styles.mutedButtonText}>Add another demo wallet</Text>
      </Pressable>

      <Pressable style={styles.dangerButton} onPress={handleResetApp}>
        <Text style={styles.dangerButtonText}>Reset app data</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B1220",
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 32,
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: "#A0AEC0",
    lineHeight: 22,
    marginBottom: 20,
  },
  walletCard: {
    backgroundColor: "#111827",
    borderRadius: 20,
    padding: 18,
    marginBottom: 24,
  },
  walletHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  walletName: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "700",
    flex: 1,
    marginRight: 12,
  },
  chainBadge: {
    color: "#93C5FD",
    fontSize: 13,
    fontWeight: "600",
    backgroundColor: "#172554",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    textTransform: "uppercase",
  },
  cardLabel: {
    color: "#94A3B8",
    fontSize: 13,
    marginTop: 16,
    marginBottom: 6,
  },
  address: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
  },
  cardHint: {
    color: "#64748B",
    fontSize: 13,
    marginTop: 12,
  },
  sectionTitle: {
    color: "#E2E8F0",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
    marginTop: 24,
  },
  balanceCard: {
    backgroundColor: "#111827",
    borderRadius: 20,
    padding: 16,
  },
  balanceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  balanceSymbol: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  balanceName: {
    color: "#94A3B8",
    fontSize: 13,
    marginTop: 2,
  },
  balanceAmount: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  actionRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  primaryAction: {
    flex: 1,
    backgroundColor: "#2563EB",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
  },
  primaryActionText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  secondaryAction: {
    flex: 1,
    backgroundColor: "#1E293B",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
  },
  secondaryActionText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
  settingCard: {
    backgroundColor: "#111827",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  settingText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "500",
    flex: 1,
    marginRight: 12,
  },
  outlineButton: {
    borderWidth: 1,
    borderColor: "#334155",
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: "center",
    marginBottom: 8,
  },
  outlineButtonText: {
    color: "#E2E8F0",
    fontSize: 15,
    fontWeight: "600",
  },
  mutedButton: {
    backgroundColor: "#1E293B",
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: "center",
    marginBottom: 12,
  },
  mutedButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
  dangerButton: {
    backgroundColor: "#B91C1C",
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: "center",
  },
  dangerButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
});
