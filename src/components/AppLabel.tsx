import React from "react";
import { StyleSheet, Text } from "react-native";

type Props = {
  text: string;
};

export function AppLabel({ text }: Props) {
  return <Text style={styles.text}>{text}</Text>;
}

const styles = StyleSheet.create({
  text: {
    color: "#4FD1C5",
    fontSize: 14,
    marginTop: 8,
  },
});
