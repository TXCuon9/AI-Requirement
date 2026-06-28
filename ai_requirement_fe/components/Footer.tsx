import Link from "next/link";
import { Send } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 font-sans mt-auto">
      {/* Newsletter Section */}
      <div className="border-b border-slate-800">
        <div className="container mx-auto px-4 max-w-6xl py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">Đăng ký nhận thông báo việc làm mới</h3>
            <p className="text-slate-400 text-sm">Nhận ngay các cơ hội việc làm hấp dẫn nhất mỗi tuần qua email.</p>
          </div>
          <form className="flex gap-2 w-full md:w-auto" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Nhập email của bạn..."
              className="h-11 px-5 rounded-full bg-slate-800 border border-slate-700 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#E52329] focus:ring-2 focus:ring-red-900/30 transition-all flex-1 md:w-[300px]"
            />
            <button type="submit" className="h-11 px-6 rounded-full bg-[#E52329] hover:bg-[#c91f24] text-white font-semibold text-sm flex items-center gap-2 transition-colors shadow-lg shadow-red-900/20">
              <Send className="size-4" /> Đăng ký
            </button>
          </form>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 max-w-6xl pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Column 1: Brand & Contact */}
          <div className="space-y-6">
            <div>
              <Link href="/" className="flex items-center gap-2 mb-3">
                <div className="size-10 rounded-xl bg-gradient-to-br from-[#E52329] to-[#ff6b6b] flex items-center justify-center text-white font-black text-lg">
                  AI
                </div>
                <span className="text-xl font-extrabold text-white tracking-tight">Recruitment</span>
              </Link>
              <p className="text-sm text-slate-400">Nền tảng tuyển dụng thông minh ứng dụng AI.</p>
            </div>
            
            <div className="space-y-2.5 text-sm">
              <h3 className="font-bold text-white text-sm mb-3 uppercase tracking-wider">Liên hệ</h3>
              <p>Hotline: <span className="font-semibold text-white">1900 000 000</span></p>
              <p>Email: <a href="mailto:hotro@airecruitment.vn" className="text-[#4876EF] hover:underline font-medium">hotro@airecruitment.vn</a></p>
            </div>
            
            {/* Social */}
            <div className="flex gap-3 mt-4">
              <a href="#" className="size-9 rounded-lg bg-slate-800 hover:bg-[#4876EF] text-slate-400 hover:text-white flex items-center justify-center transition-all">
                <svg className="size-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="#" className="size-9 rounded-lg bg-slate-800 hover:bg-[#4876EF] text-slate-400 hover:text-white flex items-center justify-center transition-all">
                <svg className="size-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
              <a href="#" className="size-9 rounded-lg bg-slate-800 hover:bg-[#E52329] text-slate-400 hover:text-white flex items-center justify-center transition-all">
                <svg className="size-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
            </div>
          </div>
          
          {/* Column 2 */}
          <div>
            <h3 className="font-bold text-white text-sm mb-5 uppercase tracking-wider">Về AI Recruitment</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="#" className="hover:text-[#E52329] transition-colors">Giới thiệu</Link></li>
              <li><Link href="#" className="hover:text-[#E52329] transition-colors">Góc báo chí</Link></li>
              <li><Link href="#" className="hover:text-[#E52329] transition-colors">Tuyển dụng</Link></li>
              <li><Link href="#" className="hover:text-[#E52329] transition-colors">Liên hệ</Link></li>
              <li><Link href="#" className="hover:text-[#E52329] transition-colors">Chính sách bảo mật</Link></li>
              <li><Link href="#" className="hover:text-[#E52329] transition-colors">Điều khoản dịch vụ</Link></li>
            </ul>
          </div>
          
          {/* Column 3 */}
          <div>
            <h3 className="font-bold text-white text-sm mb-5 uppercase tracking-wider">Dành cho ứng viên</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/jobs" className="hover:text-[#E52329] transition-colors">Việc làm mới nhất</Link></li>
              <li><Link href="/cv" className="hover:text-[#E52329] transition-colors">Quản lý CV</Link></li>
              <li><Link href="/templates" className="hover:text-[#E52329] transition-colors">Tạo CV từ mẫu</Link></li>
              <li><Link href="/profile" className="hover:text-[#E52329] transition-colors">Hồ sơ Online</Link></li>
              <li><Link href="/companies" className="hover:text-[#E52329] transition-colors">Danh sách Công ty</Link></li>
            </ul>
          </div>
          
          {/* Column 4 */}
          <div>
            <h3 className="font-bold text-white text-sm mb-5 uppercase tracking-wider">Xây dựng sự nghiệp</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="#" className="hover:text-[#E52329] transition-colors">Việc làm tốt nhất</Link></li>
              <li><Link href="#" className="hover:text-[#E52329] transition-colors">Việc làm lương cao</Link></li>
              <li><Link href="#" className="hover:text-[#E52329] transition-colors">Việc làm IT</Link></li>
              <li><Link href="#" className="hover:text-[#E52329] transition-colors">Việc làm Senior</Link></li>
              <li><Link href="#" className="hover:text-[#E52329] transition-colors">Việc làm bán thời gian</Link></li>
            </ul>

            <h3 className="font-bold text-white text-sm mt-8 mb-5 uppercase tracking-wider">Ứng dụng</h3>
            <div className="flex gap-3">
              <div className="bg-slate-800 hover:bg-slate-700 text-white px-3 py-2 rounded-lg flex items-center gap-2 cursor-pointer transition-colors text-xs">
                <svg viewBox="0 0 384 512" fill="currentColor" className="size-5"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/></svg>
                <div className="leading-tight">
                  <div className="opacity-70" style={{fontSize: '9px'}}>Download on</div>
                  <div className="font-semibold">App Store</div>
                </div>
              </div>
              <div className="bg-slate-800 hover:bg-slate-700 text-white px-3 py-2 rounded-lg flex items-center gap-2 cursor-pointer transition-colors text-xs">
                <svg viewBox="0 0 512 512" fill="currentColor" className="size-5"><path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z"/></svg>
                <div className="leading-tight">
                  <div className="opacity-70" style={{fontSize: '9px'}}>GET IT ON</div>
                  <div className="font-semibold">Google Play</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-800 pt-6 text-center text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} AI Recruitment. Nền tảng tuyển dụng thông minh ứng dụng AI.</p>
        </div>
      </div>
    </footer>
  );
}
