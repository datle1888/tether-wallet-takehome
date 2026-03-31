import { useEffect } from "react";
import { useAppStore } from "../../store/useAppStore";
import { appStorage } from "../../services/storage/appStorage";
import { useWalletStore } from "../../store/useWalletStore";

export function useBootstrap() {
  const setBootstrapped = useAppStore((state) => state.setBootstrapped);
  const setHasSeenOnboarding = useAppStore(
    (state) => state.setHasSeenOnboarding
  );
  const setBiometricEnabled = useAppStore((state) => state.setBiometricEnabled);
  const setUnlocked = useAppStore((state) => state.setUnlocked);

  const setWallets = useWalletStore((state) => state.setWallets);
  const setActiveWalletId = useWalletStore((state) => state.setActiveWalletId);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const [hasSeenOnboarding, wallets, activeWalletId, biometricEnabled] =
          await Promise.all([
            appStorage.getHasSeenOnboarding(),
            appStorage.getWallets(),
            appStorage.getActiveWalletId(),
            appStorage.getBiometricEnabled(),
          ]);

        setHasSeenOnboarding(hasSeenOnboarding);
        setWallets(wallets);
        setBiometricEnabled(biometricEnabled);
        setUnlocked(!biometricEnabled);

        if (activeWalletId) {
          setActiveWalletId(activeWalletId);
        }
      } catch (error) {
        console.log("Bootstrap load failed", error);
      } finally {
        setBootstrapped(true);
      }
    };

    bootstrap();
  }, [
    setBootstrapped,
    setHasSeenOnboarding,
    setWallets,
    setActiveWalletId,
    setBiometricEnabled,
    setUnlocked,
  ]);
}
