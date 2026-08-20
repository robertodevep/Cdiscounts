import Header from "@/src/components/Header";
import { CartContext } from "@/src/context/CartContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useContext, useMemo, useState } from "react";
import {
  Image,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type ProductVariant = {
  label: string;
  price: number;
};

type Product = {
  id: string;
  title: string;
  price: string;
  image: string;
  description?: string;
  variants?: ProductVariant[];
};

export default function ProductDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  /*const params = useLocalSearchParams<{
    product?: string | string[];
  }>();

  const rawProduct = Array.isArray(params.product)
    ? params.product[0]
    : params.product;*/

  /*const product = useMemo<Product | null>(() => {
    if (!rawProduct) {
      return null;
    }

    try {
      return JSON.parse(rawProduct);
    } catch {
      try {
        return JSON.parse(decodeURIComponent(rawProduct));
      } catch {
        return null;
      }
    }
  }, [rawProduct]); */
  const params = useLocalSearchParams();

  const rawProduct = params.product;

  let product: Product | null = null;

  try {
    if (typeof rawProduct === "string") {
      product = JSON.parse(rawProduct);
    } else if (Array.isArray(rawProduct)) {
      product = JSON.parse(rawProduct[0]);
    }
  } catch (error) {
    console.log("Erreur parsing produit :", error);
  }

  const cartContext = useContext(CartContext);

  const [quantity, setQuantity] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);

  if (!product || !cartContext) {
    return null;
  }

  const { addToCart } = cartContext;

  /*
   * Les variantes viennent directement du produit.
   * Si un produit n'a pas de variantes, on crée
   * automatiquement une variante Standard avec son prix.
   */
  const variants: ProductVariant[] =
    product.variants && product.variants.length > 0
      ? product.variants
      : [
          {
            label: "Standard",
            price: Number(product.price.replace(/[^\d]/g, "")),
          },
        ];

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
    variants[0],
  );

  const add = () => {
    setQuantity((current) => current + 1);
  };

  const remove = () => {
    setQuantity((current) => Math.max(1, current - 1));
  };

  const handleAddToCart = () => {
    /*
     * On conserve exactement la logique qui
     * existait dans ton ancien code.
     */
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

      {/* =========================
          CONTENU SCROLLABLE
      ========================== */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: 40 + insets.bottom },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* IMAGE */}
        <View style={styles.imageWrapper}>
          <Image
            source={{ uri: product.image }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>

        {/* INFORMATIONS */}
        <View style={styles.content}>
          {/* TITRE */}
          <Text style={styles.title} numberOfLines={3}>
            {product.title}
          </Text>

          {/* DESCRIPTION */}
          <Text style={styles.description}>
            {product.description ||
              "Aucune description disponible pour ce produit."}
          </Text>

          {/* VARIANTES */}
          <Text style={styles.section}>Choisir une option</Text>

          <View style={styles.variantContainer}>
            {variants.map((variant) => {
              const selected = selectedVariant.label === variant.label;

              return (
                <TouchableOpacity
                  key={variant.label}
                  activeOpacity={0.8}
                  onPress={() => setSelectedVariant(variant)}
                  style={[
                    styles.variantButton,
                    selected && styles.variantSelected,
                  ]}
                >
                  <Text
                    numberOfLines={1}
                    style={
                      selected ? styles.variantTextSelected : styles.variantText
                    }
                  >
                    {variant.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* CARTE PRIX + QUANTITÉ */}
          <View style={styles.priceQtyCard}>
            <View style={styles.priceBlock}>
              <Text style={styles.priceLabel}>Prix</Text>
              <Text style={styles.price} numberOfLines={1} adjustsFontSizeToFit>
                {selectedVariant.price.toLocaleString()} FCFA
              </Text>
            </View>

            <View style={styles.qtyContainer}>
              <TouchableOpacity
                style={styles.qtyButton}
                onPress={remove}
                activeOpacity={0.7}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text style={styles.qtyBtn}>−</Text>
              </TouchableOpacity>

              <Text style={styles.qtyText}>{quantity}</Text>

              <TouchableOpacity
                style={styles.qtyButton}
                onPress={add}
                activeOpacity={0.7}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text style={styles.qtyBtn}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* BOUTON */}
          <TouchableOpacity
            style={styles.button}
            onPress={handleAddToCart}
            activeOpacity={0.85}
          >
            <Text style={styles.buttonText} numberOfLines={1}>
              Ajouter au panier ({quantity})
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* =========================
          MODAL
      ========================== */}
      <Modal
        visible={showSuccess}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSuccess(false)}
      >
        <View style={styles.overlay}>
          <View
            style={[
              styles.modalBox,
              { paddingBottom: 18 + insets.bottom * 0.4 },
            ]}
          >
            <View style={styles.modalIconCircle}>
              <Text style={styles.modalIcon}>✓</Text>
            </View>

            <Text style={styles.modalTitle}>Ajouté au panier</Text>

            <Text style={styles.modalMessage}>
              <Text style={styles.modalProductName}>{product.title}</Text> a été
              ajouté à votre panier avec succès.
            </Text>

            <View style={styles.modalDivider} />

            <View style={styles.modalRecap}>
              <Text style={styles.modalRecapLabel}>Option</Text>

              <Text style={styles.modalRecapValue} numberOfLines={1}>
                {selectedVariant.label}
              </Text>
            </View>

            <View style={styles.modalRecap}>
              <Text style={styles.modalRecapLabel}>Quantité</Text>

              <Text style={styles.modalRecapValue}>x{quantity}</Text>
            </View>

            <View style={styles.modalRecap}>
              <Text style={styles.modalRecapLabel}>Prix</Text>

              <Text
                style={[styles.modalRecapValue, styles.modalPrice]}
                numberOfLines={1}
              >
                {(selectedVariant.price * quantity).toLocaleString()} FCFA
              </Text>
            </View>

            <View style={styles.modalDivider} />

            <TouchableOpacity
              style={[styles.modalBtn, styles.modalPrimaryBtn]}
              onPress={() => {
                setShowSuccess(false);

                router.push("/(flow)/(app)/(tabs)/cart");
              }}
              activeOpacity={0.85}
            >
              <Text style={styles.modalBtnText}>Voir le panier</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalBtn, styles.modalSecondaryBtn]}
              onPress={() => {setShowSuccess(false);
               router.push("/(flow)/(app)/(tabs)/product");
              }}
              activeOpacity={0.85}
            >
              <Text style={styles.modalBtnText}>Continuer les achats</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

