import { useEffect } from "react";
import { useAppStore } from "../../store/useAppStore";

export function useBootstrap() {
  const setBootstrapped = useAppStore((state) => state.setBootstrapped);

  useEffect(() => {
    const timer = setTimeout(() => {
      setBootstrapped(true);
    }, 1200);

    return () => clearTimeout(timer);
  }, [setBootstrapped]);
}
