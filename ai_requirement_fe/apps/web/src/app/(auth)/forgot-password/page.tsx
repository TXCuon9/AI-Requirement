import Link from "next/link";
import { Button } from "@/components/ui";

export default function ForgotPasswordPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-600">
          Quên mật khẩu
        </p>
        <h1 className="font-display text-3xl font-semibold text-slate-900">Khôi phục quyền truy cập</h1>
        <p className="text-sm text-slate-500">
          Nhập email để nhận liên kết khôi phục mật khẩu trong vài phút.
        </p>
      </div>

      <form className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-600" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
            placeholder="you@company.com"
            type="email"
          />
        </div>
        <Button className="w-full py-3 text-sm" type="submit">
          Gửi liên kết khôi phục
        </Button>
      </form>

      <p className="text-xs text-slate-500">
        Quay lại <Link className="text-cyan-600" href="/login">Đăng nhập</Link>
      </p>
    </div>
  );
}
