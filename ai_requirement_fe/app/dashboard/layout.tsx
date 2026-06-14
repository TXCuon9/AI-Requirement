"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Building, Users, Briefcase, Contact, LogOut, Home, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../../lib/authContext";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  
  // Protect route
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) return null;

  const isAdmin = user?.role === "ADMIN";
  const isCompany = user?.role === "COMPANY";
  const isRecruiter = user?.role === "RECRUITER";
  const isCandidate = user?.role === "CANDIDATE";

  // Menu items based on role
  const adminMenuItems = [
    { label: "Bảng điều khiển", href: "/dashboard", icon: LayoutDashboard },
    { label: "Duyệt tài khoản", href: "/dashboard/admin/users", icon: Users },
  ];

  const companyMenuItems = [
    { label: "Bảng điều khiển", href: "/dashboard", icon: LayoutDashboard },
    { label: "Hồ sơ Công ty", href: "/dashboard/company/profile", icon: Building },
    { label: "Quản lý Nhân sự", href: "/dashboard/company/hr", icon: Users },
    { label: "Tin tuyển dụng", href: "/dashboard/jobs", icon: Briefcase },
    { label: "Quản lý Ứng viên", href: "/dashboard/applications", icon: Contact },
  ];

  const recruiterMenuItems = [
    { label: "Bảng điều khiển", href: "/dashboard", icon: LayoutDashboard },
    { label: "Tin tuyển dụng", href: "/dashboard/jobs", icon: Briefcase },
    { label: "Quản lý Ứng viên", href: "/dashboard/applications", icon: Contact },
  ];

  const candidateMenuItems = [
    { label: "Bảng điều khiển", href: "/dashboard", icon: LayoutDashboard },
    { label: "Hồ sơ cá nhân", href: "/dashboard/profile", icon: Users },
    { label: "Quản lý CV", href: "/dashboard/resumes", icon: FileText },
    { label: "Việc đã ứng tuyển", href: "/dashboard/applied", icon: Briefcase },
  ];

  let menuItems: any[] = [];
  let roleTitle = "";
  if (isAdmin) {
    menuItems = adminMenuItems;
    roleTitle = "Quản trị viên";
  } else if (isCompany) {
    menuItems = companyMenuItems;
    roleTitle = "Công ty";
  } else if (isRecruiter) {
    menuItems = recruiterMenuItems;
    roleTitle = "Nhà tuyển dụng";
  } else if (isCandidate) {
    menuItems = candidateMenuItems;
    roleTitle = "Ứng viên";
  }

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col hidden md:flex shrink-0">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="size-10 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-md">
            AI
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">Dashboard</h1>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-2">
            {roleTitle}
          </div>
          {menuItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname?.startsWith(item.href));
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-blue-600 text-white font-medium shadow-md shadow-blue-900/20' : 'hover:bg-slate-800 hover:text-white'}`}
              >
                <item.icon className="size-5 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-slate-800 hover:text-white">
            <Home className="size-5 shrink-0" /> Về Trang chủ
          </Link>
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-red-400 hover:bg-red-500/10 hover:text-red-300">
            <LogOut className="size-5 shrink-0" /> Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 shrink-0 shadow-sm">
          <h2 className="font-semibold text-slate-800">
            Bảng điều khiển {roleTitle}
          </h2>
          <div className="flex items-center gap-3">
             <div className="size-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
               {user?.email.charAt(0).toUpperCase()}
             </div>
             <span className="text-sm font-medium text-slate-700">{user?.email}</span>
          </div>
        </header>
        
        <main className="flex-1 overflow-auto p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
