import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEYS = {
  HAS_SEEN_ONBOARDING: "has_seen_onboarding",
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
};
