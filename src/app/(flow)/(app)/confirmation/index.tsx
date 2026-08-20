import Header from "@/src/components/Header";
import { CartContext } from "@/src/context/CartContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useContext, useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Confirmation() {
  const { total, cart, method } = useLocalSearchParams();
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [modal, setModal] = useState<"error" | "success" | null>(null);
  const cartContext = useContext(CartContext);

  const parsedCart = JSON.parse(cart as string);

  const methodColors: Record<string, string> = {
    "Orange Money": "#FF6600",
    "Mobile Money": "#FFCC00",
    AfrikPay: "#0055CC",
  };
  const methodColor = methodColors[method as string] || "#e60023";

  const handlePayment = () => {
    if (!phone) {
      setModal("error");
      return;
    }
    cartContext?.clearCart();
    setModal("success");
  };

  return (
    <View style={styles.container}>
      <Header title="Confirmation" showBack={true} showCart={false} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Badge méthode */}
        <View
          style={[
            styles.methodBadge,
            { backgroundColor: methodColor + "18", borderColor: methodColor },
          ]}
        >
          <Text style={[styles.methodBadgeText, { color: methodColor }]}>
            💳 {method}
          </Text>
        </View>

        {/* Récapitulatif */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Récapitulatif de commande</Text>
          {parsedCart.map((item: any, index: number) => (
            <View key={index} style={styles.itemRow}>
              <View style={styles.itemLeft}>
                <Text style={styles.itemTitle} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={styles.itemVariant}>Version : {item.variant}</Text>
              </View>
              <View style={styles.itemRight}>
                <Text style={styles.itemQty}>x{item.quantity}</Text>
                <Text style={styles.itemPrice}>
                  {(item.price * item.quantity).toLocaleString()} FCFA
                </Text>
              </View>
            </View>
          ))}
          <View style={styles.divider} />
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total à payer</Text>
            <Text style={styles.totalAmount}>
              {Number(total).toLocaleString()} FCFA
            </Text>
          </View>
        </View>

        {/* Saisie numéro */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Numéro de paiement</Text>
          <Text style={styles.inputHint}>
            Entrez le numéro associé à votre compte {method}
          </Text>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputFlag}>🇨🇲 +237</Text>
            <TextInput
              placeholder="6X XX XX XX XX"
              keyboardType="phone-pad"
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholderTextColor="#aaa"
              maxLength={9}
            />
          </View>
        </View>
      </ScrollView>

      {/* Bouton bas */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.payBtn, !phone && styles.payBtnDisabled]}
          activeOpacity={0.85}
          onPress={handlePayment}
          disabled={!phone}
        >
          <Text style={styles.payText}>Confirmer le paiement</Text>
        </TouchableOpacity>
      </View>

      {/* ✅ Modal Erreur */}
      <Modal visible={modal === "error"} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.modalBox}>
            <View
              style={[styles.modalIconCircle, { backgroundColor: "#fff0f0" }]}
            >
              <Text style={styles.modalIcon}>⚠️</Text>
            </View>
            <Text style={styles.modalTitle}>Champ requis</Text>
            <Text style={styles.modalMessage}>
              Veuillez entrer votre numéro de téléphone pour continuer.
            </Text>
            <TouchableOpacity
              style={[styles.modalBtn, { backgroundColor: "#e60023" }]}
              onPress={() => setModal(null)}
            >
              <Text style={styles.modalBtnText}>Réessayer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ✅ Modal Succès */}
      <Modal visible={modal === "success"} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.modalBox}>
            <View
              style={[styles.modalIconCircle, { backgroundColor: "#f0fff4" }]}
            >
              <Text style={styles.modalIcon}>✅</Text>
            </View>
            <Text style={styles.modalTitle}>Paiement en cours</Text>
            <Text style={styles.modalMessage}>
              Votre paiement via{" "}
              <Text style={{ fontWeight: "bold", color: methodColor }}>
                {method}
              </Text>{" "}
              a bien été initié. Vous recevrez une confirmation par SMS.
            </Text>

            {/* Ligne séparateur */}
            <View style={styles.modalDivider} />

            {/* Récap mini */}
            <View style={styles.modalRecap}>
              <Text style={styles.modalRecapLabel}>Montant</Text>
              <Text style={[styles.modalRecapValue, { color: "#e60023" }]}>
                {Number(total).toLocaleString()} FCFA
              </Text>
            </View>
            <View style={styles.modalRecap}>
              <Text style={styles.modalRecapLabel}>Numéro</Text>
              <Text style={styles.modalRecapValue}>+237 {phone}</Text>
            </View>

            <View style={styles.modalDivider} />

            <TouchableOpacity
              style={[styles.modalBtn, { backgroundColor: "#111" }]}
              onPress={() => {
                setModal(null);
                router.replace("/");
              }}
            >
              <Text style={styles.modalBtnText}>Retour à l'accueil</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },

  scrollContent: { padding: 16, paddingBottom: 20, gap: 14 },

  methodBadge: {
    alignSelf: "center",
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 30,
    borderWidth: 1.5,
    marginBottom: 4,
  },
  methodBadgeText: { fontWeight: "bold", fontSize: 14 },

  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#111",
    marginBottom: 14,
  },

  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  itemLeft: { flex: 1, paddingRight: 10 },
  itemTitle: { fontSize: 14, fontWeight: "600", color: "#222" },
  itemVariant: { fontSize: 12, color: "#999", marginTop: 2 },
  itemRight: { alignItems: "flex-end" },
  itemQty: { fontSize: 12, color: "#999" },
  itemPrice: { fontSize: 14, fontWeight: "bold", color: "#333", marginTop: 2 },

  divider: { height: 1, backgroundColor: "#f0f0f0", marginVertical: 12 },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: { fontSize: 15, fontWeight: "bold", color: "#333" },
  totalAmount: { fontSize: 20, fontWeight: "bold", color: "#e60023" },

  inputHint: { fontSize: 13, color: "#888", marginBottom: 12 },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 14,
    backgroundColor: "#fafafa",
  },
  inputFlag: {
    fontSize: 14,
    color: "#555",
    marginRight: 8,
    paddingRight: 8,
    borderRightWidth: 1,
    borderRightColor: "#ddd",
    paddingVertical: 14,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#111",
    paddingVertical: 14,
    paddingLeft: 10,
    letterSpacing: 1,
  },

  footer: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  payBtn: {
    backgroundColor: "#e60023",
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: "center",
  },
  payBtnDisabled: { backgroundColor: "#ccc" },
  payText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 0.5,
  },

  /* ✅ Modal styles */
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  modalBox: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 24,
    width: "100%",
    alignItems: "center",
    elevation: 10,
  },
  modalIconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  modalIcon: { fontSize: 34 },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111",
    marginBottom: 8,
    textAlign: "center",
  },
  modalMessage: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 21,
    marginBottom: 8,
  },
  modalDivider: {
    height: 1,
    backgroundColor: "#f0f0f0",
    width: "100%",
    marginVertical: 12,
  },
  modalRecap: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingVertical: 4,
  },
  modalRecapLabel: { fontSize: 14, color: "#888" },
  modalRecapValue: { fontSize: 14, fontWeight: "bold", color: "#111" },
  modalBtn: {
    marginTop: 8,
    width: "100%",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  modalBtnText: { color: "#fff", fontWeight: "bold", fontSize: 15 },
});
