"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, MapPin, BriefcaseBusiness, Filter, Heart, Building2, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import Navbar from "../../components/Navbar";
import { fetchApi } from "../../lib/api";
import { JobResponse } from "../../lib/types/job";
import { formatSalaryRange } from "../../lib/utils";

export default function JobsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);

  const [jobs, setJobs] = useState<JobResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi("/jobs")
      .then((data) => setJobs(data))
      .catch((err) => console.error("Failed to fetch jobs:", err))
      .finally(() => setLoading(false));
  }, []);



  const filteredJobs = jobs.filter(job => {
    const matchSearch = searchTerm === "" || 
                        job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        (job.companyName && job.companyName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // For Location: match if no location selected, or if job.location contains any of the selected locations
    const matchLocation = selectedLocations.length === 0 || selectedLocations.some(loc => job.location && job.location.toLowerCase().includes(loc.toLowerCase()));

    return matchSearch && matchLocation;
  });

  const handleLocationChange = (loc: string) => {
    setSelectedLocations(prev => 
      prev.includes(loc) ? prev.filter(l => l !== loc) : [...prev, loc]
    );
  };
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navbar />

      {/* Sticky Search Bar Header */}
      <div className="bg-white border-b border-slate-200 sticky top-20 z-40 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex gap-2 max-w-5xl">
            <div className="flex-1 flex items-center px-4 py-2.5 bg-slate-100 rounded-xl border border-transparent focus-within:border-blue-300 focus-within:bg-white transition-colors">
              <Search className="size-5 text-slate-400 mr-3 shrink-0" />
              <input 
                type="text" 
                placeholder="Tên công việc, vị trí bạn muốn ứng tuyển..." 
                className="w-full bg-transparent outline-none text-slate-700 font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors shrink-0">
              Tìm kiếm
            </button>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 flex gap-8 items-start">
        {/* Left Sidebar - Filters */}
        <aside className="hidden lg:block w-72 shrink-0 space-y-6 sticky top-40">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="size-5 text-blue-600" />
            <h2 className="text-lg font-bold">Lọc tìm kiếm</h2>
          </div>
          
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            {/* Filter: Location */}
            <div>
              <h3 className="font-semibold mb-3">Khu vực</h3>
              <div className="space-y-2">
                {["Hà Nội", "Hồ Chí Minh", "Đà Nẵng", "Cần Thơ"].map((loc) => (
                  <label key={loc} className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="size-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" 
                      checked={selectedLocations.includes(loc)}
                      onChange={() => handleLocationChange(loc)}
                    />
                    <span className="text-sm text-slate-700">{loc}</span>
                  </label>
                ))}
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* Filter: Salary */}
            <div>
              <h3 className="font-semibold mb-3">Mức lương</h3>
              <div className="space-y-2">
                {["Dưới 10 triệu", "10 - 15 triệu", "15 - 20 triệu", "20 - 30 triệu", "Trên 30 triệu", "Thỏa thuận"].map((sal) => (
                  <label key={sal} className="flex items-center gap-3 cursor-pointer">
                    <input type="radio" name="salary" className="size-4 border-slate-300 text-blue-600 focus:ring-blue-500" />
                    <span className="text-sm text-slate-700">{sal}</span>
                  </label>
                ))}
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* Filter: Experience */}
            <div>
              <h3 className="font-semibold mb-3">Kinh nghiệm</h3>
              <div className="space-y-2">
                {["Chưa có kinh nghiệm", "Dưới 1 năm", "1 - 3 năm", "3 - 5 năm", "Trên 5 năm"].map((exp) => (
                  <label key={exp} className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" className="size-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                    <span className="text-sm text-slate-700">{exp}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Right Content - Job List */}
        <div className="flex-1 min-w-0">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-xl font-bold">
              Tìm thấy <span className="text-blue-600">{filteredJobs.length}</span> việc làm phù hợp
            </h1>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-slate-500">Sắp xếp theo:</span>
              <select className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 outline-none focus:border-blue-400">
                <option>Mới nhất</option>
                <option>Lương cao nhất</option>
                <option>Phù hợp nhất</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="flex justify-center items-center py-20 text-blue-600">
                <Loader2 className="size-8 animate-spin" />
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="text-center py-20 text-slate-500">
                Không có việc làm nào phù hợp.
              </div>
            ) : (
              filteredJobs.map((job) => (
                <div key={job.id} className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-900/5 transition-all group flex flex-col sm:flex-row gap-5 cursor-pointer relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  <div className="size-20 sm:size-24 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 p-2">
                    <Building2 className="size-10 text-slate-300" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <Link href={`/jobs/${job.id}`}>
                          <h2 className="font-bold text-slate-900 text-lg truncate group-hover:text-blue-600 transition-colors" title={job.title}>
                            {job.title}
                          </h2>
                        </Link>
                        <Link href={`/companies/${job.id}`} className="text-slate-600 text-sm truncate mt-1 hover:underline hover:text-blue-600 block">
                          {job.companyName || "Công ty bảo mật"}
                        </Link>
                      </div>
                      <span className="inline-flex items-center justify-center shrink-0 px-3 py-1 bg-red-50 text-red-600 text-sm font-semibold rounded-lg whitespace-nowrap">
                        {formatSalaryRange(job.salaryMin, job.salaryMax, job.currency)}
                      </span>
                    </div>
                    
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-1 bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md text-xs font-medium">
                        <MapPin className="size-3.5" /> {job.location || "Nhiều địa điểm"}
                      </div>
                      <div className="flex items-center gap-1 bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md text-xs font-medium">
                        <BriefcaseBusiness className="size-3.5" /> {job.experienceLevel === "ENTRY_LEVEL" ? "Chưa có kinh nghiệm" : job.experienceLevel === "JUNIOR" ? "Dưới 1 năm" : job.experienceLevel === "MID_LEVEL" ? "1-3 năm" : job.experienceLevel === "SENIOR" ? "3-5 năm" : "Trên 5 năm"}
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex gap-2 hidden sm:flex">
                        <span className="text-xs text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-full">{job.jobType === "FULL_TIME" ? "Toàn thời gian" : job.jobType === "PART_TIME" ? "Bán thời gian" : job.jobType === "INTERNSHIP" ? "Thực tập" : job.jobType}</span>
                        {job.remote && <span className="text-xs text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-full">Remote</span>}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-slate-400">
                        <span>Cập nhật gần đây</span>
                        <button className="text-slate-400 hover:text-blue-500 transition-colors p-1.5 rounded-full hover:bg-blue-50" onClick={(e) => { e.preventDefault(); /* TODO: Save Job */ }}>
                          <Heart className="size-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          <div className="mt-8 flex justify-center items-center gap-2">
            <button className="size-10 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-50">
              <ChevronLeft className="size-5" />
            </button>
            <button className="size-10 flex items-center justify-center rounded-lg border border-blue-600 bg-blue-600 text-white font-medium">1</button>
            <button className="size-10 flex items-center justify-center rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium">2</button>
            <button className="size-10 flex items-center justify-center rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium">3</button>
            <span className="text-slate-400">...</span>
            <button className="size-10 flex items-center justify-center rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium">10</button>
            <button className="size-10 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50">
              <ChevronRight className="size-5" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
