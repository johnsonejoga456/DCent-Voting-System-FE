"use client";

import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

export function Button({ variant = "primary", className = " ", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "px-4 py-2 font-medium rounded-md transition",
        variant === "primary" ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-gray-600 hover:bg-gray-700 text-white",
        className
      )}
      {...props}
    />
  );
}
