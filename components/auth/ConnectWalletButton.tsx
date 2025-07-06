"use client";

import { useState } from "react";
import { walletLogin } from "@/hooks/useWalletLogin";
import { Loader2 } from "lucide-react";

export default function ConnectWalletButton() {
  const [loading, setLoading] = useState(false);

  const handleConnect = async () => {
    try {
      setLoading(true);
      await walletLogin(); // calls reusable hook to handle login
    } catch (error) {
      console.error("Wallet login error:", error);
      alert("Failed to connect wallet. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleConnect}
      disabled={loading}
      className="w-full h-12 border border-gray-300 hover:bg-gray-50 flex items-center justify-center rounded-xl transition-colors text-gray-700 font-semibold space-x-2"
    >
      {loading ? (
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
