import Header from "@/src/components/Header";
import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";

import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

type ProductVariant = {
  label: string;
  price: number;
};

type Product = {
  id: string;
  title: string;
  price: string;
  image: string;
  description: string
   variants?: ProductVariant[];
};

const bannerImages = [
  "https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&w=1200&q=60",
  "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHByb2R1aXR8ZW58MHx8MHx8fDA%3D",
  "https://plus.unsplash.com/premium_photo-1664392147011-2a720f214e01?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZHVpdHxlbnwwfHwwfHx8MA%3D%3D",
  "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8cHJvZHVpdHxlbnwwfHwwfHx8MA%3D%3D",
  "https://plus.unsplash.com/premium_photo-1670537994863-5ad53a3214e0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8cHJvZHVpdHxlbnwwfHwwfHx8MA%3D%3D",
  "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHByb2R1aXRzfGVufDB8fDB8fHww",
  "https://images.unsplash.com/photo-1693443687750-611ad77f3aba?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHQtc2hpcnR8ZW58MHx8MHx8fDA%3D",
  "https://media.istockphoto.com/id/2204715822/fr/photo/sac-%C3%A0-main-en-cuir-marron-rouge-femme-%C3%A9l%C3%A9gante-de-luxe.webp?a=1&b=1&s=612x612&w=0&k=20&c=6gL-9NhsNbETlZwfCeXkYN_WSk-jZ30PKzJsN0eM0-g=",
  "https://plus.unsplash.com/premium_photo-1681276170683-706111cf496e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YWNjZXNzb2lyZXxlbnwwfHwwfHx8MA%3D%3D",
];
const products: Product[] = [


  {
    id: "10",
    title: "Chaussures Élégantes",
    price: "65 000 FCFA",
    image:
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHByb2R1aXR8ZW58MHx8MHx8fDA%3D",
    description:
      "Chaussures élégantes et confortables adaptées aux sorties, aux événements et à une utilisation quotidienne.",
    variants: [
      { label: "39", price: 65000 },
      { label: "40", price: 65000 },
      { label: "41", price: 65000 },
      { label: "42", price: 65000 },
      { label: "43", price: 65000 },
    ],
  },

  {
    id: "11",
    title: "Produit Beauté",
    price: "40 000 FCFA",
    image:
      "https://plus.unsplash.com/premium_photo-1664392147011-2a720f214e01?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZHVpdHxlbnwwfHwwfHx8MA%3D%3D",
    description:
      "Produit de beauté destiné aux soins quotidiens. Une solution pratique pour prendre soin de soi et compléter votre routine.",
    variants: [
      { label: "Standard", price: 40000 },
      { label: "Premium", price: 55000 },
      { label: "Pack", price: 75000 },
    ],
  },

  {
    id: "12",
    title: "Montre Classique",
    price: "95 000 FCFA",
    image:
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8cHJvZHVpdHxlbnwwfHwwfHx8MA%3D%3D",
    description:
      "Montre au design élégant et moderne, idéale pour compléter une tenue professionnelle ou décontractée.",
    variants: [
      { label: "Noir", price: 95000 },
      { label: "Argent", price: 100000 },
      { label: "Doré", price: 110000 },
    ],
  },

  {
    id: "13",
    title: "Sac à Main",
    price: "75 000 FCFA",
    image:
      "https://plus.unsplash.com/premium_photo-1670537994863-5ad53a3214e0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8cHJvZHVpdHxlbnwwfHwwfHx8MA%3D%3D",
    description:
      "Sac à main élégant et pratique offrant suffisamment d'espace pour transporter vos effets personnels au quotidien.",
    variants: [
      { label: "Petit", price: 75000 },
      { label: "Moyen", price: 90000 },
      { label: "Grand", price: 110000 },
    ],
  },

  {
    id: "14",
    title: "Produit Cosmétique",
    price: "30 000 FCFA",
    image:
      "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHByb2R1aXRzfGVufDB8fDB8fHww",
    description:
      "Produit cosmétique destiné aux soins et à l'entretien quotidien. Une solution simple pour compléter votre routine beauté.",
    variants: [
      { label: "50 ml", price: 30000 },
      { label: "100 ml", price: 45000 },
      { label: "200 ml", price: 65000 },
    ],
  },

  {
    id: "15",
    title: "T-Shirt",
    price: "25 000 FCFA",
    image:
      "https://images.unsplash.com/photo-1693443687750-611ad77f3aba?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHQtc2hpcnR8ZW58MHx8MHx8fDA%3D",
    description:
      "T-shirt moderne et confortable, idéal pour une tenue décontractée au quotidien. Disponible dans plusieurs tailles.",
    variants: [
      { label: "S", price: 25000 },
      { label: "M", price: 25000 },
      { label: "L", price: 28000 },
      { label: "XL", price: 30000 },
    ],
  },

  {
    id: "16",
    title: "Sac à Main en Cuir",
    price: "120 000 FCFA",
    image:
      "https://media.istockphoto.com/id/2204715822/fr/photo/sac-%C3%A0-main-en-cuir-marron-rouge-femme-%C3%A9l%C3%A9gante-de-luxe.webp?a=1&b=1&s=612x612&w=0&k=20&c=6gL-9NhsNbETlZwfCeXkYN_WSk-jZ30PKzJsN0eM0-g=",
    description:
      "Sac à main en cuir au style élégant et raffiné. Il convient particulièrement aux sorties, au travail et aux occasions spéciales.",
    variants: [
      { label: "Marron", price: 120000 },
      { label: "Noir", price: 120000 },
      { label: "Rouge", price: 130000 },
    ],
  },

  {
    id: "17",
    title: "Accessoire de Mode",
    price: "35 000 FCFA",
    image:
      "https://plus.unsplash.com/premium_photo-1681276170683-706111cf496e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YWNjZXNzb3J5fGVufDB8fDB8fHww",
    description:
      "Accessoire de mode élégant permettant de compléter facilement différentes tenues et d'apporter une touche personnelle à votre style.",
    variants: [
      { label: "Standard", price: 35000 },
      { label: "Premium", price: 50000 },
      { label: "Luxe", price: 75000 },
    ],
  },
];


