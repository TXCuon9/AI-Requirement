"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { fetchApi } from "../lib/api";
import { useAuth } from "../lib/authContext";
import { Search, ChevronDown, Flame, BriefcaseBusiness, Building2, Wrench, FileText } from "lucide-react";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [avatar, setAvatar] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/jobs?keyword=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const isActive = (path: string) => pathname === path || pathname?.startsWith(path + '/');

  return (
    <header className="sticky top-0 z-50 w-full bg-white">
      {/* Tier 1: Logo + Search + Auth */}
      <div className="border-b border-slate-100">
        <div className="container mx-auto px-4 h-[72px] flex items-center justify-between gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="size-10 rounded-xl bg-gradient-to-br from-[#E52329] to-[#ff6b6b] flex items-center justify-center text-white font-black text-lg shadow-lg shadow-red-500/20">
              AI
            </div>
            <div className="hidden sm:block">
              <span className="font-extrabold text-xl tracking-tight text-slate-900">Recruitment</span>
              <span className="block text-[10px] text-slate-400 font-medium -mt-0.5 tracking-wider">SMART HIRING PLATFORM</span>
            </div>
          </Link>

          {/* Search Bar - Pill Style */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-[500px]">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Vị trí tuyển dụng, công ty..."
                className="w-full h-11 pl-5 pr-12 rounded-full border-2 border-[#4876EF] bg-white text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#E52329] focus:ring-2 focus:ring-red-100 transition-all"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 size-8 rounded-full bg-[#4876EF] hover:bg-[#3a62d4] text-white flex items-center justify-center transition-colors"
              >
                <Search className="size-4" />
              </button>
            </div>
          </form>

          {/* Auth / Profile */}
          <div className="flex items-center gap-3 shrink-0">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2">
                  {avatar ? (
                    <img src={avatar} alt="Avatar" className="size-8 rounded-full object-cover border-2 border-slate-200" />
                  ) : (
                    <div className="size-8 rounded-full bg-gradient-to-br from-[#4876EF] to-[#6b8df7] flex items-center justify-center text-white font-semibold text-sm">
                      {user?.email.charAt(0).toUpperCase()}
                    </div>
                  )}
                  {user?.role !== "CANDIDATE" && (
                    <span className="text-sm font-medium text-slate-700">{user?.email}</span>
                  )}
                </div>
                {user?.role === "ADMIN" && (
                  <Link href="/admin" className="text-xs font-bold bg-slate-900 text-white px-3 py-1.5 rounded-full hover:bg-slate-800 transition-colors">
                    Admin
                  </Link>
                )}
                {(user?.role === "RECRUITER" || user?.role === "COMPANY" || user?.role === "ADMIN") && (
                  <Link href="/dashboard" className="text-xs font-bold bg-[#4876EF]/10 text-[#4876EF] px-3 py-1.5 rounded-full hover:bg-[#4876EF]/20 transition-colors">
                    Dashboard
                  </Link>
                )}
                <button onClick={logout} className="text-xs font-medium text-slate-400 hover:text-red-500 transition-colors">
                  Đăng xuất
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/register?type=company" className="hidden lg:flex text-xs font-semibold text-[#4876EF] items-center gap-1.5 hover:text-[#3a62d4] transition-colors">
                  <BriefcaseBusiness className="size-3.5" />
                  Nhà tuyển dụng
                </Link>
                <span className="hidden lg:block w-px h-4 bg-slate-300"></span>
                <Link href="/login" className="text-sm font-semibold text-[#4876EF] flex items-center gap-1.5 hover:text-[#3a62d4] transition-colors">
                  <div className="size-5 bg-[#4876EF]/10 rounded-full flex items-center justify-center">
                    <svg width="10" height="10" viewBox="0 0 14 14" fill="currentColor"><path d="M7 7.27c2 0 3.636-1.635 3.636-3.635S9 0 7 0 3.366 1.635 3.366 3.635 5 7.27 7 7.27z"/><path d="M13.24 10.175a7.5 7.5 0 0 0-.366-.667A5.3 5.3 0 0 0 9.747 7.54a.7.7 0 0 0-.46.111A4.3 4.3 0 0 1 7 8.397a4.3 4.3 0 0 1-2.285-.746.6.6 0 0 0-.46-.111 5.3 5.3 0 0 0-3.127 1.968c-.143.207-.27.445-.365.667a.4.4 0 0 0 .016.302c.127.222.286.444.429.635.222.302.46.572.73.826.222.222.476.429.667.572A7.35 7.35 0 0 0 7 14a7.35 7.35 0 0 0 4.395-1.428c.19-.159.445-.365.667-.572.27-.254.508-.524.73-.826.143-.19.302-.413.429-.635a.4.4 0 0 0 .016-.302z"/></svg>
                  </div>
                  Đăng nhập
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tier 2: Navigation Menu */}
      <div className="shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
        <div className="container mx-auto px-4 flex items-center gap-1">
          {/* Nav Items */}
          <NavItem href="/" icon={<Flame className="size-3.5" />} label="Công việc hot" active={pathname === '/'} hasDropdown>
            <DropdownMenu>
              <DropdownItem href="/jobs?ordering=salary_desc" label="Top việc lương cao" />
              <DropdownItem href="/jobs?location=Hà Nội" label="Việc làm Hà Nội" />
              <DropdownItem href="/jobs?location=Hồ Chí Minh" label="Việc làm Hồ Chí Minh" />
              <DropdownItem href="/jobs?location=Đà Nẵng" label="Việc làm Đà Nẵng" />
            </DropdownMenu>
          </NavItem>
          <NavItem href="/jobs" label="Việc làm" active={isActive('/jobs')} />
          <NavItem href="/companies" icon={<Building2 className="size-3.5" />} label="Công ty" active={isActive('/companies')} />
          <NavItem href="/cv" icon={<FileText className="size-3.5" />} label="Hồ sơ & CV" active={isActive('/cv') || isActive('/profile') || isActive('/templates')} hasDropdown>
            <DropdownMenu>
              <DropdownItem href="/cv" label="Quản lý CV" />
              <DropdownItem href="/templates" label="Tạo CV từ mẫu" />
              <DropdownItem href="/profile" label="Hồ sơ Online" />
            </DropdownMenu>
          </NavItem>
          <NavItem href="#" icon={<Wrench className="size-3.5" />} label="Công cụ" active={false} />
        </div>
      </div>
    </header>
  );
}

/* Sub-components */
function NavItem({ href, icon, label, active, hasDropdown, children }: {
  href: string; icon?: React.ReactNode; label: string; active: boolean; hasDropdown?: boolean; children?: React.ReactNode;
}) {
  return (
    <div className="group relative">
      <Link
        href={href}
        className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
          active
            ? 'text-[#E52329] border-[#E52329]'
            : 'text-slate-600 border-transparent hover:text-[#E52329] hover:border-[#E52329]'
        }`}
      >
        {icon && <span className={active ? 'text-[#E52329]' : 'text-[#4876EF]'}>{icon}</span>}
        {label}
        {hasDropdown && <ChevronDown className="size-3.5 ml-0.5 opacity-50" />}
      </Link>
      {children}
    </div>
  );
}

function DropdownMenu({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute left-0 top-full pt-0.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
      <div className="bg-white rounded-xl shadow-xl border border-slate-100 p-2 min-w-[220px]">
        {children}
      </div>
    </div>
  );
}

function DropdownItem({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="block px-4 py-2.5 text-sm text-slate-600 hover:text-[#E52329] hover:bg-red-50 rounded-lg font-medium transition-colors"
    >
      {label}
    </Link>
  );
}
