import { create } from "zustand";
import type { WalletSummary } from "../types/wallet";

type WalletStore = {
  wallets: WalletSummary[];
  activeWalletId: string | null;
  setWallets: (wallets: WalletSummary[]) => void;
  addWallet: (wallet: WalletSummary) => void;
  setActiveWalletId: (walletId: string) => void;
};

export const useWalletStore = create<WalletStore>((set) => ({
  wallets: [],
  activeWalletId: null,
  setWallets: (wallets) => set({ wallets }),
  addWallet: (wallet) =>
    set((state) => ({
      wallets: [...state.wallets, wallet],
    })),
  setActiveWalletId: (walletId) => set({ activeWalletId: walletId }),
}));
