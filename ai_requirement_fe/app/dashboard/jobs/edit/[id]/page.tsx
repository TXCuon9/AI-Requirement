"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchApi } from "../../../../../lib/api";
import { Save, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function EditJobPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirement: "",
    responsibilities: "",
    salaryMin: "",
    salaryMax: "",
    currency: "VNĐ",
    location: "",
    remote: false,
    jobType: "FULL_TIME",
    experienceLevel: "JUNIOR",
    expiredAt: ""
  });

  useEffect(() => {
    if (!id) return;
    fetchApi(`/recruiter/${id}`)
      .then((data) => {
        if (data) {
          setFormData({
            title: data.title || "",
            description: data.description || "",
            requirement: data.requirements || "",
            responsibilities: data.responsibilities || "",
            salaryMin: data.salaryMin ? data.salaryMin.toString() : "",
            salaryMax: data.salaryMax ? data.salaryMax.toString() : "",
            currency: data.currency || "VNĐ",
            location: data.location || "",
            remote: data.remote || false,
            jobType: data.jobType || "FULL_TIME",
            experienceLevel: data.experienceLevel || "JUNIOR",
            expiredAt: data.expiredAt ? new Date(data.expiredAt).toISOString().substring(0, 16) : ""
          });
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [name]: target.checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    // Format data for API
    const submitData = {
      ...formData,
      salaryMin: formData.salaryMin ? Number(formData.salaryMin) : null,
      salaryMax: formData.salaryMax ? Number(formData.salaryMax) : null,
      expiredAt: formData.expiredAt ? new Date(formData.expiredAt).toISOString() : null
    };

    try {
      await fetchApi(`/recruiter/${id}`, {
        method: "PUT",
        body: JSON.stringify(submitData)
      });
      toast.success("Cập nhật tin tuyển dụng thành công!");
      router.push("/dashboard/jobs");
    } catch (error: any) {
      toast.error("Lỗi khi đăng tin: " + (error.message || "Unknown error"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/jobs" className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
          <ArrowLeft className="size-5 text-slate-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Chỉnh sửa tin tuyển dụng</h1>
          <p className="text-slate-500 mt-1">Cập nhật thông tin để tìm kiếm ứng viên phù hợp nhất.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 lg:p-8">
        <div className="space-y-8">
          
          {/* Section 1: Thông tin chung */}
          <div>
             <h3 className="text-lg font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">1. Thông tin chung</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-semibold text-slate-700">Tiêu đề công việc <span className="text-red-500">*</span></label>
                  <input
                    required
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Ví dụ: Lập trình viên Frontend (ReactJS/NextJS)"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Hình thức làm việc <span className="text-red-500">*</span></label>
                  <select
                    required
                    name="jobType"
                    value={formData.jobType}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none bg-white"
                  >
                    <option value="FULL_TIME">Toàn thời gian (Full-time)</option>
                    <option value="PART_TIME">Bán thời gian (Part-time)</option>
                    <option value="INTERNSHIP">Thực tập sinh (Internship)</option>
                    <option value="FREELANCE">Nghề tự do (Freelance)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Cấp bậc <span className="text-red-500">*</span></label>
                  <select
                    required
                    name="experienceLevel"
                    value={formData.experienceLevel}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none bg-white"
                  >
                    <option value="FRESHER">Thực tập / Fresher</option>
                    <option value="JUNIOR">Mới đi làm / Junior</option>
                    <option value="MIDDLE">Nhân viên / Middle</option>
                    <option value="SENIOR">Chuyên viên / Senior</option>
                  </select>
                </div>
             </div>
          </div>

          {/* Section 2: Địa điểm và Lương */}
          <div>
             <h3 className="text-lg font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">2. Địa điểm & Mức lương</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-semibold text-slate-700">Địa điểm làm việc <span className="text-red-500">*</span></label>
                  <input
                    required
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Ví dụ: Tòa nhà A, Quận 1, TP. HCM"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                  />
                  <div className="mt-2 flex items-center gap-2">
                    <input type="checkbox" id="remote" name="remote" checked={formData.remote} onChange={handleChange} className="size-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                    <label htmlFor="remote" className="text-sm text-slate-600">Cho phép làm việc từ xa (Remote)</label>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Mức lương</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      name="salaryMin"
                      value={formData.salaryMin}
                      onChange={handleChange}
                      placeholder="Từ..."
                      className="w-1/3 px-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                    />
                    <input
                      type="number"
                      name="salaryMax"
                      value={formData.salaryMax}
                      onChange={handleChange}
                      placeholder="Đến..."
                      className="w-1/3 px-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                    />
                      <select
                        name="currency"
                        value={formData.currency}
                        onChange={handleChange}
                        className="w-1/3 px-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none bg-white"
                      >
                        <option value="VNĐ">VNĐ</option>
                        <option value="USD">USD</option>
                      </select>
                    </div>
                    {formData.currency === "VNĐ" && (
                      <p className="text-xs text-slate-500 mt-1.5 ml-1">
                        Mẹo: Bạn có thể nhập <b>12</b> hệ thống sẽ tự hiểu là <b>12 Triệu</b>.
                      </p>
                    )}
                </div>
             </div>
          </div>

          {/* Section 3: Chi tiết công việc */}
          <div>
             <h3 className="text-lg font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">3. Chi tiết công việc</h3>
             <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Mô tả công việc</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Mô tả các công việc ứng viên sẽ thực hiện..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none resize-y"
                  ></textarea>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Yêu cầu ứng viên</label>
                  <textarea
                    name="requirement"
                    value={formData.requirement}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Các kỹ năng, kinh nghiệm, bằng cấp yêu cầu..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none resize-y"
                  ></textarea>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Quyền lợi (Responsibilities / Benefits)</label>
                  <textarea
                    name="responsibilities"
                    value={formData.responsibilities}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Quyền lợi, chế độ đãi ngộ, bảo hiểm..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none resize-y"
                  ></textarea>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Ngày hết hạn nộp hồ sơ</label>
                  <input
                    type="datetime-local"
                    name="expiredAt"
                    value={formData.expiredAt}
                    onChange={handleChange}
                    className="w-full md:w-1/2 px-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                  />
                </div>
             </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-4">
            <Link
              href="/dashboard/jobs"
              className="px-6 py-2.5 text-slate-600 font-semibold hover:bg-slate-100 rounded-xl transition-all"
            >
              Hủy
            </Link>
            <button
              type="submit"
              disabled={saving || loading}
              className="inline-flex items-center justify-center gap-2 px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-md shadow-blue-600/20 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {saving ? <Loader2 className="size-5 animate-spin" /> : <Save className="size-5" />}
              {saving ? "Đang xử lý..." : "Cập nhật tin"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