/* ============================================================
   DESIGN TOKENS
   Palette pensée pour rester lisible sur les écrans TPE/Android
   bas de gamme (contrastes forts, pas de dégradés).
============================================================ */
const colors = {
  bg: "#F6F6F8",
  surface: "#FFFFFF",
  border: "#EAEAEE",
  textPrimary: "#141416e1",
  textSecondary: "#6E7076",
  textMuted: "#9A9CA3",
  brand: "#E60023",
  brandDark: "#B8001C",
  success: "#1d8a45",
  //success: "#16A34A",
  //success: "#022ebed5",
  successBg: "#EFFDF3",
};

// Ombre portée cross-platform : elevation sur Android, shadow* sur iOS.
const cardShadow = Platform.select({
  ios: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  android: { elevation: 3 },
  default: {},
});

const softShadow = Platform.select({
  ios: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  android: { elevation: 1 },
  default: {},
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: 40,
  },

  imageWrapper: {
    backgroundColor: colors.surface,
    ...cardShadow,
  },

  image: {
    width: "100%",
    height: 300,
    minHeight: 240,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },

  content: {
    paddingTop: 18,
  },

  title: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: "500",
    color: colors.textPrimary,
    marginBottom: 8,
    paddingHorizontal: 18,
  },

  description: {
    fontSize: 14.5,
    lineHeight: 21,
    color: colors.textSecondary,
    marginBottom: 22,
    paddingHorizontal: 18,
  },

  section: {
    fontSize: 15,
    fontWeight: "500",
    color: colors.textPrimary,
    marginBottom: 10,
    paddingHorizontal: 18,
  },

  variantContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 18,
    marginBottom: 18,
  },

  variantButton: {
    backgroundColor: colors.surface,
    borderWidth: 1.2,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
    marginBottom: 8,
    minHeight: 42,
    justifyContent: "center",
  },

  variantSelected: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },

  variantText: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: "500",
  },

  variantTextSelected: {
    color: "#fff",
    fontWeight: "500",
    fontSize: 14,
  },

  priceQtyCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginHorizontal: 18,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 20,
    ...softShadow,
  },

  priceBlock: {
    flexShrink: 1,
    minWidth: 0,
    paddingRight: 12,
  },

  priceLabel: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 2,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },

  price: {
    fontSize: 21,
    fontWeight: "500",
    color: colors.success,
  },

  quantityLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: 8,
    paddingHorizontal: 18,
  },

  qtyContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.bg,
    borderRadius: 12,
    overflow: "hidden",
    flexShrink: 0,
  },

  qtyButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },

  qtyBtn: {
    fontSize: 22,
    fontWeight: "600",
    color: colors.textPrimary,
  },

  qtyText: {
    minWidth: 32,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "700",
    color: colors.textPrimary,
  },

  button: {
    backgroundColor: colors.success,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 18,
    marginBottom: 4,
    ...cardShadow,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(15,15,17,0.55)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },

  modalBox: {
    backgroundColor: colors.surface,
    borderRadius: 22,
    padding: 20,
    width: "100%",
    maxWidth: 380,
    alignItems: "center",
    ...cardShadow,
  },

  modalIconCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: colors.successBg,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },

  modalIcon: {
    fontSize: 26,
    fontWeight: "700",
    color: colors.success,
  },

  modalTitle: {
    fontSize: 17,
    fontWeight: "500",
    color: colors.textPrimary,
    marginBottom: 6,
    textAlign: "center",
  },

  modalMessage: {
    fontSize: 13.5,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 19,
  },

  modalProductName: {
    fontWeight: "600",
    color: colors.textPrimary,
  },

  modalDivider: {
    height: 1,
    backgroundColor: colors.border,
    width: "100%",
    marginVertical: 10,
  },

  modalRecap: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingVertical: 5,
  },

  modalRecapLabel: {
    fontSize: 13,
    color: colors.textSecondary,
  },

  modalRecapValue: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textPrimary,
    flexShrink: 1,
    marginLeft: 12,
    textAlign: "right",
  },

  modalPrice: {
    color: colors.success,
  },

  modalBtn: {
    width: "100%",
    paddingVertical: 13,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },

  modalPrimaryBtn: {
    backgroundColor: colors.success,
  },

  modalSecondaryBtn: {
    backgroundColor: colors.textPrimary,
    marginTop: 10,
  },

  modalBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
});

