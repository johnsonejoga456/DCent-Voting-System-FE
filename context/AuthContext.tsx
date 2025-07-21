"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  username: string;
  email: string;
  walletAddress?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  googleLogin: (idToken: string) => Promise<void>;
  walletLogin: (address: string, signature: string) => Promise<void>;
  connectWallet: (address: string, signature: string) => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get("https://api.dvs.dyung.me/users", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Fetch user response:", res.data);

        if (res.status === 200 && res.data.status === 200 && res.data.data) {
          setUser({
            id: res.data.data.id,
            username: res.data.data.username,
            email: res.data.data.email,
            walletAddress: res.data.data.walletAddress,
          });
        } else {
          console.error("Fetch user failed:", res.data.message || "Unknown error");
          localStorage.removeItem("access_token");
          setUser(null);
        }
      } catch (error: any) {
        console.error("Hydrate user error:", error.response?.data || error.message);
        localStorage.removeItem("access_token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      console.log("Login request payload:", { email, password });
      const res = await axios.post("https://api.dvs.dyung.me/auth/login", { email, password });
      console.log("Login response:", res.data);

      if (res.status !== 200 || !res.data.data || !res.data.data.access_token) {
        throw new Error(res.data.message || "Login failed");
      }

      const { user, access_token } = res.data.data;
      setUser({
        id: user.id,
        username: user.username,
        email: user.email,
        walletAddress: user.walletAddress,
      });
      localStorage.setItem("access_token", access_token);
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Login error:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const signup = async (username: string, email: string, password: string) => {
    setLoading(true);
    try {
      console.log("Signup request payload:", { username, email, password });
      const res = await axios.post("https://api.dvs.dyung.me/auth/signup", { username, email, password });
      console.log("Signup response:", res.data);

      if (res.status !== 200 || !res.data.data) {
        throw new Error(res.data.message || "Signup failed");
      }

      const { user, access_token } = res.data.data;
      setUser({
        id: user.id,
        username: user.username,
        email: user.email,
        walletAddress: user.walletAddress,
      });
      localStorage.setItem("access_token", access_token);
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Signup error:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("access_token");
    router.push("/login");
  };

  const googleLogin = async (idToken: string) => {
    setLoading(true);
    try {
      // Replace with actual Google login API call
      console.log("Google login idToken:", idToken);
      await new Promise((res) => setTimeout(res, 1000)); // Mock API call
      setUser({
        id: "mock-google-id",
        username: "Google User",
        email: "googleuser@example.com",
      });
      localStorage.setItem("access_token", "mock-google-token");
      router.push("/dashboard");
    } catch (error) {
      console.error("Google login error:", error);
      throw new Error("Google login failed");
    } finally {
      setLoading(false);
    }
  };

  const walletLogin = async (address: string, signature: string) => {
    setLoading(true);
    try {
      console.log("Wallet login request payload:", { address, signature });
      const res = await axios.post("https://api.dvs.dyung.me/auth/wallet-login", { address, signature });
      console.log("Wallet login response:", res.data);

      if (res.status !== 200 || !res.data.data || !res.data.data.access_token) {
        throw new Error(res.data.message || "Wallet login failed");
      }

      const { user, access_token } = res.data.data;
      setUser({
        id: user.id,
        username: user.username,
        email: user.email,
        walletAddress: user.walletAddress || address,
      });
      localStorage.setItem("access_token", access_token);
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Wallet login error:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Wallet login failed");
    } finally {
      setLoading(false);
    }
  };

  const connectWallet = async (address: string, signature: string) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("Please sign in to connect your wallet");

      console.log("Connect wallet request payload:", { address, signature });
      const res = await axios.post(
        "https://api.dvs.dyung.me/users/wallet/connect",
        { address, signature },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Connect wallet response:", res.data);

      if (res.status !== 200 || res.data.status !== 200) {
        throw new Error(res.data.message || "Wallet connection failed");
      }

      setUser((prev) => ({
        ...prev!,
        walletAddress: res.data.data.user?.walletAddress || address,
      }));
    } catch (error: any) {
      console.error("Connect wallet error:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Wallet connection failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        signup,
        logout,
        googleLogin,
        walletLogin,
        connectWallet,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuthContext must be used within AuthProvider");
  return context;
};