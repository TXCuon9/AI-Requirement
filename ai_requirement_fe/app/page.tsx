"use client";

import Link from "next/link";
import { Search, MapPin, BriefcaseBusiness, ChevronDown, Heart, Building2, ChevronRight, Zap } from "lucide-react";
import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section with Advanced Search */}
        <section className="relative pt-16 pb-20 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50 border-b border-blue-100">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none"></div>
          
          <div className="container mx-auto px-4 relative z-10 flex flex-col items-center">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 text-center mb-4 leading-tight">
              Tìm việc làm nhanh 24h, việc làm mới nhất <br className="hidden md:block"/> trên toàn quốc.
            </h1>
            <p className="text-lg text-slate-600 text-center mb-8 max-w-2xl">
              Tiếp cận <span className="font-semibold text-blue-600">30,000+</span> tin tuyển dụng chất lượng cao mỗi ngày.
            </p>

            {/* TopCV Style Search Bar */}
            <div className="w-full max-w-5xl bg-white p-2 rounded-2xl shadow-xl shadow-blue-900/5 border border-slate-200/60 flex flex-col md:flex-row items-center gap-2">
              
              {/* Keyword Input */}
              <div className="flex-1 flex items-center w-full px-4 py-3 bg-slate-50/50 rounded-xl hover:bg-slate-100/50 transition-colors border border-transparent focus-within:border-blue-300 focus-within:bg-white">
                <Search className="size-5 text-slate-400 mr-3 shrink-0" />
                <input 
                  type="text" 
                  placeholder="Vị trí ứng tuyển, công ty, từ khóa..." 
                  className="w-full bg-transparent outline-none text-slate-700 placeholder:text-slate-400 font-medium"
                />
              </div>

              {/* Separator hidden on mobile */}
              <div className="hidden md:block w-px h-8 bg-slate-200"></div>

              {/* Location Select */}
              <div className="w-full md:w-[220px] shrink-0 flex items-center px-4 py-3 bg-slate-50/50 rounded-xl hover:bg-slate-100/50 transition-colors cursor-pointer group">
                <MapPin className="size-5 text-slate-400 mr-3 shrink-0 group-hover:text-blue-500" />
                <div className="flex-1 truncate text-slate-700 font-medium select-none">Tất cả địa điểm</div>
                <ChevronDown className="size-4 text-slate-400 ml-2 shrink-0" />
              </div>

              {/* Separator hidden on mobile */}
              <div className="hidden md:block w-px h-8 bg-slate-200"></div>

              {/* Category Select */}
              <div className="w-full md:w-[220px] shrink-0 flex items-center px-4 py-3 bg-slate-50/50 rounded-xl hover:bg-slate-100/50 transition-colors cursor-pointer group">
                <BriefcaseBusiness className="size-5 text-slate-400 mr-3 shrink-0 group-hover:text-blue-500" />
                <div className="flex-1 truncate text-slate-700 font-medium select-none">Tất cả ngành nghề</div>
                <ChevronDown className="size-4 text-slate-400 ml-2 shrink-0" />
              </div>

              {/* Search Button */}
              <button className="w-full md:w-[140px] shrink-0 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 px-6 rounded-xl transition-colors shadow-md shadow-blue-600/20">
                Tìm kiếm
              </button>
            </div>

            {/* Suggestions */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-6 text-sm">
              <span className="text-slate-500 mr-2">Gợi ý từ khóa:</span>
              {["Frontend", "Backend", "ReactJS", "Java", "Business Analyst", "Marketing"].map((tag) => (
                <span key={tag} className="px-3 py-1 bg-white border border-slate-200 text-slate-600 rounded-full hover:border-blue-400 hover:text-blue-600 cursor-pointer transition-colors shadow-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Top Employers Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-slate-900">Nhà tuyển dụng hàng đầu</h2>
              <Link href="#" className="text-blue-600 font-medium hover:underline flex items-center text-sm">
                Xem tất cả <ChevronRight className="size-4 ml-1" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="group p-6 border border-slate-200 rounded-2xl hover:shadow-xl hover:shadow-blue-900/5 hover:border-blue-200 transition-all flex flex-col items-center justify-center text-center cursor-pointer bg-slate-50/50 hover:bg-white">
                  <div className="size-20 rounded-xl bg-white border border-slate-100 shadow-sm mb-4 flex items-center justify-center overflow-hidden">
                    <Building2 className="size-10 text-blue-200" />
                  </div>
                  <h3 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">Tech Company {i}</h3>
                  <p className="text-sm text-slate-500 mt-1 flex items-center gap-1">
                    <BriefcaseBusiness className="size-3.5" /> 15 việc làm
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Best Jobs Section */}
        <section className="py-16 bg-slate-50 border-t border-slate-200/60">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-red-100 rounded-lg">
                <Zap className="size-6 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Việc làm tốt nhất</h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Dummy Job Cards */}
              {[
                { title: "Senior Java Developer", company: "Tech Company 1", salary: "20 - 40 triệu", location: "Hà Nội" },
                { title: "ReactJS Frontend Engineer", company: "Global Tech", salary: "Thỏa thuận", location: "TP. Hồ Chí Minh" },
                { title: "Product Manager (B2B SaaS)", company: "Innovate JSC", salary: "1500 - 2500 USD", location: "Hà Nội" },
                { title: "DevOps Engineer (AWS/Kubernetes)", company: "Cloud Services VN", salary: "Up to 50M", location: "Đà Nẵng" },
                { title: "UI/UX Designer", company: "Creative Studio", salary: "15 - 25 triệu", location: "Hà Nội" },
                { title: "AI/Machine Learning Engineer", company: "Future AI", salary: "2000 - 4000 USD", location: "TP. Hồ Chí Minh" },
              ].map((job, index) => (
                <div key={index} className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-900/5 transition-all group flex flex-col h-full cursor-pointer relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  <div className="flex items-start gap-4 mb-4">
                    <div className="size-16 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                      <Building2 className="size-8 text-slate-300" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-900 text-lg truncate group-hover:text-blue-600 transition-colors" title={job.title}>
                        {job.title}
                      </h3>
                      <p className="text-slate-600 text-sm truncate mt-0.5">{job.company}</p>
                    </div>
                  </div>
                  
                  <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-100">
                    <div className="flex flex-col gap-1.5">
                      <span className="inline-block px-2.5 py-1 bg-red-50 text-red-600 text-sm font-semibold rounded-md max-w-fit">
                        {job.salary}
                      </span>
                      <span className="text-sm text-slate-500 flex items-center gap-1">
                        <MapPin className="size-3.5" /> {job.location}
                      </span>
                    </div>
                    <button className="size-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50 transition-all">
                      <Heart className="size-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 text-center">
              <button className="inline-flex items-center gap-2 bg-white border border-blue-200 text-blue-600 font-semibold px-8 py-3 rounded-xl hover:bg-blue-50 transition-colors shadow-sm">
                Xem thêm việc làm <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="container mx-auto px-4 text-center">
          <div className="size-12 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-2xl mx-auto mb-6 shadow-lg shadow-blue-600/20">
            AI
          </div>
          <p className="mb-4">Nền tảng tuyển dụng thông minh ứng dụng AI.</p>
          <p className="text-sm">&copy; {new Date().getFullYear()} AI Recruitment. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
