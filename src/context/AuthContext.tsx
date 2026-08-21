import React, { createContext, useState, ReactNode } from "react";

type User = {
  email: string;
  name?: string;
  provider: "password" | "google";
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: (email: string, name?: string) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // ⚠️ À remplacer par ton appel API réel (ex: endpoint AfrikPay /auth/login)
  const login = async (email: string, password: string) => {
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email && password.length >= 4) {
          resolve(true);
        } else {
          reject(new Error("Identifiants invalides"));
        }
      }, 900);
    });
    setUser({ email, provider: "password" });
  };

  const loginWithGoogle = (email: string, name?: string) => {
    setUser({ email, name, provider: "google" });
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, login, loginWithGoogle, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}