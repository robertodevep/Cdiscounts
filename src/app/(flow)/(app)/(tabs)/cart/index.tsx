


import Header from "@/src/components/Header";
import { useRouter } from "expo-router";
import React, { useContext } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { CartContext } from "@/src/context/CartContext";

export default function CartScreen() {
  const cartContext = useContext(CartContext);
  const router = useRouter();

  if (!cartContext) return null;

  const { cart, addToCart, removeFromCart } = cartContext;

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePayment = () => {
    if (cart.length === 0) return;

    router.push({
      pathname: "/(flow)/(app)/payment",
      params: {
        total: total.toString(),
        cart: JSON.stringify(cart),
      },
    });
  };

  return (
    <View style={styles.container}>
      <Header
        title="Mon Panier"
        onCartPress={() => {}}
        showBack={true}
        showCart={false}
      />

      {cart.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🛒</Text>
          <Text style={styles.emptyText}>Votre panier est vide</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={cart}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Image source={{ uri: item.image }} style={styles.image} />

                <View style={styles.cardContent}>
                  <Text style={styles.title} numberOfLines={2}>
                    {item.title}
                  </Text>

                  <Text style={styles.variant}>Version : {item.variant}</Text>

                  <Text style={styles.price}>
                    {(item.price * item.quantity).toLocaleString()} FCFA
                  </Text>

                  <View style={styles.qtyRow}>
                    <TouchableOpacity
                      style={styles.qtyBtn}
                      onPress={() => removeFromCart(item.id, item.variant)}
                    >
                      <Text style={styles.qtyBtnText}>🗑</Text>
                    </TouchableOpacity>

                    <Text style={styles.qtyText}>{item.quantity}</Text>

                    <TouchableOpacity
                      style={styles.qtyBtn}
                      onPress={() => addToCart({ ...item, quantity: 1 })}
                    >
                      <Text style={styles.qtyBtnText}>＋</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          />

          {/* Barre total + paiement */}
          <View style={styles.totalBar}>
            <View>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalAmount}>
                {total.toLocaleString()} FCFA
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.payButton,
                cart.length === 0 && styles.payButtonDisabled,
              ]}
              activeOpacity={0.8}
              onPress={handlePayment}
              disabled={cart.length === 0}
            >
              <Text style={styles.payButtonText}>Payer</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },

  emptyIcon: {
    fontSize: 60,
  },

  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#555",
  },

  listContent: {
    padding: 15,
    paddingBottom: 140,
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    elevation: 3,
  },

  image: {
    width: 85,
    height: 85,
    borderRadius: 12,
    marginRight: 12,
  },

  cardContent: {
    flex: 1,
    justifyContent: "space-between",
  },

  title: {
    fontWeight: "400",
    fontSize: 15,
    //color: "#111",
  },

  variant: {
    color: "#888",
    fontSize: 13,
    marginTop: 3,
  },

  price: {
    color: "#1d8a45",
    fontWeight: "bold",
    fontSize: 15,
    marginTop: 4,
  },

  qtyRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },

  qtyBtn: {
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },

  qtyBtnText: {
    fontSize: 16,
  },

  qtyText: {
    marginHorizontal: 14,
    fontWeight: "bold",
    fontSize: 16,
    color: "#111",
  },

  totalBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#ffffff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#eeeeee",
    elevation: 10,
  },

  totalLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#555",
  },

  totalAmount: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1d8a45",
  },

  payButton: {
    backgroundColor: "#1d8a45",
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 10,
  },

  payButtonDisabled: {
    backgroundColor: "#ccc",
  },

  payButtonText: {
    color: "#fff",
    fontWeight: "500",
    fontSize: 16,
  },
});
