"use client";

import Navbar from "../../components/Navbar";
import Link from "next/link";
import { ArrowRight, Star, TrendingUp, CheckCircle2 } from "lucide-react";

export default function TemplatesPage() {
  const templates = [
    {
      id: "professional",
      name: "CV Chuyên Nghiệp",
      description: "Phù hợp với môi trường kỷ luật, công ty lớn, nhà nước.",
      icon: <Star className="size-5 text-amber-500" />,
      color: "blue",
      img: "https://www.topcv.vn/images/cv/avatars/default/cv-template-default.png"
    },
    {
      id: "creative",
      name: "CV Ấn Tượng",
      description: "Phù hợp cho các vị trí Design, Marketing, Content.",
      icon: <TrendingUp className="size-5 text-purple-500" />,
      color: "purple",
      img: "https://www.topcv.vn/images/cv/avatars/default/cv-template-default.png"
    },
    {
      id: "harvard",
      name: "CV Harvard",
      description: "Tiêu chuẩn cho sinh viên mới ra trường, khối học thuật.",
      icon: <CheckCircle2 className="size-5 text-emerald-500" />,
      color: "emerald",
      img: "https://www.topcv.vn/images/cv/avatars/default/cv-template-default.png"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#F4F5F5] font-sans text-slate-900">
      <Navbar />

      <main className="container mx-auto px-4 py-10 max-w-[1140px]">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Danh sách Mẫu CV xin việc tiếng Việt / Anh chuẩn 2026</h1>
          <p className="text-slate-600 text-lg">Các mẫu CV được thiết kế chuẩn mực, giúp bạn tăng 80% cơ hội được gọi phỏng vấn. Tự động điền dữ liệu từ Hồ sơ Online của bạn!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {templates.map(tpl => (
            <div key={tpl.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden group hover:shadow-lg transition-all duration-300">
              <div className="h-64 bg-slate-100 flex flex-col relative overflow-hidden p-6 items-center justify-center">
                {/* Mock Template Preview */}
                <div className={`w-3/4 h-full bg-white shadow-md border-t-4 border-${tpl.color}-500 rounded-t flex flex-col p-4 opacity-90 group-hover:opacity-100 transition-opacity translate-y-4 group-hover:translate-y-2`}>
                   <div className="w-12 h-12 bg-slate-200 rounded-full mb-3"></div>
                   <div className="w-3/4 h-3 bg-slate-300 rounded mb-2"></div>
                   <div className="w-1/2 h-2 bg-slate-200 rounded mb-6"></div>
                   <div className="w-full h-2 bg-slate-100 rounded mb-2"></div>
                   <div className="w-5/6 h-2 bg-slate-100 rounded mb-4"></div>
                   <div className="w-1/2 h-3 bg-slate-200 rounded mb-2"></div>
                   <div className="w-full h-2 bg-slate-100 rounded"></div>
                </div>
                
                {/* Overlay actions on hover */}
                <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                   <Link href={`/cv/builder?template=${tpl.id}`} className={`bg-${tpl.color}-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-${tpl.color}-700 transition-colors shadow-lg flex items-center gap-2`}>
                      Dùng mẫu này <ArrowRight className="size-4" />
                   </Link>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  {tpl.icon}
                  <h3 className="text-xl font-bold text-slate-900">{tpl.name}</h3>
                </div>
                <p className="text-sm text-slate-500 mb-4 h-10">{tpl.description}</p>
                <Link href={`/cv/builder?template=${tpl.id}`} className={`text-${tpl.color}-600 font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all`}>
                  Xem chi tiết và Tạo CV <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
