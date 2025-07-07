import './globals.css';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/context/AuthContext';
import { WalletProvider } from '@/lib/wallet';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'DCent Voting App',
  description: 'Secure decentralized voting system with Email, Google, Wallet Login',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          src="https://accounts.google.com/gsi/client"
          async
          defer
        ></script>
      </head>
      <body className={`${inter.className} bg-gray-100 min-h-screen`}>
        {/* ✅ Wrap WalletProvider outside AuthProvider */}
        <WalletProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </WalletProvider>
      </body>
    </html>
  );
}
