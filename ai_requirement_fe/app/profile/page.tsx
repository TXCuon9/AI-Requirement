"use client";

import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import { User, Mail, Phone, MapPin, Briefcase, DollarSign, Code2, Globe, Save, Loader2 } from "lucide-react";
import { fetchApi } from "../../lib/api";

export default function ProfilePage() {
  const [profileData, setProfileData] = useState({
    fullName: "",
    currentPosition: "",
    phone: "",
    address: "",
    bio: "",
    experienceYears: 0,
    expectedSalary: 0,
    linkedinUrl: "",
    githubUrl: "",
    portfolioUrl: ""
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const calculateCompletion = () => {
    const fields = Object.values(profileData);
    const filledFields = fields.filter(val => val !== "" && val !== null && val !== 0).length;
    return Math.round((filledFields / fields.length) * 100) || 0;
  };
  const completionPercentage = calculateCompletion();

  // Fetch profile on mount
  useEffect(() => {
    fetchApi("/candidate/profile")
      .then(data => {
        if (data) {
          setProfileData({
            fullName: data.fullName || "",
            currentPosition: data.currentPosition || "",
            phone: data.phone || "",
            address: data.address || "",
            bio: data.bio || "",
            experienceYears: data.experienceYears || 0,
            expectedSalary: data.expectedSalary || 0,
            linkedinUrl: data.linkedinUrl || "",
            githubUrl: data.githubUrl || "",
            portfolioUrl: data.portfolioUrl || ""
          });
        }
      })
      .catch(console.error);
  }, []);

  const handleSaveProfile = async () => {
    setIsSavingProfile(true);
    try {
      await fetchApi("/candidate/profile", {
        method: "PUT",
        body: JSON.stringify(profileData)
      });
      alert("Lưu hồ sơ thành công!");
    } catch (err: any) {
      alert("Lỗi khi lưu hồ sơ: " + err.message);
    } finally {
      setIsSavingProfile(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navbar />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Cập nhật Hồ sơ</h1>
          <p className="text-slate-600 mt-1">Hoàn thiện hồ sơ trực tuyến của bạn để thu hút nhà tuyển dụng.</p>
        </div>

        <div className="space-y-6">
          {/* Progress Profile */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Tiến độ hoàn thiện</h2>
              <p className="text-sm text-slate-500 mt-1">Hoàn thiện hồ sơ trên 80% sẽ tăng 80% cơ hội nhận lời mời phỏng vấn.</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-sm font-semibold text-blue-600">{completionPercentage}%</div>
                <div className="text-xs text-slate-400">Hoàn thiện</div>
              </div>
              <div className="w-16 h-16 rounded-full border-4 border-slate-100 relative flex items-center justify-center">
                <svg className="absolute top-0 left-0 w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-blue-600"
                    strokeDasharray={`${completionPercentage}, 100`}
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* General Info Form */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <User className="size-5 text-blue-600" /> Thông tin cá nhân
            </h3>
            
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Họ và tên <span className="text-red-500">*</span></label>
                <input type="text" value={profileData.fullName} onChange={(e) => setProfileData({...profileData, fullName: e.target.value})} className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" placeholder="Ví dụ: Nguyễn Văn A" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Chức danh / Vị trí hiện tại <span className="text-red-500">*</span></label>
                <input type="text" value={profileData.currentPosition} onChange={(e) => setProfileData({...profileData, currentPosition: e.target.value})} className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" placeholder="Ví dụ: ReactJS Developer" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email liên hệ <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                  <input type="email" disabled value={typeof window !== "undefined" ? localStorage.getItem("userEmail") || "" : ""} className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-500 outline-none cursor-not-allowed" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Số điện thoại <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                  <input type="tel" value={profileData.phone} onChange={(e) => setProfileData({...profileData, phone: e.target.value})} className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" placeholder="09xxxx..." />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Địa chỉ hiện tại</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                  <input type="text" value={profileData.address} onChange={(e) => setProfileData({...profileData, address: e.target.value})} className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" placeholder="Ví dụ: Quận Cầu Giấy, Hà Nội" />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Giới thiệu bản thân (Bio)</label>
                <textarea rows={4} value={profileData.bio} onChange={(e) => setProfileData({...profileData, bio: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none" placeholder="Tóm tắt ngắn gọn về kinh nghiệm, kỹ năng và mục tiêu nghề nghiệp của bạn..."></textarea>
              </div>
            </div>
          </div>

          {/* Career Settings */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Briefcase className="size-5 text-blue-600" /> Cài đặt gợi ý việc làm
            </h3>
            
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Số năm kinh nghiệm</label>
                <select value={profileData.experienceYears} onChange={(e) => setProfileData({...profileData, experienceYears: parseInt(e.target.value) || 0})} className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all appearance-none">
                  <option value={0}>Chưa có kinh nghiệm</option>
                  <option value={1}>Dưới 1 năm (1)</option>
                  <option value={2}>1 - 3 năm (2)</option>
                  <option value={4}>3 - 5 năm (4)</option>
                  <option value={6}>Trên 5 năm (6)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Mức lương mong muốn (VNĐ)</label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                  <input type="number" value={profileData.expectedSalary || ""} onChange={(e) => setProfileData({...profileData, expectedSalary: parseInt(e.target.value) || 0})} className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" placeholder="Ví dụ: 20000000" />
                </div>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Globe className="size-5 text-blue-600" /> Mạng xã hội & Liên kết
            </h3>
            
            <div className="space-y-4">
              <div className="relative flex items-center">
                <Globe className="absolute left-4 size-5 text-slate-400" />
                <input type="url" value={profileData.linkedinUrl} onChange={(e) => setProfileData({...profileData, linkedinUrl: e.target.value})} className="w-full pl-12 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" placeholder="LinkedIn URL" />
              </div>
              <div className="relative flex items-center">
                <Code2 className="absolute left-4 size-5 text-slate-400" />
                <input type="url" value={profileData.githubUrl} onChange={(e) => setProfileData({...profileData, githubUrl: e.target.value})} className="w-full pl-12 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" placeholder="Github URL" />
              </div>
              <div className="relative flex items-center">
                <Globe className="absolute left-4 size-5 text-slate-400" />
                <input type="url" value={profileData.portfolioUrl} onChange={(e) => setProfileData({...profileData, portfolioUrl: e.target.value})} className="w-full pl-12 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" placeholder="Portfolio / Website cá nhân" />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button 
              onClick={handleSaveProfile}
              disabled={isSavingProfile}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white font-semibold py-3 px-8 rounded-xl transition-all shadow-md shadow-blue-600/20 flex items-center gap-2"
            >
              {isSavingProfile ? <Loader2 className="size-5 animate-spin" /> : <Save className="size-5" />} 
              Lưu Hồ sơ
            </button>
          </div>
          
        </div>
      </main>
    </div>
  );
}
