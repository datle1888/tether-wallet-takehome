import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { WelcomeScreen } from "../../features/onboarding/WelcomeScreen";
import { SetupScreen } from "../../features/onboarding/SetupScreen";

export type RootStackParamList = {
  Welcome: undefined;
  Setup: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Welcome"
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
      <Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={{ title: "Wallet Setup" }}
      />
      <Stack.Screen
        name="Setup"
        component={SetupScreen}
        options={{ title: "Next Step" }}
      />
    </Stack.Navigator>
  );
}
