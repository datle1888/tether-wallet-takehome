import AsyncStorage from "@react-native-async-storage/async-storage";
import type { WalletSummary } from "../../types/wallet";

const STORAGE_KEYS = {
  HAS_SEEN_ONBOARDING: "has_seen_onboarding",
  WALLETS: "wallets",
  ACTIVE_WALLET_ID: "active_wallet_id",
};

export const appStorage = {
  async setHasSeenOnboarding(value: boolean) {
    await AsyncStorage.setItem(
      STORAGE_KEYS.HAS_SEEN_ONBOARDING,
      JSON.stringify(value)
    );
  },

  async getHasSeenOnboarding(): Promise<boolean> {
    const value = await AsyncStorage.getItem(STORAGE_KEYS.HAS_SEEN_ONBOARDING);

    if (value === null) {
      return false;
    }

    return JSON.parse(value);
  },

  async setWallets(wallets: WalletSummary[]) {
    await AsyncStorage.setItem(STORAGE_KEYS.WALLETS, JSON.stringify(wallets));
  },

  async getWallets(): Promise<WalletSummary[]> {
    const value = await AsyncStorage.getItem(STORAGE_KEYS.WALLETS);

    if (value === null) {
      return [];
    }

    return JSON.parse(value);
  },

  async setActiveWalletId(walletId: string) {
    await AsyncStorage.setItem(STORAGE_KEYS.ACTIVE_WALLET_ID, walletId);
  },

  async getActiveWalletId(): Promise<string | null> {
    return AsyncStorage.getItem(STORAGE_KEYS.ACTIVE_WALLET_ID);
  },
};
