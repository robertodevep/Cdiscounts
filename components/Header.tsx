import { useNavigation } from "@react-navigation/native";
import React, { useContext } from "react";
import {
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { CartContext } from "../context/CartContext";

// ✅ Modifie les couleurs ici facilement
const HEADER_CONFIG = {
  backgroundColor: "#000000", // ← Noir
  titleColor: "#ffffff", // ← Texte blanc
  cartBadgeColor: "#e60023",
  cartBadgeTextColor: "#ffffff",
  titleFontSize: 18,
  height: 40,
  backArrowColor: "#ffffff", // ← Flèche blanche
};

type HeaderProps = {
  title?: string;
  onCartPress?: () => void;
  showCart?: boolean;
  showBack?: boolean; // ← false sur Accueil, true ailleurs
};

export default function Header({
  title,
  onCartPress,
  showCart = true,
  showBack = false,
}: HeaderProps) {
  const cartContext = useContext(CartContext);
  const cartCount = cartContext?.cart.length || 0;
  const navigation = useNavigation();

  return (
    <View style={styles.wrapper}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={HEADER_CONFIG.backgroundColor}
        translucent={false}
      />

      <View style={styles.header}>
        {/* Bouton retour OU espace vide */}
        <View style={styles.leftSection}>
          {showBack ? (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
              style={styles.backButton}
            >
              <Text style={styles.backArrow}>←</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.backButton} /> // espace vide pour centrer le titre
          )}
        </View>

        {/* Titre centré */}
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>

        {/* Bouton panier OU espace vide */}
        <View style={styles.rightSection}>
          {showCart && (
            <TouchableOpacity onPress={onCartPress} activeOpacity={0.8}>
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
    paddingTop:
      Platform.OS === "android" ? (StatusBar.currentHeight ?? 24) : 44,
  },
  header: {
    height: HEADER_CONFIG.height,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    backgroundColor: HEADER_CONFIG.backgroundColor,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  leftSection: {
    width: 50,
    alignItems: "flex-start",
  },
  rightSection: {
    width: 80,
    alignItems: "flex-end",
  },
  backButton: {
    padding: 4,
  },
  backArrow: {
    fontSize: 24,
    color: HEADER_CONFIG.backArrowColor,
    fontWeight: "bold",
  },
  title: {
    flex: 1,
    fontSize: HEADER_CONFIG.titleFontSize,
    fontWeight: "bold",
    color: HEADER_CONFIG.titleColor,
    textAlign: "center",
  },
  cartBadge: {
    backgroundColor: HEADER_CONFIG.cartBadgeColor,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  cartText: {
    color: HEADER_CONFIG.cartBadgeTextColor,
    fontWeight: "bold",
  },
});
