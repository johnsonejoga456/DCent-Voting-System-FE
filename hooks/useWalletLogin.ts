"use client";

import { useAuthContext } from "@/context/AuthContext";
import { useSignMessage, useAccount, useConnect } from "wagmi";
import { useState, useCallback, useEffect } from "react";
import { getAddress } from "viem";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export const useWalletLogin = () => {
  const { walletLogin } = useAuthContext();
  const router = useRouter();
  const { signMessageAsync } = useSignMessage();
  const { address, isConnected } = useAccount();
  const { connect, connectors, error: connectError } = useConnect();
  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Ensure rendering only on client
  }, []);

  const login = useCallback(async () => {
    if (!isClient) {
      console.warn("Wallet login attempted on server-side");
      return;
    }

    setLoading(true);
    try {
      // Validate API URL
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) throw new Error("NEXT_PUBLIC_API_URL is not set in environment.");

      // Connect wallet if not connected
      if (!isConnected || !address) {
        const connector = connectors.find((c) => c.id === "metaMask") || connectors[0];
        console.log("➡️ Connecting wallet via:", connector.name);
        await connect({ connector });
        if (connectError) throw new Error("Failed to connect wallet");
      }

      if (!address) throw new Error("No wallet address found after connection attempt.");

      // Normalize address to checksum format
      const checksumAddress = getAddress(address);
      console.log("➡️ Checksummed address:", checksumAddress);

      // Request nonce
      console.log("➡️ Requesting nonce for address:", checksumAddress);
      const nonceRes = await axios.post(`${apiUrl}/auth/nonce`, { address: checksumAddress });
      console.log("✅ Nonce response:", nonceRes.data);

      if (nonceRes.status !== 200 || !nonceRes.data.data?.nonce) {
        throw new Error(nonceRes.data.message || "Failed to retrieve nonce");
      }

      const nonce = nonceRes.data.data.nonce;
      // Construct message as expected by backend
      const message = `Login to DVS with this one-time code: ${nonce}`;
      console.log("➡️ Signing message:", message);

      // Sign the message
      const signature = await signMessageAsync({ message });
      console.log("✅ Signature obtained:", signature);

      if (!signature) throw new Error("Signature was rejected or missing after signing attempt.");

      // Perform wallet login
      console.log("➡️ Attempting wallet login with signature...");
      await walletLogin(checksumAddress, signature);
      toast.success("Wallet login successful!");
      router.push("/dashboard");
    } catch (error: any) {
      console.error("❌ Wallet login error:", {
        error,
        response: error.response,
        message: error.message,
      });

      // Clear local cache if auth fails to prevent infinite loops
      if (
        error.response?.status === 401 ||
        error.response?.data?.message?.toLowerCase().includes("unauthorized")
      ) {
        console.warn("Clearing local cache due to authorization error.");
        localStorage.removeItem("access_token");
      }

      toast.error(
        error.response?.data?.message ||
        error.message ||
        "Wallet login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, [isClient, connect, connectors, connectError, signMessageAsync, address, isConnected, walletLogin, router]);

  return { login, loading };
};