"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MapPin, BriefcaseBusiness, Heart, Building2, Send, DollarSign, Users, ChevronRight, AlertCircle, Loader2, Sparkles, CheckCircle2, XCircle } from "lucide-react";
import Navbar from "../../../components/Navbar";
import { useParams } from "next/navigation";
import { fetchApi } from "../../../lib/api";
import { formatSalaryRange } from "../../../lib/utils";
import { JobDetailResponse } from "../../../lib/types/job";
import { useAuth } from "../../../lib/authContext";
import toast from "react-hot-toast";

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
  const { user } = useAuth(); // Import useAuth from lib/authContext
  const [fitScore, setFitScore] = useState<any>(null);
  const [isScoring, setIsScoring] = useState(false);
  const [scoreError, setScoreError] = useState("");

  const handleScoreJobFit = async (forceReEvaluate: boolean = false) => {
    setIsScoring(true);
    setScoreError("");
    if (forceReEvaluate) {
      setFitScore(null);
    }
    try {
      // 1. Get primary CV
      const resumes = await fetchApi("/resume");
      if (!resumes || resumes.length === 0) {
        throw new Error("Bạn chưa tải lên CV nào. Vui lòng tải CV để sử dụng tính năng này.");
      }
      const primaryCv = resumes.find((r: any) => r.isPrimary) || resumes[0];

      // 1.5 Check cache first
      if (!forceReEvaluate) {
        try {
          const cachedResult = await fetchApi(`/job-fit-cache?resumeId=${primaryCv.id}&jobId=${jobId}`);
          if (cachedResult) {
            setFitScore(cachedResult);
            setIsScoring(false);
            return;
          }
        } catch (e) {
          // Cache miss, proceed to Python API
        }
      }

      // 2. Format Job Data
      const jobData = {
        title: job?.title || "",
        description: job?.description || "",
        requirements: job?.requirements || "",
        responsibilities: job?.responsibilities || ""
      };

      // 3. Format CV Data
      const cvData = {
        parsedText: primaryCv.parsedText || "",
        skills: primaryCv.skills || [],
        experiences: primaryCv.experiences || [],
        educationItemDTOS: primaryCv.educationItemDTOS || [],
        projectItems: primaryCv.projectItems || [],
        summary: primaryCv.summary || "",
        targetPosition: primaryCv.targetPosition || ""
      };

      // 4. Call Python API
      const aiApiUrl = process.env.NEXT_PUBLIC_AI_API_URL || "https://ai-recruitment-python.onrender.com";
      const response = await fetch(`${aiApiUrl}/api/v1/analysis/job-fit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cv_data: cvData, job_data: jobData })
      });

      if (!response.ok) {
        throw new Error("Có lỗi xảy ra khi gọi AI phân tích.");
      }

      const result = await response.json();
      setFitScore(result);

      // Save cache
      await fetchApi("/job-fit-cache", {
        method: "POST",
        body: JSON.stringify({
          resumeId: primaryCv.id,
          jobId: jobId,
          matchResult: result
        })
      }).catch(err => console.error("Failed to save job fit cache", err));

    } catch (err: any) {
      setScoreError(err.message || "Lỗi không xác định");
    } finally {
      setIsScoring(false);
    }
  };

  useEffect(() => {
    // Attempt to automatically load job fit score if user is candidate
    if (user?.role === "CANDIDATE" && job) {
      handleScoreJobFit(false).catch(console.error);
    }
  }, [user, job]);

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
      toast.success("Đã lưu việc làm thành công!");
    } catch (error: any) {
      toast.error(error.message || "Có lỗi xảy ra khi lưu việc làm");
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

  const renderFormattedText = (text: string) => {
    if (!text) return null;
    const lines = text.split('\n');
    return (
      <div className="space-y-2 text-slate-700 leading-relaxed text-[15px]">
        {lines.map((line, idx) => {
          const trimmed = line.trim();
          if (trimmed.startsWith('-') || trimmed.startsWith('*') || trimmed.startsWith('•')) {
            return (
              <div key={idx} className="flex gap-2.5">
                <div className="text-slate-400 mt-1 size-1.5 shrink-0 rounded-full bg-slate-400"></div>
                <div className="flex-1">{trimmed.substring(1).trim()}</div>
              </div>
            );
          }
          if (!trimmed) return <div key={idx} className="h-2"></div>;
          return <p key={idx}>{trimmed}</p>;
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f1f2f6] font-sans text-slate-900 pb-20 md:pb-0">
      <Navbar />

      {/* Breadcrumbs */}
      <div className="bg-white py-3 border-b border-slate-200">
        <div className="container max-w-[1200px] mx-auto px-4 flex items-center text-sm text-slate-500">
          <Link href="/" className="hover:text-blue-600">Trang chủ</Link>
          <ChevronRight className="size-4 mx-1 text-slate-400" />
          <Link href="/jobs" className="hover:text-blue-600">Việc làm</Link>
          <ChevronRight className="size-4 mx-1 text-slate-400" />
          <span className="text-slate-900 font-medium truncate">{job.title}</span>
        </div>
      </div>

      <main className="container max-w-[1200px] mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          
          {/* Left Column - 70% width */}
          <div className="flex-1 w-full flex flex-col gap-6">
            
            {/* Top Header Card (Job Overview) */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <h1 className="text-[26px] font-bold text-slate-900 mb-4 leading-tight">{job.title}</h1>
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-lg border border-slate-100">
                  <DollarSign className="size-5 text-emerald-600" />
                  <span className="font-bold text-emerald-600">{formatSalaryRange(job.salaryMin, job.salaryMax, job.currency)}</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-lg border border-slate-100">
                  <MapPin className="size-5 text-blue-600" />
                  <span className="font-semibold text-slate-700">{job.location || "Nhiều địa điểm"}</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-lg border border-slate-100">
                  <BriefcaseBusiness className="size-5 text-purple-600" />
                  <span className="font-semibold text-slate-700">{expLevelMap[job.experienceLevel] || job.experienceLevel}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 border-t border-slate-100 pt-6">
                <button
                  onClick={handleOpenApplyModal}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-6 rounded-lg transition-all flex items-center justify-center gap-2 shadow-[0_4px_14px_0_rgba(37,99,235,0.39)]">
                  <Send className="size-5" /> Nộp đơn ứng tuyển
                </button>
                <button
                  onClick={handleSaveJob}
                  disabled={isSaving || saveSuccess}
                  className={`sm:w-[200px] border-2 font-bold py-3.5 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 ${saveSuccess ? 'bg-orange-50 text-orange-600 border-orange-200' : 'bg-white border-orange-500 text-orange-500 hover:bg-orange-50'}`}>
                  {isSaving ? <Loader2 className="size-5 animate-spin" /> : <Heart className={`size-5 ${saveSuccess ? 'fill-orange-600 text-orange-600' : ''}`} />}
                  {saveSuccess ? 'Đã lưu' : 'Lưu công việc'}
                </button>
              </div>
            </div>

            {/* Chi tiết công việc */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <h2 className="text-xl font-bold text-slate-900 mb-6 border-l-[6px] border-blue-600 pl-3">Chi tiết công việc</h2>
              
              <div className="space-y-8">
                {job.description && (
                  <div>
                    <h3 className="text-[17px] font-bold text-slate-900 mb-3 underline decoration-slate-300 underline-offset-4">Mô tả công việc</h3>
                    {renderFormattedText(job.description)}
                  </div>
                )}

                {job.requirements && (
                  <div>
                    <h3 className="text-[17px] font-bold text-slate-900 mb-3 underline decoration-slate-300 underline-offset-4">Yêu cầu ứng viên</h3>
                    {renderFormattedText(job.requirements)}
                  </div>
                )}

                {job.responsibilities && (
                  <div>
                    <h3 className="text-[17px] font-bold text-slate-900 mb-3 underline decoration-slate-300 underline-offset-4">Quyền lợi</h3>
                    {renderFormattedText(job.responsibilities)}
                  </div>
                )}
              </div>
            </div>

            {/* Report */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-start gap-4">
              <div className="bg-slate-100 p-2 rounded-full shrink-0">
                <AlertCircle className="size-5 text-slate-500" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-700 text-sm mb-1">Báo cáo tin tuyển dụng</h4>
                <p className="text-sm text-slate-500">Nếu bạn thấy rằng tin tuyển dụng này không đúng, hãy phản ánh với chúng tôi.</p>
              </div>
            </div>

          </div>

          {/* Right Column - 30% width */}
          <div className="w-full lg:w-[360px] shrink-0 flex flex-col gap-6 sticky top-24">
            
            {/* AI Fit Assessment for Candidate - Vị trí đầu tiên theo yêu cầu */}
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-xl border border-blue-200 shadow-[0_4px_20px_-4px_rgba(59,130,246,0.15)] relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 opacity-20">
                <Sparkles className="size-16 text-blue-600" />
              </div>
              <div className="flex items-center gap-3 mb-5 relative z-10">
                <div className="size-11 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md">
                  <Sparkles className="size-6" />
                </div>
                <h2 className="text-[17px] font-bold text-slate-900 leading-tight">AI Matching Score</h2>
              </div>

              {!fitScore && !isScoring && (
                <div className="relative z-10">
                  <p className="text-sm text-slate-600 mb-5 leading-relaxed">
                    Sử dụng trí tuệ nhân tạo để phân tích mức độ phù hợp của CV với công việc này.
                  </p>
                  <button
                    onClick={() => handleScoreJobFit(true)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm"
                  >
                    Bắt đầu phân tích
                  </button>
                </div>
              )}

              {isScoring && (
                <div className="flex flex-col items-center justify-center py-6 relative z-10">
                  <Loader2 className="size-10 animate-spin text-blue-600 mb-3" />
                  <span className="text-sm font-medium text-blue-800">Đang chấm điểm bằng AI...</span>
                </div>
              )}

              {scoreError && (
                <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg flex items-start gap-2 border border-red-200 mt-4 relative z-10">
                  <XCircle className="size-4 shrink-0 mt-0.5" />
                  <span>{scoreError}</span>
                </div>
              )}

              {fitScore && (
                <div className="relative z-10 animate-in fade-in zoom-in-95 duration-500">
                  <div className="flex items-center justify-between mb-4 bg-white/60 p-3 rounded-xl border border-white">
                    <span className="font-semibold text-slate-700 text-sm">Điểm phù hợp</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-2xl font-black ${fitScore.match_score >= 80 ? 'text-emerald-600' : fitScore.match_score >= 50 ? 'text-blue-600' : 'text-amber-600'}`}>
                        {fitScore.match_score}%
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {fitScore.pros && fitScore.pros.length > 0 && (
                      <div className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">
                        <h4 className="text-[13px] font-bold text-emerald-800 flex items-center gap-1.5 mb-2">
                          <CheckCircle2 className="size-4" /> Khớp yêu cầu
                        </h4>
                        <ul className="space-y-1.5">
                          {fitScore.pros.map((p: string, i: number) => (
                            <li key={i} className="flex items-start gap-1.5 text-[13px] text-emerald-900/80">
                              <span className="mt-1 shrink-0">•</span> <span>{p}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {fitScore.cons && fitScore.cons.length > 0 && (
                      <div className="bg-amber-50/50 p-3 rounded-xl border border-amber-100">
                        <h4 className="text-[13px] font-bold text-amber-800 flex items-center gap-1.5 mb-2">
                          <AlertCircle className="size-4" /> Cần cải thiện
                        </h4>
                        <ul className="space-y-1.5">
                          {fitScore.cons.map((c: string, i: number) => (
                            <li key={i} className="flex items-start gap-1.5 text-[13px] text-amber-900/80">
                              <span className="mt-1 shrink-0">•</span> <span>{c}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleScoreJobFit(true)}
                    className="w-full mt-5 bg-white border border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    Cập nhật lại điểm
                  </button>
                </div>
              )}
            </div>

            {/* Company Info */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <div className="flex items-start gap-4 mb-4">
                <div className="size-[72px] rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden p-1 shadow-sm">
                  {job.companyLogo ? (
                    <img src={job.companyLogo} alt={job.companyName || "Logo"} className="w-full h-full object-contain" />
                  ) : (
                    <Building2 className="size-8 text-slate-300" />
                  )}
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 leading-tight mb-1">{job.companyName || "Công ty bảo mật"}</h2>
                  <Link href={`/companies/${jobId}`} className="text-sm font-semibold text-blue-600 hover:underline">
                    Xem trang công ty
                  </Link>
                </div>
              </div>
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <div className="flex gap-3 items-start">
                  <Users className="size-[18px] text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-[13px] text-slate-500 mb-0.5">Quy mô</div>
                    <div className="text-sm font-medium text-slate-800">Không xác định</div>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <MapPin className="size-[18px] text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-[13px] text-slate-500 mb-0.5">Địa điểm</div>
                    <div className="text-sm font-medium text-slate-800">{job.location || "Nhiều địa điểm"}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* General Info */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <h2 className="text-lg font-bold text-slate-900 mb-5">Thông tin chung</h2>
              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-50 p-2.5 rounded-full shrink-0">
                    <BriefcaseBusiness className="size-[22px] text-blue-600" />
                  </div>
                  <div>
                    <div className="text-[13px] text-slate-500 mb-0.5">Cấp bậc</div>
                    <div className="font-semibold text-sm text-slate-900">{expLevelMap[job.experienceLevel] || job.experienceLevel}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="bg-blue-50 p-2.5 rounded-full shrink-0">
                    <Users className="size-[22px] text-blue-600" />
                  </div>
                  <div>
                    <div className="text-[13px] text-slate-500 mb-0.5">Hình thức làm việc</div>
                    <div className="font-semibold text-sm text-slate-900">{jobTypeMap[job.jobType] || job.jobType} {job.remote && "- Remote"}</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

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
                        <div className="font-medium text-slate-900 truncate">{r.cvName || r.title || `CV #${r.id}`}</div>
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
