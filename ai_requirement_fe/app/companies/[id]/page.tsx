"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { fetchApi } from "../../../lib/api";
import { Building2, MapPin, Globe, Users, Briefcase, Calendar, DollarSign } from "lucide-react";
import { formatSalaryRange } from "../../../lib/utils";

export default function CompanyDetailPage() {
  const params = useParams();
  const id = params.id as string;
  
  const [company, setCompany] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchCompany();
    }
  }, [id]);

  const fetchCompany = async () => {
    setIsLoading(true);
    try {
      const data = await fetchApi(`/company/detail/${id}`);
      setCompany(data);
    } catch (err) {
      console.error("Lỗi khi tải chi tiết công ty:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-[#F4F5F5]">
        <Navbar />
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="flex flex-col min-h-screen bg-[#F4F5F5]">
        <Navbar />
        <div className="text-center py-20">
          <Building2 className="size-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-700 mb-2">Không tìm thấy công ty</h3>
          <Link href="/companies" className="text-blue-600 hover:underline">Quay lại danh sách</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#F4F5F5] font-sans text-slate-900 pb-20">
      <Navbar />

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 max-w-6xl py-4 text-sm text-slate-500 flex items-center gap-2">
        <Link href="/" className="hover:text-blue-600">Trang chủ</Link>
        <span>&gt;</span>
        <Link href="/companies" className="hover:text-blue-600">Danh sách công ty</Link>
        <span>&gt;</span>
        <span className="uppercase text-slate-700 font-medium line-clamp-1">{company.name}</span>
      </div>

      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row gap-6 items-start md:items-center">
          <div className="size-[120px] rounded-lg border border-slate-100 flex items-center justify-center p-2 shrink-0 bg-white">
            {company.logoUrl ? (
              <img src={company.logoUrl} alt={company.name} className="w-full h-full object-contain" />
            ) : (
              <Building2 className="size-12 text-slate-300" />
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-slate-900 mb-3 uppercase">{company.name}</h1>
            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500">
              {company.website && (
                <a 
                  href={company.website.startsWith('http') ? company.website : `https://${company.website}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-1.5 hover:text-blue-600 transition-colors"
                >
                  <Globe className="size-4" /> {company.website}
                </a>
              )}
              {company.companySize && (
                <span className="flex items-center gap-1.5"><Users className="size-4" /> {company.companySize} nhân viên</span>
              )}
            </div>
          </div>
          <div className="shrink-0 w-full md:w-auto">
            <button className="w-full md:w-auto bg-blue-600 text-white px-6 py-2.5 rounded font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-sm">
              <span className="text-lg leading-none mb-0.5">+</span> Theo dõi công ty
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 mt-6 mb-6 text-base font-semibold border-b border-slate-200 px-4">
          <div className="text-blue-600 border-b-2 border-blue-600 pb-3 cursor-pointer">
            Trang chủ
          </div>
          <div className="text-slate-500 pb-3 cursor-pointer hover:text-slate-800 transition-colors">
            Tin tuyển dụng ({company.jobs?.length || 0})
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column (Main) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Giới thiệu công ty</h2>
              <div className="text-slate-700 leading-relaxed whitespace-pre-wrap text-sm text-justify">
                {company.description ? company.description : <span className="italic text-slate-500">Thông tin giới thiệu đang được cập nhật.</span>}
              </div>
            </div>

            {/* Jobs List */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-6">Việc làm đang tuyển</h2>
              <div className="space-y-4">
                {company.jobs && company.jobs.length > 0 ? (
                  company.jobs.map((job: any) => (
                    <Link key={job.id} href={`/jobs/${job.id}`} className="block group border border-slate-100 rounded-lg p-5 hover:border-blue-600 hover:shadow-sm transition-all bg-slate-50 hover:bg-white">
                      <h3 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-1 mb-2 text-base">
                        {job.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-600">
                        {job.salaryMin || job.salaryMax ? (
                          <div className="flex items-center gap-1.5 font-semibold text-blue-600">
                            <DollarSign className="size-4" /> 
                            {formatSalaryRange(job.salaryMin, job.salaryMax, job.currency)}
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 font-semibold text-blue-600">
                            <DollarSign className="size-4" /> Lương thỏa thuận
                          </div>
                        )}
                        <div className="flex items-center gap-1.5">
                          <MapPin className="size-4 text-slate-400" /> {job.location || "Chưa cập nhật"}
                        </div>
                        {job.expiredAt && (
                          <div className="flex items-center gap-1.5">
                            <Calendar className="size-4 text-slate-400" /> Hạn nộp: {new Date(job.expiredAt).toLocaleDateString("vi-VN")}
                          </div>
                        )}
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="text-center py-6 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                    <Briefcase className="size-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-slate-500 text-sm">Hiện tại công ty không có đợt tuyển dụng nào.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column (Sidebar) */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-6">Thông tin chung</h2>
              
              <div className="space-y-6">
                {/* Lĩnh vực hoạt động */}
                <div className="flex items-start gap-4">
                  <div className="size-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                    <Briefcase className="size-5 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Lĩnh vực hoạt động</p>
                    <p className="font-medium text-slate-800 text-sm">{company.industry || "Chưa cập nhật"}</p>
                  </div>
                </div>
                
                {/* Quy mô */}
                <div className="flex items-start gap-4">
                  <div className="size-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                    <Users className="size-5 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Quy mô</p>
                    <p className="font-medium text-slate-800 text-sm">{company.companySize ? `${company.companySize} nhân viên` : "Chưa cập nhật"}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Địa điểm công ty</h2>
              <div className="flex items-start gap-3 text-sm text-slate-700">
                <MapPin className="size-5 text-slate-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{company.location || "Chưa cập nhật"}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
}
