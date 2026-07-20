"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "../../../../lib/api";
import { Save, Loader2, UploadCloud } from "lucide-react";
import toast from "react-hot-toast";

interface CompanyProfile {
  name: string;
  description: string;
  industry: string;
  companySize: string;
  website: string;
  logoUrl: string;
  location: string;
}

export default function CompanyProfilePage() {
  const [profile, setProfile] = useState<CompanyProfile>({
    name: "",
    description: "",
    industry: "",
    companySize: "",
    website: "",
    logoUrl: "",
    location: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await fetchApi("/company/profile");
        if (data) setProfile(data);
      } catch (error) {
        console.error("Failed to load company profile", error);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await fetchApi("/company/profile", {
        method: "PUT",
        body: JSON.stringify(profile)
      });
      toast.success("Cập nhật thông tin công ty thành công!");
    } catch (error: any) {
      toast.error("Lỗi khi cập nhật: " + (error.message || "Unknown error"));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="size-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Hồ sơ Công ty</h1>
        <p className="text-slate-500 mt-1">Cập nhật thông tin chi tiết về doanh nghiệp của bạn để thu hút ứng viên.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 lg:p-8">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Tên công ty <span className="text-red-500">*</span></label>
              <input
                required
                type="text"
                name="name"
                value={profile.name || ""}
                onChange={handleChange}
                placeholder="Ví dụ: Công ty TNHH AI Recruitment"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Ngành nghề</label>
              <input
                type="text"
                name="industry"
                value={profile.industry || ""}
                onChange={handleChange}
                placeholder="Ví dụ: Công nghệ thông tin, IT phần mềm..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Quy mô công ty</label>
              <input
                type="text"
                name="companySize"
                value={profile.companySize || ""}
                onChange={handleChange}
                placeholder="Ví dụ: 100-499 nhân viên"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Địa chỉ Website</label>
              <input
                type="text"
                name="website"
                value={profile.website || ""}
                onChange={handleChange}
                placeholder="https://congtycuaban.com"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-slate-700">Địa chỉ công ty</label>
              <input
                type="text"
                name="location"
                value={profile.location || ""}
                onChange={handleChange}
                placeholder="Số nhà, Tên đường, Phường/Xã, Quận/Huyện, Tỉnh/Thành phố"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-slate-700">Link Logo công ty</label>
              <input
                type="text"
                name="logoUrl"
                value={profile.logoUrl || ""}
                onChange={handleChange}
                placeholder="https://example.com/logo.png"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-slate-700">Giới thiệu về công ty</label>
              <textarea
                name="description"
                value={profile.description || ""}
                onChange={handleChange}
                rows={5}
                placeholder="Viết một đoạn ngắn giới thiệu về lịch sử, sứ mệnh và văn hóa công ty..."
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none resize-y"
              ></textarea>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-md shadow-blue-600/20 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {saving ? <Loader2 className="size-5 animate-spin" /> : <Save className="size-5" />}
              {saving ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
