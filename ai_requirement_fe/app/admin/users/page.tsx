"use client";

import { useState, useEffect } from "react";
import { fetchApi } from "../../../lib/api";
import { Edit, Trash2, Loader2, X } from "lucide-react";
import toast from "react-hot-toast";
import { customConfirm } from "@/lib/customConfirm";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterRole, setFilterRole] = useState("ALL");
  
  // Modal states
  const [editingUser, setEditingUser] = useState<any>(null);
  const [editForm, setEditForm] = useState({ role: "", status: "" });
  const [isSaving, setIsSaving] = useState(false);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await fetchApi("/admin/users");
      setUsers(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleDelete = async (id: number) => {
    if (!(await customConfirm("Bạn có chắc chắn muốn xóa người dùng này?"))) return;
    try {
      await fetchApi(`/admin/users/${id}`, { method: "DELETE" });
      setUsers(users.filter((u) => u.id !== id));
    } catch (err: any) {
      toast.error("Lỗi: " + err.message);
    }
  };

  const handleEdit = (user: any) => {
    setEditingUser(user);
    setEditForm({ role: user.role, status: user.status });
  };

  const saveEdit = async () => {
    if (!editingUser) return;
    setIsSaving(true);
    try {
      await fetchApi(`/admin/users/${editingUser.id}`, {
        method: "PUT",
        body: JSON.stringify(editForm),
      });
      setEditingUser(null);
      loadUsers();
    } catch (err: any) {
      toast.error("Lỗi: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const filteredUsers = filterRole === "ALL" ? users : users.filter(u => u.role === filterRole);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-slate-800">Quản lý Người dùng</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500 font-medium">Lọc theo vai trò:</span>
          <select 
            value={filterRole} 
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:border-[var(--vw-blue)] outline-none"
          >
            <option value="ALL">Tất cả</option>
            <option value="CANDIDATE">Ứng viên</option>
            <option value="COMPANY">Công ty</option>
            <option value="RECRUITER">Nhân sự (HR)</option>
            <option value="ADMIN">Quản trị viên</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="p-4 font-semibold border-b border-slate-200">ID</th>
                <th className="p-4 font-semibold border-b border-slate-200">Email</th>
                <th className="p-4 font-semibold border-b border-slate-200">Vai trò</th>
                <th className="p-4 font-semibold border-b border-slate-200">Trạng thái</th>
                <th className="p-4 font-semibold border-b border-slate-200 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    <Loader2 className="size-6 animate-spin mx-auto mb-2 text-[var(--vw-blue)]" />
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    Không có người dùng nào.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 text-slate-600 font-medium">#{user.id}</td>
                    <td className="p-4 text-slate-800 font-semibold">{user.email}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        user.role === 'ADMIN' ? 'bg-red-100 text-red-700' :
                        user.role === 'COMPANY' ? 'bg-blue-100 text-blue-700' :
                        user.role === 'RECRUITER' ? 'bg-purple-100 text-purple-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        user.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' :
                        user.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button 
                        onClick={() => handleEdit(user)}
                        className="p-1.5 text-slate-400 hover:text-[var(--vw-blue)] hover:bg-blue-50 rounded transition-colors"
                      >
                        <Edit className="size-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(user.id)}
                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 className="size-4" />
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
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-4 border-b border-slate-100">
              <h3 className="font-bold text-lg text-slate-800">Chỉnh sửa Người dùng</h3>
              <button onClick={() => setEditingUser(null)} className="text-slate-400 hover:text-slate-600">
                <X className="size-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1.5">Email</label>
                <input type="text" disabled value={editingUser.email} className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-500" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1.5">Vai trò</label>
                <select 
                  value={editForm.role}
                  onChange={(e) => setEditForm({...editForm, role: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-[var(--vw-blue)] outline-none"
                >
                  <option value="CANDIDATE">CANDIDATE</option>
                  <option value="RECRUITER">RECRUITER</option>
                  <option value="COMPANY">COMPANY</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1.5">Trạng thái</label>
                <select 
                  value={editForm.status}
                  onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-[var(--vw-blue)] outline-none"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                  <option value="PENDING">PENDING</option>
                  <option value="BANNED">BANNED</option>
                </select>
              </div>
            </div>
            <div className="p-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
              <button 
                onClick={() => setEditingUser(null)}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
              >
                Hủy
              </button>
              <button 
                onClick={saveEdit}
                disabled={isSaving}
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-[var(--vw-blue)] text-white hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
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
