"use client";

import { useEffect } from "react";
import { useAuth } from "./useAuth";
import { useRouter } from "next/navigation";

export function useProtectedRoute() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);
}