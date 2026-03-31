import { create } from "zustand";

type AppStore = {
  isBootstrapped: boolean;
  hasSeenOnboarding: boolean;
  biometricEnabled: boolean;
  isUnlocked: boolean;
  setBootstrapped: (value: boolean) => void;
  setHasSeenOnboarding: (value: boolean) => void;
  setBiometricEnabled: (value: boolean) => void;
  setUnlocked: (value: boolean) => void;
  resetAppState: () => void;
};

export const useAppStore = create<AppStore>((set) => ({
  isBootstrapped: false,
  hasSeenOnboarding: false,
  biometricEnabled: false,
  isUnlocked: true,
  setBootstrapped: (value) => set({ isBootstrapped: value }),
  setHasSeenOnboarding: (value) => set({ hasSeenOnboarding: value }),
  setBiometricEnabled: (value) => set({ biometricEnabled: value }),
  setUnlocked: (value) => set({ isUnlocked: value }),
  resetAppState: () =>
    set({
      isBootstrapped: true,
      hasSeenOnboarding: false,
      biometricEnabled: false,
      isUnlocked: true,
    }),
}));
