"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { MapPin, BriefcaseBusiness, ChevronRight, Loader2, Building2, Heart, ChevronLeft, Flame, Users, ArrowRight } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CandidateRecommendations from "../components/CandidateRecommendations";
import { useState, useEffect, useCallback } from "react";
import { fetchApi } from "../lib/api";
import { JobResponse } from "../lib/types/job";
import { formatSalaryRange } from "../lib/utils";

const banners = [
  { src: "/banners/banner1.png", alt: "Tìm kiếm cơ hội nghề nghiệp IT hàng đầu", href: "/jobs?industry=IT" },
  { src: "/banners/banner2.png", alt: "Ngày hội tuyển dụng AI Recruitment 2026", href: "/jobs" },
  { src: "/banners/banner3.png", alt: "Tạo CV chuyên nghiệp miễn phí với AI", href: "/templates" },
];

export default function Home() {
  const router = useRouter();
  const [jobs, setJobs] = useState<JobResponse[]>([]);
  const [topCompanies, setTopCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Banner carousel state
  const [currentBanner, setCurrentBanner] = useState(0);

  const nextBanner = useCallback(() => {
    setCurrentBanner((prev) => (prev + 1) % banners.length);
  }, []);

  const prevBanner = useCallback(() => {
    setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length);
  }, []);

  // Auto-rotate banner
  useEffect(() => {
    const timer = setInterval(nextBanner, 5000);
    return () => clearInterval(timer);
  }, [nextBanner]);

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
        setTopCompanies(Array.from(compMap.values()).sort((a, b) => b.jobCount - a.jobCount).slice(0, 6));
      })
      .catch((err) => console.error("Failed to fetch jobs:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafc]">
      <Navbar />

      <main className="flex-1">
        {/* === HERO BANNER CAROUSEL === */}
        <section className="bg-[#f8fafc] pt-8 pb-6">
          <div className="container mx-auto px-4">
            <div className="relative w-full lg:w-[80%] mx-auto h-[200px] sm:h-[300px] md:h-[380px] rounded-3xl overflow-hidden shadow-xl bg-slate-900 border border-slate-200">
              {banners.map((banner, index) => (
                <Link
                  key={index}
                  href={banner.href}
                  className={`absolute inset-0 transition-all duration-700 ease-in-out flex items-center justify-center ${
                    index === currentBanner ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                  }`}
                >
                <img
                  src={banner.src}
                  alt={banner.alt}
                  className="w-full h-full object-cover"
                />
              </Link>
            ))}

            {/* Prev/Next */}
            <button onClick={prevBanner} className="absolute left-4 top-1/2 -translate-y-1/2 size-10 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center backdrop-blur-sm transition-colors z-10">
              <ChevronLeft className="size-5" />
            </button>
            <button onClick={nextBanner} className="absolute right-4 top-1/2 -translate-y-1/2 size-10 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center backdrop-blur-sm transition-colors z-10">
              <ChevronRight className="size-5" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {banners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentBanner(index)}
                  className={`rounded-full transition-all ${
                    index === currentBanner ? 'w-8 h-2.5 bg-white' : 'w-2.5 h-2.5 bg-white/50 hover:bg-white/70'
                  }`}
                />
              ))}
            </div>
            
            </div>
          </div>
        </section>

        {/* === AI RECOMMENDATIONS === */}
        <CandidateRecommendations />

        {/* === TOP COMPANIES === */}
        <section className="py-14 bg-white">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="size-10 bg-[#4876EF]/10 rounded-xl flex items-center justify-center">
                  <Building2 className="size-5 text-[#4876EF]" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Nhà tuyển dụng hàng đầu</h2>
              </div>
              <Link href="/companies" className="text-[#E52329] font-semibold hover:underline flex items-center text-sm gap-1">
                Xem tất cả <ArrowRight className="size-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {loading ? (
                <div className="col-span-full flex justify-center py-10">
                  <Loader2 className="size-8 text-[#4876EF] animate-spin" />
                </div>
              ) : topCompanies.length > 0 ? (
                topCompanies.map((comp, index) => (
                  <div key={index} className="card-hover group p-5 border border-slate-200 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer bg-white hover:border-[#4876EF]/30">
                    <div className="size-16 rounded-xl bg-slate-50 border border-slate-100 mb-3 flex items-center justify-center overflow-hidden">
                      {comp.logo ? (
                        <img src={comp.logo} alt={comp.name} className="w-full h-full object-cover" />
                      ) : (
                        <Building2 className="size-8 text-slate-300" />
                      )}
                    </div>
                    <h3 className="font-bold text-slate-800 text-xs group-hover:text-[#4876EF] transition-colors line-clamp-2 min-h-[2rem]">{comp.name}</h3>
                    <p className="text-xs text-[#E52329] font-semibold mt-1.5 flex items-center gap-1">
                      <BriefcaseBusiness className="size-3" /> {comp.jobCount} việc làm
                    </p>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-6 text-slate-500">
                  Chưa có dữ liệu nhà tuyển dụng
                </div>
              )}
            </div>
          </div>
        </section>

        {/* === BEST JOBS SECTION === */}
        <section className="py-14 bg-[#f8fafc]">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="size-10 bg-red-100 rounded-xl flex items-center justify-center">
                  <Flame className="size-5 text-[#E52329]" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Việc làm tốt nhất</h2>
              </div>
              <Link href="/jobs" className="text-[#E52329] font-semibold hover:underline flex items-center text-sm gap-1">
                Xem tất cả <ArrowRight className="size-4" />
              </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {loading ? (
                <div className="col-span-full flex justify-center py-10">
                  <Loader2 className="size-8 text-[#4876EF] animate-spin" />
                </div>
              ) : jobs.length === 0 ? (
                <div className="col-span-full text-center py-10 text-slate-500">
                  Chưa có công việc nào.
                </div>
              ) : (
                jobs.map((job) => (
                  <div
                    key={job.id}
                    onClick={() => router.push(`/jobs/${job.id}`)}
                    className="card-hover bg-white p-5 rounded-2xl border border-slate-200 hover:border-[#E52329]/30 group flex flex-col h-full cursor-pointer relative overflow-hidden"
                  >
                    {/* Left accent line */}
                    <div className="absolute top-0 left-0 w-1 h-full bg-[#E52329] opacity-0 group-hover:opacity-100 transition-opacity"></div>

                    <div className="flex items-start gap-4 mb-4">
                      <div className="size-14 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 overflow-hidden">
                        {job.companyLogo ? (
                          <img src={job.companyLogo} alt={job.companyName || "Logo"} className="w-full h-full object-cover" />
                        ) : (
                          <Building2 className="size-7 text-slate-300" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-slate-900 text-base truncate group-hover:text-[#E52329] transition-colors" title={job.title}>
                          {job.title}
                        </h3>
                        <p className="text-slate-500 text-sm truncate mt-0.5">{job.companyName || "N/A"}</p>
                      </div>
                    </div>

                    <div className="mt-auto pt-3 flex items-center justify-between border-t border-slate-100">
                      <div className="flex flex-col gap-1.5">
                        <span className="salary-tag inline-block max-w-fit">
                          {formatSalaryRange(job.salaryMin, job.salaryMax, job.currency)}
                        </span>
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <MapPin className="size-3" /> {job.location}
                        </span>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); }}
                        className="btn-brand !px-4 !py-1.5 text-xs"
                      >
                        Ứng tuyển
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-10 text-center">
              <Link href="/jobs" className="inline-flex items-center gap-2 bg-white border-2 border-[#E52329] text-[#E52329] font-bold px-8 py-3 rounded-full hover:bg-[#E52329] hover:text-white transition-all shadow-sm">
                Xem thêm việc làm <ChevronRight className="size-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* === STATS BANNER === */}
        <section className="py-14 bg-gradient-to-r from-[#1a1a2e] to-[#16213e] text-white">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-black text-[#E52329] mb-2">10,000+</div>
                <div className="text-sm text-slate-300 font-medium">Việc làm đang tuyển</div>
              </div>
              <div>
                <div className="text-4xl font-black text-[#4876EF] mb-2">500+</div>
                <div className="text-sm text-slate-300 font-medium">Nhà tuyển dụng</div>
              </div>
              <div>
                <div className="text-4xl font-black text-emerald-400 mb-2">50,000+</div>
                <div className="text-sm text-slate-300 font-medium">Ứng viên đã đăng ký</div>
              </div>
              <div>
                <div className="text-4xl font-black text-amber-400 mb-2">AI</div>
                <div className="text-sm text-slate-300 font-medium">Phân tích CV thông minh</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
