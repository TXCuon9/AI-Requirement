"use client";

import { useEffect, useState, useRef } from "react";
import { fetchApi } from "../../../lib/api";
import { Loader2, Contact, Mail, FileText, CheckCircle2, Clock, Sparkles } from "lucide-react";
import { useSearchParams } from "next/navigation";

interface Application {
  applicationId: number;
  status: string;
  appliedAt: string;
  candidateId: number;
  candidateName: string;
  candidateEmail: string;
  resumeId: number;
  resumeTitle: string;
  resumeUrl: string;
  jobId: number;
  matchScore: number | null;
}

export default function ApplicationsManagementPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [invitingId, setInvitingId] = useState<number | null>(null);
  const [isRanking, setIsRanking] = useState(false);
  const [rankingProgress, setRankingProgress] = useState({ current: 0, total: 0 });

  const searchParams = useSearchParams();
  const jobIdParam = searchParams.get("jobId");
  const autorankParam = searchParams.get("autorank");
  const autorankTriggered = useRef(false);

  const loadApplications = async () => {
    setLoading(true);
    try {
      const data = await fetchApi("/all");
      
      // Filter by jobId if provided in URL
      let filteredData = data || [];
      if (jobIdParam) {
        filteredData = filteredData.filter((app: Application) => app.jobId === parseInt(jobIdParam, 10));
      }

      // Sort by match score descending if available, else by application ID
      const sortedData = filteredData.sort((a: Application, b: Application) => {
        if (a.matchScore != null && b.matchScore != null) return b.matchScore - a.matchScore;
        if (a.matchScore != null) return -1;
        if (b.matchScore != null) return 1;
        return b.applicationId - a.applicationId;
      });
      setApplications(sortedData);
    } catch (error) {
      console.error("Failed to load applications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, [jobIdParam]);

  useEffect(() => {
    if (autorankParam === 'true' && applications.length > 0 && !loading && !autorankTriggered.current) {
      autorankTriggered.current = true;
      // We need to wait a tick to ensure state is settled before triggering
      setTimeout(() => {
        handleRankWithAI();
      }, 500);
    }
  }, [applications, loading, autorankParam]);

  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const handleStatusChange = async (id: number, status: string, actionName: string) => {
    if (!confirm(`Bạn chắc chắn muốn ${actionName.toLowerCase()} ứng viên này?`)) return;
    
    setUpdatingId(id);
    try {
      await fetchApi(`/recruiter/applications/${id}/status`, { 
        method: "PUT",
        body: JSON.stringify({ status })
      });
      alert(`Đã cập nhật trạng thái thành công!`);
      // Update local state without full reload
      setApplications(applications.map(app => 
        app.applicationId === id ? { ...app, status } : app
      ));
    } catch (error: any) {
      alert("Lỗi khi cập nhật trạng thái: " + (error.message || "Unknown error"));
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRankWithAI = async () => {
    const unrankedApps = applications.filter(app => app.matchScore == null);
    if (unrankedApps.length === 0) {
      alert("Tất cả ứng viên hiện tại đã được xếp hạng!");
      return;
    }

    setIsRanking(true);
    setRankingProgress({ current: 0, total: unrankedApps.length });
    let updatedApps = [...applications];

    try {
      const aiApiUrl = process.env.NEXT_PUBLIC_AI_API_URL || "https://ai-recruitment-python.onrender.com";
      // Cache jobs to avoid re-fetching same job details
      const jobCache: Record<number, any> = {};

      for (let i = 0; i < unrankedApps.length; i++) {
        const app = unrankedApps[i];
        try {
          // 1. Fetch Job
          if (!jobCache[app.jobId]) {
            jobCache[app.jobId] = await fetchApi(`/recruiter/${app.jobId}`);
          }
          const job = jobCache[app.jobId];

          // 2. Fetch Resume
          const resume = await fetchApi(`/recruiter/resume/${app.resumeId}`);

          // 3. Format payload
          const jobData = {
            title: job.title || "",
            description: job.description || "",
            requirements: job.requirements || "",
            responsibilities: job.responsibilities || ""
          };

          const cvData = {
            parsedText: resume.parsedText || "",
            skills: resume.skills || [],
            experiences: resume.experiences || [],
            educationItemDTOS: resume.educationItemDTOS || [],
            projectItems: resume.projectItems || [],
            summary: resume.summary || "",
            targetPosition: resume.targetPosition || ""
          };

          // 4. Call Python API
          const response = await fetch(`${aiApiUrl}/api/v1/analysis/job-fit`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ cv_data: cvData, job_data: jobData })
          });

          if (!response.ok) throw new Error("AI call failed");
          const result = await response.json();

          // 5. Save cache
          await fetchApi("/job-fit-cache", {
            method: "POST",
            body: JSON.stringify({
              resumeId: app.resumeId,
              jobId: app.jobId,
              matchResult: result
            })
          });

          // 6. Update local state
          const newScore = result.match_score;
          updatedApps = updatedApps.map(a => 
            a.applicationId === app.applicationId ? { ...a, matchScore: newScore } : a
          );
          setApplications([...updatedApps]); // Update table incrementally

        } catch (error) {
          console.error("Failed to rank applicant", app.applicationId, error);
        }

        setRankingProgress({ current: i + 1, total: unrankedApps.length });
      }
      
      // Finally, sort by new score
      updatedApps.sort((a, b) => {
        if (a.matchScore != null && b.matchScore != null) return b.matchScore - a.matchScore;
        if (a.matchScore != null) return -1;
        if (b.matchScore != null) return 1;
        return b.applicationId - a.applicationId;
      });
      setApplications(updatedApps);
      alert("Đã hoàn tất việc tự động phân tích và xếp hạng bằng AI!");

    } catch (err: any) {
      alert("Lỗi khi kết nối với AI: " + (err.message || "Unknown error"));
    } finally {
      setIsRanking(false);
    }
  };

  const getFullUrl = (url: string | undefined, resumeId: number) => {
    if (!url) return "#";
    if (url.startsWith("http")) return url;
    if (url.startsWith("builder://")) {
      const template = url.replace("builder://", "");
      return `/cv/builder?resumeId=${resumeId}&template=${template}&readonly=true`;
    }
    const baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api').replace('/api', '');
    return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Quản lý Ứng viên</h1>
          <p className="text-slate-500 mt-1">Danh sách các ứng viên đã nộp hồ sơ vào tin tuyển dụng của bạn.</p>
        </div>
        <button
          onClick={handleRankWithAI}
          disabled={isRanking || applications.length === 0}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all shadow-md disabled:opacity-50"
        >
          {isRanking ? (
            <><Loader2 className="size-4 animate-spin" /> Đang phân tích ({rankingProgress.current}/{rankingProgress.total})</>
          ) : (
            <><Sparkles className="size-4" /> Tự động phân tích & Xếp hạng AI</>
          )}
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-blue-600">
            <Loader2 className="size-10 animate-spin mb-4" />
          </div>
        ) : applications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="size-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <Contact className="size-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Chưa có ứng viên nào</h3>
            <p className="text-slate-500 text-sm mb-6">Hãy đảm bảo tin tuyển dụng của bạn hấp dẫn để thu hút nhiều nhân tài.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-sm font-semibold text-slate-600">
                  <th className="p-4 pl-6">Ứng viên</th>
                  <th className="p-4">Hồ sơ đính kèm</th>
                  <th className="p-4 text-center">Điểm AI</th>
                  <th className="p-4">Ngày nộp</th>
                  <th className="p-4">Trạng thái</th>
                  <th className="p-4 pr-6 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {applications.map((app) => (
                  <tr key={app.applicationId} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                          {app.candidateName ? app.candidateName.charAt(0).toUpperCase() : '?'}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{app.candidateName || 'Chưa cập nhật tên'}</div>
                          <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                            <Mail className="size-3" /> {app.candidateEmail}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <a 
                        href={getFullUrl(app.resumeUrl, app.resumeId)} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        <FileText className="size-4" /> {app.resumeTitle || 'Xem CV'}
                      </a>
                    </td>
                    <td className="p-4 text-center">
                      {app.matchScore != null ? (
                        <span className={`inline-flex items-center justify-center size-10 rounded-full font-bold text-sm border-2 ${app.matchScore >= 80 ? 'border-emerald-500 text-emerald-600 bg-emerald-50' : app.matchScore >= 50 ? 'border-amber-500 text-amber-600 bg-amber-50' : 'border-rose-500 text-rose-600 bg-rose-50'}`}>
                          {app.matchScore}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400 font-medium bg-slate-100 px-2 py-1 rounded-md">Chưa phân tích</span>
                      )}
                    </td>
                    <td className="p-4 text-sm text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <Clock className="size-3.5 text-slate-400" />
                        {new Date(app.appliedAt).toLocaleDateString('vi-VN')}
                      </div>
                    </td>
                    <td className="p-4">
                      {app.status === 'APPLIED' ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                          Mới ứng tuyển
                        </span>
                      ) : app.status === 'INTERVIEWING' || app.status === 'INTERVIEW' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="size-3.5" /> Chờ phỏng vấn
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                          {app.status}
                        </span>
                      )}
                    </td>
                    <td className="p-4 pr-6 text-right">
                      {app.status === 'APPLIED' || app.status === 'REVIEWING' || app.status === 'SHORTLISTED' ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleStatusChange(app.applicationId, 'INTERVIEW', 'Mời phỏng vấn')}
                            disabled={updatingId === app.applicationId}
                            className="inline-flex items-center justify-center px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[13px] font-semibold rounded transition-colors shadow-sm disabled:opacity-50"
                            title="Mời phỏng vấn"
                          >
                            {updatingId === app.applicationId ? <Loader2 className="size-3.5 animate-spin" /> : "Mời phỏng vấn"}
                          </button>
                          
                          <button
                            onClick={() => handleStatusChange(app.applicationId, 'SHORTLISTED', 'Đưa vào danh sách theo dõi thêm')}
                            disabled={updatingId === app.applicationId}
                            className="inline-flex items-center justify-center px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-[13px] font-semibold rounded transition-colors shadow-sm disabled:opacity-50"
                            title="Theo dõi thêm"
                          >
                            Theo dõi
                          </button>

                          <button
                            onClick={() => handleStatusChange(app.applicationId, 'REJECTED', 'Từ chối')}
                            disabled={updatingId === app.applicationId}
                            className="inline-flex items-center justify-center px-3 py-1.5 bg-rose-500 hover:bg-rose-600 text-white text-[13px] font-semibold rounded transition-colors shadow-sm disabled:opacity-50"
                            title="Từ chối"
                          >
                            Từ chối
                          </button>
                        </div>
                      ) : (
                        <span className="text-sm font-medium text-slate-400">Đã xử lý</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
