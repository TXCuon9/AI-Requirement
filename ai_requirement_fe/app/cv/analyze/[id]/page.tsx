"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchApi } from "../../../../lib/api";
import Navbar from "../../../../components/Navbar";
import { ArrowLeft, Loader2, Sparkles, CheckCircle2, AlertCircle, Lightbulb, Phone, Mail, MapPin, Briefcase, Code2 } from "lucide-react";

export default function AIAnalyzePage() {
  const { id } = useParams();
  const router = useRouter();

  const [formData, setFormData] = useState<any>(null);
  const [aiResult, setAiResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [error, setError] = useState("");

  const loadData = (forceReEvaluate: boolean = false) => {
    if (!id) return;
    setIsAnalyzing(true);
    setError("");

    fetchApi(`/resume/${id}`)
      .then(resume => {
        setFormData(resume);

        // Use cache if available and not forcing re-evaluation
        if (!forceReEvaluate && resume.aiAnalysisResult) {
          setAiResult(resume.aiAnalysisResult);
          setIsAnalyzing(false);
          return null;
        }

        // Call Python AI API
        const aiApiUrl = process.env.NEXT_PUBLIC_AI_API_URL || "https://ai-recruitment-python.onrender.com";
        return fetch(`${aiApiUrl}/api/v1/analysis/cv`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(resume)
        });
      })
      .then(res => {
        if (res === null) return null; // Used cache
        if (!res.ok) {
          return res.json().then(err => { throw new Error(err.detail || "Lỗi từ server AI"); });
        }
        return res.json();
      })
      .then(data => {
        if (data === null) return; // Used cache
        if (data.detail) {
          setError(data.detail);
          setIsAnalyzing(false);
        } else {
          setAiResult(data);
          // Save cache to backend
          fetchApi(`/resume/${id}/ai-analysis`, {
            method: "PUT",
            body: JSON.stringify(data)
          }).catch(err => console.error("Failed to save AI analysis cache:", err))
            .finally(() => setIsAnalyzing(false));
        }
      })
      .catch(err => {
        console.error(err);
        setError(err.message || "Không thể phân tích CV lúc này. Vui lòng thử lại sau.");
        setIsAnalyzing(false);
      });
  };

  useEffect(() => {
    loadData();
  }, [id]);

  if (!formData && !error) {
    return (
      <div className="min-h-screen bg-[#F4F5F5] flex items-center justify-center">
        <Loader2 className="size-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#F4F5F5] font-sans text-slate-900">
      <Navbar />

      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-[1400px]">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/cv")}
              className="text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-2 text-sm font-semibold"
            >
              <ArrowLeft className="size-4" /> Trở lại danh sách CV
            </button>
            <div className="h-6 w-px bg-slate-300 mx-2 hidden sm:block"></div>
            <h1 className="font-bold text-slate-800 hidden sm:block">
              {formData?.cvName || "Đang phân tích CV..."}
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content: 2 Columns */}
      <div className="flex-1 flex overflow-hidden max-h-[calc(100vh-64px)]">

        {/* Left Column: AI Feedback */}
        <div className="w-full lg:w-[450px] xl:w-[500px] bg-white border-r border-slate-200 overflow-y-auto shrink-0 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10 p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="size-14 rounded-xl overflow-hidden shadow-lg shadow-purple-500/20 border-2 border-white shrink-0">
              <img src="/images/ai-mascot.png" alt="AI Mascot" className="w-full h-full object-cover bg-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-indigo-700">
                AI Phân tích CV
              </h2>
              <p className="text-sm text-slate-500 font-medium">Chuyên gia Tuyển dụng</p>
            </div>
          </div>

          {!isAnalyzing && aiResult && (
            <button
              onClick={() => loadData(true)}
              className="w-full mb-6 bg-white border-2 border-purple-600 text-purple-600 hover:bg-purple-50 font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <Sparkles className="size-4" /> Đánh giá lại CV
            </button>
          )}

          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-xl flex gap-2 border border-red-100">
              <AlertCircle className="size-5 shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {isAnalyzing && !error && (
            <div className="space-y-8 animate-pulse">
              <div className="flex justify-center my-10">
                <div className="size-32 rounded-full border-8 border-slate-100 flex items-center justify-center relative">
                  <div className="absolute inset-0 border-8 border-indigo-200 rounded-full border-t-indigo-600 animate-spin"></div>
                  <span className="text-slate-400 font-bold">Analyzing</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-6 bg-slate-200 rounded w-1/3"></div>
                <div className="h-4 bg-slate-100 rounded w-full"></div>
                <div className="h-4 bg-slate-100 rounded w-5/6"></div>
              </div>
              <div className="space-y-3">
                <div className="h-6 bg-slate-200 rounded w-1/3"></div>
                <div className="h-4 bg-slate-100 rounded w-full"></div>
                <div className="h-4 bg-slate-100 rounded w-4/5"></div>
              </div>
            </div>
          )}

          {aiResult && !isAnalyzing && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

              {/* Score Ring */}
              <div className="flex flex-col items-center justify-center bg-slate-50 p-8 rounded-3xl border border-slate-100 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-purple-50 opacity-50"></div>
                <div className="relative size-36">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#e2e8f0" strokeWidth="10" />
                    <circle
                      cx="50" cy="50" r="45" fill="none"
                      stroke={parseFloat(aiResult.overall_score || 0) >= 80 ? "#10b981" : parseFloat(aiResult.overall_score || 0) >= 60 ? "#f59e0b" : "#ef4444"}
                      strokeWidth="10" strokeDasharray="283"
                      strokeDashoffset={isNaN(parseFloat(aiResult.overall_score)) ? 283 : 283 - (283 * parseFloat(aiResult.overall_score)) / 100}
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-black text-slate-800">{aiResult.overall_score || "N/A"}</span>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">/ 100</span>
                  </div>
                </div>
                <p className="mt-4 text-center font-semibold text-slate-700 relative z-10">
                  {parseFloat(aiResult.overall_score || 0) >= 80 ? "CV Xuất sắc!" : parseFloat(aiResult.overall_score || 0) >= 60 ? "CV Khá Tốt" : "Cần Cải Thiện Thêm"}
                </p>
              </div>

              {/* Pros */}
              {aiResult.pros && aiResult.pros.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <CheckCircle2 className="size-5 text-emerald-500" /> Ưu điểm nổi bật
                  </h3>
                  <ul className="space-y-3">
                    {aiResult.pros.map((pro: string, i: number) => (
                      <li key={i} className="flex items-start gap-3 bg-emerald-50 p-4 rounded-xl border border-emerald-100/50">
                        <span className="text-emerald-700 text-sm leading-relaxed">{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Cons */}
              {aiResult.cons && aiResult.cons.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <AlertCircle className="size-5 text-rose-500" /> Điểm yếu / Hạn chế
                  </h3>
                  <ul className="space-y-3">
                    {aiResult.cons.map((con: string, i: number) => (
                      <li key={i} className="flex items-start gap-3 bg-rose-50 p-4 rounded-xl border border-rose-100/50">
                        <span className="text-rose-700 text-sm leading-relaxed">{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Recommendations */}
              {aiResult.recommendations && aiResult.recommendations.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Lightbulb className="size-5 text-amber-500" /> Lời khuyên cải thiện
                  </h3>
                  <div className="bg-amber-50 p-5 rounded-2xl border border-amber-200/60 shadow-sm shadow-amber-100/50 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10"><Lightbulb className="size-20" /></div>
                    <ul className="space-y-4 relative z-10">
                      {aiResult.recommendations.map((rec: string, i: number) => (
                        <li key={i} className="flex gap-3 text-amber-900 text-sm leading-relaxed">
                          <span className="font-bold text-amber-600 mt-0.5">•</span> {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

            </div>
          )}
        </div>

        {/* Right Column: CV Preview */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center bg-slate-300/30">

          <div className="w-full max-w-[794px] min-h-[600px] h-fit bg-white shadow-2xl mx-auto flex origin-top transition-all scale-[0.85] sm:scale-100">

            {/* Left Sidebar (Dark Blue) */}
            <div className="w-[35%] bg-[#1A2C42] text-white p-8 flex flex-col">

              <div className="flex flex-col items-center mb-8">
                <div className="size-32 rounded-full overflow-hidden border-4 border-slate-500 bg-white flex items-center justify-center text-4xl font-bold text-[#1A2C42]">
                  {formData?.avatarUrl ? (
                    <img src={formData.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    formData?.fullName ? formData.fullName.charAt(0).toUpperCase() : "A"
                  )}
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-sm font-bold uppercase tracking-wider mb-4 border-b border-slate-600 pb-2">Liên hệ</h3>
                <ul className="space-y-4 text-sm text-slate-300">
                  {formData?.phone && (
                    <li className="flex items-start gap-3"><Phone className="size-4 mt-0.5 shrink-0" /> <span className="break-all">{formData.phone}</span></li>
                  )}
                  {formData?.email && (
                    <li className="flex items-start gap-3"><Mail className="size-4 mt-0.5 shrink-0" /> <span className="break-all">{formData.email}</span></li>
                  )}
                  {formData?.address && (
                    <li className="flex items-start gap-3"><MapPin className="size-4 mt-0.5 shrink-0" /> <span>{formData.address}</span></li>
                  )}
                  {formData?.linkedinUrl && (
                    <li className="flex items-start gap-3"><Briefcase className="size-4 mt-0.5 shrink-0" /> <span className="break-all">{formData.linkedinUrl}</span></li>
                  )}
                  {formData?.githubUrl && (
                    <li className="flex items-start gap-3"><Code2 className="size-4 mt-0.5 shrink-0" /> <span className="break-all">{formData.githubUrl}</span></li>
                  )}
                </ul>
              </div>

              {(formData?.dob || formData?.gender) && (
                <div className="mb-8">
                  <h3 className="text-sm font-bold uppercase tracking-wider mb-4 border-b border-slate-600 pb-2">Thông tin cơ bản</h3>
                  <ul className="space-y-4 text-sm text-slate-300">
                    {formData?.dob && (
                      <li><strong className="block text-white font-medium">Ngày sinh</strong> {new Date(formData.dob).toLocaleDateString("vi-VN")}</li>
                    )}
                    {formData?.gender && (
                      <li><strong className="block text-white font-medium">Giới tính</strong> {formData.gender}</li>
                    )}
                  </ul>
                </div>
              )}

              {formData?.skills && formData.skills.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-sm font-bold uppercase tracking-wider mb-4 border-b border-slate-600 pb-2">Kỹ năng</h3>
                  <ul className="space-y-3">
                    {formData.skills.map((skill: any, idx: number) => {
                      // Skill might be string or object depending on structure
                      const skillName = typeof skill === 'string' ? skill : skill.name || skill;
                      return (
                        <li key={idx} className="text-sm text-slate-300">
                          <strong className="block text-white font-medium mb-1">{skillName}</strong>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              {formData?.hobbies && (
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider mb-4 border-b border-slate-600 pb-2">Sở thích</h3>
                  <p className="text-slate-300 text-sm whitespace-pre-wrap">{formData.hobbies}</p>
                </div>
              )}

            </div>

            {/* Right Main Content */}
            <div className="w-[65%] p-10 bg-white">

              <div className="mb-10">
                <h1 className="text-3xl font-black text-slate-900 uppercase tracking-wide mb-2">
                  {formData?.fullName || "HỌ VÀ TÊN"}
                </h1>
                <h2 className="text-xl font-medium text-blue-600">
                  {formData?.targetPosition || "VỊ TRÍ ỨNG TUYỂN"}
                </h2>
              </div>

              {formData?.summary && (
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-slate-900 border-b-2 border-slate-900 pb-1 mb-4 flex items-center gap-2 uppercase tracking-wide">
                    Mục tiêu nghề nghiệp
                  </h3>
                  <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
                    {formData.summary}
                  </p>
                </div>
              )}

              {formData?.educationItemDTOS && formData.educationItemDTOS.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-slate-900 border-b-2 border-slate-900 pb-1 mb-4 flex items-center gap-2 uppercase tracking-wide">
                    Học vấn
                  </h3>
                  <div className="space-y-6">
                    {formData.educationItemDTOS.map((edu: any, idx: number) => (
                      <div key={idx}>
                        <div className="flex justify-between items-baseline mb-1">
                          <h4 className="font-bold text-slate-800">{edu.school || edu.schoolName || "Tên Trường"}</h4>
                          <span className="text-xs text-slate-500 font-semibold">{edu.startDate} - {edu.endDate}</span>
                        </div>
                        {edu.degree && <p className="text-sm font-bold text-slate-700">{edu.degree}</p>}
                        {edu.major && <p className="text-sm font-semibold text-slate-600 mb-1">Chuyên ngành: {edu.major}</p>}
                        {edu.gpa && <p className="text-sm font-medium text-slate-500 mb-2">GPA: {edu.gpa}</p>}
                        {edu.description && (
                          <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed mt-1">{edu.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {formData?.projectItems && formData.projectItems.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-slate-900 border-b-2 border-slate-900 pb-1 mb-4 flex items-center gap-2 uppercase tracking-wide">
                    Dự án nổi bật
                  </h3>
                  <div className="space-y-6">
                    {formData.projectItems.map((proj: any, idx: number) => (
                      <div key={idx}>
                        <div className="flex justify-between items-baseline mb-1">
                          <h4 className="font-bold text-slate-800">{proj.projectName || "Tên Dự án"}</h4>
                          <span className="text-xs text-slate-500 font-semibold">{proj.startDate} - {proj.endDate}</span>
                        </div>
                        {(proj.role || proj.link) && (
                          <div className="flex gap-4 items-center mb-2">
                            {proj.role && <p className="text-sm font-semibold text-slate-600">{proj.role}</p>}
                            {proj.link && <a href={proj.link} target="_blank" className="text-xs text-blue-600 underline">Link dự án</a>}
                          </div>
                        )}
                        {proj.description && (
                          <div className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                            {proj.description.split('\n').map((line: string, i: number) => {
                              if (line.trim().startsWith('-')) {
                                return <li key={i} className="ml-4 list-disc list-outside">{line.substring(1).trim()}</li>
                              }
                              return <p key={i}>{line}</p>
                            })}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {formData?.experiences && formData.experiences.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-slate-900 border-b-2 border-slate-900 pb-1 mb-4 flex items-center gap-2 uppercase tracking-wide">
                    Kinh nghiệm làm việc
                  </h3>
                  <div className="space-y-6">
                    {formData.experiences.map((exp: any, idx: number) => (
                      <div key={idx}>
                        <div className="flex justify-between items-baseline mb-1">
                          <h4 className="font-bold text-slate-800">{exp.companyName || "Tên Công ty"}</h4>
                          <span className="text-xs text-slate-500 font-semibold">{exp.startDate} - {exp.endDate}</span>
                        </div>
                        {exp.position && <p className="text-sm font-semibold text-slate-600 mb-2">{exp.position}</p>}
                        {exp.description && (
                          <div className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                            {exp.description.split('\n').map((line: string, i: number) => {
                              if (line.trim().startsWith('-')) {
                                return <li key={i} className="ml-4 list-disc list-outside">{line.substring(1).trim()}</li>
                              }
                              return <p key={i}>{line}</p>
                            })}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
