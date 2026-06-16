import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 pt-16 pb-8 text-slate-700 font-sans">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Column 1: Brand & Contact */}
          <div className="space-y-6">
            <div>
              <Link href="/" className="flex items-center gap-2 mb-2">
                <div className="size-10 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-md">
                  AI
                </div>
                <span className="text-2xl font-black text-slate-900 tracking-tight">Recruitment</span>
              </Link>
              <p className="text-sm font-semibold text-slate-600">Tiếp lợi thế, nối thành công</p>
            </div>
            
            <div className="space-y-2 text-sm mt-6">
              <h3 className="font-bold text-slate-900 text-base mb-3">Liên hệ</h3>
              <p>Hotline: <span className="font-semibold text-slate-800">1900 000 000</span> | Nhánh 2 (Giờ hành chính)</p>
              <p>Email: <a href="mailto:hotro@airecruitment.vn" className="text-blue-600 hover:underline font-medium">hotro@airecruitment.vn</a></p>
              <p>Zalo hỗ trợ ứng viên: <a href="#" className="font-semibold text-blue-600 hover:underline">Kết nối ngay →</a></p>
              <p>Fanpage: <a href="#" className="hover:text-blue-600 transition-colors font-medium">AI Recruitment Vietnam</a></p>
              <p>LinkedIn: <a href="#" className="hover:text-blue-600 transition-colors font-medium">AI Recruitment Vietnam</a></p>
              <p>Tiktok: <a href="#" className="hover:text-blue-600 transition-colors font-medium">AI Recruitment Vietnam</a></p>
            </div>
            
            <div className="mt-8">
              <h3 className="font-bold text-slate-900 text-base mb-3">Ứng dụng tải xuống</h3>
              <div className="flex flex-col gap-3">
                {/* App Store Mock */}
                <div className="bg-slate-900 text-white px-3 py-2 rounded-lg flex items-center gap-3 cursor-pointer hover:bg-slate-800 transition-colors w-[150px]">
                   <svg viewBox="0 0 384 512" fill="currentColor" className="size-6"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/></svg>
                   <div className="text-left leading-tight">
                      <div className="text-[10px] opacity-80">Download on the</div>
                      <div className="font-semibold text-sm">App Store</div>
                   </div>
                </div>
                {/* Google Play Mock */}
                <div className="bg-slate-900 text-white px-3 py-2 rounded-lg flex items-center gap-3 cursor-pointer hover:bg-slate-800 transition-colors w-[150px]">
                   <svg viewBox="0 0 512 512" fill="currentColor" className="size-6"><path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z"/></svg>
                   <div className="text-left leading-tight">
                      <div className="text-[10px] opacity-80">GET IT ON</div>
                      <div className="font-semibold text-sm">Google Play</div>
                   </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Column 2 */}
          <div className="space-y-8">
            <div>
              <h3 className="font-bold text-slate-900 text-base mb-4">Về AI Recruitment</h3>
              <ul className="space-y-3 text-sm">
                <li><Link href="#" className="hover:text-blue-600 transition-colors">Giới thiệu</Link></li>
                <li><Link href="#" className="hover:text-blue-600 transition-colors">Góc báo chí</Link></li>
                <li><Link href="#" className="hover:text-blue-600 transition-colors">Tuyển dụng</Link></li>
                <li><Link href="#" className="hover:text-blue-600 transition-colors">Liên hệ</Link></li>
                <li><Link href="#" className="hover:text-blue-600 transition-colors">Hỏi đáp</Link></li>
                <li><Link href="#" className="hover:text-blue-600 transition-colors">Chính sách bảo mật</Link></li>
                <li><Link href="#" className="hover:text-blue-600 transition-colors">Điều khoản dịch vụ</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base mb-4">Đối tác</h3>
              <ul className="space-y-3 text-sm">
                <li><Link href="#" className="hover:text-blue-600 transition-colors">TestCenter</Link></li>
                <li><Link href="#" className="hover:text-blue-600 transition-colors">TopHR</Link></li>
                <li><Link href="#" className="hover:text-blue-600 transition-colors">ViecNgay</Link></li>
                <li><Link href="#" className="hover:text-blue-600 transition-colors">Happy Time</Link></li>
              </ul>
            </div>
          </div>
          
          {/* Column 3 */}
          <div className="space-y-8">
            <div>
              <h3 className="font-bold text-slate-900 text-base mb-4">Hồ sơ và CV</h3>
              <ul className="space-y-3 text-sm">
                <li><Link href="#" className="hover:text-blue-600 transition-colors">Quản lý CV của bạn</Link></li>
                <li><Link href="#" className="hover:text-blue-600 transition-colors">Hướng dẫn viết CV</Link></li>
                <li><Link href="#" className="hover:text-blue-600 transition-colors">Thư viện CV theo ngành nghề</Link></li>
                <li><Link href="#" className="hover:text-blue-600 transition-colors">Review CV</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base mb-4">Khám phá</h3>
              <ul className="space-y-3 text-sm">
                <li><Link href="#" className="hover:text-blue-600 transition-colors">Ứng dụng di động AI Recruitment</Link></li>
                <li><Link href="#" className="hover:text-blue-600 transition-colors">Tính lương Gross - Net</Link></li>
                <li><Link href="#" className="hover:text-blue-600 transition-colors">Tính lãi suất kép</Link></li>
                <li><Link href="#" className="hover:text-blue-600 transition-colors">Lập kế hoạch tiết kiệm</Link></li>
                <li><Link href="#" className="hover:text-blue-600 transition-colors">Tính bảo hiểm thất nghiệp</Link></li>
                <li><Link href="#" className="hover:text-blue-600 transition-colors">Tính bảo hiểm xã hội một lần</Link></li>
                <li><Link href="#" className="hover:text-blue-600 transition-colors">Trắc nghiệm MBTI</Link></li>
                <li><Link href="#" className="hover:text-blue-600 transition-colors">Trắc nghiệm MI</Link></li>
              </ul>
            </div>
          </div>
          
          {/* Column 4 */}
          <div className="space-y-8">
            <div>
              <h3 className="font-bold text-slate-900 text-base mb-4">Xây dựng sự nghiệp</h3>
              <ul className="space-y-3 text-sm">
                <li><Link href="#" className="hover:text-blue-600 transition-colors">Việc làm tốt nhất</Link></li>
                <li><Link href="#" className="hover:text-blue-600 transition-colors">Việc làm lương cao</Link></li>
                <li><Link href="#" className="hover:text-blue-600 transition-colors">Việc làm quản lý</Link></li>
                <li><Link href="#" className="hover:text-blue-600 transition-colors">Việc làm IT</Link></li>
                <li><Link href="#" className="hover:text-blue-600 transition-colors">Việc làm Senior</Link></li>
                <li><Link href="#" className="hover:text-blue-600 transition-colors">Việc làm bán thời gian</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base mb-4">Quy tắc chung</h3>
              <ul className="space-y-3 text-sm">
                <li><Link href="#" className="hover:text-blue-600 transition-colors">Điều kiện giao dịch chung</Link></li>
                <li><Link href="#" className="hover:text-blue-600 transition-colors">Giá dịch vụ & Cách thanh toán</Link></li>
                <li><Link href="#" className="hover:text-blue-600 transition-colors">Thông tin về vận chuyển</Link></li>
              </ul>
            </div>
          </div>
          
        </div>

        <div className="border-t border-slate-200 pt-6 flex flex-col items-center justify-center text-center pb-8 text-sm text-slate-500">
          <p className="mb-1">&copy; {new Date().getFullYear()} AI Recruitment. Nền tảng tuyển dụng thông minh ứng dụng AI.</p>
        </div>
      </div>
    </footer>
  );
}
