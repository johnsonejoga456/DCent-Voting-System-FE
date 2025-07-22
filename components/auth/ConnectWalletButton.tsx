"use client";

import { useState } from "react";
import { useWalletLogin } from "@/hooks/useWalletLogin";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Loader2 } from "lucide-react";
import { useAuthContext } from "@/context/AuthContext";

export default function ConnectWalletButton() {
  const { login } = useWalletLogin();
  const { loading } = useAuthContext();
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      await login();
    }/* catch (error) {
      // Errors are handled in useWalletLogin via toast
    } */finally {
      setIsConnecting(false);
    }
  };

  return (
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
                  <span>Sign in with Wallet</span>
                </>
              )}
            </button>
          );
        }
        return (
          <button
            onClick={handleConnect}
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
                <span>Sign in with Wallet ({account.displayName})</span>
              </>
            )}
          </button>
        );
      }}
    </ConnectButton.Custom>
  );
}
