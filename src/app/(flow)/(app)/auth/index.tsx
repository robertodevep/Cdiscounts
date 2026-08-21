import { AuthContext } from "@/src/context/AuthContext";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
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
import { LOGO } from "@/src/constants";
import Header from "@/src/components/Header";

WebBrowser.maybeCompleteAuthSession();

export default function Login() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const auth = useContext(AuthContext);

  // Params reçus depuis l'écran "Choix du paiement" pour reprendre le parcours après connexion
  const { total, cart, method } = useLocalSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(true); // true = masqué
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  // ⚠️ Remplace par tes vrais identifiants OAuth Google Cloud Console
  const [request, response, promptAsync] = Google.useAuthRequest({
    //expoClientId: "TON_EXPO_CLIENT_ID.apps.googleusercontent.com",
    iosClientId: "TON_IOS_CLIENT_ID.apps.googleusercontent.com",
    androidClientId: "TON_ANDROID_CLIENT_ID.apps.googleusercontent.com",
    webClientId: "TON_WEB_CLIENT_ID.apps.googleusercontent.com",
  });

  // Gestion manuelle du clavier (même pattern que les autres écrans)
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

  // Redirection après succès (login classique ou Google) vers la confirmation
  const goToConfirmation = () => {
    router.replace({
      pathname: "/(flow)/(app)/confirmation",
      params: { total, cart, method },
    });
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMsg("Veuillez renseigner votre email et votre mot de passe.");
      return;
    }
    setLoading(true);
    setErrorMsg(null);
    try {
      await auth?.login(email, password);
      goToConfirmation();
    } catch (e) {
      setErrorMsg("Email ou mot de passe incorrect.");
    } finally {
      setLoading(false);
    }
  };

  // Traite la réponse Google une fois reçue
  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      // Récupère les infos du profil Google
      fetch("https://www.googleapis.com/userinfo/v2/me", {
        headers: { Authorization: `Bearer ${authentication?.accessToken}` },
      })
        .then((res) => res.json())
        .then((profile) => {
          auth?.loginWithGoogle(profile.email, profile.name);
          goToConfirmation();
        })
        .catch(() => {
          setErrorMsg("Connexion Google impossible. Réessayez.");
        });
    }
  }, [response]);

  return (
    <View style={styles.container}>
      <Header title="Login" showBack={true} showCart={false} />
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 10, paddingBottom: keyboardHeight + 40 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Logo / Branding */}
        <View style={styles.brandWrap}>
          <View style={styles.logoCircle}>
            <Image source={LOGO} style={styles.logo} resizeMode="contain" />
          </View>
          <Text style={styles.title}>Connexion requise</Text>
          <Text style={styles.subtitle}>
            Connectez-vous pour finaliser votre paiement en toute sécurité
          </Text>
        </View>

        {/* Formulaire */}
        <View style={styles.form}>
          <Text style={styles.label}>Adresse email</Text>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputIcon}>✉️</Text>
            <TextInput
              placeholder="exemple@mail.com"
              placeholderTextColor="#aaa"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              returnKeyType="next"
            />
          </View>

          <Text style={[styles.label, { marginTop: 16 }]}>Mot de passe</Text>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputIcon}>🔒</Text>
            <TextInput
              placeholder="••••••••"
              placeholderTextColor="#aaa"
              style={[styles.input, { minWidth: 0, flexShrink: 1 }]}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={showPassword}
              returnKeyType="done"
              onSubmitEditing={handleLogin}
            />
            <TouchableOpacity
              onPress={() => setShowPassword((v) => !v)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.eyeIcon}>{showPassword ? "👁️" : "🙈"}</Text>
            </TouchableOpacity>
          </View>

          {errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}

          <TouchableOpacity style={styles.forgotBtn}
           onPress={() => {
              Alert.alert(
                "Password",
                "Cette fonctionnalité n'est pas encore disponible.",
              );
            }}
          >
            <Text style={styles.forgotText}>Mot de passe oublié ?</Text>
          </TouchableOpacity>

          {/* Bouton connexion */}
          <TouchableOpacity
            style={[styles.loginBtn, loading && styles.loginBtnDisabled]}
            activeOpacity={0.85}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.loginBtnText}>Se connecter</Text>
            )}
          </TouchableOpacity>

          {/* Séparateur */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>ou</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Bouton Google */}
          <TouchableOpacity
            style={styles.googleBtn}
            activeOpacity={0.85}
            disabled={!request}
            //onPress={() => promptAsync()}
            onPress={() => {
              Alert.alert(
                "Google",
                "Cette fonctionnalité n'est pas encore disponible.",
              );
            }}
          >
            <Text style={styles.googleIcon}>G</Text>
            <Text style={styles.googleBtnText}>Continuer avec Google</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footerNote}>
          Vos informations sont chiffrées et ne seront jamais partagées.
        </Text>
      </ScrollView>

      {/* Modal erreur bloquante (optionnelle, en plus du message inline) */}
      <Modal visible={false} transparent animationType="fade" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: "#ffffff"
    backgroundColor: "#f2f2f2",
  },

  scrollContent: { paddingHorizontal: 24 },

  backBtn: {
    width: 40,
    height: 35,
    borderRadius: 20,
    backgroundColor: "#f2f2f2",
    justifyContent: "center",
    alignItems: "center",
    //marginBottom: 24,
  },
  backIcon: { fontSize: 26, color: "#585555", marginTop: -2 },

  brandWrap: {
    alignItems: "center",
    marginBottom: 30,
    marginTop: 0,
  },
  logoCircle: {
    //width: 64,
    height: 64,
    //borderRadius: 20,
    //backgroundColor: "#1a3ccc",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
    //elevation: 4,
    //shadowColor: "#1a3ccc",
    //shadowOffset: { width: 0, height: 4 },
    //shadowOpacity: 0.25,
    //shadowRadius: 10,
  },
  logo: {
    width: 205,
    height: 120,
  },

  logoText: { color: "#fff", fontSize: 22, fontWeight: "800" },
  title: {
    fontSize: 20,
    fontWeight: "400",
    //color: "#111",
    //color: "#5a4e4e",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#888",
    //color: "#5a4e4e",
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 12,
  },

  form: { gap: 0 },
  label: {
    fontSize: 14,
    fontWeight: "400",
    color: "#333",
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#e2e2e2",
    borderRadius: 14,
    backgroundColor: "#fafafa",
    paddingHorizontal: 14,
    minWidth: 0,
  },
  inputIcon: { fontSize: 16, marginRight: 10 },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#111",
    paddingVertical: 14,
    minWidth: 0,
  },
  eyeIcon: { fontSize: 18, marginLeft: 8 },

  errorText: {
    color: "#e60023",
    fontSize: 13,
    marginTop: 10,
    fontWeight: "600",
  },

  forgotBtn: { alignSelf: "flex-end", marginTop: 12, marginBottom: 22 },
  forgotText: { color: "#1d8a45", fontSize: 13, fontWeight: "600" },

  loginBtn: {
    //backgroundColor: "#1a3ccc",
    backgroundColor: "#1d8a45", //#1d8a45
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 52,
  },
  loginBtnDisabled: { opacity: 0.7 },
  loginBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
    letterSpacing: 0.5,
  },

  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
    gap: 12,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: "#eaeaea" },
  dividerText: { fontSize: 13, color: "#aaa", fontWeight: "500" },

  googleBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "#e2e2e2",
    borderRadius: 30,
    paddingVertical: 15,
    gap: 10,
    backgroundColor: "#fff",
  },
  googleIcon: {
    fontSize: 16,
    fontWeight: "800",
    color: "#4285F4",
    width: 20,
    textAlign: "center",
  },
  googleBtnText: { fontSize: 15, fontWeight: "500", color: "#333" },

  footerNote: {
    fontSize: 12,
    color: "#aaa",
    textAlign: "center",
    marginTop: 28,
    lineHeight: 18,
  },
});
