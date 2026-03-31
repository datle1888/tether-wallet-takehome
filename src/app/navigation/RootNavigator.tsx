import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { WelcomeScreen } from "../../features/onboarding/WelcomeScreen";
import { CreateWalletScreen } from "../../features/onboarding/CreateWalletScreen";
import { BackupSeedScreen } from "../../features/onboarding/BackupSeedScreen";
import { ImportWalletScreen } from "../../features/onboarding/ImportWalletScreen";
import { SetupScreen } from "../../features/onboarding/SetupScreen";
import { SplashScreen } from "../../features/home/SplashScreen";
import { WalletSwitcherScreen } from "../../features/wallets/WalletSwitcherScreen";
import { ReceiveScreen } from "../../features/receive/ReceiveScreen";
import { SendScreen } from "../../features/send/SendScreen";
import { useBootstrap } from "../bootstrap/useBootstrap";
import { useAppStore } from "../../store/useAppStore";
import { useWalletStore } from "../../store/useWalletStore";

export type RootStackParamList = {
  Welcome: undefined;
  CreateWallet: undefined;
  BackupSeed: {
    walletName: string;
    seedPhrase: string;
  };
  ImportWallet: undefined;
  Setup: undefined;
  WalletSwitcher: undefined;
  Receive: undefined;
  Send: undefined;
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
        <>
          <Stack.Screen
            name="Welcome"
            component={WelcomeScreen}
            options={{ title: "Wallet Setup" }}
          />
          <Stack.Screen
            name="CreateWallet"
            component={CreateWalletScreen}
            options={{ title: "Create Wallet" }}
          />
          <Stack.Screen
            name="BackupSeed"
            component={BackupSeedScreen}
            options={{ title: "Backup Seed Phrase" }}
          />
          <Stack.Screen
            name="ImportWallet"
            component={ImportWalletScreen}
            options={{ title: "Import Wallet" }}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name="Setup"
            component={SetupScreen}
            options={{ title: "Home" }}
          />
          <Stack.Screen
            name="WalletSwitcher"
            component={WalletSwitcherScreen}
            options={{ title: "Switch Wallet" }}
          />
          <Stack.Screen
            name="Receive"
            component={ReceiveScreen}
            options={{ title: "Receive" }}
          />
          <Stack.Screen
            name="Send"
            component={SendScreen}
            options={{ title: "Send" }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}
