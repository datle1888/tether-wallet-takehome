import { useEffect } from "react";
import { useAppStore } from "../../store/useAppStore";
import { appStorage } from "../../services/storage/appStorage";
import { useWalletStore } from "../../store/useWalletStore";

export function useBootstrap() {
  const setBootstrapped = useAppStore((state) => state.setBootstrapped);
  const setHasSeenOnboarding = useAppStore(
    (state) => state.setHasSeenOnboarding
  );

  const setWallets = useWalletStore((state) => state.setWallets);
  const setActiveWalletId = useWalletStore((state) => state.setActiveWalletId);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const [hasSeenOnboarding, wallets, activeWalletId] = await Promise.all([
          appStorage.getHasSeenOnboarding(),
          appStorage.getWallets(),
          appStorage.getActiveWalletId(),
        ]);

        setHasSeenOnboarding(hasSeenOnboarding);
        setWallets(wallets);

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
  }, [setBootstrapped, setHasSeenOnboarding, setWallets, setActiveWalletId]);
}
