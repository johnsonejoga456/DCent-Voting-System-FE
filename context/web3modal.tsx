"use client";

import { WagmiConfig, createConfig } from "wagmi";
import { http } from "viem";
import { mainnet } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";

const WALLET_CONNECT_PROJECT_ID = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "";

// Create React Query Client
const queryClient = new QueryClient();

// Create the wagmiConfig properly
const wagmiConfig = createConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(),
  },
});

export function Web3ModalProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider modalSize="compact">{children}</RainbowKitProvider>
      </WagmiConfig>
    </QueryClientProvider>
  );
}
