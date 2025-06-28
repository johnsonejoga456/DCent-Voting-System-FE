"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface User {
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  googleLogin: (idToken: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    // Mocking API call
    await new Promise((res) => setTimeout(res, 1000));
    setUser({ name: "Mock User", email });
  };

  const signup = async (name: string, email: string, password: string) => {
    await new Promise((res) => setTimeout(res, 1000));
    setUser({ name, email });
  };

  const logout = () => setUser(null);



  const googleLogin = async (idToken: string) => {
  // Mock call for now:
  console.log("Google ID Token:", idToken);

  // Later, you will:
  // await fetch("/api/auth/google", { method: "POST", body: JSON.stringify({ idToken }), ... })
  
  await new Promise((res) => setTimeout(res, 1000));
  setUser({ name: "Google User", email: "googleuser@example.com" });
};


  return (
    <AuthContext.Provider value={{ user, isAuthenticated: user !== null, login, signup, logout, googleLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuthContext must be used within AuthProvider");
  return context;
};