"use client";

import { useState, useEffect } from "react";
import { fetchApi } from "../../../lib/api";
import { Building2, Search, Loader2, Edit, Trash2, CheckCircle2, XCircle, AlertCircle, X } from "lucide-react";

interface CompanyAdminDTO {
  id: number;
  name: string;
  email: string;
  industry: string;
  companySize: string;
  location: string;
  verified: boolean;
  status: "ACTIVE" | "INACTIVE" | "PENDING" | "BANNED";
}

export default function AdminCompaniesPage() {
  const [companies, setCompanies] = useState<CompanyAdminDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterIndustry, setFilterIndustry] = useState("ALL");
  const [processingId, setProcessingId] = useState<number | null>(null);

  // Modal states
  const [editingCompany, setEditingCompany] = useState<CompanyAdminDTO | null>(null);
  const [editForm, setEditForm] = useState({ name: "", industry: "", companySize: "", location: "", verified: false });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      setLoading(true);
      const data = await fetchApi("/admin/companies");
      if (data) setCompanies(data);
    } catch (error) {
      console.error("Failed to load companies:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn thay đổi trạng thái hoạt động của doanh nghiệp này?")) return;
    try {
      setProcessingId(id);
      await fetchApi(`/admin/companies/${id}/toggle-status`, { method: "PUT" });
      await loadCompanies(); 
    } catch (error) {
      console.error("Failed to toggle status:", error);
      alert("Có lỗi xảy ra khi cập nhật trạng thái");
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("CẢNH BÁO: Xóa công ty sẽ xóa toàn bộ Việc làm và Tài khoản nhân sự liên quan. Bạn có chắc chắn muốn xóa?")) return;
    try {
      setProcessingId(id);
      await fetchApi(`/admin/companies/${id}`, { method: "DELETE" });
      setCompanies(companies.filter(c => c.id !== id));
    } catch (error: any) {
      alert("Lỗi khi xóa: " + error.message);
    } finally {
      setProcessingId(null);
    }
  };

  const handleEdit = (company: CompanyAdminDTO) => {
    setEditingCompany(company);
    setEditForm({
      name: company.name || "",
      industry: company.industry || "",
      companySize: company.companySize || "",
      location: company.location || "",
      verified: company.verified || false
    });
  };

  const saveEdit = async () => {
    if (!editingCompany) return;
    setIsSaving(true);
    try {
      await fetchApi(`/admin/companies/${editingCompany.id}`, {
        method: "PUT",
        body: JSON.stringify(editForm),
      });
      setEditingCompany(null);
      loadCompanies();
    } catch (err: any) {
      alert("Lỗi khi lưu: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const filteredCompanies = companies.filter(c => {
    const matchesSearch = (c.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) || 
                          (c.email?.toLowerCase() || "").includes(searchTerm.toLowerCase());
    const matchesIndustry = filterIndustry === "ALL" || (c.industry && c.industry.toLowerCase().includes(filterIndustry.toLowerCase()));
    return matchesSearch && matchesIndustry;
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Quản lý Doanh nghiệp</h1>
          <p className="text-slate-500 mt-1">Sửa, xóa và quản lý trạng thái của các công ty trên hệ thống.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Tìm kiếm theo tên hoặc email..." 
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
                <th className="px-6 py-4 font-semibold">Tên doanh nghiệp</th>
                <th className="px-6 py-4 font-semibold">Email tài khoản</th>
                <th className="px-6 py-4 font-semibold">Xác thực</th>
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
              ) : filteredCompanies.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-slate-500">
                    Không tìm thấy doanh nghiệp nào.
                  </td>
                </tr>
              ) : (
                filteredCompanies.map((company) => (
                  <tr key={company.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                          <Building2 className="size-5 text-[var(--vw-blue)]" />
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">{company.name}</div>
                          <div className="text-[12px] text-slate-500">{company.industry || "Chưa cập nhật ngành nghề"}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium">{company.email}</td>
                    <td className="px-6 py-4">
                      {company.verified ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[12px] font-bold bg-emerald-100 text-emerald-700">
                          <CheckCircle2 className="size-3.5" /> Đã duyệt
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[12px] font-bold bg-amber-100 text-amber-700">
                          <AlertCircle className="size-3.5" /> Chờ duyệt
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {company.status === "ACTIVE" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[12px] font-bold bg-blue-100 text-blue-700">
                          Đang hoạt động
                        </span>
                      ) : company.status === "INACTIVE" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[12px] font-bold bg-red-100 text-red-700">
                          Ngừng hoạt động
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[12px] font-bold bg-slate-100 text-slate-700">
                          {company.status}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleToggleStatus(company.id)}
                        disabled={processingId === company.id}
                        className={`inline-flex items-center justify-center px-3 py-1.5 rounded-lg text-[13px] font-semibold transition-colors ${
                          company.status === "ACTIVE" 
                            ? "bg-red-50 text-red-600 hover:bg-red-100" 
                            : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                        }`}
                      >
                        {processingId === company.id ? <Loader2 className="size-4 animate-spin" /> : (company.status === "ACTIVE" ? "Khóa" : "Mở")}
                      </button>
                      <button 
                        onClick={() => handleEdit(company)}
                        className="p-1.5 text-slate-400 hover:text-[var(--vw-blue)] hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit className="size-[18px]" />
                      </button>
                      <button 
                        onClick={() => handleDelete(company.id)}
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
      {editingCompany && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-4 border-b border-slate-100">
              <h3 className="font-bold text-lg text-slate-800">Sửa thông tin Doanh nghiệp</h3>
              <button onClick={() => setEditingCompany(null)} className="text-slate-400 hover:text-slate-600">
                <X className="size-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-[13px] font-semibold text-slate-600 mb-1.5">Tên doanh nghiệp</label>
                <input type="text" value={editForm.name} onChange={(e) => setEditForm({...editForm, name: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-[var(--vw-blue)] outline-none text-[14px]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-semibold text-slate-600 mb-1.5">Ngành nghề</label>
                  <input type="text" value={editForm.industry} onChange={(e) => setEditForm({...editForm, industry: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-[var(--vw-blue)] outline-none text-[14px]" />
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-slate-600 mb-1.5">Quy mô</label>
                  <input type="text" value={editForm.companySize} onChange={(e) => setEditForm({...editForm, companySize: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-[var(--vw-blue)] outline-none text-[14px]" />
                </div>
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-slate-600 mb-1.5">Địa chỉ</label>
                <input type="text" value={editForm.location} onChange={(e) => setEditForm({...editForm, location: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-[var(--vw-blue)] outline-none text-[14px]" />
              </div>
              <div className="flex items-center gap-2 mt-4">
                <input type="checkbox" id="verified" checked={editForm.verified} onChange={(e) => setEditForm({...editForm, verified: e.target.checked})} className="size-4" />
                <label htmlFor="verified" className="text-[14px] font-semibold text-slate-700">Đã xác thực (Verified)</label>
              </div>
            </div>
            <div className="p-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
              <button onClick={() => setEditingCompany(null)} className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-200 transition-colors">
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
