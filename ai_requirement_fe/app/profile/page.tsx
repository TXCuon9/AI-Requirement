"use client";

import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { User, Mail, Phone, MapPin, Briefcase, DollarSign, Code2, Globe, Save, Loader2, FileText, CheckCircle2, Pencil, Trash2, Plus, UploadCloud, GraduationCap, Star, Info, Eye, Download, LayoutTemplate } from "lucide-react";
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
  const [activeTab, setActiveTab] = useState("my-profile");
  const [cvTab, setCvTab] = useState("system"); // "system" | "attached"

  // Determine avatar letter
  const avatarLetter = profileData.fullName ? profileData.fullName.charAt(0).toUpperCase() : "U";

  const calculateCompletion = () => {
    const fields = Object.values(profileData);
    const filledFields = fields.filter(val => val !== "" && val !== null && val !== 0).length;
    return Math.round((filledFields / fields.length) * 100) || 0;
  };
  const completionPercentage = calculateCompletion();

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
      alert("Cập nhật thông tin thành công!");
    } catch (err: any) {
      alert("Lỗi khi lưu hồ sơ: " + err.message);
    } finally {
      setIsSavingProfile(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f1f2f6] font-sans text-slate-900">
      <Navbar />

      {/* Main Container */}
      <main className="container max-w-[1200px] mx-auto px-4 py-8 flex-1 flex flex-col lg:flex-row gap-6">
        
        {/* === LEFT SIDEBAR === */}
        <aside className="w-full lg:w-[280px] shrink-0 flex flex-col gap-4">
          
          {/* User Summary Card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex flex-col items-center text-center">
            <div className="relative group cursor-pointer mb-4">
              <div className="size-[100px] bg-slate-100 border border-slate-200 rounded-full text-slate-400 flex items-center justify-center text-4xl font-bold overflow-hidden shadow-inner">
                {profileData.fullName ? profileData.fullName.charAt(0).toUpperCase() : <User className="size-12" />}
              </div>
              <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Pencil className="size-6 text-white" />
              </div>
            </div>
            
            <h2 className="text-lg font-bold text-slate-900 leading-tight">
              {profileData.fullName || "Người dùng ẩn danh"}
            </h2>
            <p className="text-[14px] text-slate-500 mt-1 font-medium">
              {profileData.currentPosition || "Chưa cập nhật chức danh"}
            </p>
          </div>

          {/* Profile Strength */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <h3 className="font-bold text-[15px] text-slate-800 mb-4">Mức độ hoàn thiện</h3>
            <div className="flex items-center gap-4">
              <div className="size-16 rounded-full border-[5px] border-slate-100 relative flex items-center justify-center shrink-0">
                <svg className="absolute top-0 left-0 size-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-blue-600"
                    strokeDasharray={`${completionPercentage}, 100`}
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                </svg>
                <span className="font-bold text-sm text-slate-800">{completionPercentage}%</span>
              </div>
              <div className="text-[12px] text-slate-500 leading-relaxed">
                Hoàn thiện hồ sơ trên 80% giúp bạn có cơ hội nhận việc cao hơn!
              </div>
            </div>
          </div>

          {/* Sidebar Menu */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="flex flex-col">
              <button 
                onClick={() => setActiveTab("my-profile")}
                className={`flex items-center px-5 py-3.5 text-sm font-semibold transition-colors ${activeTab === "my-profile" ? "text-blue-600 bg-blue-50/50 border-l-[3px] border-blue-600" : "text-slate-600 border-l-[3px] border-transparent hover:bg-slate-50 hover:text-blue-600"}`}
              >
                <User className="size-[18px] mr-3" /> Quản lý hồ sơ
              </button>
              <button 
                className="flex items-center px-5 py-3.5 text-sm font-semibold text-slate-600 border-l-[3px] border-transparent hover:bg-slate-50 hover:text-blue-600 transition-colors"
              >
                <FileText className="size-[18px] mr-3" /> Việc làm đã ứng tuyển
              </button>
              <button 
                className="flex items-center px-5 py-3.5 text-sm font-semibold text-slate-600 border-l-[3px] border-transparent hover:bg-slate-50 hover:text-blue-600 transition-colors"
              >
                <Star className="size-[18px] mr-3" /> Việc làm đã lưu
              </button>
              <button 
                className="flex items-center px-5 py-3.5 text-sm font-semibold text-slate-600 border-l-[3px] border-transparent hover:bg-slate-50 hover:text-blue-600 transition-colors"
              >
                <Globe className="size-[18px] mr-3" /> Nhà tuyển dụng xem hồ sơ
              </button>
            </div>
          </div>

        </aside>

        {/* === MAIN CONTENT === */}
        <div className="flex-1 flex flex-col gap-6">
          
          {/* Header Action Bar */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-slate-900">Hồ sơ ứng viên</h1>
              <p className="text-sm text-slate-500 mt-1">Cập nhật thông tin để nhà tuyển dụng hiểu rõ hơn về bạn.</p>
            </div>
            <button 
              onClick={handleSaveProfile}
              disabled={isSavingProfile}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-lg transition-all flex items-center justify-center gap-2 text-sm shadow-sm whitespace-nowrap"
            >
              {isSavingProfile ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />} 
              Lưu hồ sơ
            </button>
          </div>

          {/* Block: Quản lý CV */}
          <div>
            <div className="flex items-center gap-6 border-b border-slate-200 mb-4 px-2">
              <button
                onClick={() => setCvTab("system")}
                className={`pb-3 text-[16px] font-bold transition-colors border-b-[3px] ${cvTab === "system" ? "text-blue-600 border-blue-600" : "text-slate-500 border-transparent hover:text-slate-800"}`}
              >
                Hồ sơ hệ thống
              </button>
              <button
                onClick={() => setCvTab("attached")}
                className={`pb-3 text-[16px] font-bold transition-colors border-b-[3px] ${cvTab === "attached" ? "text-blue-600 border-blue-600" : "text-slate-500 border-transparent hover:text-slate-800"}`}
              >
                Hồ sơ đính kèm
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sm:p-8">
              {cvTab === "system" ? (
                <div className="flex flex-col sm:flex-row gap-8 items-start">
                  <div className="w-[180px] shrink-0 border border-slate-200 shadow-sm rounded-lg overflow-hidden bg-slate-50">
                    <img src="/images/cv-preview-mock.png" alt="CV Preview" className="w-full h-auto opacity-80" onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/180x240?text=CV+Preview" }} />
                  </div>
                  <div className="flex flex-col gap-4 py-2">
                    <button className="flex items-center gap-4 text-blue-600 hover:text-blue-700 transition-colors group">
                      <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                        <LayoutTemplate className="size-5" />
                      </div>
                      <span className="text-[16px] font-medium">Thay đổi mẫu hồ sơ</span>
                    </button>
                    
                    <button className="flex items-center gap-4 text-blue-600 hover:text-blue-700 transition-colors group">
                      <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                        <Eye className="size-5" />
                      </div>
                      <span className="text-[16px] font-medium">Xem như nhà tuyển dụng</span>
                    </button>

                    <button className="flex items-center gap-4 text-blue-600 hover:text-blue-700 transition-colors group">
                      <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                        <Download className="size-5" />
                      </div>
                      <span className="text-[16px] font-medium">Tải xuống</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-4">CV đính kèm của bạn</h3>
                  <div className="border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 hover:bg-blue-50 hover:border-blue-300 transition-colors cursor-pointer flex flex-col items-center justify-center p-8 text-center group">
                    <div className="bg-white p-3 rounded-full shadow-sm mb-4 group-hover:scale-110 transition-transform">
                      <UploadCloud className="size-8 text-blue-500" />
                    </div>
                    <p className="text-slate-700 font-semibold mb-1">Tải CV lên (Kéo thả hoặc Bấm vào đây)</p>
                    <p className="text-[13px] text-slate-500">Định dạng hỗ trợ: PDF, DOC, DOCX. Dung lượng tối đa: 5MB</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Block: Thông tin cá nhân */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">Thông tin cá nhân</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Họ và tên <span className="text-red-500">*</span></label>
                <input type="text" value={profileData.fullName} onChange={(e) => setProfileData({...profileData, fullName: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors text-[14px]" placeholder="Nhập họ và tên" />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Vị trí mong muốn <span className="text-red-500">*</span></label>
                <input type="text" value={profileData.currentPosition} onChange={(e) => setProfileData({...profileData, currentPosition: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors text-[14px]" placeholder="VD: Senior Frontend Developer" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Email <span className="text-red-500">*</span></label>
                <input type="email" disabled value={typeof window !== "undefined" ? localStorage.getItem("userEmail") || "" : ""} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-500 outline-none cursor-not-allowed text-[14px]" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Số điện thoại <span className="text-red-500">*</span></label>
                <input type="tel" value={profileData.phone} onChange={(e) => setProfileData({...profileData, phone: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors text-[14px]" placeholder="Nhập số điện thoại" />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Địa chỉ hiện tại</label>
                <input type="text" value={profileData.address} onChange={(e) => setProfileData({...profileData, address: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors text-[14px]" placeholder="Nhập địa chỉ của bạn" />
              </div>
            </div>
          </div>

          {/* Block: Thông tin nghề nghiệp */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">Thông tin nghề nghiệp</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Số năm kinh nghiệm</label>
                <select value={profileData.experienceYears} onChange={(e) => setProfileData({...profileData, experienceYears: parseInt(e.target.value) || 0})} className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors text-[14px] bg-white cursor-pointer">
                  <option value={0}>Chưa có kinh nghiệm</option>
                  <option value={1}>Dưới 1 năm</option>
                  <option value={2}>1 - 3 năm</option>
                  <option value={4}>3 - 5 năm</option>
                  <option value={6}>Trên 5 năm</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Mức lương mong muốn (VNĐ/tháng)</label>
                <input type="number" value={profileData.expectedSalary || ""} onChange={(e) => setProfileData({...profileData, expectedSalary: parseInt(e.target.value) || 0})} className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors text-[14px]" placeholder="VD: 20000000" />
              </div>
            </div>
          </div>

          {/* Block: Mục tiêu nghề nghiệp */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-4">Mục tiêu nghề nghiệp</h3>
            <textarea 
              rows={4} 
              value={profileData.bio} 
              onChange={(e) => setProfileData({...profileData, bio: e.target.value})} 
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors resize-y text-[14px] leading-relaxed" 
              placeholder="Giới thiệu bản thân và mục tiêu nghề nghiệp của bạn..."
            ></textarea>
          </div>

          {/* Block: Kinh nghiệm làm việc (MOCK UI) */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
              <h3 className="text-lg font-bold text-slate-900">Kinh nghiệm làm việc</h3>
              <button className="text-blue-600 text-[14px] font-semibold hover:underline flex items-center gap-1">
                <Plus className="size-4" /> Thêm kinh nghiệm
              </button>
            </div>
            
            <div className="relative pl-6 border-l-2 border-slate-200 space-y-8">
              <div className="relative">
                <div className="absolute -left-[31px] bg-blue-600 border-[3px] border-white w-4 h-4 rounded-full mt-1.5 shadow-sm"></div>
                <div className="flex justify-between items-start group bg-slate-50 hover:bg-slate-100 rounded-xl p-4 transition-colors">
                  <div>
                    <h4 className="font-bold text-[16px] text-slate-900">Senior Software Engineer</h4>
                    <p className="text-[14px] text-slate-600 font-semibold mt-1">Techcombank (MOCK)</p>
                    <p className="text-[13px] text-slate-500 mt-1">Tháng 01/2021 - Hiện tại</p>
                    <p className="text-[14px] text-slate-700 mt-3 leading-relaxed">
                      - Phát triển hệ thống Core Banking.<br/>
                      - Tối ưu hóa hiệu năng cơ sở dữ liệu.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 text-slate-400 hover:text-blue-600 bg-white rounded-lg shadow-sm border border-slate-100"><Pencil className="size-4" /></button>
                    <button className="p-2 text-slate-400 hover:text-red-500 bg-white rounded-lg shadow-sm border border-slate-100"><Trash2 className="size-4" /></button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Block: Học vấn (MOCK UI) */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
              <h3 className="text-lg font-bold text-slate-900">Học vấn</h3>
              <button className="text-blue-600 text-[14px] font-semibold hover:underline flex items-center gap-1">
                <Plus className="size-4" /> Thêm học vấn
              </button>
            </div>
            
            <div className="relative pl-6 border-l-2 border-slate-200 space-y-8">
              <div className="relative">
                <div className="absolute -left-[31px] bg-emerald-500 border-[3px] border-white w-4 h-4 rounded-full mt-1.5 shadow-sm"></div>
                <div className="flex justify-between items-start group bg-slate-50 hover:bg-slate-100 rounded-xl p-4 transition-colors">
                  <div>
                    <h4 className="font-bold text-[16px] text-slate-900">Đại học Bách Khoa Hà Nội (MOCK)</h4>
                    <p className="text-[14px] text-slate-600 font-semibold mt-1">Cử nhân Công nghệ Thông tin</p>
                    <p className="text-[13px] text-slate-500 mt-1">Tháng 09/2015 - Tháng 06/2019</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 text-slate-400 hover:text-blue-600 bg-white rounded-lg shadow-sm border border-slate-100"><Pencil className="size-4" /></button>
                    <button className="p-2 text-slate-400 hover:text-red-500 bg-white rounded-lg shadow-sm border border-slate-100"><Trash2 className="size-4" /></button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Block: Mạng xã hội */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">Liên kết mạng xã hội & Website</h3>
            
            <div className="space-y-4 max-w-2xl">
              <div className="relative flex items-center">
                <Globe className="absolute left-4 size-5 text-slate-400" />
                <input type="url" value={profileData.linkedinUrl} onChange={(e) => setProfileData({...profileData, linkedinUrl: e.target.value})} className="w-full pl-12 pr-4 py-2.5 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors text-[14px]" placeholder="Đường dẫn LinkedIn (tùy chọn)" />
              </div>
              <div className="relative flex items-center">
                <Code2 className="absolute left-4 size-5 text-slate-400" />
                <input type="url" value={profileData.githubUrl} onChange={(e) => setProfileData({...profileData, githubUrl: e.target.value})} className="w-full pl-12 pr-4 py-2.5 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors text-[14px]" placeholder="Đường dẫn Github (tùy chọn)" />
              </div>
              <div className="relative flex items-center">
                <Info className="absolute left-4 size-5 text-slate-400" />
                <input type="url" value={profileData.portfolioUrl} onChange={(e) => setProfileData({...profileData, portfolioUrl: e.target.value})} className="w-full pl-12 pr-4 py-2.5 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors text-[14px]" placeholder="Đường dẫn Website cá nhân (tùy chọn)" />
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
