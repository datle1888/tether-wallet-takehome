import type { BalanceItem } from "../../types/balance";

export const balanceService = {
  async getBalances(walletAddress?: string): Promise<BalanceItem[]> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (!walletAddress) {
      return [];
    }

    if (walletAddress === "0x71C7656EC7ab88b098defB751B7401B5f6d8976F") {
      return [
        {
          symbol: "USDT",
          name: "Tether USD",
          amountFormatted: "245.00",
        },
        {
          symbol: "ETH",
          name: "Ethereum",
          amountFormatted: "0.18",
        },
      ];
    }

    return [
      {
        symbol: "USDT",
        name: "Tether USD",
        amountFormatted: "1200.50",
      },
      {
        symbol: "ETH",
        name: "Ethereum",
        amountFormatted: "0.42",
      },
    ];
  },
};
