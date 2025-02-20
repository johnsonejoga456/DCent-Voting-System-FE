"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ConnectButton } from "@/components/ConnectButton";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-900 text-white">
      {/* Navbar */}
      <nav className="w-full flex items-center justify-between px-6 py-4 bg-gray-800 shadow-md">
        <Link href="/" className="text-xl font-bold text-blue-500">
          🗳️ Decentralized Voting
        </Link>
        <div className="flex gap-6">
          <Link href="/" className="hover:text-blue-400">Home</Link>
          <Link href="/vote" className="hover:text-blue-400">Vote</Link>
          <Link href="/results" className="hover:text-blue-400">Results</Link>
        </div>
        <ConnectButton />
      </nav>

      {/* Main Content */}
      <section className="flex flex-col items-center justify-center h-[calc(100vh-4rem)]">
        <h1 className="text-4xl font-bold mb-4">Decentralized Voting System</h1>
        <p className="text-lg mb-6">Secure, Transparent, and Trustless Voting</p>

        <div className="flex gap-4">
          <Link href="/vote">
            <Button className="bg-blue-600 hover:bg-blue-700">Vote Now</Button>
          </Link>
          <Link href="/results">
            <Button className="bg-green-600 hover:bg-green-700">View Results</Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
