import { create } from "zustand";

type AppStore = {
  isBootstrapped: boolean;
  hasSeenOnboarding: boolean;
  setBootstrapped: (value: boolean) => void;
  completeOnboarding: () => void;
};

export const useAppStore = create<AppStore>((set) => ({
  isBootstrapped: false,
  hasSeenOnboarding: false,
  setBootstrapped: (value) => set({ isBootstrapped: value }),
  completeOnboarding: () => set({ hasSeenOnboarding: true }),
}));
