"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MapPin, BriefcaseBusiness, Heart, Building2, Send, DollarSign, Users, ChevronRight, AlertCircle, Loader2 } from "lucide-react";
import Navbar from "../../../components/Navbar";
import { useParams } from "next/navigation";
import { fetchApi } from "../../../lib/api";
import { JobDetailResponse } from "../../../lib/types/job";

export default function JobDetailPage() {
  const params = useParams();
  const jobId = params.id as string;

  const [job, setJob] = useState<JobDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Apply & Save states
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [resumes, setResumes] = useState<any[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(false);
  const [selectedResumeId, setSelectedResumeId] = useState<number | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [applyMessage, setApplyMessage] = useState("");

  useEffect(() => {
    if (jobId) {
      fetchApi(`/detail/${jobId}`)
        .then((data) => setJob(data))
        .catch((err) => console.error("Failed to fetch job detail:", err))
        .finally(() => setLoading(false));
    }
  }, [jobId]);

  const handleSaveJob = async () => {
    setIsSaving(true);
    try {
      await fetchApi(`/saveJob/${jobId}`, { method: "POST" });
      setSaveSuccess(true);
      alert("Đã lưu việc làm thành công!");
    } catch (error: any) {
      alert(error.message || "Có lỗi xảy ra khi lưu việc làm");
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenApplyModal = async () => {
    setShowApplyModal(true);
    setLoadingResumes(true);
    setApplyMessage("");
    try {
      const data = await fetchApi("/resume");
      setResumes(data || []);
      if (data && data.length > 0) {
        // Auto select primary resume or first one
        const primary = data.find((r: any) => r.isPrimary);
        if (primary) setSelectedResumeId(primary.id);
        else setSelectedResumeId(data[0].id);
      }
    } catch (error) {
      console.error("Failed to load resumes", error);
    } finally {
      setLoadingResumes(false);
    }
  };

  const handleApplyJob = async () => {
    if (!selectedResumeId) {
      setApplyMessage("Vui lòng chọn một CV để ứng tuyển!");
      return;
    }
    setIsApplying(true);
    setApplyMessage("");
    try {
      await fetchApi(`/apply/${jobId}`, {
        method: "POST",
        body: JSON.stringify({ resumeId: selectedResumeId })
      });
      setApplyMessage("Ứng tuyển thành công!");
      setTimeout(() => setShowApplyModal(false), 2000);
    } catch (error: any) {
      setApplyMessage(error.message || "Ứng tuyển thất bại");
    } finally {
      setIsApplying(false);
    }
  };

  const formatSalary = (min: number | null, max: number | null) => {
    if (!min && !max) return "Thỏa thuận";
    if (min && max) return `${min} - ${max} triệu`;
    if (min) return `Từ ${min} triệu`;
    return `Đến ${max} triệu`;
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-50">
        <Navbar />
        <div className="flex-1 flex justify-center items-center">
          <Loader2 className="size-10 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-50">
        <Navbar />
        <div className="flex-1 flex justify-center items-center text-slate-500">
          Không tìm thấy thông tin việc làm.
        </div>
      </div>
    );
  }

  const expLevelMap: Record<string, string> = {
    "ENTRY_LEVEL": "Chưa có kinh nghiệm",
    "JUNIOR": "Dưới 1 năm",
    "MID_LEVEL": "1-3 năm",
    "SENIOR": "3-5 năm",
    "EXPERT": "Trên 5 năm"
  };

  const jobTypeMap: Record<string, string> = {
    "FULL_TIME": "Toàn thời gian",
    "PART_TIME": "Bán thời gian",
    "INTERNSHIP": "Thực tập",
    "CONTRACT": "Hợp đồng"
  };

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
          <span className="text-slate-900 font-medium truncate">{job.title}</span>
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
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">{job.title}</h1>
              <Link href={`/companies/${jobId}`} className="text-lg text-slate-600 hover:text-blue-600 transition-colors font-medium">
                {job.companyName || "Công ty bảo mật"}
              </Link>
              
              <div className="flex flex-wrap items-center gap-4 mt-4">
                <div className="flex items-center gap-2 text-slate-700">
                  <div className="p-2 bg-blue-50 rounded-full text-blue-600">
                    <DollarSign className="size-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 font-medium">Mức lương</div>
                    <div className="font-semibold text-slate-900">{formatSalary(job.salaryMin, job.salaryMax)}</div>
                  </div>
                </div>
                <div className="w-px h-10 bg-slate-200 hidden md:block"></div>
                
                <div className="flex items-center gap-2 text-slate-700">
                  <div className="p-2 bg-blue-50 rounded-full text-blue-600">
                    <MapPin className="size-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 font-medium">Địa điểm</div>
                    <div className="font-semibold text-slate-900">{job.location || "Nhiều địa điểm"}</div>
                  </div>
                </div>
                <div className="w-px h-10 bg-slate-200 hidden md:block"></div>
                
                <div className="flex items-center gap-2 text-slate-700">
                  <div className="p-2 bg-blue-50 rounded-full text-blue-600">
                    <BriefcaseBusiness className="size-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 font-medium">Kinh nghiệm</div>
                    <div className="font-semibold text-slate-900">{expLevelMap[job.experienceLevel] || job.experienceLevel}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions Desktop */}
            <div className="hidden md:flex flex-col gap-3 shrink-0 w-48">
              <button 
                onClick={handleOpenApplyModal}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-md shadow-blue-600/20 flex items-center justify-center gap-2">
                <Send className="size-4" /> Ứng tuyển ngay
              </button>
              <button 
                onClick={handleSaveJob}
                disabled={isSaving || saveSuccess}
                className={`w-full border-2 font-semibold py-2.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 ${saveSuccess ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-white border-slate-200 hover:border-blue-600 text-slate-700 hover:text-blue-600'}`}>
                {isSaving ? <Loader2 className="size-4 animate-spin" /> : <Heart className={`size-4 ${saveSuccess ? 'fill-blue-600' : ''}`} />} 
                {saveSuccess ? 'Đã lưu' : 'Lưu việc làm'}
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
                {job.description && (
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">Mô tả công việc</h3>
                    <div className="whitespace-pre-line">{job.description}</div>
                  </div>
                )}
                
                {job.requirements && (
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">Yêu cầu ứng viên</h3>
                    <div className="whitespace-pre-line">{job.requirements}</div>
                  </div>
                )}
                
                {job.responsibilities && (
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">Trách nhiệm / Quyền lợi</h3>
                    <div className="whitespace-pre-line">{job.responsibilities}</div>
                  </div>
                )}
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
                <h2 className="text-lg font-bold text-slate-900 leading-tight">{job.companyName || "Công ty bảo mật"}</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex gap-3 text-slate-700">
                  <MapPin className="size-5 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs text-slate-500 font-medium">Địa điểm</div>
                    <div className="text-sm font-medium">{job.location || "Nhiều địa điểm"}</div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-slate-100">
                <Link href={`/companies/${jobId}`} className="text-blue-600 font-medium hover:underline text-sm flex items-center justify-center">
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
                  <span className="font-medium text-sm">{expLevelMap[job.experienceLevel] || job.experienceLevel}</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-50 pb-3">
                  <span className="text-slate-500 text-sm">Hình thức</span>
                  <span className="font-medium text-sm">{jobTypeMap[job.jobType] || job.jobType}</span>
                </div>
                {job.remote && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 text-sm">Remote</span>
                    <span className="font-medium text-sm">Có hỗ trợ Remote</span>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Mobile Fixed Action Bar */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 p-4 flex gap-3 z-50">
        <button onClick={handleOpenApplyModal} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl shadow-md">
          Ứng tuyển ngay
        </button>
        <button onClick={handleSaveJob} className="size-12 flex items-center justify-center shrink-0 bg-white border-2 border-slate-200 text-slate-600 rounded-xl">
          <Heart className={`size-6 ${saveSuccess ? 'fill-blue-600 text-blue-600' : ''}`} />
        </button>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-xl font-bold mb-4">Ứng tuyển {job.title}</h2>
            
            {loadingResumes ? (
              <div className="flex justify-center py-8"><Loader2 className="size-8 animate-spin text-blue-600" /></div>
            ) : resumes.length === 0 ? (
              <div className="text-center py-6 text-slate-600">
                Bạn chưa có CV nào trên hệ thống. 
                <br /><br />
                <Link href="/cv" className="text-blue-600 font-semibold underline">Đi tới trang quản lý CV</Link>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-slate-600">Chọn CV để ứng tuyển:</p>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                  {resumes.map(r => (
                    <label key={r.id} className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-colors ${selectedResumeId === r.id ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:bg-slate-50'}`}>
                      <input 
                        type="radio" 
                        name="resumeId" 
                        value={r.id} 
                        checked={selectedResumeId === r.id} 
                        onChange={() => setSelectedResumeId(r.id)}
                        className="size-4 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-slate-900 truncate">{r.title || `CV #${r.id}`}</div>
                        <div className="text-xs text-slate-500">Cập nhật lúc: {new Date(r.updatedAt || r.createdAt).toLocaleDateString()}</div>
                      </div>
                      {r.isPrimary && <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">Mặc định</span>}
                    </label>
                  ))}
                </div>
                
                {applyMessage && (
                  <div className={`p-3 rounded-lg text-sm ${applyMessage.includes('thành công') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {applyMessage}
                  </div>
                )}
                
                <div className="flex gap-3 mt-6">
                  <button 
                    onClick={() => setShowApplyModal(false)}
                    className="flex-1 py-2.5 rounded-xl font-semibold border border-slate-200 text-slate-700 hover:bg-slate-50">
                    Hủy
                  </button>
                  <button 
                    onClick={handleApplyJob}
                    disabled={isApplying}
                    className="flex-1 py-2.5 rounded-xl font-semibold bg-blue-600 text-white hover:bg-blue-700 flex items-center justify-center gap-2">
                    {isApplying ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />} Gửi CV
                  </button>
                </div>
              </div>
            )}
            
            {resumes.length === 0 && (
              <div className="mt-6 flex justify-end">
                <button onClick={() => setShowApplyModal(false)} className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg">Đóng</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
