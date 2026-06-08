"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "../../../lib/api";
import { UserPendingResponse } from "../../../lib/types/admin";
import { Loader2, CheckCircle2, Clock, Mail, Building2, AlertCircle } from "lucide-react";

export default function ApprovalsPage() {
  const [users, setUsers] = useState<UserPendingResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);

  const loadPendingUsers = async () => {
    setLoading(true);
    try {
      // It returns a list of users
      const data = await fetchApi("/admin/user/pending");
      setUsers(data || []);
    } catch (error) {
      console.error("Failed to load pending users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPendingUsers();
  }, []);

  const handleApprove = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn duyệt tài khoản này?")) return;
    
    setActionLoadingId(id);
    try {
      await fetchApi(`/admin/approve/${id}`, { method: "PUT" });
      alert("Đã duyệt tài khoản thành công!");
      await loadPendingUsers();
    } catch (error: any) {
      alert(error.message || "Lỗi khi duyệt tài khoản");
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Duyệt tài khoản doanh nghiệp</h1>
        <p className="text-slate-500 mt-1">Danh sách các công ty mới đăng ký đang chờ quản trị viên phê duyệt để có thể đăng nhập và tuyển dụng.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-blue-600">
            <Loader2 className="size-10 animate-spin mb-4" />
            <div className="text-slate-500 text-sm font-medium">Đang tải dữ liệu...</div>
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <div className="size-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="size-8 text-green-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Không có tài khoản nào chờ duyệt</h3>
            <p className="text-slate-500 text-sm">Tuyệt vời! Tất cả tài khoản doanh nghiệp đã được xử lý.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-sm font-semibold text-slate-600">
                  <th className="p-4 pl-6">Thông tin tài khoản</th>
                  <th className="p-4">Vai trò</th>
                  <th className="p-4">Ngày đăng ký</th>
                  <th className="p-4">Trạng thái</th>
                  <th className="p-4 pr-6 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                          <Building2 className="size-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">{user.email}</div>
                          <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                            <Mail className="size-3" /> ID: {user.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <Clock className="size-3.5 text-slate-400" />
                        {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                        <AlertCircle className="size-3.5" /> {user.status}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <button
                        onClick={() => handleApprove(user.id)}
                        disabled={actionLoadingId === user.id}
                        className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm disabled:opacity-50"
                      >
                        {actionLoadingId === user.id ? (
                          <><Loader2 className="size-4 animate-spin mr-2" /> Đang xử lý</>
                        ) : (
                          "Duyệt ngay"
                        )}
                      </button>
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
