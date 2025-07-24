"use client";

import { ReactNode } from "react";
import { AuthProvider } from "@/context/AuthContext";
import WalletProvider from "@/components/WalletProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <WalletProvider>
      <AuthProvider>
        {children}
        <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
      </AuthProvider>
    </WalletProvider>
  );
}
