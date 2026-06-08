"use client";

import { Building2, Users, BriefcaseBusiness, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function AdminDashboardPage() {
  const stats = [
    { label: "Doanh nghiệp chờ duyệt", value: "Cần xử lý", icon: Building2, color: "bg-amber-50 text-amber-600", border: "border-amber-200" },
    { label: "Tổng số doanh nghiệp", value: "120+", icon: CheckCircle, color: "bg-blue-50 text-blue-600", border: "border-blue-200" },
    { label: "Tổng số người dùng", value: "1,500+", icon: Users, color: "bg-emerald-50 text-emerald-600", border: "border-emerald-200" },
    { label: "Việc làm đang mở", value: "340", icon: BriefcaseBusiness, color: "bg-purple-50 text-purple-600", border: "border-purple-200" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Bảng điều khiển</h1>
        <p className="text-slate-500 mt-1">Chào mừng quay trở lại, hệ thống đang hoạt động ổn định.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className={`bg-white rounded-2xl p-6 border ${stat.border} shadow-sm hover:shadow-md transition-shadow`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.color}`}>
                <stat.icon className="size-6" />
              </div>
            </div>
            <h3 className="text-slate-500 text-sm font-medium mb-1">{stat.label}</h3>
            <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm mt-8">
        <h2 className="text-lg font-bold mb-4">Lối tắt</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/admin/approvals" className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-colors group">
            <div className="bg-blue-100 text-blue-600 p-3 rounded-lg group-hover:scale-110 transition-transform">
              <CheckSquare className="size-6" />
            </div>
            <div>
              <div className="font-semibold text-slate-900">Duyệt tài khoản doanh nghiệp</div>
              <div className="text-sm text-slate-500">Xử lý các yêu cầu đăng ký công ty mới</div>
            </div>
          </Link>
          {/* Add more shortcuts later if needed */}
        </div>
      </div>
    </div>
  );
}

// Just importing CheckSquare at the bottom to avoid messy top imports for a simple component
import { CheckSquare } from "lucide-react";
