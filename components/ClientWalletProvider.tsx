"use client";

import { ReactNode } from "react";
import WalletProvider from "./WalletProvider";

export default function ClientWalletProvider({ children }: { children: ReactNode }) {
  return <WalletProvider>{children}</WalletProvider>;
}