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

type Product = {
  id: string;
  title: string;
  price: string;
  image: string;
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
    id: "1",
    title: "Smartphone Samsung",
    price: "250 000 FCFA",
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=60",
  },
  {
    id: "2",
    title: "Ordinateur Portable",
    price: "450 000 FCFA",
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=60",
  },
  {
    id: "3",
    title: "Casque Audio",
    price: "35 000 FCFA",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=60",
  },
  {
    id: "4",
    title: "Télévision 4K",
    price: "600 000 FCFA",
    image:
      "https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=800&q=60",
  },
  {
    id: "5",
    title: "Rouge A Levre",
    price: "10 000 FCFA",
    image:
      "data:image/jpeg;base64,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",
  },
  {
    id: "6",
    title: "Chaussures Nike",
    price: "55 000 FCFA",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=60",
  },

  // Nouveaux produits
  {
    id: "8",
    title: "Chaussures Élégantes",
    price: "45 000 FCFA",
    image:
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHByb2R1aXR8ZW58MHx8MHx8fDA%3D",
  },
  {
    id: "9",
    title: "Produit de Mode",
    price: "40 000 FCFA",
    image:
      "https://plus.unsplash.com/premium_photo-1664392147011-2a720f214e01?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZHVpdHxlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    id: "10",
    title: "Montre Connectée Premium",
    price: "95 000 FCFA",
    image:
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8cHJvZHVpdHxlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    id: "11",
    title: "Produit Cosmétique",
    price: "25 000 FCFA",
    image:
      "https://plus.unsplash.com/premium_photo-1670537994863-5ad53a3214e0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8cHJvZHVpdHxlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    id: "12",
    title: "Produits de Beauté",
    price: "35 000 FCFA",
    image:
      "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHByb2R1aXRzfGVufDB8fDB8fHww",
  },
  {
    id: "13",
    title: "T-Shirt Moderne",
    price: "20 000 FCFA",
    image:
      "https://images.unsplash.com/photo-1693443687750-611ad77f3aba?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHQtc2hpcnR8ZW58MHx8MHx8fDA%3D",
  },
  {
    id: "14",
    title: "Sac à Main en Cuir",
    price: "85 000 FCFA",
    image:
      "https://media.istockphoto.com/id/2204715822/fr/photo/sac-%C3%A0-main-en-cuir-marron-rouge-femme-%C3%A9l%C3%A9gante-de-luxe.webp?a=1&b=1&s=612x612&w=0&k=20&c=6gL-9NhsNbETlZwfCeXkYN_WSk-jZ30PKzJsN0eM0-g=",
  },
  {
    id: "15",
    title: "Accessoires de Mode",
    price: "30 000 FCFA",
    image:
      "https://plus.unsplash.com/premium_photo-1681276170683-706111cf496e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YWNjZXNzb3J5fGVufDB8fDB8fHww",
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
              onPress={() =>
                router.push({
                  pathname: "/(flow)/(app)/(tabs)/product/detail",
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
