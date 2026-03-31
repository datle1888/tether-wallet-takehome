import type { WalletProvider } from "./types";

export const mockWalletProvider: WalletProvider = {
  async getBalances(address) {
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (address === "0x71C7656EC7ab88b098defB751B7401B5f6d8976F") {
      return [
        {
          symbol: "USDT",
          name: "Tether USD",
          amount: "245.00",
        },
        {
          symbol: "ETH",
          name: "Ethereum",
          amount: "0.18",
        },
      ];
    }

    return [
      {
        symbol: "USDT",
        name: "Tether USD",
        amount: "1200.50",
      },
      {
        symbol: "ETH",
        name: "Ethereum",
        amount: "0.42",
      },
    ];
  },
};
