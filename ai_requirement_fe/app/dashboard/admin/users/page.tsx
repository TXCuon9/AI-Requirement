"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "../../../../lib/api";
import { Loader2, UserCheck, ShieldAlert, CheckCircle, Mail, Building, Clock } from "lucide-react";
import { useAuth } from "../../../../lib/authContext";
import { useRouter } from "next/navigation";

interface PendingUser {
  id: number;
  email: string;
  role: string;
  provider: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminPendingUsersPage() {
  const [users, setUsers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState<number | null>(null);
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  // Load pending users
  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await fetchApi("/admin/user/pending");
      setUsers(data || []);
    } catch (error) {
      console.error("Failed to load pending users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user?.role === "ADMIN") {
      loadUsers();
    } else if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, user, router]);

  const handleApprove = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn duyệt tài khoản này?")) return;
    
    setApproving(id);
    try {
      await fetchApi(`/admin/approve/${id}`, { method: "PUT" });
      alert("Đã duyệt tài khoản thành công!");
      setUsers(users.filter(u => u.id !== id));
    } catch (error: any) {
      alert("Lỗi khi duyệt: " + (error.message || "Unknown error"));
    } finally {
      setApproving(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-amber-100 rounded-lg">
          <ShieldAlert className="size-6 text-amber-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Duyệt tài khoản mới</h1>
          <p className="text-slate-500 mt-1">Danh sách các tài khoản đang chờ ban quản trị phê duyệt để kích hoạt.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-blue-600">
            <Loader2 className="size-10 animate-spin mb-4" />
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="size-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="size-8 text-emerald-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Tất cả tài khoản đã được duyệt</h3>
            <p className="text-slate-500 text-sm">Không có tài khoản nào đang trong trạng thái chờ xử lý.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-sm font-semibold text-slate-600">
                  <th className="p-4 pl-6">Thông tin tài khoản</th>
                  <th className="p-4">Phân quyền</th>
                  <th className="p-4">Ngày đăng ký</th>
                  <th className="p-4">Trạng thái</th>
                  <th className="p-4 pr-6 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold">
                          {u.email.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                            <Mail className="size-3.5 text-slate-400" /> {u.email}
                          </div>
                          <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                            Provider: <span className="font-medium text-slate-700">{u.provider}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-100">
                        {u.role === "COMPANY" ? <Building className="size-3.5" /> : <UserCheck className="size-3.5" />}
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <Clock className="size-3.5 text-slate-400" />
                        {new Date(u.createdAt).toLocaleDateString('vi-VN')}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                        Chờ duyệt
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <button 
                        onClick={() => handleApprove(u.id)}
                        disabled={approving === u.id}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg transition-all shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {approving === u.id ? <Loader2 className="size-4 animate-spin" /> : <CheckCircle className="size-4" />}
                        {approving === u.id ? "Đang duyệt..." : "Duyệt ngay"}
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