export default function HomeScreen() {
  const router = useRouter();
  const bannerRef = useRef<FlatList>(null);
  let currentIndex = 0;

  // Auto scroll bannière
  useEffect(() => {
    const interval = setInterval(() => {
      if (bannerRef.current) {
        currentIndex = (currentIndex + 1) % bannerImages.length;
        bannerRef.current.scrollToIndex({
          index: currentIndex,
          animated: true,
        });
      }
    }, 4000); // défile toutes les 4 secondes

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <Header
        
        onCartPress={() => router.push("/(flow)/(app)/(tabs)/cart")}
        showBack={false} // ← pas de flèche
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Bannière auto-scroll */}
        <FlatList
          ref={bannerRef}
          data={bannerImages}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <Image source={{ uri: item }} style={styles.banner} />
          )}
        />

        <Text style={styles.sectionTitle}>🔥 Produits populaires</Text>

        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          numColumns={2}
          scrollEnabled={false} // pour laisser ScrollView gérer
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              activeOpacity={0.8}
              // onPress={() =>
              //   router.push({
              //     pathname: "/(flow)/product-detail",
              //     params: { product: JSON.stringify(item) },
              //   })
              // }
              onPress={() =>
                router.push({
                  pathname: "/(flow)/(app)/product-detail",
                  params: { product: JSON.stringify(item) },
                })
              }
            >
              <Image source={{ uri: item.image }} style={styles.image} />
              <Text numberOfLines={1} style={styles.title}>
                {item.title}
              </Text>
              <Text style={styles.price}>{item.price}</Text>
            </TouchableOpacity>
          )}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  banner: {
    width: width,
    height: 200,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    margin: 15,
  },
  card: {
    backgroundColor: "#fff",
    flex: 1,
    margin: 10,
    padding: 10,
    borderRadius: 15,
    elevation: 5,
  },
  image: {
    width: "100%",
    height: 130,
    borderRadius: 10,
  },
  title: {
    marginTop: 8,
    fontWeight: "600",
  },
  price: {
    color: "#e60023",
    marginTop: 5,
    fontWeight: "bold",
  },
});
