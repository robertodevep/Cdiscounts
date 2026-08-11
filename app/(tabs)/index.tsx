

/*import { CartProvider } from "../../context/CartContext";
import AppNavigator from "../../navigation/AppNavigator";

export default function App() {
  return (
    <CartProvider>
      <AppNavigator />
    </CartProvider>
  );
}*/

import { CartProvider } from "../../context/CartContext";
import AppNavigator from "../../navigation/AppNavigator";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "react-native";

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#ffffff"
        translucent={false}
      />
      <CartProvider>
        <AppNavigator />
      </CartProvider>
    </SafeAreaProvider>
  );
}
