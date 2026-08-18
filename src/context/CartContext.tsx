/*import React, { createContext, useState } from "react";

export type CartItem = {
  id: string;
  title: string;
  price: number;
  image: string;
  variant: string;
  quantity: number;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
};

export const CartContext = createContext<CartContextType>({
  cart: [],
  addToCart: () => {},
});

export const CartProvider = ({ children }: any) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const existing = prev.find(
        (p) => p.id === item.id && p.variant === item.variant
      );

      if (existing) {
        return prev.map((p) =>
          p.id === item.id && p.variant === item.variant
            ? { ...p, quantity: p.quantity + 1 }
            : p
        );
      }

      return [...prev, { ...item, quantity: 1 }];
    });
  };

  return (
    <CartContext.Provider value={{ cart, addToCart }}>
      {children}
    </CartContext.Provider>
  );
};*/

import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useEffect, useState } from "react";

export type CartItem = {
  id: string;
  title: string;
  price: number;
  image: string;
  variant: string;
  quantity: number;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string, variant: string) => void;
};

export const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: any) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    const stored = await AsyncStorage.getItem("cart");
    if (stored) setCart(JSON.parse(stored));
  };

  const saveCart = async (newCart: CartItem[]) => {
    setCart(newCart);
    await AsyncStorage.setItem("cart", JSON.stringify(newCart));
  };

  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const exist = prev.find(
        (p) => p.id === item.id && p.variant === item.variant,
      );

      let newCart;

      if (exist) {
        newCart = prev.map((p) =>
          p.id === item.id && p.variant === item.variant
            ? { ...p, quantity: p.quantity + 1 }
            : p,
        );
      } else {
        newCart = [...prev, { ...item, quantity: 1 }];
      }

      saveCart(newCart);
      return newCart;
    });
  };

  const removeFromCart = (id: string, variant: string) => {
    const newCart = cart.filter((p) => !(p.id === id && p.variant === variant));
    saveCart(newCart);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};
