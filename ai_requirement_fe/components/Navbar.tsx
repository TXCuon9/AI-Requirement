"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { fetchApi } from "../lib/api";
import { useAuth } from "../lib/authContext";
import { FileText, ArrowRight, TrendingUp, Star, Briefcase, Code2, DollarSign, UploadCloud, CheckCircle2, Settings } from "lucide-react";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const pathname = usePathname();
  const [avatar, setAvatar] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated && user?.role === "CANDIDATE") {
      fetchApi("/candidate/profile")
        .then((data) => {
          if (data && data.avatarUrl) {
            setAvatar(data.avatarUrl);
          }
        })
        .catch((err) => console.error("Error fetching avatar:", err));
    }
  }, [isAuthenticated, user]);

  const getLinkClass = (path: string) => {
    return pathname === path || pathname?.startsWith(path + '/')
      ? "text-base font-semibold text-blue-600"
      : "text-base font-medium text-slate-700 hover:text-blue-600 transition-colors";
  };
  
  const isCvActive = pathname === "/cv" || pathname === "/profile";

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-200 shadow-sm">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center gap-10">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="size-10 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-md">
              AI
            </div>
            <span className="font-bold text-2xl tracking-tight text-blue-900 hidden sm:block">Recruitment</span>
          </Link>
          
          {/* Main Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/jobs" className={getLinkClass("/jobs")}>
              Việc làm
            </Link>
            
            {/* Dropdown for CV */}
            <div className="relative group">
              <button className={`${isCvActive ? 'text-base font-semibold text-blue-600' : 'text-base font-medium text-slate-700 hover:text-blue-600 transition-colors'} flex items-center gap-1 py-4`}>
                Hồ sơ & CV
                <svg className="w-4 h-4 ml-0.5 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>
              <div className="absolute left-0 top-full pt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <div className="bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-slate-100 p-6 w-[550px] flex gap-8">
                  {/* Left Column */}
                  <div className="flex-1 space-y-6">
                    <div>
                      <h4 className="text-blue-600 font-semibold mb-3 flex items-center gap-2">Mẫu CV theo style <ArrowRight className="size-4" /></h4>
                      <ul className="space-y-3">
                         <li><Link href="/templates" className="text-sm font-medium text-slate-600 hover:text-blue-600 flex items-center gap-2"><div className="size-5 bg-slate-100 rounded flex items-center justify-center"><FileText className="size-3" /></div> Mẫu CV Đơn giản</Link></li>
                         <li><Link href="/templates" className="text-sm font-medium text-slate-600 hover:text-blue-600 flex items-center gap-2"><div className="size-5 bg-slate-100 rounded flex items-center justify-center"><TrendingUp className="size-3" /></div> Mẫu CV Ấn tượng</Link></li>
                         <li><Link href="/templates" className="text-sm font-medium text-slate-600 hover:text-blue-600 flex items-center gap-2"><div className="size-5 bg-slate-100 rounded flex items-center justify-center"><Star className="size-3" /></div> Mẫu CV Chuyên nghiệp</Link></li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-blue-600 font-semibold mb-3 flex items-center gap-2">Mẫu CV theo vị trí <ArrowRight className="size-4" /></h4>
                      <ul className="space-y-3">
                         <li><Link href="/templates" className="text-sm font-medium text-slate-600 hover:text-blue-600 flex items-center gap-2"><div className="size-5 bg-slate-100 rounded flex items-center justify-center"><Briefcase className="size-3" /></div> Nhân viên kinh doanh</Link></li>
                         <li><Link href="/templates" className="text-sm font-medium text-slate-600 hover:text-blue-600 flex items-center gap-2"><div className="size-5 bg-slate-100 rounded flex items-center justify-center"><Code2 className="size-3" /></div> Lập trình viên</Link></li>
                         <li><Link href="/templates" className="text-sm font-medium text-slate-600 hover:text-blue-600 flex items-center gap-2"><div className="size-5 bg-slate-100 rounded flex items-center justify-center"><DollarSign className="size-3" /></div> Nhân viên kế toán</Link></li>
                      </ul>
                    </div>
                  </div>
                  
                  {/* Divider */}
                  <div className="w-[1px] bg-slate-100"></div>
                  
                  {/* Right Column */}
                  <div className="flex-1">
                    <ul className="space-y-4">
                       <li>
                         <Link href="/cv" className="flex items-center gap-3 group/link">
                            <div className="size-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center group-hover/link:bg-blue-600 group-hover/link:text-white transition-colors"><FileText className="size-4" /></div>
                            <span className="text-sm font-medium text-slate-700 group-hover/link:text-blue-600 transition-colors">Quản lý CV</span>
                         </Link>
                       </li>
                       <li>
                         <Link href="/cv" className="flex items-center gap-3 group/link">
                            <div className="size-8 bg-slate-50 text-slate-600 rounded-lg flex items-center justify-center group-hover/link:bg-blue-600 group-hover/link:text-white transition-colors"><UploadCloud className="size-4" /></div>
                            <span className="text-sm font-medium text-slate-700 group-hover/link:text-blue-600 transition-colors">Tải CV lên</span>
                         </Link>
                       </li>
                       <li>
                         <Link href="/profile" className="flex items-center gap-3 group/link">
                            <div className="size-8 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center group-hover/link:bg-emerald-600 group-hover/link:text-white transition-colors"><CheckCircle2 className="size-4" /></div>
                            <span className="text-sm font-medium text-slate-700 group-hover/link:text-emerald-600 transition-colors">Hồ sơ Online</span>
                         </Link>
                       </li>
                       <li>
                         <Link href="/templates" className="flex items-center gap-3 group/link">
                            <div className="size-8 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center group-hover/link:bg-purple-600 group-hover/link:text-white transition-colors"><Settings className="size-4" /></div>
                            <span className="text-sm font-medium text-slate-700 group-hover/link:text-purple-600 transition-colors">Tạo CV từ mẫu</span>
                         </Link>
                       </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <Link href="/companies" className={getLinkClass("/companies")}>
              Công ty
            </Link>
            <Link href="#" className="text-base font-medium text-slate-700 hover:text-blue-600 transition-colors">
              Công cụ
            </Link>
          </nav>
        </div>

        {/* Auth/Profile */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2">
                {avatar ? (
                  <img src={avatar} alt="Avatar" className="size-8 rounded-full object-cover border border-slate-200" />
                ) : (
                  <div className="size-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-medium">
                    {user?.email.charAt(0).toUpperCase()}
                  </div>
                )}
                {user?.role !== "CANDIDATE" && (
                  <span className="text-sm font-medium">{user?.email}</span>
                )}
              </div>
              {user?.role === "ADMIN" && (
                <Link
                  href="/admin"
                  className="text-sm font-semibold bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors shadow-md"
                >
                  Admin Panel
                </Link>
              )}
              {(user?.role === "RECRUITER" || user?.role === "COMPANY" || user?.role === "ADMIN") && (
                <Link
                  href="/dashboard"
                  className="text-sm font-semibold bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  Bảng điều khiển
                </Link>
              )}
              <button
                onClick={logout}
                className="text-sm font-medium text-slate-500 hover:text-red-500 transition-colors"
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            <>
              <Link 
                href="/login" 
                className="hidden sm:block text-sm font-semibold text-slate-700 border border-slate-300 px-5 py-2.5 rounded-lg hover:bg-slate-50 hover:text-blue-600 hover:border-blue-300 transition-all"
              >
                Đăng nhập
              </Link>
              <Link
                href="/register"
                className="text-sm font-semibold bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-all shadow-md shadow-blue-600/20"
              >
                Đăng ký
              </Link>
              <Link
                href="/register?type=company"
                className="hidden lg:flex text-sm font-semibold bg-slate-900 text-white px-5 py-2.5 rounded-lg hover:bg-slate-800 transition-all shadow-md"
              >
                Nhà tuyển dụng
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
