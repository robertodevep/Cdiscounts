
import Header from "@/src/components/Header";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const methods = [
  {
    name: "Orange Money",
    color: "#FF6600",
    bg: "#FFF4ED",
    border: "#FF6600",
    image: "https://237actu.com/wp-content/uploads/2025/05/Orange-money.jpg",
  },
  {
    name: "Mobile Money",
    color: "#FFCC00",
    bg: "#FFFBEA",
    border: "#FFCC00",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQy7YG35PV-YIh5oFbeYni8Ncam7c8oidlqvA&s",
  },
];

export default function ChoixPaiement() {
  const router = useRouter();
  const { total, cart } = useLocalSearchParams();
  const [selected, setSelected] = useState<string | null>(null);
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  // Largeur de carte adaptative : 2 colonnes, avec un plafond pour les tablettes
  const isTablet = width >= 600;
  //const cardWidth = isTablet ? 220 : (width - 20 * 2 - 16) / 2;
  const cardWidth = isTablet ? 140 : 125;

  const handleNext = () => {
    if (!selected) return;
    router.push({
      pathname: "/(flow)/(app)/confirmation",
      params: { total, cart, method: selected },
    });
  };

  return (
    <View style={styles.container}>
      {/* ✅ Header comme les autres pages */}
      <Header title="Paiement" showBack={true} showCart={false} />

      {/* Contenu centré en haut */}
      <View style={styles.content}>
        <Text style={styles.subtitle}>
          Sélectionnez votre moyen de paiement pour continuer
        </Text>

        <Text style={styles.sectionTitle}>Moyen de paiement</Text>

        {/* Grille 2 colonnes, centrée, responsive */}
        <View
          style={[
            styles.grid,
            isTablet && { justifyContent: "center", gap: 20 },
          ]}
        >
          {methods.map((method) => {
            const isSelected = selected === method.name;
            return (
              <TouchableOpacity
                key={method.name}
                style={[
                  styles.card,
                  { width: cardWidth, minWidth: 0 },
                  { borderColor: isSelected ? method.border : "#e0e0e0" },
                  isSelected && { backgroundColor: method.bg },
                ]}
                activeOpacity={0.8}
                onPress={() => setSelected(method.name)}
              >
                {/* Logo */}
                <View style={styles.logoContainer}>
                  <Image
                    source={{ uri: method.image }}
                    style={styles.logo}
                    resizeMode="cover"
                  />
                </View>
                <Text
                  style={[
                    styles.cardLabel,
                    isSelected && { color: method.color, fontWeight: "800" },
                  ]}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                >
                  {method.name}
                </Text>

                {/* Indicateur sélectionné */}
                {isSelected && (
                  <View
                    style={[styles.checkDot, { backgroundColor: method.color }]}
                  >
                    <Text style={styles.checkMark}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Bouton Suivant fixe en bas, adapté à la safe area de chaque téléphone */}
      <View
        style={[
          styles.footer,
          { paddingBottom: Math.max(insets.bottom, 16) },
        ]}
      >
        <TouchableOpacity
          style={[styles.nextBtn, !selected && styles.nextBtnDisabled]}
          activeOpacity={0.85}
          onPress={handleNext}
          disabled={!selected}
        >
          <Text style={styles.nextBtnText}>Suivant</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },

  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
  },

  subtitle: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "400",
    //color: "#111",
    marginBottom: 16,
  },

  /* Grille responsive, 2 colonnes */
 grid: {
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  gap: 16,
},

  /*card: {
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#e0e0e0",
    backgroundColor: "#fafafa",
    position: "relative",
  },*/
  card: {
  alignItems: "center",
  paddingVertical: 12,
  paddingHorizontal: 6,
  borderRadius: 14,
  borderWidth: 2,
  borderColor: "#e0e0e0",
  backgroundColor: "#fafafa",
  position: "relative",
},

  logoContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },

  logo: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },

  cardLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
    maxWidth: "100%",
  },

  checkDot: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  checkMark: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "bold",
  },

  /* Bouton bas */
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },

  nextBtn: {
    //backgroundColor: "#1a3ccc",
    backgroundColor: "#1d8a45",
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: "center",
  },

  nextBtnDisabled: {
    backgroundColor: "#b0b0b0",
  },

  nextBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
});


