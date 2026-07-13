import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#0b1c47] border-t border-white/10 mt-auto font-sans text-sm">
      <div className="container mx-auto px-4 max-w-6xl py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          
          {/* Logo & Info */}
          <div className="lg:col-span-2 pr-8">
            <Link href="/" className="inline-block mb-4 flex flex-col text-white">
              <span className="font-semibold text-2xl tracking-tight leading-none mb-0.5">AI Recruitment</span>
              <span className="text-[10px] text-blue-200 uppercase tracking-widest">Empower growth</span>
            </Link>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Giải pháp đột phá ứng dụng Trí tuệ Nhân tạo (AI) giúp tối ưu hóa quá trình tuyển dụng và tìm kiếm việc làm, mang lại trải nghiệm xuất sắc cho cả ứng viên và nhà tuyển dụng.
            </p>
            <h3 className="font-bold text-white mb-3 text-[15px]">Theo dõi chúng tôi tại</h3>
            <div className="flex gap-4">
              {/* Fake Social Icons with VW styling */}
              <a href="#" className="size-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-[var(--vw-blue)] transition-colors">
                <svg className="size-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="#" className="size-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-[#ff0000] transition-colors">
                <svg className="size-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
            </div>
          </div>

          {/* Column 2 */}
          <div>
            <h3 className="font-bold text-white mb-4 text-[15px]">Dành cho Ứng viên</h3>
            <ul className="space-y-3">
              <li><Link href="#" className="text-gray-300 hover:text-blue-300 transition-colors">Việc làm mới nhất</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-blue-300 transition-colors">Việc làm IT</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-blue-300 transition-colors">Việc làm Senior</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-blue-300 transition-colors">Tạo CV</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-blue-300 transition-colors">Tư vấn nghề nghiệp</Link></li>
            </ul>
          </div>
          
          {/* Column 3 */}
          <div>
            <h3 className="font-bold text-white mb-4 text-[15px]">Dành cho Nhà tuyển dụng</h3>
            <ul className="space-y-3">
              <li><Link href="#" className="text-gray-300 hover:text-blue-300 transition-colors">Đăng tuyển dụng</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-blue-300 transition-colors">Tìm kiếm hồ sơ</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-blue-300 transition-colors">Giải pháp tuyển dụng</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-blue-300 transition-colors">Khảo sát lương</Link></li>
            </ul>
          </div>
          
          {/* Column 4 */}
          <div>
            <h3 className="font-bold text-white mb-4 text-[15px]">Về AI Recruitment</h3>
            <ul className="space-y-3">
              <li><Link href="#" className="text-gray-300 hover:text-blue-300 transition-colors">Giới thiệu</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-blue-300 transition-colors">Góc báo chí</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-blue-300 transition-colors">Liên hệ</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-blue-300 transition-colors">Quy định bảo mật</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-blue-300 transition-colors">Thỏa thuận sử dụng</Link></li>
            </ul>
          </div>
        </div>
        
        {/* Bottom */}
        <div className="border-t border-white/10 pt-8 mt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 text-[13px]">
            © {new Date().getFullYear()} AI Recruitment. Nền tảng công nghệ tuyển dụng số 1 Việt Nam.
          </p>
          <div className="flex gap-4 text-xs text-gray-400">
            <Link href="#" className="hover:text-blue-300 transition-colors">Quy định bảo mật</Link>
            <span className="text-white/20">|</span>
            <Link href="#" className="hover:text-blue-300 transition-colors">Thỏa thuận sử dụng</Link>
            <span className="text-white/20">|</span>
            <Link href="#" className="hover:text-blue-300 transition-colors">Quy chế hoạt động</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
