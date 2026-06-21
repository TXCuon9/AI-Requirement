import React from 'react';
import { Mail, Phone, MapPin, Briefcase, Code2, User } from 'lucide-react';

interface TemplateProps {
  formData: any;
}

export default function CreativeTemplate({ formData }: TemplateProps) {
  return (
    <div className="w-full max-w-[794px] min-h-[600px] h-fit bg-white shadow-xl mx-auto flex flex-col font-sans text-slate-800 print:shadow-none print:w-full print:max-w-none print:h-auto origin-top transition-all">

      {/* Top Banner */}
      <div className="bg-[#2D8CFF] text-white p-10 flex gap-8 items-center">
        {/* Avatar Section */}
        <div className="size-32 shrink-0 rounded-2xl overflow-hidden border-4 border-white/20 bg-white flex items-center justify-center text-4xl font-bold text-[#2D8CFF] shadow-lg">
          {formData.avatarUrl ? (
            <img src={formData.avatarUrl.startsWith('/') ? `http://localhost:8080${formData.avatarUrl}` : formData.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            formData.fullName ? formData.fullName.charAt(0).toUpperCase() : <User className="size-12" />
          )}
        </div>

        {/* Title */}
        <div className="flex-1">
          <h1 className="text-4xl font-black uppercase tracking-wide mb-2">{formData.fullName || "HỌ VÀ TÊN"}</h1>
          <h2 className="text-xl font-medium text-blue-100 mb-4">{formData.targetPosition || "VỊ TRÍ ỨNG TUYỂN"}</h2>
          {formData.summary && (
            <p className="text-sm text-blue-50/90 leading-relaxed max-w-2xl whitespace-pre-wrap">{formData.summary}</p>
          )}
        </div>
      </div>

      <div className="flex flex-1">
        {/* Left Column (Narrow) */}
        <div className="w-[35%] bg-slate-50 p-8 border-r border-slate-200">

          {/* Contact */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <div className="w-8 h-1 bg-[#2D8CFF] rounded"></div> Liên hệ
            </h3>
            <ul className="space-y-4 text-sm text-slate-600">
              {formData.phone && (
                <li className="flex items-start gap-3"><Phone className="size-4 mt-0.5 text-[#2D8CFF]" /> <span className="break-all">{formData.phone}</span></li>
              )}
              {formData.email && (
                <li className="flex items-start gap-3"><Mail className="size-4 mt-0.5 text-[#2D8CFF]" /> <span className="break-all">{formData.email}</span></li>
              )}
              {formData.address && (
                <li className="flex items-start gap-3"><MapPin className="size-4 mt-0.5 text-[#2D8CFF]" /> <span>{formData.address}</span></li>
              )}
              {formData.linkedinUrl && (
                <li className="flex items-start gap-3"><Briefcase className="size-4 mt-0.5 text-[#2D8CFF]" /> <span className="break-all">{formData.linkedinUrl}</span></li>
              )}
              {formData.githubUrl && (
                <li className="flex items-start gap-3"><Code2 className="size-4 mt-0.5 text-[#2D8CFF]" /> <span className="break-all">{formData.githubUrl}</span></li>
              )}
            </ul>
          </div>

          {/* Basic Info */}
          {(formData.dob || formData.gender) && (
            <div className="mb-8">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <div className="w-8 h-1 bg-[#2D8CFF] rounded"></div> Thông tin
              </h3>
              <ul className="space-y-3 text-sm text-slate-600">
                {formData.dob && (
                  <li><strong className="block text-slate-800">Ngày sinh</strong> {new Date(formData.dob).toLocaleDateString("vi-VN")}</li>
                )}
                {formData.gender && (
                  <li><strong className="block text-slate-800">Giới tính</strong> {formData.gender}</li>
                )}
              </ul>
            </div>
          )}

          {/* Skills */}
          {formData.skillItems && formData.skillItems.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <div className="w-8 h-1 bg-[#2D8CFF] rounded"></div> Kỹ năng
              </h3>
              <div className="space-y-4">
                {formData.skillItems.map((skill: any, idx: number) => (
                  <div key={idx} className="text-sm">
                    <strong className="block text-slate-800 mb-1">{skill.name}</strong>
                    <div className="text-slate-600">{skill.content}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Hobbies */}
          {formData.hobbies && (
            <div className="mb-8">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <div className="w-8 h-1 bg-[#2D8CFF] rounded"></div> Sở thích
              </h3>
              <p className="text-slate-600 text-sm whitespace-pre-wrap">{formData.hobbies}</p>
            </div>
          )}

        </div>

        {/* Right Column (Wide) */}
        <div className="w-[65%] p-8 bg-white">

          {/* Experience */}
          {formData.experienceItems && formData.experienceItems.length > 0 && (
            <div className="mb-10">
              <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                <span className="text-[#2D8CFF]">Kinh nghiệm</span>
                <div className="flex-1 h-px bg-slate-200"></div>
              </h3>
              <div className="space-y-6">
                {formData.experienceItems.map((exp: any, idx: number) => (
                  <div key={idx} className="group">
                    <div className="flex justify-between items-baseline mb-1">
                      <h4 className="text-lg font-bold text-slate-800 group-hover:text-[#2D8CFF] transition-colors">{exp.position}</h4>
                      <span className="text-xs font-bold text-[#2D8CFF] bg-blue-50 px-2 py-1 rounded">{exp.startDate} - {exp.endDate}</span>
                    </div>
                    <p className="text-sm font-semibold text-slate-500 mb-2">{exp.companyName}</p>
                    {exp.description && (
                      <div className="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed">
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

          {/* Education */}
          {formData.educationItems && formData.educationItems.length > 0 && (
            <div className="mb-10">
              <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                <span className="text-[#2D8CFF]">Học vấn</span>
                <div className="flex-1 h-px bg-slate-200"></div>
              </h3>
              <div className="space-y-6">
                {formData.educationItems.map((edu: any, idx: number) => (
                  <div key={idx} className="group">
                    <div className="flex justify-between items-baseline mb-1">
                      <h4 className="text-lg font-bold text-slate-800 group-hover:text-[#2D8CFF] transition-colors">{edu.schoolName}</h4>
                      <span className="text-xs font-bold text-[#2D8CFF] bg-blue-50 px-2 py-1 rounded">{edu.startDate} - {edu.endDate}</span>
                    </div>
                    <p className="text-sm font-semibold text-slate-500 mb-2">{edu.major}</p>
                    {edu.description && (
                      <p className="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed">{edu.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {formData.projectItems && formData.projectItems.length > 0 && (
            <div className="mb-10">
              <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                <span className="text-[#2D8CFF]">Dự án</span>
                <div className="flex-1 h-px bg-slate-200"></div>
              </h3>
              <div className="space-y-6">
                {formData.projectItems.map((proj: any, idx: number) => (
                  <div key={idx} className="group border border-slate-100 p-4 rounded-xl hover:shadow-md transition-shadow bg-white">
                    <div className="flex justify-between items-baseline mb-1">
                      <h4 className="text-lg font-bold text-slate-800">{proj.projectName}</h4>
                      <span className="text-xs font-semibold text-slate-500">{proj.startDate} - {proj.endDate}</span>
                    </div>
                    <div className="flex gap-4 items-center mb-3">
                      {proj.role && <span className="text-sm font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">{proj.role}</span>}
                      {proj.link && <a href={proj.link} target="_blank" rel="noreferrer" className="text-xs text-[#2D8CFF] hover:underline flex items-center gap-1"><Code2 className="size-3" /> Link</a>}
                    </div>
                    {proj.description && (
                      <div className="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed">
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

        </div>
      </div>
    </div>
  );
}
