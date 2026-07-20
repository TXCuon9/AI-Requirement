"use client";

import { useState, useEffect } from "react";
import { fetchApi } from "../../../lib/api";
import { Briefcase, Search, Loader2, Edit, Trash2, X } from "lucide-react";
import toast from "react-hot-toast";
import { customConfirm } from "@/lib/customConfirm";

interface JobAdminDTO {
  id: number;
  title: string;
  companyName: string;
  industry: string;
  status: "OPEN" | "CLOSED" | "DRAFT";
}

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<JobAdminDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterIndustry, setFilterIndustry] = useState("ALL");

  // Modal states
  const [editingJob, setEditingJob] = useState<JobAdminDTO | null>(null);
  const [editForm, setEditForm] = useState({ title: "", status: "" });
  const [isSaving, setIsSaving] = useState(false);

  const loadJobs = async () => {
    setLoading(true);
    try {
      const data = await fetchApi("/admin/jobs");
      setJobs(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const handleDelete = async (id: number) => {
    if (!(await customConfirm("Bạn có chắc chắn muốn xóa tin tuyển dụng này vĩnh viễn?"))) return;
    try {
      await fetchApi(`/admin/jobs/${id}`, { method: "DELETE" });
      setJobs(jobs.filter((j) => j.id !== id));
    } catch (err: any) {
      toast.error("Lỗi: " + err.message);
    }
  };

  const handleEdit = (job: JobAdminDTO) => {
    setEditingJob(job);
    setEditForm({ title: job.title, status: job.status });
  };

  const saveEdit = async () => {
    if (!editingJob) return;
    setIsSaving(true);
    try {
      await fetchApi(`/admin/jobs/${editingJob.id}`, {
        method: "PUT",
        body: JSON.stringify(editForm),
      });
      setEditingJob(null);
      loadJobs();
    } catch (err: any) {
      toast.error("Lỗi: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const filteredJobs = jobs.filter(j => {
    const matchesSearch = (j.title?.toLowerCase() || "").includes(searchTerm.toLowerCase()) || 
                          (j.companyName?.toLowerCase() || "").includes(searchTerm.toLowerCase());
    const matchesIndustry = filterIndustry === "ALL" || (j.industry && j.industry.toLowerCase().includes(filterIndustry.toLowerCase()));
    return matchesSearch && matchesIndustry;
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-slate-800">Quản lý Việc làm</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Tìm kiếm theo tên việc làm hoặc công ty..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[var(--vw-blue)] focus:border-[var(--vw-blue)] transition-all outline-none text-[14px]"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500 font-medium whitespace-nowrap">Lọc ngành nghề:</span>
            <select 
              value={filterIndustry} 
              onChange={(e) => setFilterIndustry(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:border-[var(--vw-blue)] outline-none"
            >
              <option value="ALL">Tất cả ngành nghề</option>
              <option value="IT">IT / Công nghệ</option>
              <option value="Viễn thông">Viễn thông</option>
              <option value="Tài chính">Tài chính / Ngân hàng</option>
              <option value="Sản xuất">Sản xuất</option>
              <option value="Giáo dục">Giáo dục</option>
              <option value="Bán lẻ">Bán lẻ / Tiêu dùng</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[14px] whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 text-[12px] uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-semibold">Tên việc làm</th>
                <th className="px-6 py-4 font-semibold">Tên công ty</th>
                <th className="px-6 py-4 font-semibold">Ngành nghề</th>
                <th className="px-6 py-4 font-semibold">Trạng thái</th>
                <th className="px-6 py-4 font-semibold text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center">
                    <Loader2 className="size-6 text-[var(--vw-blue)] animate-spin mx-auto" />
                  </td>
                </tr>
              ) : filteredJobs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-slate-500">
                    Không tìm thấy việc làm nào.
                  </td>
                </tr>
              ) : (
                filteredJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-[var(--vw-blue)]">{job.title}</td>
                    <td className="px-6 py-4 text-slate-700">{job.companyName}</td>
                    <td className="px-6 py-4 text-slate-500 text-[12px]">{job.industry || "Chưa cập nhật"}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[12px] font-bold ${
                        job.status === 'OPEN' ? 'bg-emerald-100 text-emerald-700' :
                        job.status === 'CLOSED' ? 'bg-red-100 text-red-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {job.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                      <button 
                        onClick={() => handleEdit(job)}
                        className="p-1.5 text-slate-400 hover:text-[var(--vw-blue)] hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit className="size-[18px]" />
                      </button>
                      <button 
                        onClick={() => handleDelete(job.id)}
                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="size-[18px]" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editingJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-4 border-b border-slate-100">
              <h3 className="font-bold text-lg text-slate-800">Chỉnh sửa Việc làm</h3>
              <button onClick={() => setEditingJob(null)} className="text-slate-400 hover:text-slate-600">
                <X className="size-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-[13px] font-semibold text-slate-600 mb-1.5">Tên việc làm</label>
                <input type="text" value={editForm.title} onChange={(e) => setEditForm({...editForm, title: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-[var(--vw-blue)] outline-none text-[14px]" />
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-slate-600 mb-1.5">Trạng thái</label>
                <select 
                  value={editForm.status}
                  onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-[var(--vw-blue)] outline-none text-[14px]"
                >
                  <option value="OPEN">OPEN (Đang mở)</option>
                  <option value="CLOSED">CLOSED (Đã đóng)</option>
                  <option value="DRAFT">DRAFT (Bản nháp)</option>
                </select>
              </div>
            </div>
            <div className="p-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
              <button onClick={() => setEditingJob(null)} className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-200 transition-colors">
                Hủy
              </button>
              <button onClick={saveEdit} disabled={isSaving} className="px-4 py-2 rounded-lg text-sm font-semibold bg-[var(--vw-blue)] text-white hover:bg-blue-700 transition-colors flex items-center gap-2">
                {isSaving && <Loader2 className="size-4 animate-spin" />}
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
