"use client";

import { useState, useEffect } from "react";
import { fetchApi } from "../../../lib/api";
import { Building2, Search, Loader2, MoreVertical, CheckCircle2, XCircle, AlertCircle } from "lucide-react";

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
  const [processingId, setProcessingId] = useState<number | null>(null);

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
    if (!window.confirm("Bạn có chắc chắn muốn thay đổi trạng thái hoạt động của doanh nghiệp này? (Hành động này sẽ bật/tắt khả năng đăng nhập của tài khoản doanh nghiệp)")) {
      return;
    }
    try {
      setProcessingId(id);
      await fetchApi(`/admin/companies/${id}/toggle-status`, { method: "PUT" });
      await loadCompanies(); // Reload to get fresh data
    } catch (error) {
      console.error("Failed to toggle status:", error);
      alert("Có lỗi xảy ra khi cập nhật trạng thái");
    } finally {
      setProcessingId(null);
    }
  };

  const filteredCompanies = companies.filter(c => 
    (c.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) || 
    (c.email?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Danh sách doanh nghiệp</h1>
          <p className="text-slate-500 mt-1">Quản lý trạng thái hoạt động của tất cả các công ty.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Tìm kiếm theo tên hoặc email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold">Tên doanh nghiệp</th>
                <th className="px-6 py-4 font-semibold">Email tài khoản</th>
                <th className="px-6 py-4 font-semibold">Trạng thái xác thực</th>
                <th className="px-6 py-4 font-semibold">Trạng thái hoạt động</th>
                <th className="px-6 py-4 font-semibold text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center">
                    <Loader2 className="size-6 text-blue-600 animate-spin mx-auto" />
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
                          <Building2 className="size-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">{company.name}</div>
                          <div className="text-xs text-slate-500">{company.industry || "Chưa cập nhật ngành nghề"}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{company.email}</td>
                    <td className="px-6 py-4">
                      {company.verified ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                          <CheckCircle2 className="size-3.5" /> Đã duyệt
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700">
                          <AlertCircle className="size-3.5" /> Chờ duyệt
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {company.status === "ACTIVE" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                          <CheckCircle2 className="size-3.5" /> Đang hoạt động
                        </span>
                      ) : company.status === "INACTIVE" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700">
                          <XCircle className="size-3.5" /> Ngừng hoạt động
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                          {company.status}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleToggleStatus(company.id)}
                        disabled={processingId === company.id}
                        className={`inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          company.status === "ACTIVE" 
                            ? "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200" 
                            : "bg-green-50 text-green-600 hover:bg-green-100 border border-green-200"
                        }`}
                      >
                        {processingId === company.id ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : company.status === "ACTIVE" ? (
                          "Ngừng hoạt động"
                        ) : (
                          "Mở hoạt động"
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
