"use client";

import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { ArrowLeft, Save, Download, Loader2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";

function BuilderContent() {
  const searchParams = useSearchParams();
  const templateId = searchParams.get("id");
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [fullName, setFullName] = useState("Sarah J. Anderson");
  const [title, setTitle] = useState("Senior Product Manager");
  const [phone, setPhone] = useState("+1 123 456 7890");
  const [email, setEmail] = useState("sarah.anderson@email.com");
  const [objective, setObjective] = useState("I have a bio who experience and are in a new profession and 3 lines wir using modern typography.");
  const [experiences, setExperiences] = useState([
    {
      id: 1,
      title: "SENIOR PRODUCT MANAGER",
      company: "InnovaTech Solutions | New York, NY",
      duration: "2019 - Present",
      desc: "• Led cross-functional team of 10 for SaaS product launch\n• Increased user acquisition by 25%\n• Increased user acquisition by 25% for customization"
    },
    {
      id: 2,
      title: "PRODUCT MANAGER",
      company: "Quantum Dynamics",
      duration: "2016 - 2019",
      desc: "• Led cross-functional team of 10 sentiles for product and management\n• Decreased the varact maneating up as 30%"
    }
  ]);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert("Đã lưu CV thành công!");
    }, 1500);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navbar />

      {/* Builder Topbar */}
      <div className="bg-white border-b border-slate-200 sticky top-[64px] z-40">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/wowcv" className="flex items-center text-slate-500 hover:text-slate-800 transition-colors font-medium">
              <ArrowLeft className="size-5 mr-1" /> Quay lại
            </Link>
            <div className="h-6 w-px bg-slate-200 mx-2"></div>
            <h1 className="font-bold text-lg">Đang tạo CV - Mẫu {templateId || "1"}</h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-5 py-2 rounded-lg font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors">
              <Download className="size-4" /> Tải PDF
            </button>
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-5 py-2 rounded-lg font-bold text-white bg-[var(--vw-orange)] hover:bg-[#e66f00] transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSaving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
              {isSaving ? "Đang lưu..." : "Lưu CV"}
            </button>
          </div>
        </div>
      </div>

      {/* Builder Main Area */}
      <div className="flex-1 container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-6 h-[calc(100vh-128px)]">
        
        {/* Left Sidebar - Form */}
        <div className="w-full lg:w-[400px] xl:w-[450px] bg-white rounded-xl shadow-sm border border-slate-200 p-6 overflow-y-auto hidden md:block h-full">
          <h2 className="text-xl font-bold mb-6">Thông tin cá nhân</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Họ và Tên</label>
              <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[var(--vw-blue)]/50 focus:border-[var(--vw-blue)] transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Vị trí ứng tuyển</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[var(--vw-blue)]/50 focus:border-[var(--vw-blue)] transition-colors" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Số điện thoại</label>
                <input type="text" value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[var(--vw-blue)]/50 focus:border-[var(--vw-blue)] transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[var(--vw-blue)]/50 focus:border-[var(--vw-blue)] transition-colors" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Mục tiêu nghề nghiệp</label>
              <textarea rows={4} value={objective} onChange={e => setObjective(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[var(--vw-blue)]/50 focus:border-[var(--vw-blue)] transition-colors resize-none"></textarea>
            </div>
          </div>
          
          <h2 className="text-xl font-bold mt-8 mb-6">Kinh nghiệm làm việc</h2>
          <div className="space-y-4">
            {experiences.map((exp, index) => (
              <div key={exp.id} className="p-4 border border-slate-200 rounded-lg">
                <input type="text" value={exp.title} onChange={e => {
                  const newExp = [...experiences];
                  newExp[index].title = e.target.value;
                  setExperiences(newExp);
                }} className="font-bold w-full focus:outline-none bg-transparent" />
                <input type="text" value={exp.company} onChange={e => {
                  const newExp = [...experiences];
                  newExp[index].company = e.target.value;
                  setExperiences(newExp);
                }} className="text-sm font-medium w-full focus:outline-none bg-transparent mt-1" />
                <input type="text" value={exp.duration} onChange={e => {
                  const newExp = [...experiences];
                  newExp[index].duration = e.target.value;
                  setExperiences(newExp);
                }} className="text-sm text-slate-500 mb-2 w-full focus:outline-none bg-transparent" />
                <textarea rows={3} value={exp.desc} onChange={e => {
                  const newExp = [...experiences];
                  newExp[index].desc = e.target.value;
                  setExperiences(newExp);
                }} className="text-sm text-slate-700 w-full focus:outline-none bg-transparent resize-none leading-relaxed"></textarea>
              </div>
            ))}
            <button className="w-full py-2 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 font-medium hover:border-slate-400 hover:text-slate-600 transition-colors">
              + Thêm kinh nghiệm
            </button>
          </div>
        </div>

        {/* Right Area - Preview */}
        <div className="flex-1 bg-slate-200/50 rounded-xl border border-slate-200 flex items-start justify-center overflow-y-auto overflow-x-hidden h-full py-8">
          {/* A4 Paper Mockup with Scaling for smaller screens */}
          <div className="w-[794px] h-[1123px] bg-white shadow-2xl shrink-0 origin-top scale-[0.6] sm:scale-[0.8] xl:scale-[0.9] flex text-slate-900 border border-slate-100">
            
            {/* Template: Left Sidebar */}
            <div className="w-[35%] bg-[#eef5fa] p-8 flex flex-col items-center h-full">
              <div className="w-44 h-44 rounded-full overflow-hidden border-4 border-white shadow-md mb-10 mt-6 shrink-0">
                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200" alt="Avatar" className="w-full h-full object-cover" />
              </div>
              
              <div className="w-full space-y-6">
                <div className="flex gap-4 items-start text-[#333333]">
                   <div className="mt-1 shrink-0 bg-[#333333] text-white p-1 rounded-sm">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                   </div>
                   <div>
                     <div className="font-bold text-[15px]">Phone</div>
                     <div className="text-[14px] leading-tight mt-0.5">{phone}</div>
                   </div>
                </div>
                
                <div className="flex gap-4 items-start text-[#333333]">
                   <div className="mt-1 shrink-0 bg-[#333333] text-white p-1 rounded-sm">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>
                   </div>
                   <div>
                     <div className="font-bold text-[15px]">Email</div>
                     <div className="text-[14px] leading-tight mt-0.5 break-all">{email}</div>
                   </div>
                </div>

                <div className="flex gap-4 items-start text-[#333333]">
                   <div className="mt-1 shrink-0 bg-[#333333] text-white p-1 rounded-sm">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect width="4" height="12" x="2" y="9"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                   </div>
                   <div>
                     <div className="font-bold text-[15px]">LinkedIn</div>
                     <div className="text-[14px] leading-tight mt-0.5">linkedin.com/in/sarah</div>
                   </div>
                </div>
              </div>
              
              <div className="w-full mt-10">
                 <h3 className="text-[22px] font-bold text-[#333333] mb-4 border-b border-[#aecce0] pb-2">About Me</h3>
                 <p className="text-[14px] text-[#333333] leading-relaxed whitespace-pre-wrap">{objective}</p>
              </div>
              
              <div className="w-full mt-10">
                 <h3 className="text-[22px] font-bold text-[#333333] mb-4 border-b border-[#aecce0] pb-2">Skills</h3>
                 <h4 className="font-bold text-[15px] mb-2 text-[#333333]">Hard Skills</h4>
                 <ul className="list-disc list-inside text-[14px] text-[#333333] space-y-1 ml-2 marker:text-[#67a3cf]">
                   <li>Python</li><li>Java</li><li>SQL</li><li>Project Management</li>
                 </ul>
                 <h4 className="font-bold text-[15px] mt-4 mb-2 text-[#333333]">Soft Skills</h4>
                 <ul className="list-disc list-inside text-[14px] text-[#333333] space-y-1 ml-2 marker:text-[#67a3cf]">
                   <li>Leadership</li><li>Communication</li><li>Problem-solving</li>
                 </ul>
              </div>
            </div>
            
            {/* Template: Right Main Content */}
            <div className="w-[65%] p-12 h-full bg-white">
               <h1 className="text-[54px] font-black text-[#565656] tracking-tight leading-none mb-2 pt-6">{fullName}</h1>
               <h2 className="text-[20px] font-medium text-[#333333] uppercase tracking-wider">{title}</h2>
               
               <div className="mt-14">
                 <h3 className="text-[24px] font-bold text-[#333333] border-b-2 border-[#aecce0] pb-2 mb-6">Work Experience</h3>
                 
                 <div className="space-y-8">
                   {experiences.map((exp) => (
                     <div key={exp.id}>
                        <h4 className="text-[16px] font-bold uppercase text-[#333333]">{exp.title}</h4>
                        <div className="text-[15px] text-[#333333] mb-1 leading-snug">
                          {exp.company} <span className="text-[#666666] mx-1">|</span> {exp.duration}
                        </div>
                        <div className="text-[14px] text-[#333333] leading-relaxed mt-2 whitespace-pre-wrap">
                          {exp.desc}
                        </div>
                     </div>
                   ))}
                 </div>
               </div>

               <div className="mt-12">
                 <h3 className="text-[24px] font-bold text-[#333333] border-b-2 border-[#aecce0] pb-2 mb-6">Education</h3>
                 
                 <div>
                    <h4 className="text-[16px] font-bold uppercase text-[#333333]">M.S. in COMPUTER SCIENCE</h4>
                    <div className="text-[15px] text-[#333333] leading-snug">
                      Columbia University <span className="text-[#666666] mx-1">|</span> 2014 - 2016
                    </div>
                 </div>
               </div>
            </div>
            
          </div>
        </div>

      </div>

    </div>
  );
}

export default function WowCVBuilderPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="size-8 animate-spin text-[var(--vw-blue)]" />
      </div>
    }>
      <BuilderContent />
    </Suspense>
  );
}
