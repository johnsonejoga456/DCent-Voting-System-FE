"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  googleLogin: (idToken: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    try {
        const res = await fetch("https://api.dvs.dyung.me/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();
        console.log("Login Response:", data);

        if (data.status === 0) {
            const { user, access_token } = data.data;

            // Store token in localStorage
            localStorage.setItem("token", access_token);

            // Update user context
            setUser({
                id: user.id,
                username: user.username,
                email: user.email,
            });
        } else {
            throw new Error(data.message || "Login failed. Please check your credentials.");
        }
    } catch (error) {
        console.error("Login Error:", error);
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

      if (data.status === 0) {
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

  const logout = () => setUser(null);

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
        isAuthenticated: user !== null,
        login,
        signup,
        logout,
        googleLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuthContext must be used within AuthProvider");
  return context;
};
