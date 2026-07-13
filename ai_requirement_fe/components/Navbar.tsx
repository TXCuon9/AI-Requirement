"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { fetchApi } from "../lib/api";
import { useAuth } from "../lib/authContext";
import { ChevronDown, Building2, ShieldCheck, X, Menu, Bell, User as UserIcon, LayoutDashboard, FileText, Briefcase, ShoppingCart, Settings, LogOut, ChevronRight } from "lucide-react";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [avatar, setAvatar] = useState<string | null>(null);
  const [fullName, setFullName] = useState<string | null>(null);
  const [showTopBanner, setShowTopBanner] = useState(true);

  useEffect(() => {
    if (isAuthenticated && user?.role === "CANDIDATE") {
      fetchApi("/candidate/profile")
        .then((data) => {
          if (data) {
            if (data.avatarUrl) setAvatar(data.avatarUrl);
            if (data.fullName) setFullName(data.fullName);
          }
        })
        .catch((err) => console.warn("Error fetching avatar:", err));
    }
  }, [isAuthenticated, user]);

  return (
    <header className="w-full flex flex-col z-50 sticky top-0">
      {/* Top Banner Warning */}
      {showTopBanner && (
        <div className="bg-[#1161ed] text-white text-sm py-2 px-4 flex items-center justify-between">
          <div className="flex-1 flex justify-center items-center gap-2">
            <ShieldCheck className="size-4" />
            <span>Hãy bảo vệ chính mình trước các trường hợp mạo danh AI Recruitment.</span>
            <Link href="#" className="underline font-medium hover:text-blue-200 transition-colors">Xem thêm</Link>
          </div>
          <button onClick={() => setShowTopBanner(false)} className="text-white hover:text-blue-200 transition-colors p-1">
            <X className="size-5" />
          </button>
        </div>
      )}

      {/* Main Navbar */}
      <div className="bg-[#0b1c47] h-[64px] flex items-center">
        <div className="container relative mx-auto px-4 max-w-7xl flex items-center justify-between w-full">
          
          {/* Left: Logo */}
          <Link href="/" className="flex flex-col text-white mr-8">
            <span className="font-semibold text-2xl tracking-tight leading-none mb-0.5">AI Recruitment</span>
            <span className="text-[10px] text-blue-200 uppercase tracking-widest">Empower growth</span>
          </Link>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            
            {/* inTECH fake logo */}
            <div className="hidden lg:flex flex-col text-white mr-4 text-right">
              <span className="text-[10px] leading-none mb-0.5 opacity-80">AI Recruitment</span>
              <span className="text-sm font-black italic">inTECH</span>
            </div>

            {/* Tất cả danh mục Button */}
            <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 text-white hover:bg-white/10 transition-colors cursor-pointer group">
              <Menu className="size-4" />
              <span className="text-sm font-medium">Tất cả danh mục</span>
              
              {/* Dropdown for Tất cả danh mục */}
              <div className="absolute left-0 right-0 top-full pt-[20px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 w-full cursor-default">
                <div className="bg-white rounded-xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] border-4 border-[#0b1c47] p-0 text-gray-800 flex overflow-hidden text-left min-h-[400px]">
                  
                  {/* Left Panel (Categories) */}
                  <div className="flex-[3] p-8 grid grid-cols-3 gap-8 bg-white">
                    {/* Column 1 */}
                    <div>
                      <h3 className="text-[#0b1c47] font-bold text-lg mb-4">Việc làm</h3>
                      <ul className="space-y-2">
                        <li><Link href="/jobs" className="block py-1.5 text-[15px] text-slate-700 hover:text-[var(--vw-blue)] hover:bg-slate-50 rounded px-2 -mx-2 transition-colors">Việc làm mới nhất</Link></li>
                        <li><Link href="/jobs" className="block py-1.5 text-[15px] text-slate-700 hover:text-[var(--vw-blue)] bg-slate-100 hover:bg-slate-200 rounded px-2 -mx-2 transition-colors font-medium">Tìm việc làm</Link></li>
                        <li><Link href="/jobs" className="block py-1.5 text-[15px] text-slate-700 hover:text-[var(--vw-blue)] hover:bg-slate-50 rounded px-2 -mx-2 transition-colors">Việc làm quản lý</Link></li>
                      </ul>
                      
                      <h3 className="text-[#0b1c47] font-bold text-lg mt-10 mb-4">Khám phá</h3>
                      <ul className="space-y-2">
                        <li><Link href="/wowcv" className="block py-1.5 text-[15px] text-slate-700 hover:text-[var(--vw-blue)] hover:bg-slate-50 rounded px-2 -mx-2 transition-colors">WowCV - Thư viện CV mẫu</Link></li>
                        <li><Link href="/cv" className="block py-1.5 text-[15px] text-slate-700 hover:text-[var(--vw-blue)] hover:bg-slate-50 rounded px-2 -mx-2 transition-colors">Quản lý CV</Link></li>
                        <li><Link href="#" className="block py-1.5 text-[15px] text-slate-700 hover:text-[var(--vw-blue)] hover:bg-slate-50 rounded px-2 -mx-2 transition-colors">Lộ trình sự nghiệp</Link></li>
                      </ul>
                    </div>
                    
                    {/* Column 2 */}
                    <div>
                      <h3 className="text-[#0b1c47] font-bold text-lg mb-4">Việc của tôi</h3>
                      <ul className="space-y-2">
                        <li><Link href="/saved-jobs" className="block py-1.5 text-[15px] text-slate-700 hover:text-[var(--vw-blue)] hover:bg-slate-50 rounded px-2 -mx-2 transition-colors">Việc đã lưu</Link></li>
                        <li><Link href="/profile" className="block py-1.5 text-[15px] text-slate-700 hover:text-[var(--vw-blue)] hover:bg-slate-50 rounded px-2 -mx-2 transition-colors">Việc đã ứng tuyển</Link></li>
                        <li><Link href="/profile" className="block py-1.5 text-[15px] text-slate-700 hover:text-[var(--vw-blue)] hover:bg-slate-50 rounded px-2 -mx-2 transition-colors">Thông báo việc làm</Link></li>
                        <li><Link href="/profile" className="block py-1.5 text-[15px] text-slate-700 hover:text-[var(--vw-blue)] hover:bg-slate-50 rounded px-2 -mx-2 transition-colors">Việc dành cho bạn</Link></li>
                      </ul>
                      
                      <div className="mt-10">
                        <ul className="space-y-2">
                          <li><Link href="#" className="block py-1.5 text-[15px] text-slate-700 hover:text-[var(--vw-blue)] hover:bg-slate-50 rounded px-2 -mx-2 transition-colors">Báo cáo lương</Link></li>
                          <li><Link href="#" className="block py-1.5 text-[15px] text-slate-700 hover:text-[var(--vw-blue)] hover:bg-slate-50 rounded px-2 -mx-2 transition-colors">Công cụ tính lương</Link></li>
                          <li><Link href="#" className="block py-1.5 text-[15px] text-slate-700 hover:text-[var(--vw-blue)] hover:bg-slate-50 rounded px-2 -mx-2 transition-colors">Trạm sạc</Link></li>
                        </ul>
                      </div>
                    </div>

                    {/* Column 3 */}
                    <div>
                      <h3 className="text-[#0b1c47] font-bold text-lg mb-4">Công ty</h3>
                      <ul className="space-y-2">
                        <li><Link href="/companies" className="block py-1.5 text-[15px] text-slate-700 hover:text-[var(--vw-blue)] hover:bg-slate-50 rounded px-2 -mx-2 transition-colors">Tất cả công ty</Link></li>
                      </ul>
                      
                      <div className="mt-[168px]">
                        <ul className="space-y-2">
                          <li><Link href="#" className="block py-1.5 text-[15px] text-slate-700 hover:text-[var(--vw-blue)] hover:bg-slate-50 rounded px-2 -mx-2 transition-colors">Câu hỏi phỏng vấn</Link></li>
                          <li><Link href="#" className="block py-1.5 text-[15px] text-slate-700 hover:text-[var(--vw-blue)] hover:bg-slate-50 rounded px-2 -mx-2 transition-colors">Nhân số học</Link></li>
                          <li><Link href="#" className="block py-1.5 text-[15px] text-slate-700 hover:text-[var(--vw-blue)] hover:bg-slate-50 rounded px-2 -mx-2 transition-colors">Career newbies</Link></li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Right Panel (AI Recruitment inTECH) */}
                  <div className="flex-[1.2] bg-[#f8fbff] border-l border-slate-200 p-8 flex flex-col relative overflow-hidden">
                    <h3 className="text-[#0b1c47] font-bold text-lg mb-4">AI Recruitment inTECH</h3>
                    <ul className="space-y-2 mb-8 relative z-10">
                      <li><Link href="#" className="block py-1.5 text-[15px] text-slate-700 hover:text-[var(--vw-blue)] hover:bg-blue-50 rounded px-2 -mx-2 transition-colors">IT Jobs</Link></li>
                      <li><Link href="#" className="block py-1.5 text-[15px] text-slate-700 hover:text-[var(--vw-blue)] hover:bg-blue-50 rounded px-2 -mx-2 transition-colors">IT Hub</Link></li>
                    </ul>
                    
                    <div className="mt-auto rounded-xl overflow-hidden shadow-md relative group/banner cursor-pointer border border-[#0b1c47]/10 z-10">
                      <div className="absolute inset-0 bg-gradient-to-r from-[#031548] to-[#123185] z-0"></div>
                      <div className="relative z-10 p-6 flex flex-col h-full justify-between min-h-[160px]">
                         <div className="flex items-center gap-2 text-white/80 text-xs font-semibold uppercase tracking-wider mb-2">
                            <span>AI Recruitment</span>
                            <span className="font-black italic text-white">inTECH</span>
                         </div>
                         <h4 className="text-white text-xl font-bold leading-tight w-3/4">AI Recruitment inTECH</h4>
                         <p className="text-blue-200 text-xs mt-1">Thương hiệu việc làm & tuyển dụng IT</p>
                         <button className="bg-[#ff7d55] text-white text-xs font-bold py-1.5 px-4 rounded-full self-end mt-4 hover:bg-[#e66f00] transition-colors shadow-lg">XEM THÊM</button>
                      </div>
                    </div>
                    
                    {/* Decorative background circle */}
                    <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-50 z-0"></div>
                  </div>
                  
                </div>
              </div>
            </div>

            {/* Right Action Button based on Role */}
            {!isAuthenticated ? (
              <Link href="/register?type=company" className="hidden sm:flex items-center px-4 py-2 rounded-full border border-white/20 text-white hover:bg-white/10 transition-colors text-sm font-medium">
                Dành cho Nhà tuyển dụng
              </Link>
            ) : user?.role === "ADMIN" ? (
              <Link href="/admin" className="hidden sm:flex items-center px-4 py-2 rounded-full border border-[var(--vw-orange)] text-[var(--vw-orange)] hover:bg-orange-500/10 transition-colors text-sm font-bold bg-white/5">
                <ShieldCheck className="size-4 mr-2" /> Bảng điều khiển Admin
              </Link>
            ) : (user?.role === "COMPANY" || user?.role === "RECRUITER") ? (
              <Link href="/dashboard" className="hidden sm:flex items-center px-4 py-2 rounded-full border border-[var(--vw-blue)] text-blue-300 hover:bg-blue-500/10 transition-colors text-sm font-bold bg-white/5">
                Bảng điều khiển NTD
              </Link>
            ) : null}

            {/* Language Switch */}
            <div className="size-9 rounded-full bg-[#1161ed] text-white flex items-center justify-center font-bold text-xs cursor-pointer hover:bg-blue-600 transition-colors">
              Vi
            </div>

            {/* Notification */}
            <div className="size-9 rounded-full bg-[#1161ed] text-white flex items-center justify-center cursor-pointer hover:bg-blue-600 transition-colors">
              <Bell className="size-4" />
            </div>

            {/* User Account */}
            <div className="group relative">
              <div className="size-9 rounded-full bg-[#1161ed] text-white flex items-center justify-center cursor-pointer hover:bg-blue-600 transition-colors overflow-hidden">
                {isAuthenticated && avatar ? (
                  <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <UserIcon className="size-5" />
                )}
              </div>

              {/* User Dropdown */}
              <div className="absolute right-0 top-full pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                {isAuthenticated ? (
                  <div className="bg-white rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.15)] border border-gray-100 w-[320px] overflow-hidden flex flex-col">
                    {/* Header */}
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                      <div className="flex-1 min-w-0 pr-3">
                        <h4 className="font-bold text-gray-800 text-[15px] truncate">{fullName || "Ứng viên"}</h4>
                        <p className="text-gray-500 text-[13px] truncate">{typeof window !== "undefined" ? localStorage.getItem("userEmail") || "user@email.com" : ""}</p>
                      </div>
                      <Link href="/profile" className="px-3 py-1.5 rounded border border-[var(--vw-orange)] text-[var(--vw-orange)] text-[13px] font-semibold hover:bg-orange-50 transition-colors whitespace-nowrap">
                        Cập nhật hồ sơ
                      </Link>
                    </div>
                    
                    {/* Menu Items */}
                    <div className="py-2 flex flex-col">
                      <Link href="/dashboard" className="flex items-center px-5 py-2.5 hover:bg-gray-50 transition-colors text-gray-700 group">
                        <LayoutDashboard className="size-[18px] mr-4 text-gray-500 group-hover:text-[var(--vw-blue)]" />
                        <span className="text-[14px] font-medium group-hover:text-[var(--vw-blue)]">Tổng Quan</span>
                      </Link>
                      <Link href="/profile" className="flex items-center px-5 py-2.5 hover:bg-gray-50 transition-colors text-gray-700 group">
                        <FileText className="size-[18px] mr-4 text-gray-500 group-hover:text-[var(--vw-blue)]" />
                        <span className="text-[14px] font-medium group-hover:text-[var(--vw-blue)]">Hồ Sơ Của Tôi</span>
                      </Link>
                      {(user?.role === "RECRUITER" || user?.role === "COMPANY" || user?.role === "ADMIN") && (
                        <Link href="/company-profile" className="flex items-center px-5 py-2.5 hover:bg-gray-50 transition-colors text-gray-700 group">
                          <Building2 className="size-[18px] mr-4 text-gray-500 group-hover:text-[var(--vw-blue)]" />
                          <span className="text-[14px] font-medium group-hover:text-[var(--vw-blue)]">Công Ty Của Tôi</span>
                        </Link>
                      )}
                      <Link href="/my-jobs" className="flex items-center px-5 py-2.5 hover:bg-gray-50 transition-colors text-gray-700 group">
                        <Briefcase className="size-[18px] mr-4 text-gray-500 group-hover:text-[var(--vw-blue)]" />
                        <span className="text-[14px] font-medium group-hover:text-[var(--vw-blue)]">Việc Làm Của Tôi</span>
                      </Link>
                      <Link href="/job-alerts" className="flex items-center px-5 py-2.5 hover:bg-gray-50 transition-colors text-gray-700 group">
                        <Bell className="size-[18px] mr-4 text-gray-500 group-hover:text-[var(--vw-blue)]" />
                        <span className="text-[14px] font-medium group-hover:text-[var(--vw-blue)]">Thông Báo Việc Làm</span>
                      </Link>
                      <Link href="/orders" className="flex items-center px-5 py-2.5 hover:bg-gray-50 transition-colors text-gray-700 group">
                        <ShoppingCart className="size-[18px] mr-4 text-gray-500 group-hover:text-[var(--vw-blue)]" />
                        <span className="text-[14px] font-medium group-hover:text-[var(--vw-blue)]">Quản Lý Đơn Hàng</span>
                      </Link>
                      <Link href="/settings" className="flex items-center px-5 py-2.5 hover:bg-gray-50 transition-colors text-gray-700 group">
                        <Settings className="size-[18px] mr-4 text-gray-500 group-hover:text-[var(--vw-blue)]" />
                        <span className="text-[14px] font-medium group-hover:text-[var(--vw-blue)]">Quản Lý Tài Khoản</span>
                      </Link>
                      <button onClick={logout} className="w-full text-left flex items-center px-5 py-2.5 hover:bg-gray-50 transition-colors text-gray-700 group">
                        <LogOut className="size-[18px] mr-4 text-gray-500 group-hover:text-red-500" />
                        <span className="text-[14px] font-medium group-hover:text-red-500">Thoát</span>
                      </button>
                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t border-gray-100 flex items-center justify-between hover:bg-blue-50 cursor-pointer transition-colors group">
                      <span className="text-[14px] text-[var(--vw-blue)] font-medium">Tham khảo những câu hỏi thường gặp</span>
                      <ChevronRight className="size-4 text-[var(--vw-blue)] group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-lg shadow-lg border border-gray-100 py-2 w-48">
                    <Link href="/login" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[var(--vw-blue)]">Đăng nhập</Link>
                    <Link href="/register" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[var(--vw-blue)]">Đăng ký</Link>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </header>
  );
}
