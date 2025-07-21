"use client";

import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { RainbowKitProvider, getDefaultConfig } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";

// Create QueryClient for React Query
const queryClient = new QueryClient();

// Ensure projectId is defined
const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;
if (!projectId) {
  throw new Error("NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID is not set in .env");
}

// Create wagmi config (singleton to prevent multiple initializations)
const config = (() => {
  let instance: ReturnType<typeof getDefaultConfig> | undefined;

  return () => {
    if (!instance) {
      console.log("Initializing wagmi config");
      instance = getDefaultConfig({
        appName: "DCent Voting System",
        projectId,
        chains: [mainnet, sepolia],
      });
    }
    return instance;
  };
})()();

export default function WalletProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={config}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </WagmiProvider>
    </QueryClientProvider>
  );
}