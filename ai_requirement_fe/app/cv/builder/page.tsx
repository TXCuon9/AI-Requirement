"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { fetchApi } from "../../../lib/api";
import { ArrowLeft, Printer, Loader2, Mail, Phone, MapPin, Briefcase, Code2, Globe, Save, CheckCircle2, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import Navbar from "../../../components/Navbar";
import ImpressiveTemplate from "../../../components/cv-templates/ImpressiveTemplate";
import StandardTemplate from "../../../components/cv-templates/StandardTemplate";
import ElegantTemplate from "../../../components/cv-templates/ElegantTemplate";
import CreativeTemplate from "../../../components/cv-templates/CreativeTemplate";

export default function CvBuilderPage() {
  const searchParams = useSearchParams();
  const templateId = searchParams.get("template") || "professional";
  const resumeIdParam = searchParams.get("resumeId");

  const isReadonly = searchParams.get("readonly") === "true";

  const [isLoadingProfile, setIsLoadingProfile] = useState(!isReadonly);
  const [profileData, setProfileData] = useState<any>(null);
  const [existingResume, setExistingResume] = useState<any>(null);

  const [showImportModal, setShowImportModal] = useState(!resumeIdParam && !isReadonly);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [avatarError, setAvatarError] = useState("");

  const [formData, setFormData] = useState({
    cvName: "CV Của Tôi",
    fullName: "",
    targetPosition: "",
    email: "",
    phone: "",
    address: "",
    avatarUrl: "",
    linkedinUrl: "",
    githubUrl: "",
    portfolioUrl: "",
    dob: "",
    gender: "",
    hobbies: "",
    summary: "",
    experienceYears: 0,
    skillItems: [] as { name: string, content: string }[],
    experienceItems: [] as any[],
    educationItems: [] as any[],
    projectItems: [] as any[]
  });

  useEffect(() => {
    Promise.all([
      !isReadonly ? fetchApi("/candidate/profile").catch(() => null) : Promise.resolve(null),
      resumeIdParam ? fetchApi(isReadonly ? `/recruiter/resume/${resumeIdParam}` : `/resume/${resumeIdParam}`).catch(() => null) : Promise.resolve(null)
    ]).then(([profileRes, resumesRes]) => {
      if (profileRes) setProfileData(profileRes);

      let found = null;
      if (resumesRes && Array.isArray(resumesRes)) {
        found = resumesRes.find((r: any) => r.id.toString() === resumeIdParam);
      } else if (resumesRes && !Array.isArray(resumesRes)) {
        found = resumesRes;
      }

      if (found) {
        setExistingResume(found);
        setFormData({
          cvName: found.cvName || "CV Của Tôi",
          fullName: found.fullName || "",
          targetPosition: found.targetPosition || "",
          email: found.email || "",
          phone: found.phone || "",
          address: found.address || "",
          avatarUrl: found.avatarUrl || "",
          linkedinUrl: found.linkedinUrl || "",
          githubUrl: found.githubUrl || "",
          portfolioUrl: found.portfolioUrl || "",
          dob: found.dob || (profileRes?.dob ? new Date(profileRes.dob).toISOString().split('T')[0] : ""),
          gender: found.gender || profileRes?.gender || "",
          hobbies: found.hobbies || "",
          summary: found.summary || "",
          experienceYears: profileRes?.experienceYears || 0,
          skillItems: (found.skills || []).map((s: string) => {
            const splitIdx = s.indexOf(':');
            if (splitIdx > -1) {
              return { name: s.substring(0, splitIdx).trim(), content: s.substring(splitIdx + 1).trim() };
            }
            return { name: "Chuyên môn", content: s };
          }),
          experienceItems: found.experiences || [],
          educationItems: found.educationItemDTOS || [],
          projectItems: found.projectItems || []
        });
      }
      setIsLoadingProfile(false);
    });
  }, [resumeIdParam]);

  const handleImportFromProfile = () => {
    if (profileData) {
      setFormData({
        cvName: "CV Của Tôi",
        fullName: profileData.fullName || "",
        targetPosition: profileData.currentPosition || "",
        email: "email@example.com", // Dummy email as it's not in profile
        phone: profileData.phone || "",
        address: profileData.address || "",
        avatarUrl: profileData.avatarUrl || "",
        linkedinUrl: profileData.linkedinUrl || "",
        githubUrl: profileData.githubUrl || "",
        portfolioUrl: profileData.portfolioUrl || "",
        dob: profileData.dob ? new Date(profileData.dob).toISOString().split('T')[0] : "",
        gender: profileData.gender || "",
        hobbies: "",
        summary: profileData.bio || "",
        experienceYears: profileData.experienceYears || 0,
        skillItems: (profileData.skills || []).map((s: string) => ({ name: "Kỹ năng", content: s })),
        experienceItems: [],
        educationItems: [],
        projectItems: []
      });
    }
    setShowImportModal(false);
  };

  const handleCreateNew = () => {
    setShowImportModal(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setAvatarError("Chỉ hỗ trợ file hình ảnh.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setAvatarError("File ảnh không được vượt quá 5MB.");
      return;
    }

    setAvatarError("");
    setIsUploadingAvatar(true);

    try {
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);

      const fileUploadResponse = await fetchApi("/file/upload", {
        method: "POST",
        body: uploadFormData
      });

      const actualFileUrl = fileUploadResponse?.fileUrl || (typeof fileUploadResponse === 'string' ? fileUploadResponse : '');
      if (actualFileUrl) {
        setFormData(prev => ({ ...prev, avatarUrl: actualFileUrl }));
      } else {
        setAvatarError("Không nhận được URL ảnh từ server.");
      }
    } catch (err: any) {
      setAvatarError(err.message || "Tải ảnh thất bại.");
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  // --- Dynamic Form Handlers ---
  const handleAddExperience = () => {
    setFormData(prev => ({
      ...prev,
      experienceItems: [...prev.experienceItems, { companyName: "", position: "", startDate: "", endDate: "", description: "" }]
    }));
  };
  const handleExperienceChange = (index: number, field: string, value: string) => {
    setFormData(prev => {
      const newItems = [...prev.experienceItems];
      newItems[index] = { ...newItems[index], [field]: value };
      return { ...prev, experienceItems: newItems };
    });
  };
  const handleRemoveExperience = (index: number) => {
    setFormData(prev => ({
      ...prev,
      experienceItems: prev.experienceItems.filter((_, i) => i !== index)
    }));
  };

  const handleAddEducation = () => {
    setFormData(prev => ({
      ...prev,
      educationItems: [...prev.educationItems, { schoolName: "", major: "", startDate: "", endDate: "", description: "" }]
    }));
  };
  const handleEducationChange = (index: number, field: string, value: string) => {
    setFormData(prev => {
      const newItems = [...prev.educationItems];
      newItems[index] = { ...newItems[index], [field]: value };
      return { ...prev, educationItems: newItems };
    });
  };
  const handleRemoveEducation = (index: number) => {
    setFormData(prev => ({
      ...prev,
      educationItems: prev.educationItems.filter((_, i) => i !== index)
    }));
  };

  const handleAddSkill = () => {
    setFormData(prev => ({
      ...prev,
      skillItems: [...prev.skillItems, { name: "", content: "" }]
    }));
  };
  const handleSkillChange = (index: number, field: string, value: string) => {
    setFormData(prev => {
      const newItems = [...prev.skillItems];
      newItems[index] = { ...newItems[index], [field]: value };
      return { ...prev, skillItems: newItems };
    });
  };
  const handleRemoveSkill = (index: number) => {
    setFormData(prev => ({
      ...prev,
      skillItems: prev.skillItems.filter((_, i) => i !== index)
    }));
  };

  const handleAddProject = () => {
    setFormData(prev => ({
      ...prev,
      projectItems: [...prev.projectItems, { projectName: "", role: "", startDate: "", endDate: "", description: "", link: "" }]
    }));
  };
  const handleProjectChange = (index: number, field: string, value: string) => {
    setFormData(prev => {
      const newItems = [...prev.projectItems];
      newItems[index] = { ...newItems[index], [field]: value };
      return { ...prev, projectItems: newItems };
    });
  };
  const handleRemoveProject = (index: number) => {
    setFormData(prev => ({
      ...prev,
      projectItems: prev.projectItems.filter((_, i) => i !== index)
    }));
  };
  // -----------------------------

  const handlePrint = () => {
    window.print();
  };

  const handleSaveCV = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      const endpoint = existingResume ? `/resume/${existingResume.id}` : "/resume";
      const method = existingResume ? "PUT" : "POST";

      await fetchApi(endpoint, {
        method: method,
        body: JSON.stringify({
          fileUrl: `builder://${templateId}`,
          cvName: formData.cvName,
          parsedText: "Created via CV Builder",
          summary: formData.summary,
          version: 1,
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          targetPosition: formData.targetPosition,
          avatarUrl: formData.avatarUrl,
          githubUrl: formData.githubUrl,
          linkedinUrl: formData.linkedinUrl,
          dob: formData.dob,
          gender: formData.gender,
          hobbies: formData.hobbies,
          skills: formData.skillItems.filter(s => s.name || s.content).map(s => `${s.name || 'Kỹ năng'}: ${s.content}`),
          experienceItems: formData.experienceItems,
          educationItems: formData.educationItems,
          projectItems: formData.projectItems
        })
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      alert("Lỗi khi lưu CV: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoadingProfile && !isReadonly) {
    return (
      <div className="flex flex-col min-h-screen bg-[#F4F5F5] items-center justify-center">
        <Loader2 className="size-10 text-blue-600 animate-spin mb-4" />
        <p className="text-slate-600 font-medium">Đang khởi tạo Trình tạo CV...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#F4F5F5] font-sans">

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-2 text-center">Bắt đầu tạo CV</h2>
            <p className="text-slate-600 text-center mb-8">Bạn muốn tự nhập dữ liệu hay lấy thông tin đã có từ Hồ sơ Online?</p>

            <div className="space-y-4">
              <button onClick={handleImportFromProfile} className="w-full bg-blue-600 text-white font-semibold py-3.5 rounded-xl hover:bg-blue-700 transition-colors shadow-sm flex items-center justify-center gap-2">
                <CheckCircle2 className="size-5" /> Dùng dữ liệu Hồ sơ Online
              </button>
              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink-0 mx-4 text-slate-400 text-sm">Hoặc</span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>
              <button onClick={handleCreateNew} className="w-full bg-slate-100 text-slate-700 font-semibold py-3.5 rounded-xl hover:bg-slate-200 transition-colors">
                Tự nhập liệu mới hoàn toàn
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Toolbar (Hidden in Print) */}
      <div className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm print:hidden">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {!isReadonly ? (
            <Link href="/templates" className="flex items-center gap-2 text-slate-600 hover:text-blue-600 font-medium transition-colors">
              <ArrowLeft className="size-4" /> Trở lại danh sách mẫu
            </Link>
          ) : (
            <button onClick={() => window.close()} className="flex items-center gap-2 text-slate-600 hover:text-blue-600 font-medium transition-colors">
              <ArrowLeft className="size-4" /> Đóng
            </button>
          )}

          <div className="flex items-center gap-4">
            {saveSuccess && <span className="text-emerald-600 text-sm font-medium flex items-center gap-1"><CheckCircle2 className="size-4" /> Đã lưu thành công!</span>}
            {!isReadonly && (
              <button onClick={handleSaveCV} disabled={isSaving} className="bg-blue-50 text-blue-600 px-5 py-2 rounded-lg font-semibold hover:bg-blue-100 transition-colors flex items-center gap-2">
                {isSaving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />} Lưu CV
              </button>
            )}
            <button onClick={handlePrint} className="bg-emerald-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-emerald-700 transition-colors flex items-center gap-2 shadow-sm">
              <Printer className="size-4" /> Tải xuống PDF
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden print:overflow-visible">

        {/* LEFT: Form Input Sidebar (Hidden in Print and Readonly mode) */}
        {!isReadonly && (
          <div className="w-[450px] shrink-0 bg-white border-r border-slate-200 overflow-y-auto p-6 print:hidden">
            <h3 className="text-lg font-bold text-slate-900 mb-6 sticky top-0 bg-white py-2 z-10 border-b border-slate-100">Chỉnh sửa nội dung</h3>

            <div className="space-y-8 pb-10">
              {/* Tên CV */}
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">Tên file CV (Quản lý nội bộ)</label>
                <input type="text" name="cvName" value={formData.cvName} onChange={handleInputChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900" />
              </div>

              {/* Thông tin cá nhân */}
              <div>
                <h4 className="font-bold text-blue-600 mb-4 border-l-4 border-blue-600 pl-2">Thông tin cá nhân</h4>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="size-20 rounded-full bg-slate-100 border-2 border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                      {formData.avatarUrl ? (
                        <img src={formData.avatarUrl.startsWith('/') ? `http://localhost:8080${formData.avatarUrl}` : formData.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-slate-400 text-xs text-center px-2">Ảnh đại diện</span>
                      )}
                    </div>
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        id="avatarUpload"
                        className="hidden"
                        onChange={handleAvatarUpload}
                      />
                      <label
                        htmlFor="avatarUpload"
                        className="cursor-pointer bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors inline-block"
                      >
                        {isUploadingAvatar ? "Đang tải lên..." : "Tải ảnh lên"}
                      </label>
                      {avatarError && <p className="text-red-500 text-xs mt-1">{avatarError}</p>}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 uppercase">Họ và Tên</label>
                    <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm text-slate-900" placeholder="VD: Nguyễn Văn A" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 uppercase">Vị trí ứng tuyển</label>
                    <input type="text" name="targetPosition" value={formData.targetPosition} onChange={handleInputChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm text-slate-900" placeholder="VD: Frontend Developer" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-500 uppercase">Ngày sinh</label>
                      <input type="date" name="dob" value={formData.dob} onChange={handleInputChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm text-slate-900" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-500 uppercase">Giới tính</label>
                      <select name="gender" value={formData.gender} onChange={handleInputChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm bg-white text-slate-900">
                        <option value="">Chọn...</option>
                        <option value="Nam">Nam</option>
                        <option value="Nữ">Nữ</option>
                        <option value="Khác">Khác</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-500 uppercase">Số điện thoại</label>
                      <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm text-slate-900" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-500 uppercase">Email</label>
                      <input type="text" name="email" value={formData.email} onChange={handleInputChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm text-slate-900" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 uppercase">Địa chỉ</label>
                    <input type="text" name="address" value={formData.address} onChange={handleInputChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm text-slate-900" />
                  </div>
                </div>
              </div>

              {/* Mục tiêu nghề nghiệp */}
              <div>
                <h4 className="font-bold text-blue-600 mb-4 border-l-4 border-blue-600 pl-2">Mục tiêu nghề nghiệp</h4>
                <div className="space-y-1">
                  <textarea name="summary" value={formData.summary} onChange={handleInputChange} rows={4} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm leading-relaxed text-slate-900" placeholder="Giới thiệu bản thân và mục tiêu nghề nghiệp..."></textarea>
                </div>
              </div>

              {/* Sở thích */}
              <div>
                <h4 className="font-bold text-blue-600 mb-4 border-l-4 border-blue-600 pl-2">Sở thích</h4>
                <div className="space-y-1">
                  <textarea name="hobbies" value={formData.hobbies} onChange={handleInputChange} rows={2} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm leading-relaxed text-slate-900" placeholder="Đọc sách, nghe nhạc, thể thao..."></textarea>
                </div>
              </div>

              {/* Kỹ năng */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-blue-600 border-l-4 border-blue-600 pl-2">Kỹ năng</h4>
                  <button onClick={handleAddSkill} className="text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 px-2 py-1 rounded flex items-center gap-1"><Plus className="size-3" /> Thêm</button>
                </div>
                <div className="space-y-3">
                  {formData.skillItems.map((skill, idx) => (
                    <div key={idx} className="flex gap-2 items-start relative group">
                      <input type="text" placeholder="Nhóm (VD: Frontend)" value={skill.name} onChange={e => handleSkillChange(idx, 'name', e.target.value)} className="w-1/3 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm text-slate-900 font-medium" />
                      <input type="text" placeholder="Chi tiết (VD: React, Vue)" value={skill.content} onChange={e => handleSkillChange(idx, 'content', e.target.value)} className="w-2/3 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm text-slate-900" />
                      <button onClick={() => handleRemoveSkill(idx)} className="mt-2 text-slate-400 hover:text-red-500 shrink-0"><Trash2 className="size-4" /></button>
                    </div>
                  ))}
                  {formData.skillItems.length === 0 && <p className="text-sm text-slate-500 italic">Chưa có thông tin kỹ năng.</p>}
                </div>
              </div>

              {/* Học vấn */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-blue-600 border-l-4 border-blue-600 pl-2">Học vấn</h4>
                  <button onClick={handleAddEducation} className="text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 px-2 py-1 rounded flex items-center gap-1"><Plus className="size-3" /> Thêm</button>
                </div>
                <div className="space-y-4">
                  {formData.educationItems.map((edu, idx) => (
                    <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-lg relative group">
                      <button onClick={() => handleRemoveEducation(idx)} className="absolute top-2 right-2 text-slate-400 hover:text-red-500 p-1"><Trash2 className="size-4" /></button>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <input type="text" placeholder="Trường học" value={edu.schoolName} onChange={e => handleEducationChange(idx, 'schoolName', e.target.value)} className="w-full px-2 py-1 border border-slate-200 rounded focus:border-blue-500 text-sm text-slate-900 font-medium" />
                          <input type="text" placeholder="Chuyên ngành" value={edu.major} onChange={e => handleEducationChange(idx, 'major', e.target.value)} className="w-full px-2 py-1 border border-slate-200 rounded focus:border-blue-500 text-sm text-slate-900" />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <input type="text" placeholder="Từ (VD: 2019)" value={edu.startDate} onChange={e => handleEducationChange(idx, 'startDate', e.target.value)} className="w-full px-2 py-1 border border-slate-200 rounded focus:border-blue-500 text-sm text-slate-900" />
                          <input type="text" placeholder="Đến (VD: 2023)" value={edu.endDate} onChange={e => handleEducationChange(idx, 'endDate', e.target.value)} className="w-full px-2 py-1 border border-slate-200 rounded focus:border-blue-500 text-sm text-slate-900" />
                        </div>
                        <textarea placeholder="Thành tích / Mô tả thêm" value={edu.description} onChange={e => handleEducationChange(idx, 'description', e.target.value)} rows={2} className="w-full px-2 py-1 border border-slate-200 rounded focus:border-blue-500 text-sm leading-relaxed text-slate-900"></textarea>
                      </div>
                    </div>
                  ))}
                  {formData.educationItems.length === 0 && <p className="text-sm text-slate-500 italic">Chưa có thông tin học vấn.</p>}
                </div>
              </div>

              {/* Dự án (Projects) */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-blue-600 border-l-4 border-blue-600 pl-2">Dự án</h4>
                  <button onClick={handleAddProject} className="text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 px-2 py-1 rounded flex items-center gap-1"><Plus className="size-3" /> Thêm</button>
                </div>
                <div className="space-y-4">
                  {formData.projectItems.map((proj, idx) => (
                    <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-lg relative group">
                      <button onClick={() => handleRemoveProject(idx)} className="absolute top-2 right-2 text-slate-400 hover:text-red-500 p-1"><Trash2 className="size-4" /></button>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <input type="text" placeholder="Tên dự án" value={proj.projectName} onChange={e => handleProjectChange(idx, 'projectName', e.target.value)} className="w-full px-2 py-1 border border-slate-200 rounded focus:border-blue-500 text-sm text-slate-900 font-medium" />
                          <input type="text" placeholder="Vai trò" value={proj.role} onChange={e => handleProjectChange(idx, 'role', e.target.value)} className="w-full px-2 py-1 border border-slate-200 rounded focus:border-blue-500 text-sm text-slate-900" />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <input type="text" placeholder="Từ (VD: 2022)" value={proj.startDate} onChange={e => handleProjectChange(idx, 'startDate', e.target.value)} className="w-full px-2 py-1 border border-slate-200 rounded focus:border-blue-500 text-sm text-slate-900" />
                          <input type="text" placeholder="Đến (VD: 2023)" value={proj.endDate} onChange={e => handleProjectChange(idx, 'endDate', e.target.value)} className="w-full px-2 py-1 border border-slate-200 rounded focus:border-blue-500 text-sm text-slate-900" />
                        </div>
                        <input type="text" placeholder="Link (nếu có)" value={proj.link} onChange={e => handleProjectChange(idx, 'link', e.target.value)} className="w-full px-2 py-1 border border-slate-200 rounded focus:border-blue-500 text-sm text-slate-900" />
                        <textarea placeholder="Mô tả dự án, công nghệ sử dụng..." value={proj.description} onChange={e => handleProjectChange(idx, 'description', e.target.value)} rows={3} className="w-full px-2 py-1 border border-slate-200 rounded focus:border-blue-500 text-sm leading-relaxed text-slate-900"></textarea>
                      </div>
                    </div>
                  ))}
                  {formData.projectItems.length === 0 && <p className="text-sm text-slate-500 italic">Chưa có thông tin dự án.</p>}
                </div>
              </div>

              {/* Kinh nghiệm làm việc */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-blue-600 border-l-4 border-blue-600 pl-2">Kinh nghiệm làm việc</h4>
                  <button onClick={handleAddExperience} className="text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 px-2 py-1 rounded flex items-center gap-1"><Plus className="size-3" /> Thêm</button>
                </div>
                <div className="space-y-4">
                  {formData.experienceItems.map((exp, idx) => (
                    <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-lg relative group">
                      <button onClick={() => handleRemoveExperience(idx)} className="absolute top-2 right-2 text-slate-400 hover:text-red-500 p-1"><Trash2 className="size-4" /></button>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <input type="text" placeholder="Tên công ty" value={exp.companyName} onChange={e => handleExperienceChange(idx, 'companyName', e.target.value)} className="w-full px-2 py-1 border border-slate-200 rounded focus:border-blue-500 text-sm text-slate-900 font-medium" />
                          <input type="text" placeholder="Vị trí (VD: Nhân viên)" value={exp.position} onChange={e => handleExperienceChange(idx, 'position', e.target.value)} className="w-full px-2 py-1 border border-slate-200 rounded focus:border-blue-500 text-sm text-slate-900" />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <input type="text" placeholder="Từ (VD: 01/2023)" value={exp.startDate} onChange={e => handleExperienceChange(idx, 'startDate', e.target.value)} className="w-full px-2 py-1 border border-slate-200 rounded focus:border-blue-500 text-sm text-slate-900" />
                          <input type="text" placeholder="Đến (VD: Hiện tại)" value={exp.endDate} onChange={e => handleExperienceChange(idx, 'endDate', e.target.value)} className="w-full px-2 py-1 border border-slate-200 rounded focus:border-blue-500 text-sm text-slate-900" />
                        </div>
                        <textarea placeholder="Mô tả công việc (Dùng - để tạo danh sách)" value={exp.description} onChange={e => handleExperienceChange(idx, 'description', e.target.value)} rows={3} className="w-full px-2 py-1 border border-slate-200 rounded focus:border-blue-500 text-sm leading-relaxed text-slate-900"></textarea>
                      </div>
                    </div>
                  ))}
                  {formData.experienceItems.length === 0 && <p className="text-sm text-slate-500 italic">Chưa có kinh nghiệm nào.</p>}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* RIGHT: Live Preview Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center bg-slate-300/30 print:p-0 print:block print:bg-white">
          {templateId === "impressive" || templateId === "professional" ? (
            <ImpressiveTemplate formData={formData} />
          ) : templateId === "standard" ? (
            <StandardTemplate formData={formData} />
          ) : templateId === "elegant" ? (
            <ElegantTemplate formData={formData} />
          ) : templateId === "creative" ? (
            <CreativeTemplate formData={formData} />
          ) : (
            <ImpressiveTemplate formData={formData} />
          )}
        </div>
      </div>
    </div>
  );
}
