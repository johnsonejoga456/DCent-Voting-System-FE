"use client";

import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useConnect, useSignMessage, useAccount } from "wagmi";
import axios from "axios";
import { toast } from "react-toastify";

export const useWalletLogin = () => {
  const { walletLogin } = useAuthContext();
  const router = useRouter();
  const { connect, connectors, error: connectError } = useConnect();
  const { signMessageAsync } = useSignMessage();
  const { address } = useAccount();

  const login = async () => {
    try {
      // Connect wallet
      if (!address) {
        const connector = connectors.find((c) => c.id === "metaMask") || connectors[0];
        connect({ connector });
        if (connectError) throw new Error("Failed to connect wallet");
      }

      if (!address) throw new Error("No wallet address found");

      // Request nonce
      const nonceRes = await axios.post("https://api.dvs.dyung.me/auth/wallet/nonce", { address });
      if (nonceRes.status !== 200 || !nonceRes.data.nonce) {
        throw new Error("Failed to retrieve nonce");
      }
      const nonce = nonceRes.data.nonce;

      // Sign nonce
      const signature = await signMessageAsync({ message: nonce });
      if (!signature) throw new Error("Signature rejected");

      // Perform wallet login
      await walletLogin(address, signature);
      router.push("/dashboard");
    } catch (error: any) {
      if (error.response?.data?.message === "Wallet not registered") {
        toast.error("This wallet is not registered. Please link your wallet in your dashboard.");
      } else {
        toast.error(error.response?.data?.message || error.message || "Wallet login failed");
      }
    }
  };

  return { login };
};
