import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import WalletProvider from "@/lib/wallet";
import { AuthProvider } from "@/context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DCent Voting System",
  description: "A decentralized voting system",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WalletProvider>
          <AuthProvider>
            {children}
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
          </AuthProvider>
        </WalletProvider>
      </body>
    </html>
  );
}