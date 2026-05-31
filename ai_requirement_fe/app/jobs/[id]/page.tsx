"use client";

import Link from "next/link";
import { MapPin, BriefcaseBusiness, Heart, Building2, Send, Clock, DollarSign, Users, ChevronRight, Share2, AlertCircle } from "lucide-react";
import Navbar from "../../../components/Navbar";
import { useParams } from "next/navigation";

export default function JobDetailPage() {
  const params = useParams();
  const jobId = params.id; // Just for demo

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-900 pb-20 md:pb-0">
      <Navbar />

      {/* Breadcrumbs */}
      <div className="bg-slate-50 py-3 border-b border-slate-200">
        <div className="container mx-auto px-4 flex items-center text-sm text-slate-500">
          <Link href="/" className="hover:text-blue-600">Trang chủ</Link>
          <ChevronRight className="size-4 mx-1" />
          <Link href="/jobs" className="hover:text-blue-600">Việc làm IT</Link>
          <ChevronRight className="size-4 mx-1" />
          <span className="text-slate-900 font-medium truncate">Senior React Developer</span>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        
        {/* Top Header Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-blue-700"></div>
          
          <div className="flex flex-col md:flex-row gap-6 mt-2">
            {/* Company Logo */}
            <div className="size-24 rounded-2xl bg-white border-2 border-slate-100 flex items-center justify-center shrink-0 shadow-sm p-2">
              <Building2 className="size-12 text-blue-200" />
            </div>

            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Senior React Developer (Typescript / Next.js)</h1>
              <Link href={`/companies/1`} className="text-lg text-slate-600 hover:text-blue-600 transition-colors font-medium">
                Tech Company {jobId || 1}
              </Link>
              
              <div className="flex flex-wrap items-center gap-4 mt-4">
                <div className="flex items-center gap-2 text-slate-700">
                  <div className="p-2 bg-blue-50 rounded-full text-blue-600">
                    <DollarSign className="size-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 font-medium">Mức lương</div>
                    <div className="font-semibold text-slate-900">20 - 40 triệu</div>
                  </div>
                </div>
                <div className="w-px h-10 bg-slate-200 hidden md:block"></div>
                
                <div className="flex items-center gap-2 text-slate-700">
                  <div className="p-2 bg-blue-50 rounded-full text-blue-600">
                    <MapPin className="size-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 font-medium">Địa điểm</div>
                    <div className="font-semibold text-slate-900">Hà Nội</div>
                  </div>
                </div>
                <div className="w-px h-10 bg-slate-200 hidden md:block"></div>
                
                <div className="flex items-center gap-2 text-slate-700">
                  <div className="p-2 bg-blue-50 rounded-full text-blue-600">
                    <BriefcaseBusiness className="size-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 font-medium">Kinh nghiệm</div>
                    <div className="font-semibold text-slate-900">2 năm</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions Desktop */}
            <div className="hidden md:flex flex-col gap-3 shrink-0 w-48">
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-md shadow-blue-600/20 flex items-center justify-center gap-2">
                <Send className="size-4" /> Ứng tuyển ngay
              </button>
              <button className="w-full bg-white border-2 border-slate-200 hover:border-blue-600 text-slate-700 hover:text-blue-600 font-semibold py-2.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-2">
                <Heart className="size-4" /> Lưu việc làm
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Left Column - Job Details */}
          <div className="flex-1 w-full space-y-6">
            
            {/* Chi tiết công việc */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-6 border-l-4 border-blue-600 pl-3">Chi tiết công việc</h2>
              
              <div className="space-y-6 text-slate-700 leading-relaxed">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Mô tả công việc</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Tham gia thiết kế và phát triển các ứng dụng Web sử dụng ReactJS / Next.js.</li>
                    <li>Phối hợp với đội ngũ UI/UX Designer, Backend, QA để hoàn thiện sản phẩm.</li>
                    <li>Tối ưu hóa performance, đảm bảo code chuẩn SEO và responsive.</li>
                    <li>Nghiên cứu và áp dụng các công nghệ mới vào dự án thực tế.</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Yêu cầu ứng viên</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Có ít nhất 2 năm kinh nghiệm làm việc với ReactJS, Javascript/Typescript.</li>
                    <li>Am hiểu về State Management (Redux, Zustand, Context API...).</li>
                    <li>Có kinh nghiệm với Next.js (App Router), Server Side Rendering (SSR) là một lợi thế cực lớn.</li>
                    <li>Hiểu biết về RESTful API, GraphQL.</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Quyền lợi</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Lương cứng 20 - 40 triệu (tùy năng lực) + Thưởng dự án.</li>
                    <li>Môi trường làm việc trẻ trung, năng động, Agile/Scrum.</li>
                    <li>Được cung cấp Macbook Pro M2 / M3.</li>
                    <li>Review lương 2 lần/năm. Bảo hiểm sức khỏe PVI.</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-yellow-50/50 p-4 rounded-xl border border-yellow-200">
              <AlertCircle className="size-6 text-yellow-600 shrink-0" />
              <p className="text-sm text-yellow-800">
                Báo cáo tin tuyển dụng: Nếu bạn thấy tin tuyển dụng này không đúng sự thật hoặc vi phạm pháp luật, hãy báo cáo cho chúng tôi.
              </p>
            </div>
          </div>

          {/* Right Column - Company & Summary */}
          <div className="w-full lg:w-[350px] shrink-0 space-y-6">
            
            {/* Company Summary */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="size-16 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                  <Building2 className="size-8 text-blue-200" />
                </div>
                <h2 className="text-lg font-bold text-slate-900 leading-tight">Tech Company {jobId || 1}</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex gap-3 text-slate-700">
                  <Users className="size-5 text-slate-400 shrink-0" />
                  <div>
                    <div className="text-xs text-slate-500 font-medium">Quy mô</div>
                    <div className="text-sm font-medium">50 - 150 nhân viên</div>
                  </div>
                </div>
                <div className="flex gap-3 text-slate-700">
                  <MapPin className="size-5 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs text-slate-500 font-medium">Địa điểm</div>
                    <div className="text-sm font-medium">Tầng 12, Tòa nhà Keangnam, Phạm Hùng, Nam Từ Liêm, Hà Nội</div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-slate-100">
                <Link href={`/companies/1`} className="text-blue-600 font-medium hover:underline text-sm flex items-center justify-center">
                  Xem trang công ty <ChevronRight className="size-4 ml-1" />
                </Link>
              </div>
            </div>

            {/* General Info */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Thông tin chung</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-50 pb-3">
                  <span className="text-slate-500 text-sm">Cấp bậc</span>
                  <span className="font-medium text-sm">Nhân viên / Chuyên viên</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-50 pb-3">
                  <span className="text-slate-500 text-sm">Hình thức</span>
                  <span className="font-medium text-sm">Nhân viên chính thức</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 text-sm">Thời gian làm việc</span>
                  <span className="font-medium text-sm">Thứ 2 - Thứ 6</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Mobile Fixed Action Bar */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 p-4 flex gap-3 z-50">
        <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl shadow-md">
          Ứng tuyển ngay
        </button>
        <button className="size-12 flex items-center justify-center shrink-0 bg-white border-2 border-slate-200 text-slate-600 rounded-xl">
          <Heart className="size-6" />
        </button>
      </div>
    </div>
  );
}
