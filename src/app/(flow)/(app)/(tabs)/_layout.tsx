import { Tabs } from "expo-router";
import React from "react";

//import { HapticTab } from "@/components/haptic-tab";
import { HapticTab } from "@/src/components/haptic-tab";
import { IconSymbol } from "@/src/components/ui/icon-symbol";
import { Colors } from "@/src/constants/theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColorScheme } from "@/src/hooks/use-color-scheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const bottomInset = insets.bottom;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          height: 60 + bottomInset,
          paddingBottom: bottomInset,
        },
      }}
    >
      <Tabs.Screen
        name="welcome"
        options={{
          title: "Welcome",
          tabBarLabel: "Accueil",
          tabBarIcon: ({ focused, color }) => (
            <IconSymbol
              size={28}
              name={focused ? "house.fill" : "house"}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="product"
        options={{
          title: "Product",
          tabBarLabel: "Produits",
          tabBarIcon: ({ focused, color }) => (
            <IconSymbol
              size={28}
              name={focused ? "bag.fill" : "bag"}
              //name={focused ? "house.fill" : "house"}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          tabBarLabel: "Panier",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="cart.fill" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="setting" // Parametre
        options={{
          tabBarLabel: "Parametre",
          tabBarIcon: ({ focused, color }) => (
            <IconSymbol
              size={28}
              name={focused ? "gearshape.fill" : "gearshape"}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
