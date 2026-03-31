import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { WelcomeScreen } from "../../features/onboarding/WelcomeScreen";
import { SetupScreen } from "../../features/onboarding/SetupScreen";
import { SplashScreen } from "../../features/home/SplashScreen";
import { useBootstrap } from "../bootstrap/useBootstrap";
import { useAppStore } from "../../store/useAppStore";
import { useWalletStore } from "../../store/useWalletStore";

export type RootStackParamList = {
  Welcome: undefined;
  Setup: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  useBootstrap();

  const isBootstrapped = useAppStore((state) => state.isBootstrapped);
  const hasSeenOnboarding = useAppStore((state) => state.hasSeenOnboarding);
  const wallets = useWalletStore((state) => state.wallets);

  if (!isBootstrapped) {
    return <SplashScreen />;
  }

  const shouldShowOnboarding = !hasSeenOnboarding || wallets.length === 0;

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#0B1220",
        },
        headerTintColor: "#FFFFFF",
        contentStyle: {
          backgroundColor: "#0B1220",
        },
      }}
    >
      {shouldShowOnboarding ? (
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{ title: "Wallet Setup" }}
        />
      ) : (
        <Stack.Screen
          name="Setup"
          component={SetupScreen}
          options={{ title: "Home" }}
        />
      )}
    </Stack.Navigator>
  );
}
