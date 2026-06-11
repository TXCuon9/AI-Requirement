"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "../../../lib/api";
import { Loader2, Contact, Mail, FileText, CheckCircle2, Clock } from "lucide-react";

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
}

export default function ApplicationsManagementPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [invitingId, setInvitingId] = useState<number | null>(null);

  const loadApplications = async () => {
    setLoading(true);
    try {
      const data = await fetchApi("/all");
      setApplications(data || []);
    } catch (error) {
      console.error("Failed to load applications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const handleInvite = async (id: number) => {
    if (!confirm("Bạn muốn gửi email mời ứng viên này phỏng vấn?")) return;
    
    setInvitingId(id);
    try {
      await fetchApi(`/interview/${id}`, { method: "PUT" });
      alert("Đã gửi email mời phỏng vấn thành công!");
      await loadApplications();
    } catch (error: any) {
      alert("Lỗi khi gửi thư mời: " + (error.message || "Unknown error"));
    } finally {
      setInvitingId(null);
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
                      {app.status === 'APPLIED' && (
                        <button
                          onClick={() => handleInvite(app.applicationId)}
                          disabled={invitingId === app.applicationId}
                          className="inline-flex items-center justify-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm disabled:opacity-50"
                        >
                          {invitingId === app.applicationId ? (
                            <><Loader2 className="size-4 animate-spin mr-2" /> Đang gửi...</>
                          ) : (
                            "Mời phỏng vấn"
                          )}
                        </button>
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
