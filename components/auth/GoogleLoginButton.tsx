"use client";
import { useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function GoogleLoginButton() {
  const divRef = useRef<HTMLDivElement>(null);
  const { googleLogin } = useAuth();

  useEffect(() => {
    if (!window.google || !divRef.current) return;

    window.google.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      callback: handleCredentialResponse,
    });

    window.google.accounts.id.renderButton(divRef.current, {
      theme: "outline",
      size: "large",
      width: "300",
    });
  }, []);

  const handleCredentialResponse = (response: any) => {
    const idToken = response.credential;
    googleLogin(idToken); // call AuthContext method to send to backend (later)
  };

  return <div ref={divRef} className="flex justify-center"></div>;
}