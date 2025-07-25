"use client";

import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { useAuthContext } from "@/context/AuthContext";
import ConnectWalletButton from "@/components/auth/ConnectWalletButton";

export default function DashboardPage() {
  useProtectedRoute();
  const { user, logout } = useAuthContext();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 via-white to-blue-50 p-4">
      <div className="max-w-md w-full bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 space-y-6">
        <h1 className="text-3xl font-bold text-center text-green-700">Welcome to Your Dashboard</h1>
        <div className="space-y-2 text-center text-gray-700">
          <p>
            <strong>Username:</strong> {user?.username ?? user?.email}
          </p>
          <p>
            <strong>Email:</strong> {user?.email ?? "N/A"}
          </p>
          <p>
            <strong>Wallet Address:</strong> {user?.walletAddress ?? "Not connected"}
          </p>
        </div>
        {!user?.walletAddress && <ConnectWalletButton mode="connect" />}
        <button
          onClick={() => {
            logout();
            window.location.href = "/login";
          }}
          className="w-full h-12 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg shadow-red-500/25"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
