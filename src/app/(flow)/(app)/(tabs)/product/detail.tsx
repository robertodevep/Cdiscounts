import Header from "@/src/components/Header";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useContext, useState } from "react";
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { CartContext } from "@/src/context/CartContext";

type Product = {
  id: string;
  title: string;
  price: string;
  image: string;
};

export default function ProductDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ product?: string | string[] }>();

  const raw = Array.isArray(params.product)
    ? params.product[0]
    : params.product;

  if (!raw) return null;

  let product: Product;
  try {
    product = JSON.parse(decodeURIComponent(raw));
  } catch {
    try {
      product = JSON.parse(raw);
    } catch {
      return null;
    }
  }

  const cartContext = useContext(CartContext);
  if (!cartContext) return null;
  const { addToCart } = cartContext;

  const variants = [
    { label: "64GB", price: 250000 },
    { label: "128GB", price: 280000 },
    { label: "256GB", price: 320000 },
  ];

  const [selectedVariant, setSelectedVariant] = useState(variants[0]);
  const [quantity, setQuantity] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);

  const add = () => setQuantity(quantity + 1);
  const remove = () => quantity > 1 && setQuantity(quantity - 1);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        title: product.title,
        image: product.image,
        variant: selectedVariant.label,
        price: selectedVariant.price,
        quantity: 1,
      });
    }
    setShowSuccess(true);
  };

  return (
    <View style={styles.container}>
      <Header
        onCartPress={() => router.push("/(flow)/(app)/(tabs)/cart")}
        showBack={true}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <Image source={{ uri: product.image }} style={styles.image} />
        <Text style={styles.title}>{product.title}</Text>
        <Text style={styles.description}>
          Produit électronique haut de gamme, performance optimale et qualité
          garantie pour votre usage quotidien.
        </Text>
        <Text style={styles.section}>Version :</Text>

        <View style={styles.variantContainer}>
          {variants.map((variant) => (
            <TouchableOpacity
              key={variant.label}
              style={[
                styles.variantButton,
                selectedVariant.label === variant.label &&
                  styles.variantSelected,
              ]}
              onPress={() => setSelectedVariant(variant)}
            >
              <Text
                style={
                  selectedVariant.label === variant.label
                    ? styles.variantTextSelected
                    : styles.variantText
                }
              >
                {variant.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.price}>
          {selectedVariant.price.toLocaleString()} FCFA
        </Text>

        <View style={styles.qtyContainer}>
          <TouchableOpacity onPress={remove}>
            <Text style={styles.qtyBtn}>−</Text>
          </TouchableOpacity>
          <Text style={styles.qtyText}>{quantity}</Text>
          <TouchableOpacity onPress={add}>
            <Text style={styles.qtyBtn}>+</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleAddToCart}>
          <Text style={styles.buttonText}>Ajouter au panier ({quantity})</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal visible={showSuccess} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalIconCircle}>
              <Text style={styles.modalIcon}>✅</Text>
            </View>
            <Text style={styles.modalTitle}>Ajouté au panier</Text>
            <Text style={styles.modalMessage}>
              <Text style={{ fontWeight: "bold", color: "#111" }}>
                {product.title}
              </Text>{" "}
              a été ajouté à votre panier avec succès.
            </Text>

            <View style={styles.modalDivider} />

            <View style={styles.modalRecap}>
              <Text style={styles.modalRecapLabel}>Version</Text>
              <Text style={styles.modalRecapValue}>
                {selectedVariant.label}
              </Text>
            </View>
            <View style={styles.modalRecap}>
              <Text style={styles.modalRecapLabel}>Quantité</Text>
              <Text style={styles.modalRecapValue}>x{quantity}</Text>
            </View>
            <View style={styles.modalRecap}>
              <Text style={styles.modalRecapLabel}>Prix</Text>
              <Text style={[styles.modalRecapValue, { color: "#e60023" }]}>
                {(selectedVariant.price * quantity).toLocaleString()} FCFA
              </Text>
            </View>

            <View style={styles.modalDivider} />

            <TouchableOpacity
              style={[styles.modalBtn, { backgroundColor: "#e60023" }]}
              onPress={() => {
                setShowSuccess(false);
                router.push("/(flow)/(app)/(tabs)/cart");
              }}
            >
              <Text style={styles.modalBtnText}>Voir le panier</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.modalBtn,
                { backgroundColor: "#111", marginTop: 10 },
              ]}
              onPress={() => setShowSuccess(false)}
            >
              <Text style={styles.modalBtnText}>Continuer les achats</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f2f2f2" },
  image: { width: "100%", height: 300, borderRadius: 20 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 10,
    paddingHorizontal: 15,
  },
  description: { color: "#666", marginBottom: 15, paddingHorizontal: 15 },
  section: { fontWeight: "bold", marginVertical: 10, paddingHorizontal: 15 },
  variantContainer: {
    flexDirection: "row",
    marginBottom: 15,
    paddingHorizontal: 15,
  },
  variantButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    marginRight: 10,
  },
  variantSelected: { backgroundColor: "#e60023", borderColor: "#e60023" },
  variantText: { color: "#000" },
  variantTextSelected: { color: "#fff", fontWeight: "bold" },
  price: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#e60023",
    marginVertical: 10,
    paddingHorizontal: 15,
  },
  qtyContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
    paddingHorizontal: 15,
  },
  qtyBtn: { fontSize: 28, paddingHorizontal: 20 },
  qtyText: { fontSize: 18, fontWeight: "bold" },
  button: {
    backgroundColor: "#e60023",
    padding: 16,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 10,
    marginHorizontal: 15,
    marginBottom: 30,
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  modalBox: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 18,
    width: "88%",
    alignItems: "center",
    elevation: 10,
  },
  modalIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#f0fff4",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  modalIcon: { fontSize: 26 },
  modalTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111",
    marginBottom: 6,
    textAlign: "center",
  },
  modalMessage: {
    fontSize: 13,
    color: "#666",
    textAlign: "center",
    lineHeight: 19,
    marginBottom: 6,
  },
  modalDivider: {
    height: 1,
    backgroundColor: "#f0f0f0",
    width: "100%",
    marginVertical: 8,
  },
  modalRecap: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingVertical: 3,
  },
  modalRecapLabel: { fontSize: 13, color: "#888" },
  modalRecapValue: { fontSize: 13, fontWeight: "bold", color: "#111" },
  modalBtn: {
    width: "100%",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  modalBtnText: { color: "#fff", fontWeight: "bold", fontSize: 14 },
});
