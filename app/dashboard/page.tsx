"use client";

import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { useAuth } from "@/hooks/useAuth";

export default function DashboardPage() {
  useProtectedRoute();

  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 via-white to-blue-50 p-4">
      <div className="max-w-md w-full bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 space-y-6">
        <h1 className="text-3xl font-bold text-center text-green-700">Welcome to Your Dashboard</h1>
        <p className="text-center text-gray-700">
          Hello, <span className="font-semibold">{user?.username ?? user?.email}</span>!
        </p>
        <button
          onClick={logout}
          className="w-full h-12 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg shadow-red-500/25"
        >
          Logout
        </button>
      </div>
    </div>
  );
}