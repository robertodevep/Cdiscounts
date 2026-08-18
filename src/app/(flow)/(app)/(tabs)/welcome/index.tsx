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
  "https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=1200&q=60",
  "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=1200&q=60",
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
    title: "Montre Connectée",
    price: "75 000 FCFA",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=60",
  },
  {
    id: "6",
    title: "Chaussures Nike",
    price: "55 000 FCFA",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=60",
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
        title="Accueil"
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
