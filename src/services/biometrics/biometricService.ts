import * as LocalAuthentication from "expo-local-authentication";

export const biometricService = {
  async isAvailable() {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    return hasHardware && isEnrolled;
  },

  async authenticate() {
    return LocalAuthentication.authenticateAsync({
      promptMessage: "Unlock wallet",
      fallbackLabel: "Use passcode",
      disableDeviceFallback: false,
    });
  },
};
