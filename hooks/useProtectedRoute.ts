"use client";

import { useEffect } from "react";
import { useAuth } from "./useAuth";
import { useRouter } from "next/navigation";

export function useProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/");
    }
  }, [isLoading, isAuthenticated, router]);
}