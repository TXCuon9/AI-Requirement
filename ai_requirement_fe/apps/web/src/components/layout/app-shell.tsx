import { type ReactNode } from "react";
import Link from "next/link";

const navItems = [
  { href: "/dashboard", label: "Bảng điều khiển" },
  { href: "/jobs", label: "Việc làm" },
  { href: "/companies", label: "Công ty" },
  { href: "/users", label: "Người dùng" },
  { href: "/admin", label: "Quản trị" },
];

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-topcv-page">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link className="font-display text-lg font-semibold" href="/">
            AI Recruit
          </Link>
          <nav className="flex items-center gap-4 text-sm text-slate-600">
            {navItems.map((item) => (
              <Link key={item.href} className="hover:text-cyan-600" href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-4 py-6">{children}</div>
    </div>
  );
}
