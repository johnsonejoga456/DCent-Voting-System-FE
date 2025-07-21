"use client";

import { useState } from "react";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { useAuthContext } from "@/context/AuthContext";
import { useConnect, useSignMessage, useAccount } from "wagmi";
import axios from "axios";
import { toast } from "react-toastify";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  useProtectedRoute();
  const { user, connectWallet, loading, logout } = useAuthContext();
  const { connect, connectors, error: connectError } = useConnect();
  const { signMessageAsync } = useSignMessage();
  const { address } = useAccount();
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnectWallet = async () => {
    setIsConnecting(true);
    try {
      if (!address) {
        const connector = connectors.find((c) => c.id === "metaMask") || connectors[0];
        await connect({ connector });
        if (connectError) throw new Error("Failed to connect wallet");
      }

      if (!address) throw new Error("No wallet address found");

      const nonceRes = await axios.post("https://api.dvs.dyung.me/auth/wallet/nonce", { address });
      if (nonceRes.status !== 200 || !nonceRes.data.nonce) {
        throw new Error("Failed to retrieve nonce");
      }
      const nonce = nonceRes.data.nonce;

      const signature = await signMessageAsync({ message: nonce });
      if (!signature) throw new Error("Signature rejected");

      await connectWallet(address, signature);
      toast.success("Wallet connected successfully");
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || "Wallet connection failed");
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 via-white to-blue-50 p-4">
      <div className="max-w-md w-full bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 space-y-6">
        <h1 className="text-3xl font-bold text-center text-green-700">Welcome to Your Dashboard</h1>
        <div className="space-y-2 text-center text-gray-700">
          <p>
            <strong>Username:</strong> {user?.username ?? user?.email}
          </p>
          <p>
            <strong>Email:</strong> {user?.email ?? "N/A"}
          </p>
          <p>
            <strong>Wallet Address:</strong> {user?.walletAddress ?? "Not connected"}
          </p>
        </div>
        {!user?.walletAddress && (
          <ConnectButton.Custom>
            {({ account, chain, openConnectModal, mounted }) => {
              if (!mounted || !account || !chain) {
                return (
                  <button
                    onClick={openConnectModal}
                    disabled={isConnecting || loading}
                    className="w-full h-12 border border-gray-300 hover:bg-gray-50 flex items-center justify-center rounded-xl transition-colors text-gray-700 font-semibold space-x-2"
                  >
                    {isConnecting || loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Connecting Wallet...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" viewBox="0 0 32 32" fill="currentColor">
                          <path d="M27 12h-7v2h7v6h-7v2h7c1.1 0 2-.9 2-2v-6c0-1.1-.9-2-2-2zM20 18h-8v2h8v-2zM4 20h7v-2H4v-6h7v-2H4c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2z" />
                        </svg>
                        <span>Connect Wallet</span>
                      </>
                    )}
                  </button>
                );
              }
              return (
                <button
                  onClick={handleConnectWallet}
                  disabled={isConnecting || loading}
                  className="w-full h-12 border border-gray-300 hover:bg-gray-50 flex items-center justify-center rounded-xl transition-colors text-gray-700 font-semibold space-x-2"
                >
                  {isConnecting || loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Connecting Wallet...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" viewBox="0 0 32 32" fill="currentColor">
                        <path d="M27 12h-7v2h7v6h-7v2h7c1.1 0 2-.9 2-2v-6c0-1.1-.9-2-2-2zM20 18h-8v2h8v-2zM4 20h7v-2H4v-6h7v-2H4c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2z" />
                      </svg>
                      <span>Connect Wallet ({account.displayName})</span>
                    </>
                  )}
                </button>
              );
            }}
          </ConnectButton.Custom>
        )}
        <button
          onClick={() => {
            logout();
            window.location.href = "/login";
          }}
          className="w-full h-12 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg shadow-red-500/25"
        >
          Logout
        </button>
      </div>
    </div>
  );
}