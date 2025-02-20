import { Web3ModalProvider } from "@/context/web3modal";

export const metadata = {
  title: "Decentralized Voting System",
  description: "Secure decentralized voting",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Web3ModalProvider>{children}</Web3ModalProvider>
      </body>
    </html>
  );
}
