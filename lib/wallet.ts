"use client";

import { ReactNode } from "react";
import { WagmiProvider, http } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getDefaultConfig, RainbowKitProvider, darkTheme, lightTheme } from "@rainbow-me/rainbowkit";
import { sepolia } from "wagmi/chains";

// ✅ Create RainbowKit config with your WalletConnect Project ID
const config = getDefaultConfig({
  appName: "DCent Voting App",
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!, // ensure this is in .env.local
  chains: [sepolia], // add more chains here as needed
  transports: {
    [sepolia.id]: http(),
  },
});

const queryClient = new QueryClient();

export function WalletProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={config}>
        <RainbowKitProvider
          theme={{
            lightMode: lightTheme(),
            darkMode: darkTheme(),
          }}
          modalSize="compact"
        >
          {children}
        </RainbowKitProvider>
      </WagmiProvider>
    </QueryClientProvider>
  );
}