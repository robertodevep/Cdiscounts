import { Stack } from "expo-router";
import React from "react";

export default function PaymentLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="confirmation" />
    </Stack>
  );
}
