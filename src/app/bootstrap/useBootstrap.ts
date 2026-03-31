import { useEffect } from "react";
import { useAppStore } from "../../store/useAppStore";
import { appStorage } from "../../services/storage/appStorage";

export function useBootstrap() {
  const setBootstrapped = useAppStore((state) => state.setBootstrapped);
  const setHasSeenOnboarding = useAppStore(
    (state) => state.setHasSeenOnboarding
  );

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const hasSeenOnboarding = await appStorage.getHasSeenOnboarding();
        setHasSeenOnboarding(hasSeenOnboarding);
      } catch (error) {
        console.log("Bootstrap load failed", error);
      } finally {
        setBootstrapped(true);
      }
    };

    bootstrap();
  }, [setBootstrapped, setHasSeenOnboarding]);
}
