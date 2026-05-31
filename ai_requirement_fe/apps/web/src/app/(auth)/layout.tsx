import { type ReactNode } from "react";
import Link from "next/link";

type AuthLayoutProps = {
  children: ReactNode;
};

const trustBadges = ["ISO 27001", "SOC 2", "SSO/SCIM", "MFA"];

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none absolute -top-32 right-0 h-72 w-72 rounded-full bg-cyan-400/30 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-[-10%] h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 rounded-full bg-slate-900/60 blur-2xl" />

      <div className="relative mx-auto grid min-h-screen max-w-6xl items-center gap-10 px-4 py-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="hidden lg:flex flex-col gap-6">
          <Link className="flex items-center gap-3" href="/">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500 text-base font-semibold text-white shadow-lg shadow-cyan-500/30">
              AI
            </div>
            <div>
              <p className="font-display text-lg font-semibold">AI Recruit</p>
              <p className="text-xs text-slate-300">Tuyển dụng thông minh cho doanh nghiệp</p>
            </div>
          </Link>

          <div className="space-y-4">
            <h1 className="font-display text-4xl font-semibold leading-tight">
              Quản trị tuyển dụng tập trung, bảo mật và chuẩn doanh nghiệp
            </h1>
            <p className="text-sm text-slate-200/80">
              Đồng bộ dữ liệu ứng viên, theo dõi pipeline, phân quyền rõ ràng và báo cáo realtime.
              Tất cả trong một nền tảng AI thống nhất.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {["Quy trình tuyển dụng", "Phân quyền linh hoạt", "Báo cáo chuyên sâu", "Tích hợp API"].map(
              (item) => (
                <div
                  key={item}
                  className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-slate-100"
                >
                  {item}
                </div>
              ),
            )}
          </div>

          <div className="flex flex-wrap gap-2 text-xs text-slate-200/80">
            {trustBadges.map((badge) => (
              <span
                key={badge}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-[32px] border border-white/10 bg-white/95 p-8 text-slate-900 shadow-2xl shadow-cyan-500/10">
          {children}
        </div>
      </div>
    </div>
  );
}
