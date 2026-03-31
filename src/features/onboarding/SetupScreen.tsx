import React, { useCallback, useEffect, useMemo, useState } from "react";
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
import { ErrorState } from "../../components/ErrorState";
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
  const [balancesError, setBalancesError] = useState("");

  const wallets = useWalletStore((state) => state.wallets);
  const activeWalletId = useWalletStore((state) => state.activeWalletId);
  const addWallet = useWalletStore((state) => state.addWallet);
  const resetWalletState = useWalletStore((state) => state.resetWalletState);

  const biometricEnabled = useAppStore((state) => state.biometricEnabled);
  const setBiometricEnabled = useAppStore((state) => state.setBiometricEnabled);
  const setUnlocked = useAppStore((state) => state.setUnlocked);
  const resetAppState = useAppStore((state) => state.resetAppState);

  const activeWallet = wallets.find((wallet) => wallet.id === activeWalletId);

  const totalBalanceText = useMemo(() => {
    if (!balances.length) return "--";

    const total = balances.reduce((sum, item) => {
      const value = Number(item.amountFormatted);
      return Number.isNaN(value) ? sum : sum + value;
    }, 0);

    return total.toFixed(2);
  }, [balances]);

  const loadBalances = useCallback(async () => {
    try {
      setLoadingBalances(true);
      setBalancesError("");

      const nextBalances = await balanceService.getBalances(
        activeWallet?.address
      );
      setBalances(nextBalances);
    } catch (error) {
      setBalances([]);
      setBalancesError(
        error instanceof Error ? error.message : "Failed to load balances"
      );
    } finally {
      setLoadingBalances(false);
    }
  }, [activeWallet?.address]);

  useEffect(() => {
    loadBalances();
  }, [loadBalances]);

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
      <View style={styles.headerRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Wallet</Text>
          <Text style={styles.subtitle}>Simple, secure, and easy to scan.</Text>
        </View>

        <Pressable
          style={styles.walletSwitcherPill}
          onPress={() => navigation.navigate("WalletSwitcher")}
        >
          <Text style={styles.walletSwitcherText}>Wallets</Text>
        </Pressable>
      </View>

      <View style={styles.heroCard}>
        <Text style={styles.heroLabel}>Active wallet</Text>
        <Text style={styles.heroWalletName}>{activeWallet?.name ?? "-"}</Text>
        <Text style={styles.heroAddress}>
          {maskAddress(activeWallet?.address)}
        </Text>

        <View style={styles.totalBalanceBlock}>
          <Text style={styles.totalBalanceLabel}>Estimated total</Text>
          <Text style={styles.totalBalanceValue}>
            {loadingBalances ? "Loading..." : totalBalanceText}
          </Text>
        </View>
      </View>

      <View style={styles.primaryActionsRow}>
        <Pressable
          style={styles.primaryAction}
          onPress={() => navigation.navigate("Receive")}
        >
          <Text style={styles.primaryActionTitle}>Receive</Text>
          <Text style={styles.primaryActionHint}>Show address and QR</Text>
        </Pressable>

        <Pressable
          style={styles.primaryAction}
          onPress={() => navigation.navigate("Send")}
        >
          <Text style={styles.primaryActionTitle}>Send</Text>
          <Text style={styles.primaryActionHint}>Transfer assets out</Text>
        </Pressable>
      </View>

      <Text style={styles.sectionTitle}>Balances</Text>
      {loadingBalances ? (
        <LoadingCard text="Loading balances..." />
      ) : balancesError ? (
        <ErrorState
          title="Could not load balances"
          description={balancesError}
          onRetry={loadBalances}
        />
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

          <Pressable style={styles.inlineRefreshButton} onPress={loadBalances}>
            <Text style={styles.inlineRefreshText}>Refresh balances</Text>
          </Pressable>
        </View>
      )}

      <Text style={styles.sectionTitle}>More</Text>
      <View style={styles.secondaryList}>
        <Pressable
          style={styles.secondaryListItem}
          onPress={() => navigation.navigate("Activity")}
        >
          <Text style={styles.secondaryListTitle}>Activity</Text>
          <Text style={styles.secondaryListHint}>
            View incoming and outgoing transactions
          </Text>
        </Pressable>

        <View style={styles.settingCard}>
          <View style={{ flex: 1, marginRight: 12 }}>
            <Text style={styles.secondaryListTitle}>Biometric lock</Text>
            <Text style={styles.secondaryListHint}>
              Protect wallet access on this device
            </Text>
          </View>
          <Switch
            value={biometricEnabled}
            onValueChange={handleToggleBiometric}
          />
        </View>

        <Pressable style={styles.secondaryListItem} onPress={handleLockNow}>
          <Text style={styles.secondaryListTitle}>Lock now</Text>
          <Text style={styles.secondaryListHint}>
            Require biometric unlock immediately
          </Text>
        </Pressable>
      </View>

      <Text style={styles.testingTitle}>Testing tools</Text>

      <Pressable style={styles.testingButton} onPress={handleAddSecondWallet}>
        <Text style={styles.testingButtonText}>Add another demo wallet</Text>
      </Pressable>

      <Pressable style={styles.resetButton} onPress={handleResetApp}>
        <Text style={styles.resetButtonText}>Reset app data</Text>
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
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: "#A0AEC0",
    lineHeight: 22,
  },
  walletSwitcherPill: {
    backgroundColor: "#1E293B",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginLeft: 12,
  },
  walletSwitcherText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  heroCard: {
    backgroundColor: "#111827",
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
  },
  heroLabel: {
    color: "#94A3B8",
    fontSize: 13,
    marginBottom: 6,
  },
  heroWalletName: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "700",
  },
  heroAddress: {
    color: "#CBD5E1",
    fontSize: 15,
    marginTop: 6,
  },
  totalBalanceBlock: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#1E293B",
  },
  totalBalanceLabel: {
    color: "#94A3B8",
    fontSize: 13,
    marginBottom: 6,
  },
  totalBalanceValue: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "700",
  },
  primaryActionsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  primaryAction: {
    flex: 1,
    backgroundColor: "#2563EB",
    borderRadius: 18,
    padding: 18,
  },
  primaryActionTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
  },
  primaryActionHint: {
    color: "#DBEAFE",
    fontSize: 13,
    lineHeight: 18,
  },
  sectionTitle: {
    color: "#E2E8F0",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
  },
  balanceCard: {
    backgroundColor: "#111827",
    borderRadius: 20,
    padding: 16,
    marginBottom: 24,
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
  inlineRefreshButton: {
    marginTop: 8,
    backgroundColor: "#1E293B",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  inlineRefreshText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  secondaryList: {
    marginBottom: 24,
  },
  secondaryListItem: {
    backgroundColor: "#111827",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  secondaryListTitle: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 4,
  },
  secondaryListHint: {
    color: "#94A3B8",
    fontSize: 13,
    lineHeight: 18,
  },
  settingCard: {
    backgroundColor: "#111827",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  testingTitle: {
    color: "#64748B",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  testingButton: {
    backgroundColor: "#1E293B",
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: "center",
    marginBottom: 12,
  },
  testingButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
  resetButton: {
    backgroundColor: "#B91C1C",
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: "center",
  },
  resetButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
});
