"use client";

import { useState } from "react";
import { Button } from "@/components/ui";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <form className="space-y-4">
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-600" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@company.com"
          autoComplete="email"
          type="email"
        />
      </div>
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-600" htmlFor="password">
          Mật khẩu
        </label>
        <input
          id="password"
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Tối thiểu 8 ký tự"
          autoComplete="current-password"
          type="password"
        />
      </div>
      <Button className="w-full py-3 text-sm" type="submit">
        Đăng nhập
      </Button>
    </form>
  );
}
