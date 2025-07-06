"use client";

import { ethers } from "ethers";
import { useAuth } from "./useAuth";
import { useRouter } from "next/navigation";

export async function walletLogin() {
  const { setUser } = useAuth();
  const router = useRouter();

  if (!window.ethereum) {
    alert("MetaMask not detected. Please install MetaMask to continue.");
    return;
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const address = await signer.getAddress();

  // Step 1: Get nonce from backend
  const nonceRes = await fetch("https://api.dvs.dyung.me/auth/nonce", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ address }),
  });
  const nonceData = await nonceRes.json();
  const nonce = nonceData.nonce || "Sign this message to login to DVS";

  // Step 2: User signs nonce
  const signature = await signer.signMessage(nonce);

  // Step 3: Send signature to backend for verification
  const loginRes = await fetch("https://api.dvs.dyung.me/auth/wallet-login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ address, signature }),
  });

  const data = await loginRes.json();

  if (loginRes.ok && data.status === 200 && data.data.access_token) {
    localStorage.setItem("access_token", data.data.access_token);

    setUser({
      id: data.data.user.id,
      username: data.data.user.username,
      email: data.data.user.email,
    });

    router.push("/dashboard");
  } else {
    throw new Error(data.message || "Wallet login failed");
  }
}