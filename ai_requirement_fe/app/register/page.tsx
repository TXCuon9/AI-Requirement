"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { fetchApi } from "../../lib/api";
import { Briefcase, UserCircle2, Loader2, ArrowRight } from "lucide-react";

import { Suspense } from "react";

function RegisterContent() {
  const searchParams = useSearchParams();
  const initialType = searchParams.get("type") === "company" ? "company" : "candidate";
  
  const [type, setType] = useState<"candidate" | "company">(initialType);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [location, setLocation] = useState("");
  const [website, setWebsite] = useState("");
  const [description, setDescription] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const bodyPayload: any = { email, password };
      if (type === "company") {
        bodyPayload.companyName = companyName;
        bodyPayload.industry = industry;
        bodyPayload.companySize = companySize;
        bodyPayload.location = location;
        bodyPayload.website = website;
        bodyPayload.description = description;
      }

      const endpoint = type === "candidate" ? "/auth/register" : "/auth/register/company";
      const response = await fetchApi(endpoint, {
        method: "POST",
        body: JSON.stringify(bodyPayload),
      });
      
      // Response is a string message from the backend
      setSuccess(typeof response === "string" ? response : "Registration successful!");
      
      // Redirect to login after a short delay
      setTimeout(() => {
        router.push("/login");
      }, 2000);
      
    } catch (err: any) {
      setError(err.message || "Something went wrong during registration.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-zinc-950 p-4 py-12">
      <div className={`w-full ${type === "company" ? "max-w-2xl" : "max-w-md"} transition-all duration-300`}>
        {/* Logo/Brand */}
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="size-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl group-hover:scale-105 transition-transform shadow-lg shadow-indigo-500/25">
              AI
            </div>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 shadow-xl shadow-slate-200/50 dark:shadow-black/50 border border-slate-100 dark:border-zinc-800">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Create an account</h1>
            <p className="text-sm text-slate-500 dark:text-zinc-400 mt-2">Join our AI-powered recruitment platform.</p>
          </div>

          {/* Type Selector */}
          <div className="flex p-1 bg-slate-100 dark:bg-zinc-950 rounded-xl mb-8">
            <button
              type="button"
              onClick={() => setType("candidate")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all ${
                type === "candidate" 
                  ? "bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-sm" 
                  : "text-slate-500 dark:text-zinc-500 hover:text-slate-900 dark:hover:text-zinc-300"
              }`}
            >
              <UserCircle2 className="size-4" />
              Candidate
            </button>
            <button
              type="button"
              onClick={() => setType("company")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all ${
                type === "company" 
                  ? "bg-white dark:bg-zinc-800 text-purple-600 dark:text-purple-400 shadow-sm" 
                  : "text-slate-500 dark:text-zinc-500 hover:text-slate-900 dark:hover:text-zinc-300"
              }`}
            >
              <Briefcase className="size-4" />
              Company
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-600 text-sm font-medium border border-red-100">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-50 text-emerald-600 text-sm font-medium border border-emerald-100 flex items-center gap-2">
              <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className={`grid gap-5 ${type === "company" ? "md:grid-cols-2" : "grid-cols-1"}`}>
              <div className={type === "company" ? "md:col-span-2" : ""}>
                <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1.5">Email address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-500 outline-none transition-all dark:text-white"
                  placeholder="you@example.com"
                />
              </div>
              
              <div className={type === "company" ? "md:col-span-2" : ""}>
                <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1.5">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-500 outline-none transition-all dark:text-white"
                  placeholder="••••••••"
                  minLength={6}
                />
              </div>

              {type === "company" && (
                <>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1.5">Company Name</label>
                    <input
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 dark:focus:border-purple-500 outline-none transition-all dark:text-white"
                      placeholder="Acme Corp"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1.5">Industry</label>
                    <input
                      type="text"
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all dark:text-white"
                      placeholder="Technology, Finance..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1.5">Company Size</label>
                    <input
                      type="text"
                      value={companySize}
                      onChange={(e) => setCompanySize(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all dark:text-white"
                      placeholder="10-50 employees"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1.5">Location</label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all dark:text-white"
                      placeholder="City, Country"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1.5">Website</label>
                    <input
                      type="url"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all dark:text-white"
                      placeholder="https://example.com"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1.5">Description</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all dark:text-white resize-none"
                      placeholder="Brief description of your company..."
                    />
                  </div>
                </>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || !!success}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-medium hover:bg-slate-800 dark:hover:bg-zinc-100 transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-2"
            >
              {isLoading ? (
                <Loader2 className="size-5 animate-spin" />
              ) : (
                <>
                  Create account
                  <ArrowRight className="size-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-slate-500 dark:text-zinc-400">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Register() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-screen"><Loader2 className="size-10 animate-spin text-blue-600" /></div>}>
      <RegisterContent />
    </Suspense>
  );
}
