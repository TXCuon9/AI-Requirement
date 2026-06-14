"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../lib/authContext";
import { fetchApi } from "../lib/api";
import { Loader2, Briefcase, MapPin, Target, DollarSign, X } from "lucide-react";

export default function CandidateOnboardingModal() {
  const { user, isAuthenticated } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    currentPosition: "",
    targetPosition: "",
    expectedSalary: "",
    address: ""
  });

  useEffect(() => {
    if (isAuthenticated && user?.role === "CANDIDATE") {
      checkProfile();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  const checkProfile = async () => {
    try {
      const profile = await fetchApi("/candidate/profile");
      if (profile) {
        const hasResume = profile.resumes && profile.resumes.length > 0;
        if (profile.isOnboarded === false && !hasResume) {
          setShowModal(true);
        }
      }
    } catch (error) {
      console.error("Failed to fetch profile", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fetchApi("/candidate/onboarding", {
        method: "POST",
        body: JSON.stringify(formData)
      });
      setShowModal(false);
      // Optional: Refresh the page to load recommendations
      window.location.reload();
    } catch (error) {
      console.error("Failed to submit onboarding", error);
      alert("Có lỗi xảy ra khi lưu thông tin.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !showModal) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl relative overflow-hidden">
        {/* Background Decorative Element */}
        <div className="absolute -top-24 -right-24 size-48 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute -bottom-24 -left-24 size-48 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>

        <button 
          onClick={() => setShowModal(false)}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors z-10"
        >
          <X className="size-5" />
        </button>

        <div className="relative z-10">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Chào mừng bạn mới!</h2>
            <p className="text-slate-600 text-sm">
              Hãy chia sẻ một chút về mục tiêu nghề nghiệp để AI của chúng tôi gợi ý những việc làm phù hợp nhất cho bạn nhé!
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Công việc hiện tại (hoặc chuyên ngành)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Briefcase className="size-5 text-slate-400" />
                </div>
                <input 
                  type="text" 
                  required
                  placeholder="VD: Sinh viên IT, Web Developer..."
                  value={formData.currentPosition}
                  onChange={(e) => setFormData({...formData, currentPosition: e.target.value})}
                  className="w-full pl-10 pr-4 py-2.5 bg-white text-slate-900 placeholder:text-slate-400 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Vị trí công việc mong muốn</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Target className="size-5 text-slate-400" />
                </div>
                <input 
                  type="text" 
                  required
                  placeholder="VD: Fresher ReactJS, Backend NodeJS..."
                  value={formData.targetPosition}
                  onChange={(e) => setFormData({...formData, targetPosition: e.target.value})}
                  className="w-full pl-10 pr-4 py-2.5 bg-white text-slate-900 placeholder:text-slate-400 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Lương kỳ vọng (VNĐ)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="size-5 text-slate-400" />
                  </div>
                  <input 
                    type="number" 
                    required
                    placeholder="VD: 15000000"
                    value={formData.expectedSalary}
                    onChange={(e) => setFormData({...formData, expectedSalary: e.target.value})}
                    className="w-full pl-10 pr-4 py-2.5 bg-white text-slate-900 placeholder:text-slate-400 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Địa điểm làm việc</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="size-5 text-slate-400" />
                  </div>
                  <input 
                    type="text" 
                    required
                    placeholder="VD: Hà Nội, Hồ Chí Minh"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="w-full pl-10 pr-4 py-2.5 bg-white text-slate-900 placeholder:text-slate-400 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 mt-6 flex gap-3">
              <button 
                type="button"
                onClick={() => setShowModal(false)}
                className="flex-1 py-3 px-4 font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Để sau
              </button>
              <button 
                type="submit"
                disabled={submitting}
                className="flex-[2] py-3 px-4 font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-md flex items-center justify-center gap-2"
              >
                {submitting ? <Loader2 className="size-5 animate-spin" /> : "Hoàn thành & Khám phá"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
