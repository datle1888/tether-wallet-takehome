# Wallet Mobile App – React Native Take Home

A simple wallet mobile application built with React Native (Expo) and TypeScript.

The project demonstrates a clean architecture for wallet flows including onboarding, wallet switching, balance display, send/receive transactions, biometric protection, and a modular service layer ready for Wallet Development Kit (WDK) integration.

---

## Tech stack

- React Native (Expo)
- TypeScript
- Zustand (state management)
- AsyncStorage (local persistence)
- Expo Local Authentication (biometric lock)

---

## Features

- create or import wallet
- support multiple wallets
- view balances
- send transaction flow (simulated)
- receive wallet address
- transaction history view
- biometric app lock
- wallet switching
- persistent local storage

---

## Architecture
Feature-based structure with clear separation between UI, state, and services.
This implementation focuses on:

- simple and intuitive UX
- clean and scalable architecture
- readiness for real WDK integration
- security-aware design

The mock provider simulates WDK behavior and can be replaced by real SDK implementation without changing UI logic.

---

## Security considerations

- biometric protection supported
- wallet metadata stored locally
- no private keys stored in plain text
- architecture prepared for secure key storage (Secure Enclave / Keystore)

---

## Run the project
npm install
npx expo start --ios or --android