// import Header from "@/src/components/Header";
// import { CartContext } from "@/src/context/CartContext";
// import { useLocalSearchParams, useRouter } from "expo-router";
// import React, { useContext, useMemo, useState } from "react";
// import {
//   Image,
//   Modal,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";

// type ProductVariant = {
//   label: string;
//   price: number;
// };

// type Product = {
//   id: string;
//   title: string;
//   price: string;
//   image: string;
//   description?: string;
//   variants?: ProductVariant[];
// };

// export default function ProductDetailScreen() {
//   const router = useRouter();

//   const params = useLocalSearchParams();

// const rawProduct = params.product;

// let product: Product | null = null;

// try {
//   if (typeof rawProduct === "string") {
//     product = JSON.parse(rawProduct);
//   } else if (Array.isArray(rawProduct)) {
//     product = JSON.parse(rawProduct[0]);
//   }
// } catch (error) {
//   console.log("Erreur parsing produit :", error);
// }

//   const cartContext = useContext(CartContext);

//   const [quantity, setQuantity] = useState(1);
//   const [showSuccess, setShowSuccess] = useState(false);

//   if (!product || !cartContext) {
//     return null;
//   }

//   const { addToCart } = cartContext;

//   /*
//    * Les variantes viennent directement du produit.
//    * Si un produit n'a pas de variantes, on crée
//    * automatiquement une variante Standard avec son prix.
//    */
//   const variants: ProductVariant[] =
//     product.variants && product.variants.length > 0
//       ? product.variants
//       : [
//           {
//             label: "Standard",
//             price: Number(
//               product.price.replace(/[^\d]/g, "")
//             ),
//           },
//         ];

