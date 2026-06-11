"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "../../../../lib/api";
import { Loader2, Plus, UserPlus, Users, AlertCircle, Ban } from "lucide-react";

interface HRUser {
  userId: number;
  email: string;
  role: string;
  status: string;
  createdAt: string;
}

export default function HRManagementPage() {
  const [hrList, setHrList] = useState<HRUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [adding, setAdding] = useState(false);
  const [banningId, setBanningId] = useState<number | null>(null);

  const loadHRList = async () => {
    setLoading(true);
    try {
      const data = await fetchApi("/company/recruiter");
      setHrList(data || []);
    } catch (error) {
      console.error("Failed to load HR list:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHRList();
  }, []);

  const handleAddHR = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);
    try {
      await fetchApi("/auth/register/recruiter", {
        method: "POST",
        body: JSON.stringify({ email: newEmail, password: newPassword })
      });
      alert("Đã tạo tài khoản HR thành công!");
      setShowAddModal(false);
      setNewEmail("");
      setNewPassword("");
      await loadHRList();
    } catch (error: any) {
      alert("Lỗi khi tạo HR: " + (error.message || "Unknown error"));
    } finally {
      setAdding(false);
    }
  };

  const handleBan = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn khóa tài khoản này? Người này sẽ không thể đăng nhập hoặc thao tác nữa.")) return;
    
    setBanningId(id);
    try {
      // API company/approve/{id} changes status to BANNED
      await fetchApi(`/company/approve/${id}`, { method: "PUT" });
      alert("Đã khóa tài khoản thành công!");
      await loadHRList();
    } catch (error: any) {
      alert("Lỗi khi khóa: " + error.message);
    } finally {
      setBanningId(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Quản lý Nhân sự (HR)</h1>
          <p className="text-slate-500 mt-1">Danh sách các tài khoản nhà tuyển dụng thuộc công ty của bạn.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-md shadow-blue-600/20"
        >
          <UserPlus className="size-5" /> Thêm nhân sự mới
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-blue-600">
            <Loader2 className="size-10 animate-spin mb-4" />
          </div>
        ) : hrList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="size-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <Users className="size-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Chưa có nhân sự nào</h3>
            <p className="text-slate-500 text-sm">Hãy thêm tài khoản HR để họ có thể đăng tin và lọc hồ sơ giúp bạn.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-sm font-semibold text-slate-600">
                  <th className="p-4 pl-6">Email HR</th>
                  <th className="p-4">Ngày tạo</th>
                  <th className="p-4">Trạng thái</th>
                  <th className="p-4 pr-6 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {hrList.map((hr) => (
                  <tr key={hr.userId} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 pl-6 font-medium text-slate-900">{hr.email}</td>
                    <td className="p-4 text-sm text-slate-600">{new Date(hr.createdAt).toLocaleDateString('vi-VN')}</td>
                    <td className="p-4">
                      {hr.status === 'ACTIVE' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">Hoạt động</span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">Đã khóa</span>
                      )}
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <button
                        onClick={() => handleBan(hr.userId)}
                        disabled={banningId === hr.userId || hr.status === 'BANNED'}
                        className="inline-flex items-center justify-center p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Khóa tài khoản"
                      >
                        {banningId === hr.userId ? <Loader2 className="size-5 animate-spin" /> : <Ban className="size-5" />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-lg text-slate-900">Tạo tài khoản HR mới</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>
            <form onSubmit={handleAddHR} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Email đăng nhập</label>
                <input
                  required
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Mật khẩu</label>
                <input
                  required
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={adding}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-70"
                >
                  {adding ? <Loader2 className="size-4 animate-spin mr-2" /> : <Plus className="size-4 mr-1" />}
                  Tạo tài khoản
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
