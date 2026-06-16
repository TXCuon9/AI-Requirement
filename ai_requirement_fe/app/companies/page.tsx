"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { fetchApi } from "../../lib/api";
import { Building2, MapPin, Globe, Users, Search } from "lucide-react";

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
    <div className="flex flex-col min-h-screen bg-[#F4F5F5] font-sans text-slate-900">
      <Navbar />

      {/* Banner / Search */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white py-16 px-4">
        <div className="container mx-auto max-w-5xl text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Khám phá các Công ty nổi bật</h1>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Tra cứu thông tin công ty và tìm kiếm nơi làm việc phù hợp nhất với định hướng nghề nghiệp của bạn.
          </p>
          
          <form onSubmit={handleSearch} className="max-w-3xl mx-auto flex bg-white rounded-xl p-2 shadow-lg">
            <div className="flex-1 flex items-center px-4">
              <Search className="size-5 text-slate-400 mr-2" />
              <input 
                type="text" 
                value={keyword}
                onChange={e => setKeyword(e.target.value)}
                placeholder="Nhập tên công ty..." 
                className="w-full py-3 text-slate-900 focus:outline-none"
              />
            </div>
            <button type="submit" className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Tìm kiếm
            </button>
          </form>
        </div>
      </div>

      <main className="container mx-auto px-4 py-12 max-w-[1140px]">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : companies.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-slate-200">
            <Building2 className="size-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-700 mb-2">Không tìm thấy công ty nào</h3>
            <p className="text-slate-500">Thử thay đổi từ khóa tìm kiếm của bạn.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((company) => (
              <Link key={company.id} href={`/companies/${company.id}`} className="block group">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 h-full hover:shadow-md hover:border-blue-300 transition-all">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="size-16 rounded-xl border border-slate-100 overflow-hidden bg-white shadow-sm flex items-center justify-center shrink-0">
                      {company.logoUrl ? (
                        <img src={company.logoUrl} alt={company.name} className="w-full h-full object-contain p-1" />
                      ) : (
                        <Building2 className="size-8 text-slate-300" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {company.name}
                      </h3>
                      {company.industry && (
                        <span className="inline-block mt-1 bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded font-medium">
                          {company.industry}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2 mt-4 pt-4 border-t border-slate-100 text-sm text-slate-600">
                    {company.location && (
                      <div className="flex items-start gap-2">
                        <MapPin className="size-4 shrink-0 mt-0.5 text-slate-400" />
                        <span className="line-clamp-1">{company.location}</span>
                      </div>
                    )}
                    {company.companySize && (
                      <div className="flex items-center gap-2">
                        <Users className="size-4 shrink-0 text-slate-400" />
                        <span>{company.companySize}</span>
                      </div>
                    )}
                    {company.website && (
                      <div className="flex items-center gap-2">
                        <Globe className="size-4 shrink-0 text-slate-400" />
                        <span className="line-clamp-1 text-blue-600">{company.website}</span>
                      </div>
                    )}
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
