"use client";

import { ReactNode, useEffect, useState } from "react";
import { WagmiProvider, http, Config } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { RainbowKitProvider, getDefaultConfig } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import '@rainbow-me/rainbowkit/styles.css';

// Create QueryClient for React Query
const queryClient = new QueryClient();

export default function WalletProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [config, setConfig] = useState<Config | null>(null);

  useEffect(() => {
    const projectId =
      process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID ||
      "006afcb2aec067de1324e26a4074d380";

    const wagmiConfig = getDefaultConfig({
      appName: "DVS App",
      projectId,
      chains: [mainnet, sepolia],
      transports: {
        [mainnet.id]: http(),
        [sepolia.id]: http(),
      },
    });

    setConfig(wagmiConfig);
    setMounted(true);
  }, []);

  if (!mounted || !config) return null;

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider modalSize="compact" initialChain={sepolia}>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
