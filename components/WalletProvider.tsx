"use client";

import { ReactNode, useEffect, useState } from "react";
import { WagmiProvider, createConfig, http } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { walletConnect, injected, metaMask } from "wagmi/connectors";

// Create QueryClient for React Query
const queryClient = new QueryClient();

export default function WalletProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [config, setConfig] = useState<any>(null);

  useEffect(() => {
    const projectId =
      process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID ||
      "006afcb2aec067de1324e26a4074d380";

    const wagmiConfig = createConfig({
      chains: [mainnet, sepolia],
      connectors: [
        metaMask(),
        injected(),
        walletConnect({
          projectId,
          metadata: {
            name: "DVS App",
            description: "Decentralized Voting System",
            url: "https://dvs.dyung.me",
            icons: ["https://dvs.dyung.me/icon.png"],
          },
        }),
      ],
      transports: {
        [mainnet.id]: http(),
        [sepolia.id]: http(),
      },
    });

    setConfig(wagmiConfig);
    setMounted(true);
  }, []);

  if (!mounted || !config) return null; // Prevent Wagmi from initializing during SSR

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider modalSize="compact">{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
