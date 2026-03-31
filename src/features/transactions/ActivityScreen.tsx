import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import type { TransactionItem } from "../../types/transaction";
import { useWalletStore } from "../../store/useWalletStore";

function maskAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function getFakeTransactions(activeAddress: string): TransactionItem[] {
  return [
    {
      id: "tx-1",
      type: "incoming",
      amount: "25.00",
      symbol: "USDT",
      address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
      status: "confirmed",
      timestamp: "2026-03-31 09:15",
    },
    {
      id: "tx-2",
      type: "outgoing",
      amount: "12.50",
      symbol: "USDT",
      address:
        "0x8ba1f109551bD432803012645Ac136ddd64DBA72" === activeAddress
          ? "0xA3b1c2d3e4F5678901234567890AbCdEf1234567"
          : "0x8ba1f109551bD432803012645Ac136ddd64DBA72",
      status: "pending",
      timestamp: "2026-03-31 11:40",
    },
    {
      id: "tx-3",
      type: "incoming",
      amount: "100.00",
      symbol: "USDT",
      address: "0x1234567890abcdef1234567890ABCDEF12345678",
      status: "confirmed",
      timestamp: "2026-03-30 18:20",
    },
  ];
}

export function ActivityScreen() {
  const wallets = useWalletStore((state) => state.wallets);
  const activeWalletId = useWalletStore((state) => state.activeWalletId);

  const activeWallet = wallets.find((wallet) => wallet.id === activeWalletId);
  const transactions = activeWallet?.address
    ? getFakeTransactions(activeWallet.address)
    : [];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Transaction history</Text>
      <Text style={styles.subtitle}>
        Incoming and outgoing activity for the active wallet.
      </Text>

      {!transactions.length ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No transactions yet</Text>
          <Text style={styles.emptySubtitle}>
            Your wallet activity will appear here once transfers happen.
          </Text>
        </View>
      ) : (
        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.row}>
                <Text
                  style={[
                    styles.type,
                    item.type === "incoming"
                      ? styles.incoming
                      : styles.outgoing,
                  ]}
                >
                  {item.type === "incoming" ? "Incoming" : "Outgoing"}
                </Text>
                <Text style={styles.status}>{item.status}</Text>
              </View>

              <Text style={styles.amount}>
                {item.type === "incoming" ? "+" : "-"}
                {item.amount} {item.symbol}
              </Text>

              <Text style={styles.label}>Address</Text>
              <Text style={styles.value}>{maskAddress(item.address)}</Text>

              <Text style={styles.label}>Time</Text>
              <Text style={styles.value}>{item.timestamp}</Text>
            </View>
          )}
        />
      )}
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
  listContent: {
    paddingBottom: 24,
  },
  emptyState: {
    backgroundColor: "#111827",
    borderRadius: 16,
    padding: 20,
  },
  emptyTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  emptySubtitle: {
    color: "#94A3B8",
    fontSize: 14,
    lineHeight: 20,
  },
  card: {
    backgroundColor: "#111827",
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  type: {
    fontSize: 14,
    fontWeight: "700",
  },
  incoming: {
    color: "#34D399",
  },
  outgoing: {
    color: "#F59E0B",
  },
  status: {
    color: "#CBD5E1",
    fontSize: 13,
    textTransform: "capitalize",
  },
  amount: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
    marginTop: 12,
    marginBottom: 14,
  },
  label: {
    color: "#94A3B8",
    fontSize: 13,
    marginBottom: 4,
    marginTop: 6,
  },
  value: {
    color: "#FFFFFF",
    fontSize: 14,
  },
});
