"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  googleLogin: (idToken: string) => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Hydrate user on refresh
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch("https://api.dvs.dyung.me/users", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();

        console.log("Hydrate Response:", data);

        if (res.ok && data.status === 200 && data.data) {
          setUser({
            id: data.data.id,
            username: data.data.username,
            email: data.data.email,
          });
        } else {
          console.error("Hydrate failed:", data.message || "Unknown error");
          localStorage.removeItem("access_token");
        }
      } catch (error) {
        console.error("Hydrate user error:", error);
        localStorage.removeItem("access_token");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch("https://api.dvs.dyung.me/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.data || !data.data.access_token) {
        throw new Error(data.message || "Login failed");
      }

      const { user, access_token } = data.data;

      setUser({
        id: user.id,
        username: user.username,
        email: user.email,
      });

      localStorage.setItem("access_token", access_token);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const signup = async (username: string, email: string, password: string) => {
    try {
      const res = await fetch("https://api.dvs.dyung.me/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();
      console.log("Signup Response:", data);

      if (res.ok && data.status === 200 && data.data) {
        setUser({
          id: data.data.user.id,
          username: data.data.user.username,
          email: data.data.user.email,
        });
      } else {
        throw new Error(data.message || "Signup failed. Please try again.");
      }
    } catch (error) {
      console.error("Signup Error:", error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("access_token");
  };

  const googleLogin = async (idToken: string) => {
    console.log("Google ID Token:", idToken);
    await new Promise((res) => setTimeout(res, 1000));
    setUser({
      id: "mock-google-id",
      username: "Google User",
      email: "googleuser@example.com",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        googleLogin,
        setUser
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
