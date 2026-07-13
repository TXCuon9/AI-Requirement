"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { MapPin, BriefcaseBusiness, ChevronRight, Loader2, Building2, Heart, Search, ChevronLeft, ChevronRight as ChevronRightIcon, X, Flame, Banknote, Quote } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CandidateRecommendations from "../components/CandidateRecommendations";
import { useState, useEffect } from "react";
import { fetchApi } from "../lib/api";
import { JobResponse } from "../lib/types/job";
import { formatSalaryRange } from "../lib/utils";

// VW style event banners
const heroCompanies = [
  {
    name: "Jotun Việt Nam",
    quote: "Protect and colour the world with us",
    logo: "https://images.vietnamworks.com/logo/jotun_hrlg_141349.png",
    banner: "https://images.vietnamworks.com/logo/jotun_hrbn26_141349.png",
  },
  {
    name: "TECHCOMBANK",
    quote: "Vượt trội hơn mỗi ngày",
    logo: "https://images.vietnamworks.com/logo/techcomb_hrlg26_142009.jpg",
    banner: "https://images.vietnamworks.com/logo/techcomb_hrbn726_142009.jpg",
  }
];

export default function Home() {
  const router = useRouter();
  const [jobs, setJobs] = useState<JobResponse[]>([]);
  const [topCompanies, setTopCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % heroCompanies.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchApi("/jobs")
      .then((data) => {
        const allJobs = data || [];
        setJobs(allJobs.slice(0, 9));

        const compMap = new Map();
        allJobs.forEach((job: JobResponse) => {
          if (job.companyName && !compMap.has(job.companyName)) {
            compMap.set(job.companyName, { name: job.companyName, logo: job.companyLogo, industry: job.industry, jobCount: 1 });
          } else if (job.companyName) {
            compMap.get(job.companyName).jobCount++;
          }
        });
        setTopCompanies(Array.from(compMap.values()).sort((a, b) => b.jobCount - a.jobCount).slice(0, 8));
      })
      .catch((err) => console.warn("Failed to fetch jobs (backend might be offline):", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[var(--vw-gray)]">
      <Navbar />

      <main className="flex-1">
        {/* === HERO BANNER & SEARCH === */}
        <section className="w-full relative pt-6 pb-12 px-4 bg-gradient-to-br from-[#0b1c47] via-[#0f3b9e] to-[#1161ed]">
          <div className="container mx-auto max-w-6xl relative z-10">
            {/* Search Box - Exact VW Screenshot Layout */}
            <div className="bg-white rounded-full p-2 flex items-center shadow-lg mb-8 w-full max-w-5xl mx-auto">
              {/* Keyword Input */}
              <div className="flex-1 flex items-center px-4">
                <Search className="size-5 text-gray-500 mr-2 shrink-0" />
                <input 
                  type="text" 
                  placeholder="Tìm kiếm việc làm, công ty, kỹ năng" 
                  className="w-full bg-transparent border-none outline-none text-[15px] text-gray-800 placeholder:text-gray-400"
                />
              </div>

              {/* Location Tag */}
              <div className="hidden md:flex items-center bg-blue-50 text-[var(--vw-blue)] px-4 py-2 rounded-full mx-2 text-sm font-medium">
                <MapPin className="size-4 mr-1 shrink-0" />
                Hà Nội
                <X className="size-4 ml-2 cursor-pointer text-gray-400 hover:text-[var(--vw-blue)] shrink-0" />
              </div>

              {/* Search Button */}
              <button className="bg-[var(--vw-orange)] hover:bg-[var(--vw-orange-hover)] text-white font-bold text-[15px] px-8 h-10 md:h-11 rounded-full transition-colors whitespace-nowrap ml-1 shrink-0">
                Tìm kiếm
              </button>
            </div>
            
            {/* Main Carousel Banner */}
            <div className="rounded-xl overflow-hidden shadow-2xl w-full max-w-5xl mx-auto flex flex-col relative transition-opacity duration-500">
              {/* Banner Image Area */}
              <div className="h-[200px] md:h-[350px] lg:h-[400px] bg-gray-900 relative">
                <img key={currentBanner} src={heroCompanies[currentBanner].banner} alt={heroCompanies[currentBanner].name} className="w-full h-full object-cover animate-[fadeIn_0.5s_ease-in-out]" />
                
                {/* Dots overlay */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 z-10">
                  {heroCompanies.map((_, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => setCurrentBanner(idx)}
                      className={`h-2 rounded-full cursor-pointer transition-all ${currentBanner === idx ? 'w-4 bg-white shadow-sm' : 'size-2 bg-white/50 hover:bg-white/80'}`}
                    ></div>
                  ))}
                </div>
              </div>

              {/* Bottom Company Info Bar */}
              <div className="bg-[#0c246b] p-4 md:px-6 md:py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-white rounded p-1 size-12 flex items-center justify-center shrink-0 shadow-sm overflow-hidden">
                    <img key={currentBanner} src={heroCompanies[currentBanner].logo} alt="Logo" className="w-full h-full object-contain animate-[fadeIn_0.5s_ease-in-out]" />
                  </div>
                  <div className="text-white">
                    <h3 className="font-bold text-[15px] md:text-[16px] leading-tight mb-0.5 animate-[fadeIn_0.5s_ease-in-out]">{heroCompanies[currentBanner].quote}</h3>
                    <p className="text-gray-300 text-sm animate-[fadeIn_0.5s_ease-in-out]">{heroCompanies[currentBanner].name}</p>
                  </div>
                </div>
                <button className="hidden sm:block border border-white/60 text-white font-semibold text-sm px-6 py-2 rounded hover:bg-white hover:text-[#0b246a] transition-colors whitespace-nowrap">
                  Apply Now
                </button>
              </div>
            </div>
          </div>
          
          {/* Top Companies Section */}
          <div className="container mx-auto max-w-5xl relative z-10 mt-12 mb-4">
            <h2 className="text-[20px] md:text-[22px] font-bold text-white mb-6">Các Công Ty Hàng Đầu</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-5">
              {[
                { name: "GSM", logo: "https://images.vietnamworks.com/logo/vgreen_cplg_141907.jpg" },
                { name: "VPBANK", logo: "https://images.vietnamworks.com/logo/vpbank_vip_137726.jpg" },
                { name: "SEI (VIỆT NAM)", logo: "https://images.vietnamworks.com/logo/sei_vip_136729.jpg" },
                { name: "VINFAST", logo: "https://images.vietnamworks.com/logo/vinfast_vip_141000.jpg" },
                { name: "CHAILEASE", logo: "https://images.vietnamworks.com/logo/chaileaseS_vip_138417.jpg" }
              ].map((company, idx) => (
                <div key={idx} className="bg-white rounded-lg p-4 md:p-5 flex flex-col items-center justify-between text-center hover:-translate-y-1 hover:shadow-xl transition-all cursor-pointer h-[170px] md:h-[190px]">
                  <div className="h-16 w-full flex items-center justify-center mb-2">
                    <img src={company.logo} alt={company.name} className="max-h-full max-w-full object-contain" />
                  </div>
                  <h3 className="font-bold text-gray-800 text-[13px] md:text-sm mb-3 line-clamp-2">{company.name}</h3>
                  <span className="bg-[#41a0ff] hover:bg-[#2b86df] transition-colors text-white text-[10px] md:text-[11px] font-bold px-3.5 py-1 rounded-full uppercase tracking-wide">Việc mới</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Zalo Floating Icon */}
          <div className="absolute right-4 md:right-8 top-[50%] -translate-y-1/2 z-50">
            <div className="size-14 bg-white rounded-full flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.15)] cursor-pointer hover:scale-105 transition-transform">
              <span className="text-[#0068ff] font-bold text-lg tracking-tighter">Zalo</span>
            </div>
          </div>
        </section>

        {/* === AI RECOMMENDATIONS === */}
        <div className="container mx-auto max-w-6xl px-4 mb-12">
          <CandidateRecommendations />
        </div>


        {/* === BEST JOBS SECTION === */}
        <section className="py-10 bg-white">
          <div className="container mx-auto max-w-6xl px-4">
            
            {/* Box Container */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-[0_8px_30px_rgb(0,0,0,0.08)] relative overflow-hidden">
              
              {/* Top Graphic Ribbon (Abstract) */}
              <div className="absolute top-0 left-0 w-[80px] h-[80px] pointer-events-none">
                <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 0H100L0 100V0Z" fill="#f0f6ff" />
                  <path d="M0 0H60L10 60V0Z" fill="#ff8d59" />
                  <path d="M0 40H30L30 100V40Z" fill="#0058ff" />
                </svg>
              </div>

              {/* Header */}
              <div className="flex justify-between items-center px-6 md:px-8 py-4 border-b border-gray-100 relative z-10 bg-[#f4f7fd]">
                <h2 className="text-[20px] font-bold text-gray-800 ml-6 md:ml-10 leading-none">Việc Làm Tốt Nhất</h2>
                <Link href="/jobs" className="text-[var(--vw-blue)] hover:underline font-bold text-[13px] uppercase tracking-wider">
                  XEM TẤT CẢ
                </Link>
              </div>

              {/* Grid */}
              <div className="p-4 md:p-8 relative z-10 bg-white">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                  {loading ? (
                    <div className="col-span-full flex justify-center py-12">
                      <Loader2 className="size-8 text-[var(--vw-blue)] animate-spin" />
                    </div>
                  ) : jobs.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-gray-500 bg-white rounded-lg border border-gray-200">
                      Chưa có công việc nào.
                    </div>
                  ) : (
                    jobs.map((job) => (
                      <div
                        key={job.id}
                        onClick={() => router.push(`/jobs/${job.id}`)}
                        className="bg-white border border-gray-100 p-4 rounded-xl flex gap-4 hover:border-[var(--vw-blue)] hover:shadow-md transition-all cursor-pointer group"
                      >
                        {/* Company Logo */}
                        <div className="size-[64px] border border-gray-100 rounded-lg p-1.5 flex items-center justify-center shrink-0">
                          {job.companyLogo ? (
                            <img src={job.companyLogo} alt={job.companyName || "Logo"} className="w-full h-full object-contain" />
                          ) : (
                            <Building2 className="size-8 text-gray-300" />
                          )}
                        </div>
                        
                        {/* Job Info */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                          <div>
                            <div className="flex items-start justify-between gap-1 mb-1">
                              <h3 className="font-bold text-[15px] text-gray-800 line-clamp-1 group-hover:text-[var(--vw-blue)] transition-colors leading-tight" title={job.title}>
                                {job.title}
                              </h3>
                              <span className="flex items-center gap-0.5 bg-red-50 text-red-500 text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0">
                                <Flame className="size-3" /> Hot
                              </span>
                            </div>
                            <p className="text-gray-500 text-[13px] truncate">{job.companyName || "N/A"}</p>
                          </div>
                          
                          <div className="mt-1.5 text-[14px]">
                            <span className="text-[#f37c36] font-medium mr-2">
                              {formatSalaryRange(job.salaryMin, job.salaryMax, job.currency)}
                            </span>
                          </div>
                          
                          <div className="mt-0.5 text-[13px] text-gray-500 truncate">
                            {job.location}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                
                {/* Pagination placeholder like the screenshot */}
                {!loading && jobs.length > 0 && (
                  <div className="mt-8 flex justify-center items-center gap-4">
                     <ChevronLeft className="size-4 text-gray-300 cursor-not-allowed" />
                     <div className="flex gap-2.5">
                       <div className="size-2 rounded-full bg-[var(--vw-blue)] cursor-pointer"></div>
                       <div className="size-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors cursor-pointer"></div>
                       <div className="size-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors cursor-pointer"></div>
                       <div className="size-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors cursor-pointer"></div>
                       <div className="size-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors cursor-pointer"></div>
                       <div className="size-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors cursor-pointer"></div>
                     </div>
                     <ChevronRightIcon className="size-4 text-gray-400 cursor-pointer hover:text-gray-600 transition-colors" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* === HIGH SALARY JOBS SECTION === */}
        <section className="py-16 relative overflow-hidden bg-[#0a0a0a]">
          {/* Subtle space glow effect to mimic the VW background */}
          <div className="absolute top-[-30%] right-[-20%] w-[80%] h-[160%] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.06)_0%,transparent_70%)] pointer-events-none z-0"></div>
          
          <div className="container mx-auto max-w-6xl px-4 relative z-10">
            <h2 className="text-[28px] font-bold text-white mb-8 leading-tight">Việc trên nghìn đô phù hợp với bạn</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {loading ? (
                <div className="col-span-full flex justify-center py-12">
                  <Loader2 className="size-8 text-white animate-spin" />
                </div>
              ) : jobs.length === 0 ? (
                <div className="col-span-full text-center py-12 text-gray-500">
                  Chưa có công việc nào.
                </div>
              ) : (
                jobs.slice(0, 6).map((job) => (
                  <div
                    key={job.id}
                    onClick={() => router.push(`/jobs/${job.id}`)}
                    className="bg-[#1a1a1a] border border-[#333] hover:border-blue-500/50 transition-colors rounded-xl p-5 cursor-pointer flex flex-col justify-between min-h-[220px] group"
                  >
                    <div>
                      {/* Company Info */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="size-12 bg-white rounded flex items-center justify-center shrink-0 p-1">
                          {job.companyLogo ? (
                            <img src={job.companyLogo} alt={job.companyName || "Logo"} className="w-full h-full object-contain" />
                          ) : (
                            <Building2 className="size-8 text-gray-300" />
                          )}
                        </div>
                        <span className="text-white font-bold text-[15px] leading-tight line-clamp-2">{job.companyName || "N/A"}</span>
                      </div>
                      
                      {/* Job Title */}
                      <h3 className="text-white font-bold text-[16px] leading-snug line-clamp-2 group-hover:text-[#41a0ff] transition-colors" title={job.title}>
                        {job.title}
                      </h3>
                      <p className="text-gray-400 text-[13px] mt-2">{job.location}</p>
                    </div>
                    
                    {/* Footer */}
                    <div className="mt-5 pt-4 border-t border-white/10 flex items-center gap-2 text-white">
                      <Banknote className="size-[18px] text-gray-300" />
                      <span className="font-bold text-[15px]">
                        {formatSalaryRange(job.salaryMin, job.salaryMax, job.currency)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

      </main>

      {/* === PRESS & TESTIMONIALS === */}
      <section className="py-16 bg-[#fafafa]">
        <div className="container mx-auto max-w-6xl px-4">
          
          {/* Press Section */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-slate-800 mb-8">Báo chí nói gì về AI Recruitment</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {/* Press 1 */}
              <div className="bg-white p-6 rounded-xl border border-gray-100 flex items-center gap-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-[100px] flex-shrink-0">
                  <span className="font-black text-2xl text-green-700 tracking-tighter">DÂN TRÍ</span>
                </div>
                <p className="text-[14px] text-gray-600 font-medium leading-relaxed border-l border-gray-200 pl-4">
                  Chiến dịch Empower Growth của AI Recruitment nhận nhiều giải thưởng quốc tế
                </p>
              </div>
              {/* Press 2 */}
              <div className="bg-white p-6 rounded-xl border border-gray-100 flex items-center gap-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-[100px] flex-shrink-0">
                  <span className="font-black text-2xl text-[#9f224e] tracking-tighter">VN<span className="text-gray-400">EXPRESS</span></span>
                </div>
                <p className="text-[14px] text-gray-600 font-medium leading-relaxed border-l border-gray-200 pl-4">
                  AI Recruitment: 64% doanh nghiệp thưởng Tết hơn một tháng lương
                </p>
              </div>
              {/* Press 3 */}
              <div className="bg-white p-6 rounded-xl border border-gray-100 flex items-center gap-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-[100px] flex-shrink-0">
                  <span className="font-black text-2xl text-red-600 tracking-tighter">CAFEF</span>
                </div>
                <p className="text-[14px] text-gray-600 font-medium leading-relaxed border-l border-gray-200 pl-4">
                  Bước chuyển mình sau 20 năm của trang tuyển dụng hàng đầu Việt Nam
                </p>
              </div>
            </div>
            {/* Dots */}
            <div className="mt-8 flex justify-center gap-2">
              <div className="size-2.5 rounded-full bg-[var(--vw-blue)] cursor-pointer"></div>
              <div className="size-2.5 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors cursor-pointer"></div>
              <div className="size-2.5 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors cursor-pointer"></div>
            </div>
          </div>

          {/* Testimonial Section */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-8">Ứng viên nói về AI Recruitment</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Testimonial 1 */}
              <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative">
                <Quote className="size-10 text-gray-100 absolute top-6 left-6 rotate-180" />
                <div className="relative z-10 pl-6">
                  <p className="text-[14.5px] text-gray-600 leading-relaxed text-justify mb-8">
                    Điều hài lòng của tôi về AI Recruitment là việc thông báo việc làm mới qua email cho người dùng thường xuyên. Điều này giúp cho tôi có cơ hội được tìm hiểu các công việc tuyển dụng phù hợp với kinh nghiệm của mình. Tất nhiên là giao diện của AI Recruitment rất đẹp, dễ sử dụng và tiện lợi giúp tôi có thể tìm kiếm công việc phù hợp một cách nhanh chóng. Mọi thông tin, ngành nghề, khu vực đều được cập nhật rất bài bản. Tôi rất hài lòng về sự trải nghiệm này.
                  </p>
                  <p className="font-bold text-slate-800 text-right">Ms. Trúc Năng</p>
                </div>
                <Quote className="size-10 text-gray-100 absolute bottom-6 right-6" />
              </div>
              
              {/* Testimonial 2 */}
              <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative">
                <Quote className="size-10 text-gray-100 absolute top-6 left-6 rotate-180" />
                <div className="relative z-10 pl-6">
                  <p className="text-[14.5px] text-gray-600 leading-relaxed text-justify mb-8">
                    AI Recruitment có nhiều công việc với những tính chất ngành nghề phong phú. Phản ánh chính xác và đầy đủ nhu cầu tìm việc làm trong xã hội hiện nay và nhu cầu tuyển dụng của các doanh nghiệp. Giao diện trình bày dễ hiểu. Bên cạnh đó, AI Recruitment còn có nhiều nội dung, bài viết phong phú, phản ánh thực tế nhu cầu tuyển dụng, công việc trong giai đoạn hiện nay.
                  </p>
                  <p className="font-bold text-slate-800 text-right mt-12">Mr. Quang Tùng</p>
                </div>
                <Quote className="size-10 text-gray-100 absolute bottom-6 right-6" />
              </div>
            </div>
            {/* Dots */}
            <div className="mt-8 flex justify-center gap-2">
              <div className="size-2.5 rounded-full bg-[var(--vw-blue)] cursor-pointer"></div>
              <div className="size-2.5 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors cursor-pointer"></div>
              <div className="size-2.5 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors cursor-pointer"></div>
              <div className="size-2.5 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors cursor-pointer"></div>
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}
