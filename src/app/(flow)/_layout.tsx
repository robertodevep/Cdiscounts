import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import { CartProvider } from "@/src/context/CartContext";

export default function FlowLayout() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      SplashScreen.hideAsync().then(() => {
        router.replace("/(flow)/(app)/(tabs)/welcome");
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <CartProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </CartProvider>
  );
}