//   const [selectedVariant, setSelectedVariant] =
//     useState<ProductVariant>(variants[0]);

//   const add = () => {
//     setQuantity((current) => current + 1);
//   };

//   const remove = () => {
//     setQuantity((current) => Math.max(1, current - 1));
//   };

//   const handleAddToCart = () => {
//     /*
//      * On conserve exactement la logique qui
//      * existait dans ton ancien code.
//      */
//     for (let i = 0; i < quantity; i++) {
//       addToCart({
//         id: product.id,
//         title: product.title,
//         image: product.image,
//         variant: selectedVariant.label,
//         price: selectedVariant.price,
//         quantity: 1,
//       });
//     }

//     setShowSuccess(true);
//   };

//   return (
//     <View style={styles.container}>
//       <Header
//         onCartPress={() =>
//           router.push("/(flow)/(app)/(tabs)/cart")
//         }
//         showBack={true}
//       />

//       {/* =========================
//           CONTENU SCROLLABLE
//       ========================== */}
//       <ScrollView
//         style={styles.scrollView}
//         contentContainerStyle={styles.scrollContent}
//         showsVerticalScrollIndicator={false}
//       >
//         {/* IMAGE */}
//         <Image
//           source={{ uri: product.image }}
//           style={styles.image}
//           resizeMode="cover"
//         />

//         {/* INFORMATIONS */}
//         <View style={styles.content}>
//           {/* TITRE */}
//           <Text style={styles.title}>{product.title}</Text>

//           {/* DESCRIPTION */}
//           <Text style={styles.description}>
//             {product.description ||
//               "Aucune description disponible pour ce produit."}
//           </Text>

//           {/* VARIANTES */}
//           <Text style={styles.section}>Choisir une option :</Text>

//           <View style={styles.variantContainer}>
//             {variants.map((variant) => {
//               const selected =
//                 selectedVariant.label === variant.label;

//               return (
//                 <TouchableOpacity
//                   key={variant.label}
//                   activeOpacity={0.8}
//                   onPress={() =>
//                     setSelectedVariant(variant)
//                   }
//                   style={[
//                     styles.variantButton,
//                     selected && styles.variantSelected,
//                   ]}
//                 >
//                   <Text
//                     style={
//                       selected
//                         ? styles.variantTextSelected
//                         : styles.variantText
//                     }
//                   >
//                     {variant.label}
//                   </Text>
//                 </TouchableOpacity>
//               );
//             })}
//           </View>

//           {/* PRIX */}
//           <Text style={styles.price}>
//             {selectedVariant.price.toLocaleString()} FCFA
//           </Text>

//           {/* QUANTITÉ */}
//           <Text style={styles.quantityLabel}>
//             Quantité
//           </Text>

//           <View style={styles.qtyContainer}>
//             <TouchableOpacity
//               style={styles.qtyButton}
//               onPress={remove}
//               activeOpacity={0.7}
//             >
//               <Text style={styles.qtyBtn}>−</Text>
//             </TouchableOpacity>

