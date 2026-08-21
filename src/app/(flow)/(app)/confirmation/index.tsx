import Header from "@/src/components/Header";
import { CartContext } from "@/src/context/CartContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useContext, useEffect, useRef, useState } from "react";
import {
  FlatList,
  Keyboard,
  KeyboardEvent,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Country = {
  name: string;
  dial: string;
  flag: string;
};

const countries: Country[] = [
  { name: "Cameroun", dial: "+237", flag: "🇨🇲" },
  { name: "Côte d'Ivoire", dial: "+225", flag: "🇨🇮" },
  { name: "Sénégal", dial: "+221", flag: "🇸🇳" },
  { name: "Mali", dial: "+223", flag: "🇲🇱" },
  { name: "Bénin", dial: "+229", flag: "🇧🇯" },
  { name: "Togo", dial: "+228", flag: "🇹🇬" },
  { name: "Burkina Faso", dial: "+226", flag: "🇧🇫" },
  { name: "Guinée", dial: "+224", flag: "🇬🇳" },
  { name: "Niger", dial: "+227", flag: "🇳🇪" },
  { name: "Gabon", dial: "+241", flag: "🇬🇦" },
  { name: "Congo", dial: "+242", flag: "🇨🇬" },
  { name: "RD Congo", dial: "+243", flag: "🇨🇩" },
  { name: "Ghana", dial: "+233", flag: "🇬🇭" },
  { name: "Nigeria", dial: "+234", flag: "🇳🇬" },
];

// Petit espace laissé au-dessus du champ après le scroll, pour ne pas
// le coller à l'extrême bord de l'écran
const SCROLL_TOP_GAP = 24;

export default function Confirmation() {
  const { total, cart, method } = useLocalSearchParams();
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [modal, setModal] = useState<"error" | "success" | null>(null);
  const [countryModal, setCountryModal] = useState(false);
  const [country, setCountry] = useState<Country>(countries[0]);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const cartContext = useContext(CartContext);
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);

  // ✅ Position réelle (mesurée) de la carte "Numéro de paiement" dans le
  // contenu scrollable — remplace le scrollToEnd() peu fiable
  const [inputCardY, setInputCardY] = useState(0);

  const parsedCart = JSON.parse(cart as string);

  const methodColors: Record<string, string> = {
    "Orange Money": "#FF6600",
    "Mobile Money": "#FFCC00",
    AfrikPay: "#0055CC",
  };
  const methodColor = methodColors[method as string] || "#e60023";

  // ✅ Le numéro est valide seulement s'il contient exactement 9 chiffres
  const isPhoneValid = phone.length === 9;

  // ✅ Ne garde que les chiffres et bloque au-delà de 9 (l'utilisateur peut
  // toujours effacer puis ressaisir normalement)
  const handlePhoneChange = (text: string) => {
    const digitsOnly = text.replace(/[^0-9]/g, "").slice(0, 9);
    setPhone(digitsOnly);
  };

  // ✅ Gestion manuelle du clavier (KeyboardAvoidingView non fiable sur TPE)
  useEffect(() => {
    const showEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showSub = Keyboard.addListener(showEvent, (e: KeyboardEvent) => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    const hideSub = Keyboard.addListener(hideEvent, () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  // ✅ Scroll précis basé sur la position mesurée du champ, pas sur
  // scrollToEnd(). S'adapte automatiquement à la hauteur de chaque écran
  // et à la hauteur réelle du clavier de chaque téléphone.
  useEffect(() => {
    if (keyboardHeight > 0) {
      const id = setTimeout(() => {
        scrollRef.current?.scrollTo({
          y: Math.max(inputCardY - SCROLL_TOP_GAP, 0),
          animated: true,
        });
      }, 100);
      return () => clearTimeout(id);
    }
  }, [keyboardHeight, inputCardY]);

  const handlePayment = () => {
    if (!isPhoneValid) {
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
        style={{ flex: 1 }}
        ref={scrollRef}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: keyboardHeight > 0 ? keyboardHeight + 20 : 24 },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Badge méthode */}
        <View
          style={[
            styles.methodBadge,
            { backgroundColor: methodColor + "18", borderColor: methodColor },
          ]}
        >
          <View style={[styles.methodDot, { backgroundColor: methodColor }]} />
          <Text style={[styles.methodBadgeText, { color: methodColor }]}>
            {method}
          </Text>
        </View>

        {/* Récapitulatif */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Récapitulatif de commande</Text>
          {parsedCart.map((item: any, index: number) => (
            <View
              key={index}
              style={[
                styles.itemRow,
                index !== parsedCart.length - 1 && styles.itemRowDashed,
              ]}
            >
              <View style={styles.itemLeft}>
                <Text style={styles.itemTitle} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={styles.itemVariant}>Version : {item.variant}</Text>
              </View>
              <View style={styles.itemRight}>
                <Text style={styles.itemQty}>x{item.quantity}</Text>
                <Text style={styles.itemPrice} numberOfLines={1}>
                  {(item.price * item.quantity).toLocaleString()} FCFA
                </Text>
              </View>
            </View>
          ))}
          <View style={styles.divider} />
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total à payer</Text>
            <Text
              style={styles.totalAmount}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              {Number(total).toLocaleString()} FCFA
            </Text>
          </View>
        </View>

        {/* Saisie numéro */}
        <View
          style={styles.card}
          onLayout={(e) => setInputCardY(e.nativeEvent.layout.y)}
        >
          <Text style={styles.cardTitle}>Numéro de paiement</Text>
          <Text style={styles.inputHint}>
            Entrez le numéro associé à votre compte {method}
          </Text>
          <View style={styles.inputWrapper}>
            <TouchableOpacity
              style={styles.countryPicker}
              activeOpacity={0.7}
              onPress={() => setCountryModal(true)}
            >
              <Text style={styles.countryFlag}>{country.flag}</Text>
              <Text style={styles.countryDial}>{country.dial}</Text>
              <Text style={styles.chevron}>▾</Text>
            </TouchableOpacity>
            <TextInput
              placeholder="6X XX XX XX XX"
              keyboardType="number-pad"
              style={styles.input}
              value={phone}
              onChangeText={handlePhoneChange}
              placeholderTextColor="#aaa"
              maxLength={9}
            />
          </View>
        </View>
      </ScrollView>

      {/* Bouton bas — masqué automatiquement quand le clavier est ouvert */}
      {keyboardHeight === 0 && (
        <View
          style={[
            styles.footer,
            { paddingBottom: Math.max(insets.bottom, 16) },
          ]}
        >
          <TouchableOpacity
            style={[styles.payBtn, !isPhoneValid && styles.payBtnDisabled]}
            activeOpacity={0.85}
            onPress={handlePayment}
            disabled={!isPhoneValid}
          >
            <Text style={styles.payText}>Confirmer le paiement</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ✅ Modal sélection pays */}
      <Modal visible={countryModal} transparent animationType="slide">
        <View style={styles.countryOverlay}>
          <View
            style={[
              styles.countrySheet,
              { paddingBottom: Math.max(insets.bottom, 16) },
            ]}
          >
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>Choisir un pays</Text>
            <FlatList
              data={countries}
              keyExtractor={(item) => item.dial}
              showsVerticalScrollIndicator={false}
              style={{ maxHeight: 380 }}
              renderItem={({ item }) => {
                const isSelected = item.dial === country.dial;
                return (
                  <TouchableOpacity
                    style={[
                      styles.countryRow,
                      isSelected && styles.countryRowSelected,
                    ]}
                    onPress={() => {
                      setCountry(item);
                      setCountryModal(false);
                    }}
                  >
                    <Text style={styles.countryRowFlag}>{item.flag}</Text>
                    <Text style={styles.countryRowName}>{item.name}</Text>
                    <Text style={styles.countryRowDial}>{item.dial}</Text>
                  </TouchableOpacity>
                );
              }}
            />
            <TouchableOpacity
              style={styles.sheetCloseBtn}
              onPress={() => setCountryModal(false)}
            >
              <Text style={styles.sheetCloseText}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ✅ Modal Erreur */}
      <Modal visible={modal === "error"} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.modalBox}>
            <View
              style={[styles.modalIconCircle, { backgroundColor: "#fff0f0" }]}
            >
              <Text style={styles.modalIcon}>⚠️</Text>
            </View>
            <Text style={styles.modalTitle}>Numéro invalide</Text>
            <Text style={styles.modalMessage}>
              Veuillez entrer un numéro de téléphone valide à 9 chiffres pour
              continuer.
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

            <View style={styles.modalDivider} />

            <View style={styles.modalRecap}>
              <Text style={styles.modalRecapLabel}>Montant</Text>
              <Text style={[styles.modalRecapValue, { color: "#1d8a45" }]}>
                {Number(total).toLocaleString()} FCFA
              </Text>
            </View>
            <View style={styles.modalRecap}>
              <Text style={styles.modalRecapLabel}>Numéro</Text>
              <Text style={styles.modalRecapValueNum}>
                {country.dial} {phone}
              </Text>
            </View>

            <View style={styles.modalDivider} />

            <TouchableOpacity
              style={[styles.modalBtn, { backgroundColor: "#1d8a45" }]}
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
  container: { flex: 1, backgroundColor: "#f5f6f8" },

  scrollContent: { padding: 16, gap: 14 },

  methodBadge: {
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 30,
    borderWidth: 1.5,
    marginBottom: 4,
    gap: 8,
  },
  methodDot: { width: 8, height: 8, borderRadius: 4 },
  methodBadgeText: { fontWeight: "700", fontSize: 14 },

  card: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 18,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "400",
    marginBottom: 14,
  },

  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 12,
    marginBottom: 12,
    minWidth: 0,
  },
  itemRowDashed: {
    borderBottomWidth: 1,
    borderStyle: "dashed",
    borderColor: "#e5e5e5",
  },
  itemLeft: { flex: 1, paddingRight: 10, minWidth: 0 },
  itemTitle: { fontSize: 14, fontWeight: "400" },
  itemVariant: { fontSize: 12, color: "#999", marginTop: 2 },
  itemRight: { alignItems: "flex-end", flexShrink: 0 },
  itemQty: { fontSize: 12, color: "#999" },
  itemPrice: { fontSize: 14, fontWeight: "400", marginTop: 2 },

  divider: { height: 1, backgroundColor: "#f0f0f0", marginVertical: 12 },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    minWidth: 0,
  },
  totalLabel: { fontSize: 15, fontWeight: "500", color: "#333" },
  totalAmount: {
    fontSize: 20,
    fontWeight: "500",
    color: "#1d8a45",
    flexShrink: 1,
    marginLeft: 10,
  },

  inputHint: { fontSize: 13, color: "#888", marginBottom: 14 },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#e2e2e2",
    borderRadius: 14,
    backgroundColor: "#fafafa",
    minWidth: 0,
  },
  countryPicker: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingLeft: 14,
    paddingRight: 10,
    borderRightWidth: 1,
    borderRightColor: "#e2e2e2",
    flexShrink: 0,
    gap: 4,
  },
  countryFlag: { fontSize: 18 },
  countryDial: { fontSize: 14, fontWeight: "600", color: "#333" },
  chevron: { fontSize: 12, color: "#999", marginLeft: 2 },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#111",
    paddingVertical: 14,
    paddingLeft: 10,
    paddingRight: 14,
    letterSpacing: 1,
    minWidth: 0,
  },

  footer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  payBtn: {
    backgroundColor: "#1d8a45",
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: "center",
  },
  payBtnDisabled: { backgroundColor: "#ccc" },
  payText: {
    color: "#fff",
    fontWeight: "500",
    fontSize: 16,
    letterSpacing: 0.5,
  },

  /* ✅ Sélecteur pays (bottom sheet) */
  countryOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  countrySheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
    maxHeight: "75%",
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#ddd",
    alignSelf: "center",
    marginBottom: 12,
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111",
    marginBottom: 10,
  },
  countryRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 12,
    gap: 12,
  },
  countryRowSelected: { backgroundColor: "#fff4f4" },
  countryRowFlag: { fontSize: 22 },
  countryRowName: { flex: 1, fontSize: 15, color: "#222", fontWeight: "500" },
  countryRowDial: { fontSize: 14, color: "#888", fontWeight: "600" },
  sheetCloseBtn: {
    marginTop: 10,
    paddingVertical: 14,
    alignItems: "center",
    borderRadius: 14,
    backgroundColor: "#f2f2f2",
  },
  sheetCloseText: { fontSize: 15, fontWeight: "400" },

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
    maxWidth: 420,
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
    fontWeight: "400",
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
  modalRecapValue: { fontSize: 14, fontWeight: "bold" },
  modalRecapValueNum: { fontSize: 14, fontWeight: "500" },
  modalBtn: {
    marginTop: 8,
    width: "100%",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  modalBtnText: { color: "#fff", fontWeight: "bold", fontSize: 15 },
});