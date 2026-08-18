

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
//import CartScreen from "../screens/CartScreen";
//import CartScreen from  "../app/(tabs)/panier";
//import HomeScreen from "../screens/HomeScreen";
//import ProductScreen from "../screens/ProductScreen";
import CartScreen from "../app/(flow)/(app)/(tabs)/cart";
import HomeScreen from "../app/(flow)/(app)/(tabs)/welcome";
import ProductScreen from "../app/(flow)/(app)/(tabs)/product";
import SettingScreen from "../app/(flow)/(app)/(tabs)/setting";

type RootStackParamList = {
  Accueil: undefined;
  Produit: {
    product: { id: string; title: string; price: string; image: string };
  };
  Panier: undefined;
  parametre: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    // ✅ On désactive le header natif qui causait le problème
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Accueil" component={HomeScreen} />
      <Stack.Screen name="Produit" component={ProductScreen} />
      <Stack.Screen name="Panier" component={CartScreen} />
      <Stack.Screen name="parametre" component={SettingScreen} />
    </Stack.Navigator>
  );
}