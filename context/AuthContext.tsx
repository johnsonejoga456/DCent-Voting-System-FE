"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

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
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.dvs.dyung.me";

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setLoading(false);
        router.push("/login");
        return;
      }

      try {
        const res = await axios.get(`${apiUrl}/users`, {
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
          router.push("/login");
        }
      } catch (error: any) {
        console.error("Hydrate user error:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
        });
        localStorage.removeItem("access_token");
        setUser(null);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [apiUrl, router]);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      console.log("Login request payload:", { email, password });
      const res = await axios.post(`${apiUrl}/auth/login`, { email, password });
      console.log("Login response:", res.data);

      if (res.status !== 200 || !res.data.data || !res.data.data.access_token) {
        throw new Error(res.data.message || "Login failed");
      }

      const { user: userData, access_token } = res.data.data;
      setUser({
        id: userData.id,
        username: userData.username,
        email: userData.email,
        walletAddress: userData.walletAddress,
      });
      localStorage.setItem("access_token", access_token);
      router.push("/dashboard");
      toast.success("Login successful");
    } catch (error: any) {
      console.error("Login error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      toast.error(error.response?.data?.message || "Login failed");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (username: string, email: string, password: string) => {
    setLoading(true);
    try {
      console.log("Signup request payload:", { username, email, password });
      const res = await axios.post(`${apiUrl}/auth/signup`, { username, email, password });
      console.log("Signup response:", res.data);

      if (res.status !== 200 || !res.data.data) {
        throw new Error(res.data.message || "Signup failed");
      }

      const { user: userData, access_token } = res.data.data;
      setUser({
        id: userData.id,
        username: userData.username,
        email: userData.email,
        walletAddress: userData.walletAddress,
      });
      localStorage.setItem("access_token", access_token);
      router.push("/dashboard");
      toast.success("Signup successful");
    } catch (error: any) {
      console.error("Signup error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      toast.error(error.response?.data?.message || "Signup failed");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("access_token");
    router.push("/login");
    toast.success("Logged out successfully");
  };

  const googleLogin = async (idToken: string) => {
    setLoading(true);
    try {
      console.log("Google login request payload:", { idToken });
      const res = await axios.post(`${apiUrl}/auth/google`, { idToken });
      console.log("Google login response:", res.data);

      if (res.status !== 200 || !res.data.data || !res.data.data.access_token) {
        throw new Error(res.data.message || "Google login failed");
      }

      const { user: userData, access_token } = res.data.data;
      setUser({
        id: userData.id,
        username: userData.username,
        email: userData.email,
        walletAddress: userData.walletAddress,
      });
      localStorage.setItem("access_token", access_token);
      router.push("/dashboard");
      toast.success("Google login successful");
    } catch (error: any) {
      console.error("Google login error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      toast.error(error.response?.data?.message || "Google login failed");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const walletLogin = async (address: string, signature: string) => {
    setLoading(true);
    try {
      console.log("Wallet login request payload:", { address, signature });
      const res = await axios.post(`${apiUrl}/auth/wallet-login`, { address, signature });
      console.log("Wallet login response:", res.data);

      if (res.status !== 200 || !res.data.data || !res.data.data.access_token) {
        throw new Error(res.data.message || "Wallet login failed");
      }

      const { user: userData, access_token } = res.data.data;
      setUser({
        id: userData.id,
        username: userData.username,
        email: userData.email,
        walletAddress: userData.walletAddress || address,
      });
      localStorage.setItem("access_token", access_token);
      router.push("/dashboard");
      toast.success("Wallet login successful");
    } catch (error: any) {
      console.error("Wallet login error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      toast.error(error.response?.data?.message || "Wallet login failed");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const connectWallet = async (address: string, signature: string) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        toast.error("No access token found. Please sign in first.");
        return;
      }

      console.log("Connect wallet request payload:", { address, signature, token });

      const res = await axios.post(
        `${apiUrl}/users/wallet/connect`,
        { address, signature },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const userData = res.data?.data;
      const message = res.data?.message || "Failed to connect wallet";

      console.log("Connect wallet response:", res.data);

      const isSuccess =
        res.status === 200 &&
        res.data.status === 200 &&
        (userData || message === "Wallet connected successfully");

      if (isSuccess) {
        setUser(prev => ({
          id: userData?.id ?? prev?.id ?? "unknown",
          username: userData?.username ?? prev?.username ?? "Anonymous",
          email: userData?.email ?? prev?.email ?? "unknown@example.com",
          walletAddress: userData?.walletAddress ?? address,
        }));
        toast.success(message);
      } else {
        console.warn("Connect wallet condition not met:", { res });
        toast.error(message);
      }
    } catch (error: any) {
      console.error("Connect wallet error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      toast.error(error.response?.data?.message || error.message || "Wallet connection failed");
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
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};