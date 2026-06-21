"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, MapPin, BriefcaseBusiness, Filter, Heart, Building2, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import CustomDropdown from "../../components/CustomDropdown";
import { fetchApi } from "../../lib/api";
import { JobResponse } from "../../lib/types/job";
import { formatSalaryRange } from "../../lib/utils";

export default function JobsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Keyword needs local state to update while typing
  const [keyword, setKeyword] = useState("");

  // Local state for top dropdowns to apply only when hitting search
  const [location, setLocation] = useState("");
  const [industry, setIndustry] = useState("");

  // Sync state when URL params change
  useEffect(() => {
    setKeyword(searchParams.get("keyword") || "");
    setLocation(searchParams.get("location") || "");
    setIndustry(searchParams.get("industry") || "");
  }, [searchParams]);

  // Derive sidebar filters directly from URL so they always represent the applied state
  const salaryMin = searchParams.get("salaryMin") || "";
  const experienceLevel = searchParams.get("experienceLevel") || "";
  const jobType = searchParams.get("jobType") || "";

  const [jobs, setJobs] = useState<JobResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams(searchParams.toString());
    fetchApi(`/jobs/search?${params.toString()}`)
      .then((data) => setJobs(data || []))
      .catch((err) => console.error("Failed to fetch jobs:", err))
      .finally(() => setLoading(false));
  }, [searchParams]);

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (keyword) params.set("keyword", keyword); else params.delete("keyword");
    if (location) params.set("location", location); else params.delete("location");
    if (industry) params.set("industry", industry); else params.delete("industry");

    router.push(`/jobs?${params.toString()}`);
  };

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (params.get(key) === value) {
      params.delete(key); // Toggle off if already selected
    } else {
      params.set(key, value);
    }
    router.push(`/jobs?${params.toString()}`);
  };

  const locationOptions = [
    { value: "Hà Nội", label: "Hà Nội" },
    { value: "Hồ Chí Minh", label: "Hồ Chí Minh" },
    { value: "Đà Nẵng", label: "Đà Nẵng" }
  ];

  const industryOptions = [
    { value: "IT", label: "Công nghệ thông tin" },
    { value: "Marketing", label: "Marketing - PR" },
    { value: "Kinh doanh", label: "Kinh doanh - Bán hàng" },
    { value: "Kế toán", label: "Kế toán - Kiểm toán" }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navbar />

      {/* Sticky Search Bar Header (Giống TopCV) */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-2 max-w-6xl mx-auto relative">
            {/* Keyword */}
            <div className="flex-1 flex items-center px-4 py-2.5 bg-slate-100/80 rounded-lg border border-transparent focus-within:border-blue-400 focus-within:bg-white transition-colors">
              <Search className="size-5 text-slate-400 mr-3 shrink-0" />
              <input
                type="text"
                placeholder="Tên công việc, vị trí, công ty..."
                className="w-full bg-transparent outline-none text-slate-700 font-medium placeholder:font-normal"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>

            {/* Location Dropdown Custom */}
            <CustomDropdown
              className="w-full md:w-56"
              icon={MapPin}
              value={location}
              options={locationOptions}
              onChange={setLocation}
              placeholder="Tất cả địa điểm"
            />

            {/* Category Dropdown Custom */}
            <CustomDropdown
              className="w-full md:w-64"
              icon={BriefcaseBusiness}
              value={industry}
              options={industryOptions}
              onChange={setIndustry}
              placeholder="Tất cả ngành nghề"
            />

            <button
              onClick={handleSearch}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-2.5 rounded-lg transition-colors shrink-0 shadow-sm"
            >
              Tìm kiếm
            </button>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6 max-w-7xl items-start">
        {/* Left Sidebar - Filters */}
        <aside className="w-full lg:w-72 shrink-0 space-y-4 lg:sticky lg:top-24">
          <div className="flex items-center gap-2 mb-2">
            <Filter className="size-5 text-blue-600" />
            <h2 className="text-lg font-bold">Lọc tìm kiếm</h2>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Filter: Mức lương */}
            <div className="p-4 border-b border-slate-100">
              <h3 className="font-semibold text-slate-800 mb-3 text-sm uppercase tracking-wide">Mức lương</h3>
              <div className="space-y-2.5">
                {[
                  { value: "", label: "Tất cả mức lương" },
                  { value: "10", label: "Trên 10 triệu" },
                  { value: "15", label: "Trên 15 triệu" },
                  { value: "20", label: "Trên 20 triệu" },
                  { value: "30", label: "Trên 30 triệu" },
                ].map((item) => (
                  <label key={item.label} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="salaryMin"
                      className="size-4 border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      checked={salaryMin === item.value}
                      onChange={() => handleFilterChange("salaryMin", item.value)}
                    />
                    <span className="text-sm text-slate-600 group-hover:text-blue-600 transition-colors">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Filter: Kinh nghiệm & Cấp bậc */}
            <div className="p-4 border-b border-slate-100">
              <h3 className="font-semibold text-slate-800 mb-3 text-sm uppercase tracking-wide">Kinh nghiệm & Cấp bậc</h3>
              <div className="space-y-2.5">
                {[
                  { value: "FRESHER", label: "Chưa có kinh nghiệm / Thực tập" },
                  { value: "JUNIOR", label: "Dưới 1 năm / Junior" },
                  { value: "MIDDLE", label: "1 - 3 năm / Middle" },
                  { value: "SENIOR", label: "Trên 3 năm / Senior" },
                ].map((item) => (
                  <label key={item.value} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="experienceLevel"
                      className="size-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      checked={experienceLevel === item.value}
                      onChange={() => handleFilterChange("experienceLevel", item.value)}
                    />
                    <span className="text-sm text-slate-600 group-hover:text-blue-600 transition-colors">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Filter: Hình thức làm việc */}
            <div className="p-4">
              <h3 className="font-semibold text-slate-800 mb-3 text-sm uppercase tracking-wide">Hình thức làm việc</h3>
              <div className="space-y-2.5">
                {[
                  { value: "FULL_TIME", label: "Toàn thời gian" },
                  { value: "PART_TIME", label: "Bán thời gian" },
                  { value: "INTERNSHIP", label: "Thực tập sinh" },
                  { value: "FREELANCE", label: "Freelance" },
                ].map((item) => (
                  <label key={item.value} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="jobType"
                      className="size-4 border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      checked={jobType === item.value}
                      onChange={() => handleFilterChange("jobType", item.value)}
                    />
                    <span className="text-sm text-slate-600 group-hover:text-blue-600 transition-colors">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Right Content - Job List */}
        <div className="flex-1 min-w-0 pb-12">
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h1 className="text-lg font-bold text-slate-800">
              Tìm thấy <span className="text-blue-600 font-black">{jobs.length}</span> việc làm phù hợp
            </h1>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-slate-500 whitespace-nowrap">Ưu tiên hiển thị:</span>
              <select className="bg-slate-50 border border-slate-200 text-slate-700 font-medium rounded-lg px-3 py-1.5 outline-none focus:border-blue-400 cursor-pointer">
                <option>Mới nhất</option>
                <option>Lương cao nhất</option>
                <option>Phù hợp nhất</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="flex flex-col justify-center items-center py-20 bg-white rounded-xl border border-slate-200 text-blue-600">
                <Loader2 className="size-10 animate-spin mb-4" />
                <p className="text-slate-500 font-medium">Đang tìm kiếm việc làm phù hợp...</p>
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-xl border border-slate-200">
                <div className="size-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="size-10 text-slate-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-700 mb-2">Không tìm thấy việc làm phù hợp</h3>
                <p className="text-slate-500 max-w-md mx-auto">Thử thay đổi tiêu chí lọc hoặc từ khóa tìm kiếm để có nhiều kết quả hơn.</p>
                <button
                  onClick={() => router.push('/jobs')}
                  className="mt-6 text-blue-600 font-semibold hover:underline"
                >
                  Xóa bộ lọc
                </button>
              </div>
            ) : (
              jobs.map((job) => (
                <div key={job.id} className="bg-white p-5 rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-900/5 transition-all group flex flex-col sm:flex-row gap-5 cursor-pointer relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>

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
                          <h2 className="font-bold text-slate-800 text-lg leading-tight truncate group-hover:text-blue-600 transition-colors" title={job.title}>
                            {job.title}
                          </h2>
                        </Link>
                        <Link href={`/companies/${job.companyId || job.id}`} className="text-slate-500 text-sm truncate mt-1 hover:text-blue-600 transition-colors block font-medium">
                          {job.companyName || "Công ty chưa cập nhật"}
                        </Link>
                      </div>
                      <span className="inline-flex items-center justify-center shrink-0 px-3 py-1.5 bg-blue-50 text-blue-700 text-sm font-bold rounded-lg whitespace-nowrap self-start">
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
                      {job.jobType && (
                        <div className="flex items-center gap-1.5 bg-slate-100 text-slate-600 px-2.5 py-1 rounded text-xs font-medium">
                          {job.jobType === "FULL_TIME" ? "Toàn thời gian" :
                            job.jobType === "PART_TIME" ? "Bán thời gian" : job.jobType}
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex gap-2">
                        {/* Tags */}
                        <span className="text-[11px] text-slate-500 border border-slate-200 px-2 py-0.5 rounded-sm">Hot</span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-slate-400">
                        <span className="hidden sm:inline">Cập nhật 1 giờ trước</span>
                        <button className="text-slate-400 hover:text-red-500 transition-colors p-1.5 rounded-full hover:bg-red-50" onClick={(e) => { e.preventDefault(); }}>
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
          {jobs.length > 0 && (
            <div className="mt-8 flex justify-center items-center gap-2">
              <button className="size-10 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-50">
                <ChevronLeft className="size-5" />
              </button>
              <button className="size-10 flex items-center justify-center rounded-lg border border-blue-600 bg-blue-600 text-white font-medium">1</button>
              <button className="size-10 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50">
                <ChevronRight className="size-5" />
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
