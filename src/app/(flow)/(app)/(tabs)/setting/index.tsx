import Header from "@/src/components/Header";
import { AuthContext } from "@/src/context/AuthContext";
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
  Image,
  Linking,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LOGO } from "@/src/constants";

type SettingRow = {
  icon: string;
  label: string;
  sublabel?: string;
  onPress?: () => void;
  danger?: boolean;
  isToggle?: boolean;
  toggleValue?: boolean;
  onToggle?: (v: boolean) => void;
};

export default function Settings() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const auth = useContext(AuthContext);

  const [notifications, setNotifications] = useState(true);
  const [biometrics, setBiometrics] = useState(false);
  const [logoutModal, setLogoutModal] = useState(false);
  const WHATSAPP_NUMBER = "237680149603";

  /*const handleWhatsApp = async () => {
  const url = `whatsapp://send?phone=${WHATSAPP_NUMBER}`;

  try {
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      // Ouvre WhatsApp Web si WhatsApp n'est pas disponible
      await Linking.openURL(
        `https://wa.me/${WHATSAPP_NUMBER}`
      );
    }
  } catch (error) {
    console.error("Impossible d'ouvrir WhatsApp :", error);
  }
};*/

  const handleWhatsApp = async () => {
    const message =
      "Bonjour 👋, je viens de l'application et j'aimerais obtenir de l'aide.\n\n" +
      "Cordialement,\n" +
      "Roberto Cedigno";

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      message,
    )}`;

    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error("Impossible d'ouvrir WhatsApp :", error);
    }
  };

  const handleLogout = () => {
    auth?.logout();
    setLogoutModal(false);
    router.replace("/");
  };

  const accountRows: SettingRow[] = [
    {
      icon: "👤",
      label: "Modifier le profil",
      sublabel: "Nom, photo, informations personnelles",
      onPress: () => {
        Alert.alert(
          "Modifier le profil",
          "Cette fonctionnalité n'est pas encore disponible.",
        );
      },
      //onPress: () => router.push("/setting/profile" as never),
    },
    {
      icon: "🔒",
      label: "Sécurité",
      sublabel: "Mot de passe, double authentification",
      //onPress: () => router.push("/setting/security" as never),
      onPress: () => {
        Alert.alert("Sécurité", "Disponible bientôt ");
      },
    },
    {
      icon: "💳",
      label: "Moyens de paiement",
      sublabel: "Orange Money, Mobile Money",
      onPress: () => {
        Alert.alert(
          "Moyens de paiement",
          "Le listing des moyens de paiement n'est pas encore disponible.",
        );
      },
      //onPress: () => router.push("/setting/payment-methods" as never),
    },
  ];

  const preferenceRows: SettingRow[] = [
    {
      icon: "🔔",
      label: "Notifications",
      sublabel: "Alertes de transaction et promotions",
      isToggle: true,
      toggleValue: notifications,
      onToggle: setNotifications,
    },
    {
      icon: "🔑",
      label: "Connexion biométrique",
      sublabel: "Empreinte digitale ou Face ID",
      isToggle: true,
      toggleValue: biometrics,
      onToggle: setBiometrics,
    },
    {
      icon: "🌐",
      label: "Langue",
      sublabel: "Français",
      onPress: () => {
        Alert.alert(
          "Langue",
          "Cette fonctionnalité n'est pas encore disponible.",
        );
      },
      //onPress: () => router.push("/setting/language" as never),
    },
  ];

  const supportRows: SettingRow[] = [
    {
      icon: "❓",
      label: "Centre d'aide",
      onPress: () => {
        Alert.alert(
          "Centre d'aide",
          "Cette fonctionnalité n'est pas encore disponible.",
        );
      },
      //onPress: () => router.push("/setting/help" as never),
    },
    /*{
      icon: "✉️",
      label: "Nous contacter",
      onPress: () => router.push("/setting/contact" as never),
    },*/
    {
      icon: "💬",
      label: "Nous contacter",
      sublabel: "Contactez-nous sur WhatsApp",
      onPress: handleWhatsApp,
    },
    {
      icon: "📄",
      label: "Conditions d'utilisation",
      onPress: () => {
        Alert.alert(
          "Conditions d'utilisation",
          "Cette fonctionnalité n'est pas encore disponible.",
        );
      },
      //onPress: () => router.push("/setting/terms" as never),
    },
    {
      icon: "🛡️",
      label: "Politique de confidentialité",
      onPress: () => {
        Alert.alert(
          "Politique de confidentialité",
          "Cette fonctionnalité n'est pas encore disponible.",
        );
      },
      //onPress: () => router.push("/setting/privacy" as never),
    },
  ];

  const renderRow = (row: SettingRow, isLast: boolean) => (
    <TouchableOpacity
      key={row.label}
      style={[styles.row, !isLast && styles.rowDashed]}
      activeOpacity={row.isToggle ? 1 : 0.6}
      onPress={row.isToggle ? undefined : row.onPress}
      disabled={row.isToggle}
    >
      <View style={styles.rowIconWrap}>
        <Text style={styles.rowIcon}>{row.icon}</Text>
      </View>
      <View style={styles.rowTextWrap}>
        <Text
          style={[styles.rowLabel, row.danger && { color: "#e60023" }]}
          numberOfLines={1}
        >
          {row.label}
        </Text>
        {row.sublabel && (
          <Text style={styles.rowSublabel} numberOfLines={1}>
            {row.sublabel}
          </Text>
        )}
      </View>
      {row.isToggle ? (
        <Switch
          value={row.toggleValue}
          onValueChange={row.onToggle}
          trackColor={{ false: "#e0e0e0", true: "#a7d9bb" }}
          thumbColor={row.toggleValue ? "#1d8a45" : "#f4f4f4"}
        />
      ) : (
        <Text style={styles.chevron}>›</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header
        title="Paramètres"
        showBack={true}
        showCart={true}
        onCartPress={() => router.push("/(flow)/(app)/(tabs)/cart")}
      />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom, 16) + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Profil utilisateur */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {(auth?.user?.name || auth?.user?.email || "U")
                .charAt(0)
                .toUpperCase()}
            </Text>
          </View>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text style={styles.profileName} numberOfLines={1}>
              {auth?.user?.name || "Utilisateur"}
            </Text>
            <Text style={styles.profileEmail} numberOfLines={1}>
              {auth?.user?.email || "Non connecté"}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.editBtn}
            //onPress={() => router.push("/setting/profile" as never)}
            onPress={() => {
              Alert.alert(
                "Modifier le profil",
                "Cette fonctionnalité n'est pas encore disponible.",
              );
            }}
          >
            <Text style={styles.editBtnText}>Modifier</Text>
          </TouchableOpacity>
        </View>

        {/* Section Compte */}
        <Text style={styles.sectionTitle}>Compte</Text>
        <View style={styles.card}>
          {accountRows.map((row, i) =>
            renderRow(row, i === accountRows.length - 1),
          )}
        </View>

        {/* Section Préférences */}
        <Text style={styles.sectionTitle}>Préférences</Text>
        <View style={styles.card}>
          {preferenceRows.map((row, i) =>
            renderRow(row, i === preferenceRows.length - 1),
          )}
        </View>

        {/* Section Support */}
        <Text style={styles.sectionTitle}>Support</Text>
        <View style={styles.card}>
          {supportRows.map((row, i) =>
            renderRow(row, i === supportRows.length - 1),
          )}
        </View>

        {/* Déconnexion */}
        <TouchableOpacity
          style={styles.logoutBtn}
          activeOpacity={0.8}
          onPress={() => setLogoutModal(true)}
        >
          <Text style={styles.logoutIcon}>⎋</Text>
          <Text style={styles.logoutText}>Se déconnecter</Text>
        </TouchableOpacity>

        {/*<Text style={styles.versionText}>AfrikPay · Version 1.0.0</Text>*/}
        <View style={styles.versionContainer}>
          <Image
            source={LOGO}
            style={styles.versionLogo}
            resizeMode="contain"
          />
          <Text style={styles.versionText}>· Version 1.0.0</Text>
        </View>
      </ScrollView>

      {/* Modal confirmation déconnexion */}
      <Modal visible={logoutModal} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalIconCircle}>
              <Text style={styles.modalIcon}>⎋</Text>
            </View>
            <Text style={styles.modalTitle}>Se déconnecter ?</Text>
            <Text style={styles.modalMessage}>
              Vous devrez vous reconnecter pour effectuer un paiement.
            </Text>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setLogoutModal(false)}
              >
                <Text style={styles.modalCancelText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalConfirmBtn}
                onPress={handleLogout}
              >
                <Text style={styles.modalConfirmText}>Déconnexion</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f6f8" },

  scrollContent: { padding: 16, gap: 20 },

  /* Profil */
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 16,
    gap: 14,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#1d8a45",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: { color: "#fff", fontSize: 22, fontWeight: "500" },
  profileName: { fontSize: 16, fontWeight: "400", color: "#222" },
  profileEmail: { fontSize: 13, color: "#888", marginTop: 2 },
  editBtn: {
    borderWidth: 1.5,
    borderColor: "#1d8a45",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  editBtnText: { color: "#1d8a45", fontSize: 12, fontWeight: "700" },

  /* Sections */
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#999",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: -8,
    marginLeft: 4,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    paddingHorizontal: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },

  /* Rows */
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    gap: 12,
    minWidth: 0,
  },
  rowDashed: {
    borderBottomWidth: 1,
    borderStyle: "dashed",
    borderColor: "#eee",
  },
  rowIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#f2f6f4",
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  rowIcon: { fontSize: 18 },
  rowTextWrap: { flex: 1, minWidth: 0 },
  rowLabel: { fontSize: 15, fontWeight: "400", color: "#222" },
  rowSublabel: { fontSize: 12, color: "#999", marginTop: 2 },
  chevron: { fontSize: 22, color: "#ccc", flexShrink: 0 },

  /* Déconnexion */
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: "#fff0f0",
    borderRadius: 16,
    paddingVertical: 15,
    marginTop: 4,
  },
  logoutIcon: { fontSize: 17, color: "#e60023", fontWeight: "700" },
  logoutText: { fontSize: 15, fontWeight: "700", color: "#e60023" },

  versionText: {
    textAlign: "center",
    fontSize: 12,
    color: "#bbb",
    marginTop: 4,
  },

  /* Modal */
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
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#fff0f0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  modalIcon: { fontSize: 26, color: "#e60023" },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
    marginBottom: 8,
    textAlign: "center",
  },
  modalMessage: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 21,
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: "row",
    width: "100%",
    gap: 12,
  },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    backgroundColor: "#f2f2f2",
  },
  modalCancelText: { fontSize: 15, fontWeight: "700", color: "#333" },
  modalConfirmBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    backgroundColor: "#e60023",
  },
  modalConfirmText: { fontSize: 15, fontWeight: "700", color: "#fff" },

  versionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },

  versionLogo: {
    width: 70,
    height: 24,
    resizeMode: "contain",
  },

  /*versionText: {
  fontSize: 12,
  color: "#bbb",
  marginLeft: 4,
},*/
});
