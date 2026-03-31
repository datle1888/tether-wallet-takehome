import { create } from "zustand";

type AppStore = {
  isBootstrapped: boolean;
  hasSeenOnboarding: boolean;
  setBootstrapped: (value: boolean) => void;
  setHasSeenOnboarding: (value: boolean) => void;
};

export const useAppStore = create<AppStore>((set) => ({
  isBootstrapped: false,
  hasSeenOnboarding: false,
  setBootstrapped: (value) => set({ isBootstrapped: value }),
  setHasSeenOnboarding: (value) => set({ hasSeenOnboarding: value }),
}));
