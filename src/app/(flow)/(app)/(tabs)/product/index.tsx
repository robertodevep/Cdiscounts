import Header from "@/src/components/Header";
import { useRouter } from "expo-router";
import React from "react";
import {
  Dimensions,
  FlatList,
  Image,
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
  {
    id: "7",
    title: "Appareil Photo",
    price: "320 000 FCFA",
    image:
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=60",
  },
  {
    id: "8",
    title: "Enceinte Bluetooth",
    price: "45 000 FCFA",
    image:
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=60",
  },
];

export default function ProductListScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Header title="Produits" showBack={false} />
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.8}
            onPress={() =>
              router.push({
                //pathname: "/(flow)/(app)/(tabs)/product/detail",
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f2f2f2" },
  list: { padding: 10 },
  card: {
    backgroundColor: "#fff",
    flex: 1,
    margin: 8,
    padding: 10,
    borderRadius: 15,
    elevation: 3,
  },
  image: { width: "100%", height: 130, borderRadius: 10 },
  title: { marginTop: 8, fontWeight: "600", fontSize: 14 },
  price: { color: "#e60023", marginTop: 5, fontWeight: "bold" },
});
