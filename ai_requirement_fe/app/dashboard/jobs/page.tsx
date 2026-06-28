"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "../../../lib/api";
import { JobResponse } from "../../../lib/types/job";
import { Loader2, Plus, BriefcaseBusiness, MapPin, DollarSign, Clock, Pencil, Trash2, Users, Sparkles } from "lucide-react";
import Link from "next/link";
import { formatSalaryRange } from "../../../lib/utils";

export default function JobsManagementPage() {
  const [jobs, setJobs] = useState<JobResponse[]>([]);
  const [applicantCounts, setApplicantCounts] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [jobsData, appsData] = await Promise.all([
        fetchApi("/recruiter/jobs"),
        fetchApi("/all").catch(() => []) // if it fails, default to empty
      ]);
      
      setJobs(jobsData || []);
      
      // Calculate applicant counts per job
      const counts: Record<number, number> = {};
      (appsData || []).forEach((app: any) => {
        if (app.jobId) {
          counts[app.jobId] = (counts[app.jobId] || 0) + 1;
        }
      });
      setApplicantCounts(counts);

    } catch (error) {
      console.error("Failed to load jobs data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa tin tuyển dụng này?")) return;
    try {
      await fetchApi(`/recruiter/${id}`, { method: "DELETE" });
      setJobs(jobs.filter(job => job.id !== id));
      alert("Xóa tin tuyển dụng thành công!");
    } catch (error: any) {
      alert("Lỗi khi xóa: " + (error.message || "Unknown error"));
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Quản lý Tin tuyển dụng</h1>
          <p className="text-slate-500 mt-1">Quản lý các công việc mà công ty bạn đã đăng tải.</p>
        </div>
        <Link
          href="/dashboard/jobs/create"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-md shadow-blue-600/20"
        >
          <Plus className="size-5" /> Đăng tin mới
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-blue-600">
            <Loader2 className="size-10 animate-spin mb-4" />
          </div>
        ) : jobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="size-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <BriefcaseBusiness className="size-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Chưa có tin tuyển dụng nào</h3>
            <p className="text-slate-500 text-sm mb-6">Hãy đăng tin tuyển dụng đầu tiên của bạn để tìm kiếm những ứng viên tài năng.</p>
            <Link
              href="/dashboard/jobs/create"
              className="inline-flex items-center gap-2 px-5 py-2 text-sm bg-blue-50 text-blue-600 font-semibold rounded-lg hover:bg-blue-100 transition-colors"
            >
              Đăng tin ngay
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-sm font-semibold text-slate-600">
                  <th className="p-4 pl-6">Vị trí tuyển dụng</th>
                  <th className="p-4">Số ứng viên</th>
                  <th className="p-4">Hình thức</th>
                  <th className="p-4">Mức lương</th>
                  <th className="p-4">Ngày đăng</th>
                  <th className="p-4 pr-6 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {jobs.map((job) => {
                  const count = applicantCounts[job.id] || 0;
                  return (
                    <tr key={job.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 pl-6">
                        <div className="font-bold text-slate-900 line-clamp-1">{job.title}</div>
                        <div className="text-sm text-slate-500 flex items-center gap-1.5 mt-1">
                          <MapPin className="size-3.5" /> {job.location} {job.remote && "(Remote)"}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className={`flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold border ${count > 0 ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                            <Users className="size-3.5 mr-1" /> {count}
                          </div>
                          {count > 0 && (
                            <Link
                              href={`/dashboard/applications?jobId=${job.id}&autorank=true`}
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-gradient-to-r from-purple-50 to-indigo-50 text-purple-700 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
                            >
                              <Sparkles className="size-3" /> Xem xếp hạng
                            </Link>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                          {job.jobType}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="text-sm font-semibold text-emerald-600 flex items-center gap-1">
                          <DollarSign className="size-4" /> 
                          {formatSalaryRange(job.salaryMin, job.salaryMax, job.currency)}
                        </div>
                      </td>
                      <td className="p-4 text-sm text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <Clock className="size-3.5 text-slate-400" />
                          {job.createdAt ? new Date(job.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                        </div>
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link 
                            href={`/dashboard/jobs/edit/${job.id}`}
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Sửa"
                          >
                            <Pencil className="size-4" />
                          </Link>
                          <button 
                            onClick={() => handleDelete(job.id)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Xóa"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
