import React from 'react';
import { Mail, Phone, MapPin, Briefcase, Code2 } from 'lucide-react';

interface TemplateProps {
  formData: any;
}

export default function ImpressiveTemplate({ formData }: TemplateProps) {
  return (
    <div className="w-full max-w-[794px] min-h-[600px] h-fit bg-white shadow-xl mx-auto flex print:shadow-none print:w-full print:max-w-none print:h-auto origin-top transition-all">
      {/* Left Sidebar (Dark Blue for Professional template) */}
      <div className="w-[35%] bg-[#1A2C42] text-white p-8 flex flex-col">
        {/* Avatar Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="size-32 rounded-full overflow-hidden border-4 border-slate-500 bg-white flex items-center justify-center text-4xl font-bold text-[#1A2C42]">
            {formData.avatarUrl ? (
              <img src={formData.avatarUrl.startsWith('/') ? `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'https://ai-recruitment-java.onrender.com'}${formData.avatarUrl}` : formData.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              formData.fullName ? formData.fullName.charAt(0).toUpperCase() : "A"
            )}
          </div>
        </div>

        {/* Contact Info */}
        <div className="mb-8">
          <h3 className="text-sm font-bold uppercase tracking-wider mb-4 border-b border-slate-600 pb-2">Liên hệ</h3>
          <ul className="space-y-4 text-sm text-slate-300">
            {formData.phone && (
              <li className="flex items-start gap-3"><Phone className="size-4 mt-0.5 shrink-0" /> <span className="break-all">{formData.phone}</span></li>
            )}
            {formData.email && (
              <li className="flex items-start gap-3"><Mail className="size-4 mt-0.5 shrink-0" /> <span className="break-all">{formData.email}</span></li>
            )}
            {formData.address && (
              <li className="flex items-start gap-3"><MapPin className="size-4 mt-0.5 shrink-0" /> <span>{formData.address}</span></li>
            )}
            {formData.linkedinUrl && (
              <li className="flex items-start gap-3"><Briefcase className="size-4 mt-0.5 shrink-0" /> <span className="break-all">{formData.linkedinUrl}</span></li>
            )}
            {formData.githubUrl && (
              <li className="flex items-start gap-3"><Code2 className="size-4 mt-0.5 shrink-0" /> <span className="break-all">{formData.githubUrl}</span></li>
            )}
          </ul>
        </div>

        {/* Basic Info */}
        {(formData.dob || formData.gender) && (
          <div className="mb-8">
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4 border-b border-slate-600 pb-2">Thông tin cơ bản</h3>
            <ul className="space-y-4 text-sm text-slate-300">
              {formData.dob && (
                <li><strong className="block text-white font-medium">Ngày sinh</strong> {new Date(formData.dob).toLocaleDateString("vi-VN")}</li>
              )}
              {formData.gender && (
                <li><strong className="block text-white font-medium">Giới tính</strong> {formData.gender}</li>
              )}
            </ul>
          </div>
        )}

        {/* Skills */}
        {formData.skillItems && formData.skillItems.length > 0 && (
          <div className="mb-8">
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4 border-b border-slate-600 pb-2">Kỹ năng</h3>
            <ul className="space-y-3">
              {formData.skillItems.map((skill: any, idx: number) => (
                <li key={idx} className="text-sm">
                  <strong className="block text-white font-medium mb-1">{skill.name}</strong>
                  <span className="text-slate-300 block">{skill.content}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Hobbies */}
        {formData.hobbies && (
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4 border-b border-slate-600 pb-2">Sở thích</h3>
            <p className="text-slate-300 text-sm whitespace-pre-wrap">{formData.hobbies}</p>
          </div>
        )}

      </div>

      {/* Right Main Content */}
      <div className="w-[65%] p-10 bg-white">
        {/* Header (Name & Title) */}
        <div className="mb-10">
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-wide mb-2">
            {formData.fullName || "HỌ VÀ TÊN"}
          </h1>
          <h2 className="text-xl font-medium text-blue-600">
            {formData.targetPosition || "VỊ TRÍ ỨNG TUYỂN"}
          </h2>
        </div>

        {/* Summary / Bio */}
        {formData.summary && (
          <div className="mb-8">
            <h3 className="text-lg font-bold text-slate-900 border-b-2 border-slate-900 pb-1 mb-4 flex items-center gap-2 uppercase tracking-wide">
              Mục tiêu nghề nghiệp
            </h3>
            <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
              {formData.summary}
            </p>
          </div>
        )}

        {/* Education */}
        {formData.educationItems && formData.educationItems.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-bold text-slate-900 border-b-2 border-slate-900 pb-1 mb-4 flex items-center gap-2 uppercase tracking-wide">
              Học vấn
            </h3>
            <div className="space-y-6">
              {formData.educationItems.map((edu: any, idx: number) => (
                <div key={idx}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="font-bold text-slate-800">{edu.schoolName || "Tên Trường"}</h4>
                    <span className="text-xs text-slate-500 font-semibold">{edu.startDate} - {edu.endDate}</span>
                  </div>
                  {edu.major && <p className="text-sm font-semibold text-slate-600 mb-2">{edu.major}</p>}
                  {edu.description && (
                    <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{edu.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {formData.projectItems && formData.projectItems.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-bold text-slate-900 border-b-2 border-slate-900 pb-1 mb-4 flex items-center gap-2 uppercase tracking-wide">
              Dự án nổi bật
            </h3>
            <div className="space-y-6">
              {formData.projectItems.map((proj: any, idx: number) => (
                <div key={idx}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="font-bold text-slate-800">{proj.projectName || "Tên Dự án"}</h4>
                    <span className="text-xs text-slate-500 font-semibold">{proj.startDate} - {proj.endDate}</span>
                  </div>
                  {(proj.role || proj.link) && (
                    <div className="flex gap-4 items-center mb-2">
                      {proj.role && <p className="text-sm font-semibold text-slate-600">{proj.role}</p>}
                      {proj.link && <a href={proj.link} target="_blank" rel="noreferrer" className="text-xs text-blue-600 underline">Link dự án</a>}
                    </div>
                  )}
                  {proj.description && (
                    <div className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                      {proj.description.split('\n').map((line: string, i: number) => {
                        if (line.trim().startsWith('-')) {
                          return <li key={i} className="ml-4 list-disc list-outside">{line.substring(1).trim()}</li>
                        }
                        return <p key={i}>{line}</p>
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Experience */}
        {formData.experienceItems && formData.experienceItems.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-bold text-slate-900 border-b-2 border-slate-900 pb-1 mb-4 flex items-center gap-2 uppercase tracking-wide">
              Kinh nghiệm làm việc
            </h3>
            <div className="space-y-6">
              {formData.experienceItems.map((exp: any, idx: number) => (
                <div key={idx}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="font-bold text-slate-800">{exp.companyName || "Tên Công ty"}</h4>
                    <span className="text-xs text-slate-500 font-semibold">{exp.startDate} - {exp.endDate}</span>
                  </div>
                  {exp.position && <p className="text-sm font-semibold text-slate-600 mb-2">{exp.position}</p>}
                  {exp.description && (
                    <div className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                      {exp.description.split('\n').map((line: string, i: number) => {
                        if (line.trim().startsWith('-')) {
                          return <li key={i} className="ml-4 list-disc list-outside">{line.substring(1).trim()}</li>
                        }
                        return <p key={i}>{line}</p>
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
