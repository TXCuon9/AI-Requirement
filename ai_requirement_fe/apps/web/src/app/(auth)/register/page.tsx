import Link from "next/link";
import { RegisterForm } from "@/features/auth";

export default function RegisterPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-600">Đăng ký</p>
        <h1 className="font-display text-3xl font-semibold text-slate-900">
          Bắt đầu hành trình tuyển dụng
        </h1>
        <p className="text-sm text-slate-500">
          Tạo tài khoản doanh nghiệp để quản lý tin tuyển dụng và ứng viên tập trung.
        </p>
      </div>

      <RegisterForm />

      <p className="text-xs text-slate-500">
        Đã có tài khoản? <Link className="text-cyan-600" href="/login">Đăng nhập</Link>
      </p>
    </div>
  );
}
