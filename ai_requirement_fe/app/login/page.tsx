"use client";

import { useState } from "react";
import Link from "next/link";
import { fetchApi } from "../../lib/api";
import { useAuth } from "../../lib/authContext";
import { Loader2, ArrowRight } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetchApi("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      
      // Response returns accessToken, refreshToken, email, role
      login(response.accessToken, response.refreshToken, response.email, response.role);
      
    } catch (err: any) {
      setError(err.message || "Email hoặc mật khẩu không chính xác.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] font-sans p-4">
      <div className="w-full max-w-[440px]">
        {/* Logo/Brand */}
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="size-12 rounded-xl bg-gradient-to-br from-[#E52329] to-[#ff6b6b] flex items-center justify-center text-white font-black text-2xl group-hover:scale-105 transition-transform shadow-lg shadow-red-500/20">
              AI
            </div>
            <div>
              <span className="font-extrabold text-2xl tracking-tight text-slate-900 block leading-none">Recruitment</span>
              <span className="text-[11px] text-slate-500 font-medium tracking-widest uppercase">Smart Hiring Platform</span>
            </div>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Chào mừng trở lại</h1>
            <p className="text-sm text-slate-500 mt-2">Đăng nhập để tiếp tục tìm kiếm cơ hội của bạn</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 text-[#E52329] text-sm font-medium border border-red-100 flex items-start gap-2">
              <svg className="size-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Địa chỉ Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#f8fafc] border border-slate-200 focus:bg-white focus:ring-2 focus:ring-[#4876EF]/20 focus:border-[#4876EF] outline-none transition-all text-slate-800 font-medium"
                placeholder="nguyenvana@gmail.com"
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-semibold text-slate-700">Mật khẩu</label>
                <Link href="#" className="text-sm font-semibold text-[#4876EF] hover:text-[#3a62d4] hover:underline transition-colors">
                  Quên mật khẩu?
                </Link>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#f8fafc] border border-slate-200 focus:bg-white focus:ring-2 focus:ring-[#4876EF]/20 focus:border-[#4876EF] outline-none transition-all text-slate-800 font-medium"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-[#E52329] text-white rounded-xl font-bold hover:bg-[#c91f24] transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-4 shadow-lg shadow-red-500/25"
            >
              {isLoading ? (
                <Loader2 className="size-5 animate-spin" />
              ) : (
                <>
                  Đăng nhập
                  <ArrowRight className="size-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-slate-600 font-medium">
            Chưa có tài khoản?{" "}
            <Link href="/register" className="font-bold text-[#E52329] hover:underline transition-colors">
              Đăng ký ngay
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
