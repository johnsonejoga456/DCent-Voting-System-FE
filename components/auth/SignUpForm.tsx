"use client";

import { useState } from "react";
import type React from "react";
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";
import ConnectWalletButton from "@/components/auth/ConnectWalletButton";
import { toast } from "react-toastify";
import axios from "axios";

export default function SignUpForm() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const { signup, loading } = useAuthContext();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await signup(form.username, form.email, form.password);
      router.push("/dashboard");
    } catch (err: unknown) {
      let errorMessage = "Signup failed. Please try again.";
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-pink-50 p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-orange-400 to-pink-400 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-orange-300 to-yellow-300 rounded-full opacity-20 blur-3xl"></div>
      </div>

      <div className="w-full max-w-md relative backdrop-blur-sm bg-white/80 border-0 shadow-2xl shadow-orange-500/10 rounded-2xl">
        <div className="space-y-1 text-center pb-8 pt-8 px-6">
          <div className="mx-auto w-12 h-12 bg-gradient-to-r from-orange-500 to-pink-500 rounded-xl flex items-center justify-center mb-4">
            <User className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
            Create an Account
          </h1>
          <p className="text-gray-600">Sign up to start your journey</p>
        </div>

        <div className="space-y-6 px-6 pb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium text-gray-700 block">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  className="w-full pl-10 h-12 border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:outline-none rounded-xl bg-orange-50 text-gray-800 transition-colors"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700 block">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="w-full pl-10 h-12 border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:outline-none rounded-xl bg-orange-50 text-gray-800 transition-colors"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-700 block">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  className="w-full pl-10 h-12 border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:outline-none rounded-xl bg-orange-50 text-gray-800 transition-colors"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full h-12 ${
                loading
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
              } text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg shadow-orange-500/25 flex items-center justify-center`}
            >
              {loading ? "Signing Up..." : "Sign Up"}
              {!loading && <ArrowRight className="ml-2 w-4 h-4" />}
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <ConnectWalletButton />
          </div>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-orange-600 hover:text-orange-500 transition-colors"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
