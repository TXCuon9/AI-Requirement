"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, CheckSquare, LogOut, Home, UserCog, Search, Bell, Settings, Building, Briefcase } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../../lib/authContext";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== "ADMIN")) {
      router.push("/");
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading || !isAuthenticated || user?.role !== "ADMIN") return null;

  const navItems = [
    { label: "Bảng điều khiển", href: "/admin", icon: LayoutDashboard },
    { label: "Duyệt doanh nghiệp", href: "/admin/approvals", icon: CheckSquare },
    { label: "Quản lý Người dùng", href: "/admin/users", icon: UserCog },
    { label: "Quản lý Doanh nghiệp", href: "/admin/companies", icon: Building },
    { label: "Quản lý Việc làm", href: "/admin/jobs", icon: Briefcase },
  ];

  return (
    <div className="flex h-screen bg-[#f4f7fa] font-sans text-slate-900">
      
      {/* Sidebar (Premium Goyzer Style) */}
      <aside className="w-[260px] bg-white border-r border-slate-200 flex flex-col hidden md:flex shrink-0 z-20">
        {/* Logo Area */}
        <div className="h-[72px] px-6 border-b border-slate-100 flex items-center gap-3">
          <div className="size-8 rounded bg-[var(--vw-blue)] flex items-center justify-center text-white font-bold text-lg shadow-sm">
            AI
          </div>
          <div className="flex flex-col">
            <h1 className="text-[17px] font-bold text-slate-800 tracking-tight leading-none">Admin Panel</h1>
            <span className="text-[11px] text-slate-500 uppercase tracking-widest font-semibold mt-1">Super Admin</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 space-y-1.5 overflow-y-auto px-3">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3 px-3">
            Quản lý hệ thống
          </div>
          
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                  isActive 
                    ? 'bg-blue-50 text-[var(--vw-blue)] font-semibold border-l-4 border-[var(--vw-blue)] -ml-3 pl-[11px]' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-[var(--vw-blue)] font-medium'
                }`}
              >
                <item.icon className={`size-[18px] shrink-0 ${isActive ? 'text-[var(--vw-blue)]' : 'text-slate-400'}`} />
                <span className="text-[14px]">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 space-y-1.5">
          <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-slate-600 hover:bg-slate-50 hover:text-[var(--vw-blue)] font-medium">
            <Home className="size-[18px] shrink-0 text-slate-400" /> 
            <span className="text-[14px]">Trở lại website</span>
          </Link>
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-red-500 hover:bg-red-50 hover:text-red-600 font-medium text-left"
          >
            <LogOut className="size-[18px] shrink-0 text-red-400" /> 
            <span className="text-[14px]">Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 h-[72px] flex items-center justify-between px-6 lg:px-8 shrink-0 z-10">
          
          {/* Breadcrumb / Search */}
          <div className="flex items-center gap-6 flex-1">
            <h2 className="font-bold text-slate-800 text-[18px] hidden lg:block min-w-max">
              Dashboard Admin
            </h2>
            <div className="hidden md:flex items-center bg-slate-100 rounded-full px-4 py-2 w-full max-w-md border border-transparent focus-within:border-[var(--vw-blue)] focus-within:bg-white transition-colors">
              <Search className="size-4 text-slate-400 mr-2" />
              <input 
                type="text" 
                placeholder="Tìm kiếm tài khoản..." 
                className="bg-transparent border-none outline-none text-[14px] text-slate-700 w-full placeholder-slate-400"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-5 pl-4">
            <button className="relative text-slate-400 hover:text-[var(--vw-blue)] transition-colors">
              <Bell className="size-[22px]" />
            </button>
            <button className="text-slate-400 hover:text-[var(--vw-blue)] transition-colors">
              <Settings className="size-[22px]" />
            </button>
            
            {/* User Profile */}
            <div className="flex items-center gap-3 pl-5 border-l border-slate-200 cursor-pointer group">
               <div className="flex flex-col items-end hidden sm:flex">
                 <span className="text-[13px] font-bold text-slate-800 group-hover:text-[var(--vw-blue)] transition-colors">
                   {user?.email.split('@')[0]}
                 </span>
                 <span className="text-[11px] text-slate-500 uppercase">Quản trị viên</span>
               </div>
               <div className="size-[38px] rounded-full bg-gradient-to-r from-red-500 to-orange-500 text-white flex items-center justify-center font-bold shadow-sm border-2 border-white ring-1 ring-slate-200">
                 A
               </div>
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
