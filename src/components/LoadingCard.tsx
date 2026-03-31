import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  text?: string;
};

export function LoadingCard({ text = "Loading..." }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#111827",
    borderRadius: 16,
    padding: 16,
  },
  text: {
    color: "#94A3B8",
    fontSize: 14,
  },
});
