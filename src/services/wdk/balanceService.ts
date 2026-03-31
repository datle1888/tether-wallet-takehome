import { mockWalletProvider } from "./mockWalletProvider";
import type { BalanceItem } from "../../types/balance";

export const balanceService = {
  async getBalances(walletAddress?: string): Promise<BalanceItem[]> {
    if (!walletAddress) {
      throw new Error("Missing wallet address");
    }

    const balances = await mockWalletProvider.getBalances(walletAddress);

    return balances.map((b) => ({
      symbol: b.symbol,
      name: b.name,
      amountFormatted: b.amount,
    }));
  },
};
