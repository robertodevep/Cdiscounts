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

type ProductVariant = {
  label: string;
  price: number;
};

type Product = {
  id: string;
  title: string;
  price: string;
  image: string;
  variants?: ProductVariant[];
  description: string;
};


const products: Product[] = [
  {
    id: "1",
    title: "Smartphone Samsung",
    price: "250 000 FCFA",
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=60",
    description:
      "Smartphone Samsung moderne offrant de bonnes performances, un écran de qualité et une autonomie adaptée à une utilisation quotidienne.",
    variants: [
      { label: "64GB", price: 250000 },
      { label: "128GB", price: 280000 },
      { label: "256GB", price: 320000 },
    ],
  },

  {
    id: "2",
    title: "Ordinateur Portable",
    price: "450 000 FCFA",
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=60",
    description:
      "Ordinateur portable performant et polyvalent, idéal pour le travail, les études, la navigation sur Internet et les activités professionnelles.",
    variants: [
      { label: "8GB RAM / 256GB SSD", price: 450000 },
      { label: "16GB RAM / 512GB SSD", price: 550000 },
      { label: "16GB RAM / 1TB SSD", price: 650000 },
    ],
  },

  {
    id: "3",
    title: "Casque Audio",
    price: "35 000 FCFA",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=60",
    description:
      "Casque audio confortable offrant une bonne qualité sonore. Idéal pour écouter de la musique, regarder des vidéos ou passer des appels.",
    variants: [
      { label: "Noir", price: 35000 },
      { label: "Blanc", price: 35000 },
      { label: "Rouge", price: 38000 },
    ],
  },


  {
    id: "6",
    title: "Chaussures Nike",
    price: "55 000 FCFA",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=60",
    description:
      "Chaussures Nike confortables et modernes, conçues pour accompagner vos activités sportives et vos déplacements quotidiens.",
    variants: [
      { label: "39", price: 55000 },
      { label: "40", price: 55000 },
      { label: "41", price: 55000 },
      { label: "42", price: 55000 },
      { label: "43", price: 55000 },
      { label: "44", price: 55000 },
    ],
  },

  {
    id: "7",
    title: "Appareil Photo",
    price: "320 000 FCFA",
    image:
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=60",
    description:
      "Appareil photo conçu pour capturer des images de qualité. Idéal pour les amateurs de photographie, les voyages et les événements.",
    variants: [
      { label: "Kit Standard", price: 320000 },
      { label: "Kit + Objectif", price: 400000 },
      { label: "Kit Professionnel", price: 500000 },
    ],
  },

  {
    id: "8",
    title: "Enceinte Bluetooth",
    price: "45 000 FCFA",
    image:
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=60",
    description:
      "Enceinte Bluetooth compacte et pratique offrant un son puissant. Elle est idéale pour écouter de la musique à la maison ou en déplacement.",
    variants: [
      { label: "Mini", price: 45000 },
      { label: "Standard", price: 65000 },
      { label: "Premium", price: 85000 },
    ],
  },

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

export default function ProductListScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Header showBack={true}
        onCartPress={() => router.push("/(flow)/(app)/(tabs)/cart")}
      />
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