//             <Text style={styles.qtyText}>{quantity}</Text>

//             <TouchableOpacity
//               style={styles.qtyButton}
//               onPress={add}
//               activeOpacity={0.7}
//             >
//               <Text style={styles.qtyBtn}>+</Text>
//             </TouchableOpacity>
//           </View>

//           {/* BOUTON */}
//           <TouchableOpacity
//             style={styles.button}
//             onPress={handleAddToCart}
//             activeOpacity={0.8}
//           >
//             <Text style={styles.buttonText}>
//               Ajouter au panier ({quantity})
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>

//       {/* =========================
//           MODAL
//       ========================== */}
//       <Modal
//         visible={showSuccess}
//         transparent
//         animationType="fade"
//         onRequestClose={() => setShowSuccess(false)}
//       >
//         <View style={styles.overlay}>
//           <View style={styles.modalBox}>
//             <View style={styles.modalIconCircle}>
//               <Text style={styles.modalIcon}>✓</Text>
//             </View>

//             <Text style={styles.modalTitle}>
//               Ajouté au panier
//             </Text>

//             <Text style={styles.modalMessage}>
//               <Text style={styles.modalProductName}>
//                 {product.title}
//               </Text>{" "}
//               a été ajouté à votre panier avec succès.
//             </Text>

//             <View style={styles.modalDivider} />

//             <View style={styles.modalRecap}>
//               <Text style={styles.modalRecapLabel}>
//                 Option
//               </Text>

//               <Text style={styles.modalRecapValue}>
//                 {selectedVariant.label}
//               </Text>
//             </View>

//             <View style={styles.modalRecap}>
//               <Text style={styles.modalRecapLabel}>
//                 Quantité
//               </Text>

//               <Text style={styles.modalRecapValue}>
//                 x{quantity}
//               </Text>
//             </View>

//             <View style={styles.modalRecap}>
//               <Text style={styles.modalRecapLabel}>
//                 Prix
//               </Text>

//               <Text
//                 style={[
//                   styles.modalRecapValue,
//                   styles.modalPrice,
//                 ]}
//               >
//                 {(
//                   selectedVariant.price * quantity
//                 ).toLocaleString()}{" "}
//                 FCFA
//               </Text>
//             </View>

//             <View style={styles.modalDivider} />

//             <TouchableOpacity
//               style={[
//                 styles.modalBtn,
//                 styles.modalPrimaryBtn,
//               ]}
//               onPress={() => {
//                 setShowSuccess(false);

//                 router.push(
//                   "/(flow)/(app)/(tabs)/cart"
//                 );
//               }}
//             >
//               <Text style={styles.modalBtnText}>
//                 Voir le panier
//               </Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={[
//                 styles.modalBtn,
//                 styles.modalSecondaryBtn,
//               ]}
//               onPress={() => setShowSuccess(false)}
//             >
//               <Text style={styles.modalBtnText}>
//                 Continuer les achats
//               </Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#f2f2f2",
//   },

//   scrollView: {
//     flex: 1,
//   },

//   scrollContent: {
//     paddingBottom: 40,
//   },

//   image: {
//     width: "100%",
//     height: 300,
//     borderRadius: 20,
//   },

//   content: {
//     paddingTop: 5,
//   },

//   title: {
//     fontSize: 24,
//     fontWeight: "bold",
//     color: "#111",
//     marginTop: 10,
//     marginBottom: 8,
//     paddingHorizontal: 15,
//   },

//   description: {
//     fontSize: 15,
//     lineHeight: 22,
//     color: "#666",
//     marginBottom: 18,
//     paddingHorizontal: 15,
//   },

//   section: {
//     fontSize: 16,
//     fontWeight: "bold",
//     color: "#111",
//     marginBottom: 10,
//     paddingHorizontal: 15,
//   },

//   variantContainer: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     paddingHorizontal: 15,
//     marginBottom: 10,
//   },

