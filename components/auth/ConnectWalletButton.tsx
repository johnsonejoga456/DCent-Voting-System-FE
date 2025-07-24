"use client";

import { useState, useEffect } from "react";
import { useWalletLogin } from "@/hooks/useWalletLogin";
import { useAuthContext } from "@/context/AuthContext";
import { useConnect, useSignMessage, useAccount, useChainId } from "wagmi";
import { getAddress } from "viem";
import axios from "axios";
import { toast } from "react-toastify";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Loader2 } from "lucide-react";

export default function ConnectWalletButton({ mode = "login" }: { mode?: "login" | "connect" }) {
  const { walletLogin, connectWallet, loading } = useAuthContext();
  const { login } = useWalletLogin();
  const { connect, connectors, error: connectError } = useConnect();
  const { signMessageAsync } = useSignMessage();
  const { address } = useAccount();
  const chainId = useChainId();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== "undefined" && !window.indexedDB) {
      console.warn("indexedDB is not available in this environment");
    }
  }, []);

  const handleConnect = async () => {
    if (!isClient) {
      console.warn("Wallet connection attempted on server-side");
      return;
    }

    setIsConnecting(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) {
        throw new Error("NEXT_PUBLIC_API_URL is not set in .env");
      }

      if (mode === "login") {
        await login();
        return;
      }

      // Connect wallet
      if (!address || !chainId) {
        const connector = connectors.find((c) => c.id === "metaMask") || connectors[0];
        if (!connector) {
          throw new Error("No valid connectors available");
        }
        console.log("🔌 Connecting wallet via:", connector.name);
        console.log("Available connectors:", connectors.map(c => ({ id: c.id, name: c.name })));
        try {
          await connect({ connector });
        } catch (err: any) {
          console.error("Connector error:", {
            message: err.message,
            stack: err.stack,
            connector: connector.name,
          });
          throw new Error("Failed to connect wallet: " + (err.message || "Unknown error"));
        }
        if (connectError) {
          console.error("Connect error:", connectError);
          throw new Error("Failed to connect wallet: " + (connectError.message || "Unknown error"));
        }
      }

      if (!address) throw new Error("No wallet address found");
      if (!chainId) throw new Error("No chain detected after connection");

      console.log("Connected chain ID:", chainId);

      const checksumAddress = getAddress(address);
      console.log("Checksummed address:", checksumAddress);

      console.log("Requesting nonce for address:", checksumAddress);
      const nonceRes = await axios.post(`${apiUrl}/auth/nonce`, { address: checksumAddress });
      console.log("Nonce response:", nonceRes.data);

      if (nonceRes.status !== 200 || !nonceRes.data.data?.nonce) {
        throw new Error(nonceRes.data.message || "Failed to retrieve nonce");
      }
      const nonce = nonceRes.data.data.nonce;

      const message = `Login to DVS with this one-time code: ${nonce}`;
      console.log("Signing message:", message);

      const signature = await signMessageAsync({ message });
      console.log("Signature obtained:", signature);

      if (!signature) throw new Error("Signature rejected");

      console.log("Attempting wallet connect with signature...");
      await connectWallet(checksumAddress, signature);
      toast.success("Wallet connected successfully");
    } catch (error: any) {
      console.error(`${mode === "login" ? "Wallet login" : "Wallet connect"} error:`, {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      if (error.response?.data?.message === "Wallet not registered") {
        toast.error("This wallet is not registered. Please link your wallet in your dashboard.");
      } else {
        toast.error(error.response?.data?.message || error.message || `${mode === "login" ? "Wallet login" : "Wallet connection"} failed`);
      }
    } finally {
      setIsConnecting(false);
    }
  };

  if (!isClient) {
    return null;
  }

  return (
    <ConnectButton.Custom>
      {({ account, chain: connectedChain, openConnectModal, mounted }) => {
        if (!mounted || !account || !connectedChain) {
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
                  <span>{mode === "login" ? "Sign in with Wallet" : "Connect Wallet"}</span>
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
                <span>
                  {mode === "login" ? "Sign in with Wallet" : "Connect Wallet"} ({account.displayName})
                </span>
              </>
            )}
          </button>
        );
      }}
    </ConnectButton.Custom>
  );
}