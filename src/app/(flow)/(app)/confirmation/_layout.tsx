import { Stack } from "expo-router";
import React from "react";

export default function ConfirmationLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
    </Stack>
  );
}
