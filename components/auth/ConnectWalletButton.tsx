"use client";

import { useState, useEffect } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { useSignMessage, useAccount, useChainId } from "wagmi";
import { getAddress } from "viem";
import axios from "axios";
import { toast } from "react-toastify";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Loader2 } from "lucide-react";

export default function ConnectWalletButton({
  mode = "login",
}: {
  mode?: "login" | "connect";
}) {
  const { walletLogin, connectWallet, loading } = useAuthContext();
  const { signMessageAsync } = useSignMessage();
  const { address, isConnected } = useAccount();
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

    if (!isConnected || !address || !chainId) {
      toast.error("Please connect your wallet first before proceeding.");
      return;
    }

    setIsConnecting(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) {
        throw new Error("NEXT_PUBLIC_API_URL is not set in .env");
      }

      console.log("Proceeding with wallet authentication:", {
        isConnected,
        address,
        chainId,
        mode,
      });

      const checksumAddress = getAddress(address);
      console.log("Checksummed address:", checksumAddress);

      const nonceRes = await axios.post(`${apiUrl}/auth/nonce`, {
        address: checksumAddress,
      });
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

      if (mode === "login") {
        await walletLogin(checksumAddress, signature);
      } else {
        await connectWallet(checksumAddress, signature);
      }

      toast.success(
        `Wallet ${mode === "login" ? "login" : "connection"} successful`
      );
    } catch (error: unknown) {
      const err =
        error as
        | {
            message?: string;
            response?: { data?: { message?: string }; status?: number };
            stack?: string;
          }
        | undefined;

      console.error(
        `${mode === "login" ? "Wallet login" : "Wallet connect"} error:`,
        {
          message: err?.message,
          response: err?.response?.data,
          status: err?.response?.status,
          stack: err?.stack,
        }
      );

      if (err?.response?.data?.message === "Wallet not registered") {
        toast.error(
          "This wallet is not registered. Please link your wallet in your dashboard."
        );
      } else {
        toast.error(
          err?.response?.data?.message ||
            err?.message ||
            `${mode === "login" ? "Wallet login" : "Wallet connection"} failed`
        );
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
        if (!mounted) {
          return null;
        }
        if (!isConnected || !account || !connectedChain) {
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
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 32 32"
                    fill="currentColor"
                  >
                    <path d="M27 12h-7v2h7v6h-7v2h7c1.1 0 2-.9 2-2v-6c0-1.1-.9-2-2-2zM20 18h-8v2h8v-2zM4 20h7v-2H4v-6h7v-2H4c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2z" />
                  </svg>
                  <span>
                    {mode === "login" ? "Sign in with Wallet" : "Connect Wallet"}
                  </span>
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
                <span>Processing...</span>
              </>
            ) : (
              <>
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 32 32"
                  fill="currentColor"
                >
                  <path d="M27 12h-7v2h7v6h-7v2h7c1.1 0 2-.9 2-2v-6c0-1.1-.9-2-2-2zM20 18h-8v2h8v-2zM4 20h7v-2H4v-6h7v-2H4c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2z" />
                </svg>
                <span>
                  {mode === "login"
                    ? "Sign in with Wallet"
                    : "Connect Wallet"}{" "}
                  ({account.displayName})
                </span>
              </>
            )}
          </button>
        );
      }}
    </ConnectButton.Custom>
  );
}
