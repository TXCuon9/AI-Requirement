"use client";

import { useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { ArrowRight, Sparkles, ChevronLeft, ChevronRight, Pencil } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function WowCVPage() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(1);
  const templates = [
    { id: 1, name: "Premium Modern", img: "/images/cv-mock.png", tag: "Mới" },
    { id: 2, name: "Creative Designer", img: "/images/cv-mock.png", tag: "Hot" },
    { id: 3, name: "Minimalist Dev", img: "/images/cv-mock.png" },
    { id: 4, name: "Executive Pro", img: "/images/cv-mock.png" },
    { id: 5, name: "Marketing Specialist", img: "/images/cv-mock.png" },
    { id: 6, name: "Data Analyst", img: "/images/cv-mock.png", tag: "Tiếng Anh" },
    { id: 7, name: "Sales Manager", img: "/images/cv-mock.png" },
    { id: 8, name: "Fresh Graduate", img: "/images/cv-mock.png" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans text-slate-900">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-[#f4f5f5] pt-16 pb-32 px-4 text-center overflow-hidden">
        <div className="max-w-[1200px] mx-auto">
          <h1 className="text-[32px] md:text-[40px] font-bold text-[#333333] mb-4 leading-tight tracking-tight">
            Tổng hợp các Mẫu CV xin việc chuyên nghiệp cho mọi ngành nghề
          </h1>
          <p className="text-[var(--vw-blue)] font-bold text-lg mb-16 flex items-center justify-center gap-2">
            Tạo CV thật dễ dàng cùng công cụ thiết kế WOWCV của AI Recruitment <Sparkles className="size-5" />
          </p>
          
          {/* Coverflow Slider */}
          <div className="relative h-[480px] sm:h-[600px] w-full flex items-center justify-center">
            {templates.slice(0, 5).map((tpl, i) => {
              const position = i - activeIndex;
              const isActive = position === 0;
              const isPrev = position === -1;
              const isNext = position === 1;
              const isHidden = Math.abs(position) > 1;

              let transform = "translateX(0) scale(1)";
              let zIndex = 10;
              let opacity = 1;

              if (isActive) {
                transform = "translateX(0) scale(1.1)";
                zIndex = 30;
              } else if (isPrev) {
                transform = "translateX(-80%) scale(0.85)";
                zIndex = 20;
                opacity = 0.6;
              } else if (isNext) {
                transform = "translateX(80%) scale(0.85)";
                zIndex = 20;
                opacity = 0.6;
              } else if (position < -1) {
                transform = "translateX(-160%) scale(0.7)";
                opacity = 0;
                zIndex = 0;
              } else {
                transform = "translateX(160%) scale(0.7)";
                opacity = 0;
                zIndex = 0;
              }

              return (
                <div 
                  key={tpl.id} 
                  className={`absolute transition-all duration-500 ease-out ${isHidden ? "pointer-events-none" : "cursor-pointer"}`}
                  style={{ transform, zIndex, opacity }}
                  onClick={() => !isActive && setActiveIndex(i)}
                >
                  <div className="w-[280px] sm:w-[400px] aspect-[1/1.4] bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 relative group">
                     <img 
                       src={tpl.img} 
                       alt={tpl.name}
                       onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/400x560?text=CV+Template" }} 
                       className="w-full h-full object-cover" 
                     />
                     
                     {isActive && (
                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[1px]">
                           <button 
                             onClick={(e) => {
                               e.stopPropagation();
                               router.push(`/wowcv/builder?id=${tpl.id}`);
                             }}
                             className="bg-[var(--vw-orange)] text-white font-bold py-3.5 px-8 rounded-full shadow-lg hover:bg-[#e66f00] hover:scale-105 transition-all flex items-center gap-2 text-[15px]"
                           >
                              <Pencil className="size-5"/> Dùng mẫu
                           </button>
                        </div>
                     )}
                  </div>
                </div>
              );
            })}
            
            {/* Controls */}
            <button 
              onClick={() => setActiveIndex(Math.max(0, activeIndex - 1))} 
              className={`absolute left-0 sm:left-12 z-40 bg-white/80 hover:bg-white text-gray-800 p-4 rounded-full shadow-md transition-all ${activeIndex === 0 ? "opacity-50 cursor-not-allowed" : "hover:scale-110"}`}
              disabled={activeIndex === 0}
            >
              <ChevronLeft className="size-6 sm:size-8 text-gray-600" />
            </button>
            <button 
              onClick={() => setActiveIndex(Math.min(4, activeIndex + 1))} 
              className={`absolute right-0 sm:right-12 z-40 bg-white/80 hover:bg-white text-gray-800 p-4 rounded-full shadow-md transition-all ${activeIndex === 4 ? "opacity-50 cursor-not-allowed" : "hover:scale-110"}`}
              disabled={activeIndex === 4}
            >
              <ChevronRight className="size-6 sm:size-8 text-gray-600" />
            </button>
          </div>
        </div>
      </section>

      {/* Templates Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-[1200px]">
          
          {/* Tabs */}
          <div className="flex flex-wrap gap-x-8 gap-y-4 mb-10 border-b border-gray-200">
            <button className="pb-3 border-b-[3px] border-[var(--vw-blue)] text-[var(--vw-blue)] font-bold text-[16px]">
              Tất cả mẫu CV
            </button>
            <button className="pb-3 border-b-[3px] border-transparent text-gray-500 hover:text-gray-800 font-bold text-[16px] transition-colors">
              CV Tiếng Việt
            </button>
            <button className="pb-3 border-b-[3px] border-transparent text-gray-500 hover:text-gray-800 font-bold text-[16px] transition-colors">
              CV Tiếng Anh
            </button>
            <button className="pb-3 border-b-[3px] border-transparent text-gray-500 hover:text-gray-800 font-bold text-[16px] transition-colors">
              Mẫu CV Đơn Giản
            </button>
            <button className="pb-3 border-b-[3px] border-transparent text-gray-500 hover:text-gray-800 font-bold text-[16px] transition-colors">
              Mẫu CV Sáng Tạo
            </button>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {templates.map((tpl) => (
              <div key={tpl.id} className="group relative">
                <div className="rounded-xl overflow-hidden shadow-sm border border-gray-200 relative bg-gray-50 aspect-[1/1.4] cursor-pointer">
                  
                  {tpl.tag && (
                    <div className="absolute top-4 left-4 z-10 bg-red-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider shadow-sm">
                      {tpl.tag}
                    </div>
                  )}

                  <img 
                    src={tpl.img} 
                    alt={tpl.name}
                    onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/400x560?text=CV+Template" }} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center gap-3">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/wowcv/builder?id=${tpl.id}`);
                      }}
                      className="bg-[var(--vw-blue)] hover:bg-[#0c47b5] text-white font-bold py-2.5 px-6 rounded-full w-[160px] text-[14px] transition-colors"
                    >
                      Sử dụng mẫu này
                    </button>
                    <button className="bg-white hover:bg-gray-100 text-gray-900 font-bold py-2.5 px-6 rounded-full w-[160px] text-[14px] transition-colors">
                      Xem chi tiết
                    </button>
                  </div>
                </div>
                
                <h3 className="text-center mt-4 font-bold text-[15px] text-gray-800 group-hover:text-[var(--vw-blue)] cursor-pointer transition-colors">
                  {tpl.name}
                </h3>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button className="bg-white border border-gray-300 hover:border-gray-400 text-gray-700 font-bold py-3 px-8 rounded-full text-[15px] transition-colors shadow-sm">
              Xem thêm các mẫu CV khác
            </button>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}
