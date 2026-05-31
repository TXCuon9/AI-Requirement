import { type ButtonHTMLAttributes } from "react";
import { cn } from "@ai-requirement/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost";
};

const variants = {
  primary: "bg-cyan-500 text-white hover:bg-cyan-600",
  ghost: "border border-slate-200 text-slate-700 hover:border-cyan-200 hover:text-cyan-600",
} as const;

export function Button({ variant = "primary", className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
