"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchApi } from "../lib/api";
import { JobResponse } from "../lib/types/job";
import { formatSalaryRange } from "../lib/utils";
import { Sparkles, MapPin, Building2, ChevronRight, Heart, Loader2 } from "lucide-react";

import { useAuth } from "../lib/authContext";

export default function CandidateRecommendations() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [recommendedJobs, setRecommendedJobs] = useState<JobResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user?.role === "CANDIDATE") {
      fetchRecommendations();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      // 1. Fetch Candidate Profile
      const profile = await fetchApi("/candidate/profile");

      let vectorQueryPayload = {};

      const vectorIds = JSON.parse(localStorage.getItem("aiResumeVectorIds") || "{}");

      if (profile.resumes && profile.resumes.length > 0) {
        // Find primary CV or first CV
        const primaryResume = profile.resumes.find((r: any) => r.isPrimary) || profile.resumes[0];
        const vectorId = vectorIds[String(primaryResume.id)];
        if (vectorId) {
          vectorQueryPayload = { candidate_id: vectorId };
        } else if (profile.isOnboarded) {
          // CVs uploaded before this integration may not have a vector-id mapping.
          const text = `Vị trí hiện tại: ${profile.currentPosition || ""}\nVị trí mong muốn: ${profile.targetPosition || ""}\nĐịa điểm: ${profile.address || ""}\nMức lương kỳ vọng: ${profile.expectedSalary || ""}`;
          vectorQueryPayload = { onboarding_text: text };
        }
      } else if (profile.isOnboarded) {
        // Use onboarding data
        const text = `Vị trí hiện tại: ${profile.currentPosition || ""}\nVị trí mong muốn: ${profile.targetPosition || ""}\nĐịa điểm: ${profile.address || ""}\nMức lương kỳ vọng: ${profile.expectedSalary || ""}`;
        vectorQueryPayload = { onboarding_text: text };
      } else {
        // Neither CV nor Onboarding data available
        setLoading(false);
        return;
      }

      // 2. Fetch Job IDs from Python AI API
      const aiApiUrl = process.env.NEXT_PUBLIC_AI_API_URL || "https://ai-recruitment-python.onrender.com";
      const aiResponse = await fetch(`${aiApiUrl}/api/v1/recommendation/jobs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(vectorQueryPayload)
      });

      if (!aiResponse.ok) {
        throw new Error("AI API Failed");
      }

      const aiData = await aiResponse.json();
      const jobIds: string[] = aiData.recommended_job_ids || [];

      if (jobIds.length === 0) {
        setLoading(false);
        return;
      }

      // 3. Fetch Job Details from Java Backend using the batch API
      const jobIdsNumber = jobIds.map(id => parseInt(id, 10)).filter(id => !isNaN(id));
      const matchedJobs: JobResponse[] = await fetchApi("/jobs/batch", {
        method: "POST",
        body: JSON.stringify(jobIdsNumber)
      });

      setRecommendedJobs(matchedJobs || []);

    } catch (error) {
      console.error("Failed to fetch recommended jobs", error);
      setHasError(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="size-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (hasError || recommendedJobs.length === 0) {
    return null; // Do not show section if no recommendations or error
  }

  return (
    <section className="py-12 bg-blue-50/50 border-t border-blue-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Sparkles className="size-6 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">✨ Việc làm gợi ý từ AI dành riêng cho bạn</h2>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendedJobs.map((job) => (
            <div
              key={job.id}
              onClick={() => router.push(`/jobs/${job.id}`)}
              className="bg-white p-5 rounded-2xl border border-blue-200 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-900/10 transition-all group flex flex-col h-full cursor-pointer relative overflow-hidden"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="size-16 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 overflow-hidden">
                  {job.companyLogo ? (
                    <img src={job.companyLogo} alt={job.companyName || "Logo"} className="w-full h-full object-cover" />
                  ) : (
                    <Building2 className="size-8 text-slate-300" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-900 text-lg truncate group-hover:text-blue-600 transition-colors" title={job.title}>
                    {job.title}
                  </h3>
                  <p className="text-slate-600 text-sm truncate mt-0.5">{job.companyName || "N/A"}</p>
                </div>
              </div>

              <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-100">
                <div className="flex flex-col gap-1.5">
                  <span className="inline-block px-2.5 py-1 bg-green-50 text-green-700 text-sm font-semibold rounded-md max-w-fit">
                    {formatSalaryRange(job.salaryMin, job.salaryMax, job.currency)}
                  </span>
                  <span className="text-sm text-slate-500 flex items-center gap-1">
                    <MapPin className="size-3.5" /> {job.location}
                  </span>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); }}
                  className="size-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50 transition-all z-10"
                >
                  <Heart className="size-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
