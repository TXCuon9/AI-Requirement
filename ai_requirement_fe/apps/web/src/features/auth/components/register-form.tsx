"use client";

import { useState } from "react";
import { Button } from "@/components/ui";

export function RegisterForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    accept: false,
  });

  return (
    <form className="space-y-4">
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-600" htmlFor="name">
          Họ và tên
        </label>
        <input
          id="name"
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
          value={form.name}
          onChange={(event) => setForm({ ...form, name: event.target.value })}
          placeholder="Nguyễn Văn A"
          type="text"
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-600" htmlFor="email">
          Email công việc
        </label>
        <input
          id="email"
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
          value={form.email}
          onChange={(event) => setForm({ ...form, email: event.target.value })}
          placeholder="you@company.com"
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
          value={form.password}
          onChange={(event) => setForm({ ...form, password: event.target.value })}
          placeholder="Tối thiểu 8 ký tự"
          type="password"
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-600" htmlFor="confirmPassword">
          Xác nhận mật khẩu
        </label>
        <input
          id="confirmPassword"
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
          value={form.confirmPassword}
          onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })}
          placeholder="Nhập lại mật khẩu"
          type="password"
        />
      </div>

      <label className="flex items-center gap-2 text-xs text-slate-500">
        <input
          className="h-4 w-4 rounded border border-slate-300"
          checked={form.accept}
          onChange={(event) => setForm({ ...form, accept: event.target.checked })}
          type="checkbox"
        />
        Tôi đồng ý với điều khoản và chính sách bảo mật.
      </label>

      <Button className="w-full py-3 text-sm" type="submit">
        Tạo tài khoản
      </Button>
    </form>
  );
}
