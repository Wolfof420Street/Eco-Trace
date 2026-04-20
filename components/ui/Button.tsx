"use client";

import type { ButtonHTMLAttributes } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
};

const variantClasses = {
  primary: "bg-primary text-[var(--text-inverse)] shadow-glow",
  secondary: "bg-surface text-text border border-strong",
  ghost: "bg-transparent text-text border border-transparent hover:border-strong",
  danger: "bg-danger text-white"
};

const sizeClasses = {
  sm: "px-3 py-2 text-sm",
  md: "px-4 py-3 text-sm",
  lg: "px-5 py-4 text-base"
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  loading = false,
  children,
  ...props
}: ButtonProps) {
  return (
    <motion.div whileTap={{ scale: 0.97 }} className="inline-flex">
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-full font-medium transition duration-200 disabled:cursor-not-allowed disabled:opacity-60",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {loading ? "Loading..." : children}
      </button>
    </motion.div>
  );
}