//   variantButton: {
//     backgroundColor: "#fff",
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 12,
//     paddingHorizontal: 14,
//     paddingVertical: 11,
//     marginRight: 8,
//     marginBottom: 8,
//   },

//   variantSelected: {
//     backgroundColor: "#e60023",
//     borderColor: "#e60023",
//   },

//   variantText: {
//     color: "#111",
//     fontSize: 14,
//   },

//   variantTextSelected: {
//     color: "#fff",
//     fontWeight: "bold",
//     fontSize: 14,
//   },

//   price: {
//     fontSize: 24,
//     fontWeight: "bold",
//     color: "#e60023",
//     marginTop: 5,
//     marginBottom: 20,
//     paddingHorizontal: 15,
//   },

//   quantityLabel: {
//     fontSize: 15,
//     fontWeight: "600",
//     color: "#333",
//     marginBottom: 8,
//     paddingHorizontal: 15,
//   },

//   qtyContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     alignSelf: "flex-start",
//     backgroundColor: "#fff",
//     borderWidth: 1,
//     borderColor: "#ddd",
//     borderRadius: 12,
//     marginLeft: 15,
//     overflow: "hidden",
//   },

//   qtyButton: {
//     width: 42,
//     height: 42,
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   qtyBtn: {
//     fontSize: 26,
//     color: "#111",
//   },

//   qtyText: {
//     minWidth: 40,
//     textAlign: "center",
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#111",
//   },

//   button: {
//     backgroundColor: "#e60023",
//     padding: 16,
//     borderRadius: 15,
//     alignItems: "center",
//     marginTop: 20,
//     marginHorizontal: 15,
//   },

//   buttonText: {
//     color: "#fff",
//     fontWeight: "bold",
//     fontSize: 16,
//   },

//   overlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.55)",
//     justifyContent: "center",
//     alignItems: "center",
//     paddingHorizontal: 24,
//   },

//   modalBox: {
//     backgroundColor: "#fff",
//     borderRadius: 20,
//     padding: 18,
//     width: "88%",
//     alignItems: "center",
//     elevation: 10,
//   },

//   modalIconCircle: {
//     width: 52,
//     height: 52,
//     borderRadius: 26,
//     backgroundColor: "#f0fff4",
//     justifyContent: "center",
//     alignItems: "center",
//     marginBottom: 12,
//   },

//   modalIcon: {
//     fontSize: 28,
//     fontWeight: "bold",
//     color: "#16a34a",
//   },

//   modalTitle: {
//     fontSize: 17,
//     fontWeight: "bold",
//     color: "#111",
//     marginBottom: 6,
//   },

//   modalMessage: {
//     fontSize: 13,
//     color: "#666",
//     textAlign: "center",
//     lineHeight: 19,
//   },

//   modalProductName: {
//     fontWeight: "bold",
//     color: "#111",
//   },

//   modalDivider: {
//     height: 1,
//     backgroundColor: "#f0f0f0",
//     width: "100%",
//     marginVertical: 8,
//   },

//   modalRecap: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     width: "100%",
//     paddingVertical: 4,
//   },

//   modalRecapLabel: {
//     fontSize: 13,
//     color: "#888",
//   },

//   modalRecapValue: {
//     fontSize: 13,
//     fontWeight: "bold",
//     color: "#111",
//   },

//   modalPrice: {
//     color: "#e60023",
//   },

//   modalBtn: {
//     width: "100%",
//     paddingVertical: 12,
//     borderRadius: 12,
//     alignItems: "center",
//   },

//   modalPrimaryBtn: {
//     backgroundColor: "#e60023",
//   },

//   modalSecondaryBtn: {
//     backgroundColor: "#111",
//     marginTop: 10,
//   },

//   modalBtnText: {
//     color: "#fff",
//     fontWeight: "bold",
//     fontSize: 14,
//   },
// });
