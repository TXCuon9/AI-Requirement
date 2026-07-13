"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { fetchApi } from "../../lib/api";
import { Building2, MapPin, Globe, Users, Search, ChevronRight } from "lucide-react";

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    handleSearch();
  }, []);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    try {
      const url = keyword ? `/company/search?keyword=${encodeURIComponent(keyword)}` : `/company/search`;
      const data = await fetchApi(url);
      setCompanies(data);
    } catch (err) {
      console.error("Lỗi khi tải danh sách công ty:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[var(--vw-gray)] font-sans text-slate-900">
      <Navbar />

      {/* Hero Banner - VW Style */}
      <div className="bg-gradient-to-r from-[#0b1c47] to-[#1161ed] text-white pt-12 pb-16 px-4">
        <div className="container mx-auto max-w-5xl text-center">
          <h1 className="text-[28px] md:text-[32px] font-bold mb-3">Khám phá văn hóa công ty & Khởi đầu sự nghiệp</h1>
          <p className="text-blue-100 text-[15px] mb-8 max-w-2xl mx-auto">
            Tra cứu thông tin công ty và tìm kiếm nơi làm việc phù hợp nhất với định hướng nghề nghiệp của bạn.
          </p>
          
          <form onSubmit={handleSearch} className="max-w-4xl mx-auto flex bg-white rounded-full p-2 shadow-lg">
            <div className="flex-1 flex items-center px-5 border-r border-gray-200">
              <Search className="size-5 text-gray-400 mr-3" />
              <input 
                type="text" 
                value={keyword}
                onChange={e => setKeyword(e.target.value)}
                placeholder="Nhập tên công ty..." 
                className="w-full py-2.5 text-gray-800 focus:outline-none text-[15px]"
              />
            </div>
            <button type="submit" className="bg-[var(--vw-orange)] text-white px-8 py-2.5 rounded-full font-bold hover:bg-[#e05b1c] transition-colors whitespace-nowrap ml-2">
              Tìm kiếm
            </button>
          </form>
        </div>
      </div>

      <main className="container mx-auto px-4 py-12 max-w-6xl -mt-6">
        {isLoading ? (
          <div className="flex justify-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[var(--vw-blue)]"></div>
          </div>
        ) : companies.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
            <Building2 className="size-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">Không tìm thấy công ty nào</h3>
            <p className="text-gray-500">Thử thay đổi từ khóa tìm kiếm của bạn.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((company, index) => (
              <Link key={company.id} href={`/companies/${company.id}`} className="block group h-full">
                <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.06)] border border-gray-100 overflow-hidden h-full flex flex-col hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300 relative">
                  
                  {/* Cover Image / Banner */}
                  <div className={`h-28 w-full bg-gradient-to-r ${['from-blue-100 to-indigo-100', 'from-emerald-100 to-teal-100', 'from-orange-100 to-rose-100', 'from-purple-100 to-pink-100'][index % 4]} relative`}>
                     {/* Pattern overlay optional */}
                     <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                  </div>

                  {/* Logo overlapping cover */}
                  <div className="px-5 relative">
                    <div className="size-16 bg-white rounded-lg shadow-sm border border-gray-100 p-1 flex items-center justify-center absolute -top-8 left-5 overflow-hidden">
                      {company.logoUrl ? (
                        <img src={company.logoUrl} alt={company.name} className="w-full h-full object-contain" />
                      ) : (
                        <Building2 className="size-8 text-gray-300" />
                      )}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="px-5 pt-12 pb-5 flex flex-col flex-1">
                    <h3 className="font-bold text-[16px] text-gray-800 group-hover:text-[var(--vw-blue)] transition-colors line-clamp-1 mb-1">
                      {company.name}
                    </h3>
                    
                    {company.industry ? (
                      <p className="text-[13px] text-gray-500 line-clamp-1 mb-4">{company.industry}</p>
                    ) : (
                      <p className="text-[13px] text-gray-400 line-clamp-1 mb-4">Lĩnh vực chưa cập nhật</p>
                    )}

                    <div className="mt-auto space-y-2 mb-4">
                      {company.location && (
                        <div className="flex items-center gap-2 text-[13px] text-gray-600">
                          <MapPin className="size-4 shrink-0 text-gray-400" />
                          <span className="line-clamp-1">{company.location}</span>
                        </div>
                      )}
                      {company.companySize && (
                        <div className="flex items-center gap-2 text-[13px] text-gray-600">
                          <Users className="size-4 shrink-0 text-gray-400" />
                          <span>{company.companySize}</span>
                        </div>
                      )}
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-auto">
                      <span className="text-[13px] font-medium text-[var(--vw-blue)] flex items-center gap-1 group-hover:underline">
                        Xem chi tiết <ChevronRight className="size-3" />
                      </span>
                      {company.website && (
                        <Globe className="size-4 text-gray-300 group-hover:text-[var(--vw-blue)] transition-colors" />
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
