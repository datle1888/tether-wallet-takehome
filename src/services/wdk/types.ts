export type WalletProvider = {
  getBalances(address: string): Promise<
    {
      symbol: string;
      name: string;
      amount: string;
    }[]
  >;
};
