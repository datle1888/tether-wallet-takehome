export type TransactionItem = {
  id: string;
  type: "incoming" | "outgoing";
  amount: string;
  symbol: string;
  address: string;
  status: "pending" | "confirmed" | "failed";
  timestamp: string;
};
