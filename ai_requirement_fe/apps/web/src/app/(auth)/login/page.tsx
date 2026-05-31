import Link from "next/link";
import { Github, Globe, Users } from "lucide-react";
import { LoginForm } from "@/features/auth";

export default function LoginPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-600">
          Đăng nhập
        </p>
        <h1 className="font-display text-3xl font-semibold text-slate-900">Chào mừng trở lại</h1>
        <p className="text-sm text-slate-500">
          Đăng nhập để theo dõi pipeline tuyển dụng, ứng viên và báo cáo realtime.
        </p>
      </div>

      <LoginForm />

      <div className="flex items-center gap-3 text-xs text-slate-400">
        <span className="h-px flex-1 bg-slate-200" />
        Hoặc đăng nhập bằng
        <span className="h-px flex-1 bg-slate-200" />
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <button
          className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-cyan-200 hover:text-cyan-600"
          type="button"
        >
          <Globe className="h-4 w-4" />
          Google
        </button>
        <button
          className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-cyan-200 hover:text-cyan-600"
          type="button"
        >
          <Users className="h-4 w-4" />
          Facebook
        </button>
        <button
          className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-cyan-200 hover:text-cyan-600"
          type="button"
        >
          <Github className="h-4 w-4" />
          GitHub
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
        <span>Ưu tiên bảo mật với MFA và SSO.</span>
        <Link className="text-cyan-600" href="/forgot-password">
          Quên mật khẩu?
        </Link>
      </div>

      <p className="text-xs text-slate-500">
        Chưa có tài khoản? <Link className="text-cyan-600" href="/register">Tạo mới</Link>
      </p>
    </div>
  );
}
