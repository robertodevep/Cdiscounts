/*import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useContext } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import CartScreen from "../screens/CartScreen";
import { CartContext } from "../context/CartContext";
import HomeScreen from "../screens/HomeScreen";
import ProductScreen from "../screens/ProductScreen";

type RootStackParamList = {
  Accueil: undefined;
  Produit: {
    product: { id: string; title: string; price: string; image: string };
  };
  Panier: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const cartContext = useContext(CartContext);

  return (
    <Stack.Navigator
      screenOptions={({ navigation }) => ({
        headerRight: () => {
          const cartCount = cartContext?.cart.length || 0;

          return (
            <TouchableOpacity
              onPress={() => navigation.navigate("Panier")}
              style={{
                marginRight: 15,
              }}
            >
              <View
                style={{
                  backgroundColor: "#e60023",
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  borderRadius: 20,
                }}
              >
                <Text style={{ color: "white", fontWeight: "bold" }}>
                  🛒 {cartCount}
                </Text>
              </View>
            </TouchableOpacity>
          );
        },
      })}
    >
      <Stack.Screen name="Accueil" component={HomeScreen} />
      <Stack.Screen name="Produit" component={ProductScreen} />
      <Stack.Screen name="Panier" component={CartScreen} />
    </Stack.Navigator>
  );
}*/


import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
//import CartScreen from "../screens/CartScreen";
import CartScreen from  "../app/(tabs)/panier";
import HomeScreen from "../screens/HomeScreen";
import ProductScreen from "../screens/ProductScreen";

type RootStackParamList = {
  Accueil: undefined;
  Produit: {
    product: { id: string; title: string; price: string; image: string };
  };
  Panier: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    // ✅ On désactive le header natif qui causait le problème
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Accueil" component={HomeScreen} />
      <Stack.Screen name="Produit" component={ProductScreen} />
      <Stack.Screen name="Panier" component={CartScreen} />
    </Stack.Navigator>
  );
}