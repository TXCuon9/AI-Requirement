"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MapPin, BriefcaseBusiness, Heart, Building2, Sparkles, ArrowRight, Trash2 } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { fetchApi } from "../../lib/api";
import { JobResponse } from "../../lib/types/job";
import { formatSalaryRange } from "../../lib/utils";

export default function SavedJobsPage() {
  const [savedJobs, setSavedJobs] = useState<JobResponse[]>([]);
  const [recommendedJobs, setRecommendedJobs] = useState<JobResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mocking the behavior by fetching jobs and splitting them
    fetchApi(`/jobs/search`)
      .then((data: JobResponse[]) => {
        if (data && data.length > 0) {
          // Take first 2 jobs as saved
          setSavedJobs(data.slice(0, 2));
          // Take next 3 jobs as AI Recommended based on the saved ones
          setRecommendedJobs(data.slice(2, 5));
        }
      })
      .catch((err) => console.error("Failed to fetch jobs:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleRemoveSaved = (id: number) => {
    setSavedJobs(savedJobs.filter(job => job.id !== id));
  };

  const JobCard = ({ job, isSaved = false }: { job: JobResponse, isSaved?: boolean }) => (
    <div className="bg-white p-5 rounded-xl border border-slate-200 hover:border-[var(--vw-blue)] hover:shadow-lg transition-all group flex flex-col sm:flex-row gap-5 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full bg-[var(--vw-blue)] opacity-0 group-hover:opacity-100 transition-opacity"></div>

      <div className="size-24 rounded-lg bg-white border border-slate-100 flex items-center justify-center shrink-0 p-2 overflow-hidden shadow-sm">
        {job.companyLogo ? (
          <img src={job.companyLogo} alt={job.companyName || "Logo"} className="w-full h-full object-contain" />
        ) : (
          <Building2 className="size-10 text-slate-300" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-4">
          <div className="min-w-0 flex-1">
            <Link href={`/jobs/${job.id}`}>
              <h2 className="font-bold text-slate-800 text-lg leading-tight truncate group-hover:text-[var(--vw-blue)] transition-colors" title={job.title}>
                {job.title}
              </h2>
            </Link>
            <Link href={`/companies/${job.companyId || job.id}`} className="text-slate-500 text-sm truncate mt-1 hover:text-[var(--vw-blue)] transition-colors block font-medium">
              {job.companyName || "Công ty chưa cập nhật"}
            </Link>
          </div>
          <span className="inline-flex items-center justify-center shrink-0 px-3 py-1.5 bg-blue-50 text-[var(--vw-blue)] text-sm font-bold rounded-lg whitespace-nowrap self-start">
            {formatSalaryRange(job.salaryMin, job.salaryMax, job.currency)}
          </span>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 bg-slate-100 text-slate-600 px-2.5 py-1 rounded text-xs font-medium">
            <MapPin className="size-3.5" /> {job.location || "Nhiều địa điểm"}
          </div>
          <div className="flex items-center gap-1.5 bg-slate-100 text-slate-600 px-2.5 py-1 rounded text-xs font-medium">
            <BriefcaseBusiness className="size-3.5" />
            {job.experienceLevel === "FRESHER" ? "Thực tập / Fresher" :
              job.experienceLevel === "JUNIOR" ? "Dưới 1 năm (Junior)" :
                job.experienceLevel === "MIDDLE" ? "1-3 năm (Middle)" :
                  job.experienceLevel === "SENIOR" ? "Trưởng nhóm / Senior" : "Chưa có kinh nghiệm"}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="text-xs text-slate-400">Đã cập nhật gần đây</div>
          <div className="flex items-center gap-3">
            {isSaved ? (
              <button onClick={() => handleRemoveSaved(job.id)} className="flex items-center justify-center bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600 p-2 rounded-lg transition-colors group/btn">
                 <Trash2 className="size-4" />
              </button>
            ) : (
              <button className="flex items-center justify-center bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 p-2 rounded-lg transition-colors">
                 <Heart className="size-4" />
              </button>
            )}
            <Link href={`/jobs/${job.id}`} className="bg-[#ff7b00] text-white hover:bg-[#e66f00] px-6 py-2 rounded-lg text-sm font-bold shadow-sm transition-colors flex items-center gap-2">
              Ứng tuyển <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navbar />

      {/* Header */}
      <div className="bg-[#0b1c47] text-white py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          <h1 className="text-3xl font-bold mb-3">Việc làm đã lưu</h1>
          <p className="text-blue-200">Xem lại danh sách việc làm bạn đã lưu và các gợi ý tuyệt vời từ AI.</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 container mx-auto px-4 max-w-5xl py-10 flex flex-col gap-10">
        
        {/* Saved Jobs Section */}
        <div>
           <div className="flex items-center gap-2 mb-6">
              <Heart className="size-6 text-[#ff7b00] fill-[#ff7b00]" />
              <h2 className="text-2xl font-bold text-slate-800">Việc làm bạn đã lưu ({savedJobs.length})</h2>
           </div>
           
           {loading ? (
             <div className="animate-pulse space-y-4">
                <div className="h-40 bg-slate-200 rounded-xl w-full"></div>
                <div className="h-40 bg-slate-200 rounded-xl w-full"></div>
             </div>
           ) : savedJobs.length > 0 ? (
             <div className="space-y-4">
               {savedJobs.map(job => (
                 <JobCard key={`saved-${job.id}`} job={job} isSaved={true} />
               ))}
             </div>
           ) : (
             <div className="bg-white rounded-xl border border-slate-200 p-10 text-center flex flex-col items-center">
                <Heart className="size-12 text-slate-300 mb-4" />
                <h3 className="text-lg font-bold text-slate-700 mb-2">Bạn chưa lưu việc làm nào</h3>
                <p className="text-slate-500 mb-6">Hãy lướt xem các việc làm hấp dẫn và bấm nút tim để lưu lại nhé!</p>
                <Link href="/jobs" className="bg-[var(--vw-blue)] text-white px-6 py-2.5 rounded-lg font-bold hover:bg-[#0c47b5] transition-colors">
                  Tìm việc ngay
                </Link>
             </div>
           )}
        </div>

        {/* AI Recommendations Section */}
        <div className="bg-gradient-to-r from-[#f0f7ff] to-[#e6f3ff] rounded-2xl p-1 border border-blue-100 shadow-sm relative overflow-hidden mt-6">
           <div className="absolute top-0 right-0 w-64 h-64 bg-blue-300 opacity-20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
           
           <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 relative z-10">
             <div className="flex items-center gap-3 mb-2">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-2 rounded-lg shadow-md">
                   <Sparkles className="size-5" />
                </div>
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-800">
                  AI Gợi ý việc làm
                </h2>
             </div>
             <p className="text-slate-600 mb-8 max-w-2xl">
               Dựa trên phân tích <strong>lịch sử tìm kiếm</strong> và <strong>các việc làm bạn đã lưu</strong>, hệ thống AI Recruitment đề xuất những cơ hội tuyệt vời dành riêng cho bạn.
             </p>

             {loading ? (
               <div className="animate-pulse space-y-4">
                  <div className="h-40 bg-white/50 rounded-xl w-full"></div>
                  <div className="h-40 bg-white/50 rounded-xl w-full"></div>
               </div>
             ) : recommendedJobs.length > 0 ? (
               <div className="space-y-4">
                 {recommendedJobs.map(job => (
                   <JobCard key={`rec-${job.id}`} job={job} isSaved={false} />
                 ))}
               </div>
             ) : (
               <div className="bg-white/50 rounded-xl border border-blue-100 p-8 text-center text-slate-500">
                  Chưa đủ dữ liệu để AI phân tích. Hãy lưu thêm việc làm nhé!
               </div>
             )}
           </div>
        </div>

      </div>

      <Footer />
    </div>
  );
}
