"use client";

import { useState, useRef, useEffect } from "react";
import Navbar from "../../components/Navbar";
import { UploadCloud, CheckCircle2, FileText, ArrowRight, TrendingUp, Settings, FileUp, Loader2, AlertCircle, Plus, Eye, MoreVertical, Trash2, Star, Sparkles } from "lucide-react";
import { fetchApi } from "../../lib/api";
import Link from "next/link";

export default function CVManagementPage() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [resumes, setResumes] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isJobSearchActive, setIsJobSearchActive] = useState(false);
  const [userName, setUserName] = useState("Bạn");

  const getFileUrl = (url: string) => {
    if (!url) return "";
    if (url.startsWith('http')) return url;
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
    return baseUrl.replace(/\/api$/, '') + url;
  };

  // Fetch existing resumes on mount
  useEffect(() => {
    fetchApi("/resume")
      .then(data => {
        if (Array.isArray(data)) setResumes(data);
      })
      .catch(console.error);

    fetchApi("/candidate/profile")
      .then(data => {
        if (data) {
          if (data.fullName) setUserName(data.fullName);
          setIsJobSearchActive(data.isLookingForJob === true);
        }
      })
      .catch(console.error);
  }, []);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setUploadError("Chỉ hỗ trợ file định dạng PDF.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("File quá lớn, vui lòng chọn file dưới 5MB.");
      return;
    }

    setUploadError("");
    setIsUploading(true);

    try {
      // 1. Parse CV using Python AI Backend
      const parseFormData = new FormData();
      parseFormData.append("file", file);

      const parseRes = await fetch("http://localhost:8000/api/v1/resume/parse", {
        method: "POST",
        body: parseFormData
      });

      if (!parseRes.ok) {
        throw new Error("Lỗi khi AI đọc CV.");
      }
      const parsedData = await parseRes.json();

      // 2. Upload file to Spring Boot for storage
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);

      const fileUploadResponse = await fetchApi("/file/upload", {
        method: "POST",
        body: uploadFormData
      });

      const actualFileUrl = fileUploadResponse?.fileUrl || (typeof fileUploadResponse === 'string' ? fileUploadResponse : '');

      if (!actualFileUrl) {
        throw new Error("Không thể lấy đường dẫn file từ server sau khi upload.");
      }

      // 3. Save Resume to DB
      await fetchApi("/resume", {
        method: "POST",
        body: JSON.stringify({
          fileUrl: actualFileUrl,
          cvName: file.name,
          parsedText: parsedData.parsedText || "Uploaded via file",
          summary: parsedData.summary || "",
          version: 1,
          fullName: parsedData.personal_info?.name || "",
          email: parsedData.personal_info?.email || "",
          phone: parsedData.personal_info?.phone || "",
          address: parsedData.personal_info?.address || "",
          skills: (parsedData.skills || []).map((s: any) => typeof s === 'string' ? `Kỹ năng: ${s}` : `${s.normalized || 'Kỹ năng'}: ${s.original || ''}`),
          experienceItems: (parsedData.experience || parsedData.experiences || []).map((exp: any) => typeof exp === 'string' ? { companyName: exp, position: "", startDate: "", endDate: "", description: "" } : exp),
          educationItems: (parsedData.education || []).map((edu: any) => typeof edu === 'string' ? { schoolName: edu, major: "", startDate: "", endDate: "", description: "" } : edu),
          projectItems: (parsedData.projects || []).map((proj: any) => typeof proj === 'string' ? { projectName: proj, role: "", startDate: "", endDate: "", description: "", link: "" } : proj)
        })
      });

      // 4. Refresh resumes
      const updatedResumes = await fetchApi("/resume");
      if (Array.isArray(updatedResumes)) setResumes(updatedResumes);

    } catch (err: any) {
      setUploadError(err.message || "Tải lên thất bại. Vui lòng thử lại.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleUpdateCvName = async (resumeId: number, newName: string, resumeObj: any) => {
    try {
      await fetchApi(`/resume/${resumeId}`, {
        method: "PUT",
        body: JSON.stringify({
          ...resumeObj,
          cvName: newName
        })
      });
      // Refresh list
      const updatedResumes = await fetchApi("/resume");
      if (Array.isArray(updatedResumes)) setResumes(updatedResumes);
    } catch (err: any) {
      alert("Đổi tên thất bại: " + err.message);
    }
  };

  const handleDeleteResume = async (resumeId: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn xoá CV này?")) return;
    try {
      await fetchApi(`/resume/${resumeId}`, { method: "DELETE" });
      const updatedResumes = await fetchApi("/resume");
      if (Array.isArray(updatedResumes)) setResumes(updatedResumes);
    } catch (err: any) {
      alert("Xoá thất bại: " + err.message);
    }
  };

  const handleSetPrimaryResume = async (resumeId: number) => {
    try {
      await fetchApi(`/resume/${resumeId}/primary`, { method: "PUT" });
      const updatedResumes = await fetchApi("/resume");
      if (Array.isArray(updatedResumes)) setResumes(updatedResumes);
    } catch (err: any) {
      alert("Đặt CV chính thất bại: " + err.message);
    }
  };

  const handleToggleJobSearch = async () => {
    const newValue = !isJobSearchActive;
    setIsJobSearchActive(newValue);
    try {
      await fetchApi("/candidate/profile", {
        method: "PUT",
        body: JSON.stringify({ isLookingForJob: newValue })
      });
    } catch (err: any) {
      setIsJobSearchActive(!newValue); // revert
      alert("Không thể lưu trạng thái tìm việc: " + err.message);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F4F5F5] font-sans text-slate-900">
      <Navbar />

      <main className="container mx-auto px-4 py-8 max-w-[1140px]">

        <div className="flex flex-col lg:flex-row gap-6 items-start">

          {/* Left Column: Main Content */}
          <div className="flex-1 w-full space-y-6">

            {/* Green Banner */}
            <div className="bg-gradient-to-r from-blue-700 to-blue-600 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between shadow-lg shadow-blue-600/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-full opacity-20 pointer-events-none">
                <svg viewBox="0 0 200 100" className="w-full h-full" preserveAspectRatio="none">
                  <path d="M0,100 L50,50 L100,80 L150,20 L200,60 L200,100 Z" fill="none" stroke="white" strokeWidth="2" strokeDasharray="4 4" />
                  <circle cx="150" cy="20" r="4" fill="white" />
                </svg>
              </div>

              <div className="relative z-10 text-white mb-6 sm:mb-0 max-w-lg">
                <h2 className="text-xl sm:text-2xl font-bold mb-2 leading-tight">
                  Ứng viên được NTD chủ động tiếp cận <span className="text-blue-200">tăng 27%</span> trong tuần vừa rồi
                </h2>
                <p className="text-blue-50 text-sm sm:text-base">
                  Cập nhật CV để không bỏ lỡ cơ hội!
                </p>
                <div className="flex flex-wrap items-center gap-3 mt-6">
                  <Link href="/profile" className="bg-white text-blue-700 font-semibold px-5 py-2.5 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2">
                    Cập nhật Hồ sơ <ArrowRight className="size-4" />
                  </Link>
                  <button onClick={() => fileInputRef.current?.click()} className="bg-blue-600 border border-blue-500 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-blue-500 transition-colors flex items-center gap-2">
                    Tải CV lên <FileUp className="size-4" />
                  </button>
                  <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="application/pdf" className="hidden" />
                </div>
              </div>

              <div className="relative z-10 hidden sm:flex flex-col items-end">
                <div className="flex items-center text-blue-100 bg-blue-800/40 px-3 py-1.5 rounded-full text-sm font-medium mb-3">
                  <TrendingUp className="size-4 mr-2" /> +27%
                </div>
              </div>
            </div>

            {uploadError && (
              <div className="p-4 bg-red-50 text-red-600 text-sm rounded-xl flex items-start gap-2 border border-red-100">
                <AlertCircle className="size-5 mt-0.5 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            {isUploading && (
              <div className="bg-white p-8 rounded-2xl border border-slate-200 flex flex-col items-center justify-center shadow-sm">
                <Loader2 className="size-10 text-blue-600 animate-spin mb-4" />
                <h4 className="font-semibold text-slate-700">Đang phân tích & tải CV lên...</h4>
              </div>
            )}

            {/* Uploaded CVs Section */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">CV đã tạo / tải lên</h3>
                <button onClick={() => fileInputRef.current?.click()} className="bg-blue-50 text-blue-600 hover:bg-blue-100 font-semibold px-4 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm">
                  <Plus className="size-4" /> Tải CV lên
                </button>
              </div>

              <div className="p-6">
                {resumes.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {resumes.map((resume: any, idx: number) => (
                      <div key={resume.id || idx} className="group flex flex-col bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow relative">
                        {/* CV Preview Placeholder */}
                        <div className="aspect-[1/1.4] bg-slate-100 relative p-4 flex flex-col">
                          {resume.isPrimary && (
                            <div className="absolute top-2 right-2 bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider z-10 shadow-sm">
                              CV Chính
                            </div>
                          )}
                          <div className="w-full h-full bg-white shadow-sm border border-slate-200 p-3 rounded opacity-80 group-hover:opacity-100 transition-opacity flex flex-col">
                            <div className="w-3/4 h-3 bg-slate-200 rounded mb-4"></div>
                            <div className="w-full h-2 bg-slate-100 rounded mb-2"></div>
                            <div className="w-5/6 h-2 bg-slate-100 rounded mb-2"></div>
                            <div className="w-full h-2 bg-slate-100 rounded mb-6"></div>
                            <div className="w-1/2 h-3 bg-slate-200 rounded mb-3"></div>
                            <div className="w-full h-2 bg-slate-100 rounded mb-2"></div>
                            <div className="w-4/5 h-2 bg-slate-100 rounded mb-2"></div>

                            <div className="mt-auto flex justify-center">
                              <FileText className="size-8 text-slate-300" />
                            </div>
                          </div>

                          {/* Overlay actions on hover */}
                          <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                            <button onClick={() => {
                              if (resume.fileUrl?.startsWith('builder://')) {
                                const template = resume.fileUrl.replace('builder://', '');
                                window.location.href = `/cv/builder?template=${template}&resumeId=${resume.id}`;
                              } else {
                                window.open(getFileUrl(resume.fileUrl), '_blank');
                              }
                            }} className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors" title="Xem CV">
                              <Eye className="size-4" />
                            </button>
                            {!resume.isPrimary && (
                              <button onClick={() => handleSetPrimaryResume(resume.id)} className="bg-amber-500 text-white p-2 rounded-full hover:bg-amber-600 transition-colors" title="Đặt làm CV Chính">
                                <Star className="size-4" />
                              </button>
                            )}
                            <button onClick={() => handleDeleteResume(resume.id)} className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors" title="Xoá CV">
                              <Trash2 className="size-4" />
                            </button>
                          </div>
                        </div>

                        <div className="absolute top-2 left-2 z-10">
                          <button
                            onClick={() => window.location.href = `/cv/analyze/${resume.id}`}
                            className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-[10px] font-bold px-2.5 py-1 rounded shadow-sm flex items-center gap-1 hover:shadow-md hover:scale-105 transition-all"
                            title="AI Chấm Điểm"
                          >
                            <Sparkles className="size-3" /> AI Đánh Giá
                          </button>
                        </div>

                        <div className="p-4 border-t border-slate-100">
                          <input
                            type="text"
                            defaultValue={resume.cvName || resume.fileUrl?.split('/').pop() || "CV.pdf"}
                            onBlur={(e) => {
                              if (e.target.value !== resume.cvName) {
                                handleUpdateCvName(resume.id, e.target.value, resume);
                              }
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') e.currentTarget.blur();
                            }}
                            className="text-sm font-semibold text-slate-800 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 outline-none w-full truncate cursor-text transition-colors mb-1"
                            title="Nhấn để sửa tên CV"
                          />
                          <p className="text-[11px] text-slate-500 flex items-center gap-1">
                            <CheckCircle2 className="size-3 text-blue-500" /> Cập nhật gần đây
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 bg-slate-50 rounded-xl border border-slate-200 border-dashed">
                    <FileText className="size-10 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500 font-medium mb-1">Bạn chưa có CV nào</p>
                    <p className="text-sm text-slate-400">Tải lên hoặc cập nhật hồ sơ để bắt đầu</p>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Right Column: Sidebar */}
          <div className="w-full lg:w-[320px] shrink-0 space-y-6">

            {/* User Profile Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center relative">
              <button className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                <Settings className="size-5" />
              </button>

              <div className="size-20 bg-blue-100 text-blue-600 rounded-full mx-auto flex items-center justify-center text-3xl font-bold mb-3">
                {userName.charAt(0).toUpperCase()}
              </div>
              <p className="text-slate-500 text-sm mb-1">Chào bạn trở lại,</p>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{userName}</h3>
              <div className="inline-block bg-slate-100 text-slate-600 text-[11px] font-semibold px-3 py-1 rounded-full uppercase tracking-wider mb-4">
                Tài khoản đã xác thực
              </div>
              <br />
              <Link href="/profile" className="text-blue-600 hover:text-blue-700 text-sm font-semibold transition-colors flex items-center justify-center gap-1">
                <ArrowRight className="size-3" /> Nâng cấp tài khoản
              </Link>
            </div>

            {/* Job Search Status Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className={`font-semibold ${isJobSearchActive ? 'text-blue-600' : 'text-slate-500'}`}>
                  {isJobSearchActive ? 'Đang Bật tìm việc' : 'Đang Tắt tìm việc'}
                </span>
                <button
                  onClick={handleToggleJobSearch}
                  className={`w-12 h-6 rounded-full relative transition-colors duration-200 ${isJobSearchActive ? 'bg-blue-500' : 'bg-slate-300'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-200 ${isJobSearchActive ? 'left-7' : 'left-1'}`}></div>
                </button>
              </div>

              <div className="space-y-3 text-sm text-slate-600">
                <p className="font-medium text-slate-800">Khi bật tìm việc:</p>
                <p className="flex items-start gap-2">
                  <CheckCircle2 className="size-4 text-blue-500 shrink-0 mt-0.5" />
                  Nhà tuyển dụng có thể tìm thấy và mang đến cho bạn những cơ hội hấp dẫn.
                </p>
                <p className="flex items-start gap-2">
                  <CheckCircle2 className="size-4 text-blue-500 shrink-0 mt-0.5" />
                  Hồ sơ của bạn sẽ hiển thị nổi bật trên kết quả tìm kiếm.
                </p>
              </div>
            </div>

            {/* Search Allow Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-2">Cho phép NTD tìm kiếm hồ sơ</h3>
              <p className="text-sm text-slate-600 mb-4">
                Có <span className="font-bold text-blue-600">{resumes.filter(r => r.isPrimary).length} CV</span> đang bật cho phép NTD tìm kiếm
              </p>
              <button className="text-blue-600 border border-blue-500 hover:bg-blue-50 font-semibold px-4 py-2 rounded-lg transition-colors text-sm w-full mb-4">
                Quản lý danh sách
              </button>
              <div className="bg-slate-50 p-3 rounded-lg text-xs text-slate-500">
                Khi bạn cho phép Nhà tuyển dụng tìm kiếm hồ sơ, các NTD uy tín có thể tiếp cận thông tin...
                <button className="text-blue-600 font-medium ml-1">Tìm hiểu thêm</button>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
