"use client";

import { useAuth } from "../../lib/authContext";
import { Building2, Users, BriefcaseBusiness, Contact, FileText } from "lucide-react";

import { useState, useEffect } from "react";
import { fetchApi } from "../../lib/api";

export default function DashboardPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  const isCompany = user?.role === "COMPANY";
  const isRecruiter = user?.role === "RECRUITER";

  const [dynamicStats, setDynamicStats] = useState({ activeJobs: 0, pendingApps: 0 });

  useEffect(() => {
    if (isCompany || isRecruiter) {
      fetchApi("/company/dashboard-stats")
        .then((res) => {
          if (res) {
            setDynamicStats({
              activeJobs: res.activeJobsCount || 0,
              pendingApps: res.pendingApplicationsCount || 0
            });
          }
        })
        .catch((err) => console.error(err));
    }
  }, [isCompany, isRecruiter]);

  const adminStats = [
    { label: "Tài khoản chờ duyệt", value: "2", icon: Users, color: "bg-amber-50 text-amber-600", border: "border-amber-200" },
    { label: "Công ty đang hoạt động", value: "45", icon: Building2, color: "bg-blue-50 text-blue-600", border: "border-blue-200" },
  ];

  const companyStats = [
    { label: "Tin tuyển dụng của công ty", value: dynamicStats.activeJobs.toString(), icon: BriefcaseBusiness, color: "bg-blue-50 text-blue-600", border: "border-blue-200" },
    { label: "Lượt ứng tuyển mới", value: dynamicStats.pendingApps.toString(), icon: Contact, color: "bg-emerald-50 text-emerald-600", border: "border-emerald-200" },
    { label: "Nhân sự HR", value: "2", icon: Users, color: "bg-purple-50 text-purple-600", border: "border-purple-200" },
    { label: "Lượt xem hồ sơ công ty", value: "340", icon: Building2, color: "bg-amber-50 text-amber-600", border: "border-amber-200" },
  ];

  const recruiterStats = [
    { label: "Tin tuyển dụng đang quản lý", value: dynamicStats.activeJobs.toString(), icon: BriefcaseBusiness, color: "bg-blue-50 text-blue-600", border: "border-blue-200" },
    { label: "Lượt ứng tuyển cần duyệt", value: dynamicStats.pendingApps.toString(), icon: Contact, color: "bg-emerald-50 text-emerald-600", border: "border-emerald-200" },
  ];

  const candidateStats = [
    { label: "Việc đã ứng tuyển", value: "5", icon: BriefcaseBusiness, color: "bg-blue-50 text-blue-600", border: "border-blue-200" },
    { label: "CV đã lưu", value: "2", icon: FileText, color: "bg-emerald-50 text-emerald-600", border: "border-emerald-200" },
    { label: "Lượt nhà tuyển dụng xem CV", value: "12", icon: Users, color: "bg-purple-50 text-purple-600", border: "border-purple-200" },
  ];

  let stats = [];
  if (isAdmin) stats = adminStats;
  else if (isCompany) stats = companyStats;
  else if (isRecruiter) stats = recruiterStats;
  else stats = candidateStats;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Tổng quan</h1>
        <p className="text-slate-500 mt-1">Chào mừng quay trở lại, {user?.email}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const accentColor = stat.color.split(' ')[0].replace('-50', '-500');
          return (
            <div key={i} className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all flex items-center gap-5 relative overflow-hidden group">
              {/* Left Accent line matching the color */}
              <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${accentColor}`}></div>
              
              <div className={`size-14 rounded-full flex items-center justify-center shrink-0 ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className="size-6" />
              </div>
              <div>
                <div className="text-[28px] font-extrabold text-slate-800 leading-none mb-1.5">{stat.value}</div>
                <h3 className="text-slate-500 text-[12px] font-bold uppercase tracking-wider">{stat.label}</h3>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm mt-8 min-h-[300px] flex items-center justify-center">
        <div className="text-center">
          <div className="size-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
             <LayoutDashboard className="size-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">Chưa có thông báo mới</h3>
          <p className="text-slate-500 text-sm">Biểu đồ và thống kê chi tiết sẽ xuất hiện tại đây khi có đủ dữ liệu.</p>
        </div>
      </div>
    </div>
  );
}

import { LayoutDashboard } from "lucide-react";
