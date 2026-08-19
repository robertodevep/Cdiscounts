// import { useNavigation } from "@react-navigation/native";
// import React, { useContext } from "react";
// import {
//   Platform,
//   StatusBar,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import { CartContext } from "../context/CartContext";

// // ✅ Modifie les couleurs ici facilement
// const HEADER_CONFIG = {
//   backgroundColor: "#FFFFFF",
//   //titleColor: "#ffffff", // ← Texte blanc
//   cartBadgeColor: "#E60023",
//   cartBadgeTextColor: "#FFFFFF",
//   //titleFontSize: 18,
//   //height: 40,*
//   headerHeight: 38,
//   backArrowColor: "#222222", // ← Flèche blanche
// };

// type HeaderProps = {
//   title?: string;
//   onCartPress?: () => void;
//   showCart?: boolean;
//   showBack?: boolean; // ← false sur Accueil, true ailleurs
// };

// export default function Header({
//   title,
//   onCartPress,
//   showCart = true,
//   showBack = false,
// }: HeaderProps) {
//   const cartContext = useContext(CartContext);
//   const cartCount = cartContext?.cart.length || 0;
//   const navigation = useNavigation();

//   return (
//     <View style={styles.wrapper}>
//       <StatusBar
//         barStyle="dark-content"
//         backgroundColor={HEADER_CONFIG.backgroundColor}
//         translucent={false}
//       />

//       <View style={styles.header}>
//         {/* Bouton retour OU espace vide */}
//         <View style={styles.leftSection}>
//           {showBack ? (
//             <TouchableOpacity
//               onPress={() => navigation.goBack()}
//               activeOpacity={0.7}
//               style={styles.backButton}
//             >
//              <Text style={styles.backArrow}>‹</Text>
//             </TouchableOpacity>
//           ) : (
//             <View style={styles.backButton} /> // espace vide pour centrer le titre
//           )}
//         </View>

//         {/* Bouton panier OU espace vide */}
//         <View style={styles.rightSection}>
//           {showCart && (
//             <TouchableOpacity
//               onPress={onCartPress}
//               activeOpacity={0.8}
//               style={styles.cartButton}
//             >
//               <View style={styles.cartBadge}>
//                 <Text style={styles.cartText}>🛒 {cartCount}</Text>
//               </View>
//             </TouchableOpacity>
//           )}
//         </View>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   wrapper: {
//     backgroundColor: HEADER_CONFIG.backgroundColor,
//     paddingTop: Platform.OS === "android" ? (StatusBar.currentHeight ?? 24) : 44,
//   },
//   header: {
//     height: HEADER_CONFIG.headerHeight,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingHorizontal: 12,
//     backgroundColor: HEADER_CONFIG.backgroundColor,
//     elevation: 0,
//     shadowOpacity: 0,
//     borderBottomWidth: 0,
//   },
//   leftSection: {
//     width: 45,
//     height: "100%",
//     alignItems: "flex-start",
//     justifyContent: "center",
//   },
//   rightSection: {
//     width: 70,
//     height: "100%",

//     alignItems: "flex-end",
//     justifyContent: "center",
//   },
//   backButton: {
//     width: 32,
//     height: 32,

//     alignItems: "center",
//     justifyContent: "center",
//   },
//   backArrow: {
//     fontSize: 32,
//     lineHeight: 34,
//     color: HEADER_CONFIG.backArrowColor,
//     fontWeight: "300",

//     marginTop: -3,
//   },
//    cartButton: {
//     //width: 32,
//     //height: 32,
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   cartBadge: {
//     backgroundColor: HEADER_CONFIG.cartBadgeColor,

//     minHeight: 32,

//     paddingHorizontal: 9,
//     paddingVertical: 5,

//     borderRadius: 18,

//     alignItems: "center",
//     justifyContent: "center",
//   },
//   cartText: {
//     color: HEADER_CONFIG.cartBadgeTextColor,
//     fontSize: 14,
//     fontWeight: "bold",
//   },
// });

import { useNavigation } from "@react-navigation/native";
import React, { useContext } from "react";
import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CartContext } from "../context/CartContext";

const HEADER_CONFIG = {
  backgroundColor: "#FFFFFF",
  cartBadgeColor: "#E60023",
  cartBadgeTextColor: "#FFFFFF",
  backArrowColor: "#222222",
  headerHeight: 38,
};

type HeaderProps = {
  title?: string;
  onCartPress?: () => void;
  showCart?: boolean;
  showBack?: boolean;
};

export default function Header({
  onCartPress,
  showCart = true,
  showBack = false,
}: HeaderProps) {
  const cartContext = useContext(CartContext);
  const cartCount = cartContext?.cart.length || 0;
  const navigation = useNavigation();

  const insets = useSafeAreaInsets();

  return (
    <View style={styles.wrapper}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={HEADER_CONFIG.backgroundColor}
        translucent
      />

      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top,
          },
        ]}
      >
        {/* Retour */}
        <View style={styles.leftSection}>
          {showBack ? (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
              style={styles.backButton}
            >
              <Text style={styles.backArrow}>‹</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.backButton} />
          )}
        </View>

        {/* Panier */}
        <View style={styles.rightSection}>
          {showCart && (
            <TouchableOpacity
              onPress={onCartPress}
              activeOpacity={0.8}
              style={styles.cartButton}
            >
              <View style={styles.cartBadge}>
                <Text style={styles.cartText}>🛒 {cartCount}</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: HEADER_CONFIG.backgroundColor,
  },

  header: {
    minHeight: HEADER_CONFIG.headerHeight,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    paddingHorizontal: 12,

    backgroundColor: HEADER_CONFIG.backgroundColor,

    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 0,
  },

  leftSection: {
    width: 45,
    height: 38,

    alignItems: "flex-start",
    justifyContent: "center",
  },

  rightSection: {
    width: 70,
    height: 38,

    alignItems: "flex-end",
    justifyContent: "center",
  },

  backButton: {
    width: 32,
    height: 32,

    alignItems: "center",
    justifyContent: "center",
  },

  backArrow: {
    fontSize: 32,
    lineHeight: 34,
    color: HEADER_CONFIG.backArrowColor,
    fontWeight: "300",
    marginTop: -3,
  },

  cartButton: {
    alignItems: "center",
    justifyContent: "center",
  },

  cartBadge: {
    backgroundColor: HEADER_CONFIG.cartBadgeColor,
    minHeight: 25,
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },

  cartText: {
    color: HEADER_CONFIG.cartBadgeTextColor,
    fontSize: 14,
    fontWeight: "bold",
  },
});
