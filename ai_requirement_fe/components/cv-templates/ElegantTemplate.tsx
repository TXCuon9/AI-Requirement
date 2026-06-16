import React from 'react';
import { Mail, Phone, MapPin, Briefcase, Code2 } from 'lucide-react';

interface TemplateProps {
  formData: any;
}

export default function ElegantTemplate({ formData }: TemplateProps) {
  return (
    <div className="w-full max-w-[794px] min-h-[600px] h-fit bg-white shadow-xl mx-auto flex flex-col font-sans text-slate-800 print:shadow-none print:w-full print:max-w-none print:h-auto origin-top transition-all">
      
      {/* Header Banner */}
      <div className="bg-slate-100 p-10 flex flex-col items-center text-center">
        <h1 className="text-3xl font-light tracking-wide text-slate-900 mb-2">{formData.fullName || "HỌ VÀ TÊN"}</h1>
        <h2 className="text-lg font-medium text-slate-500 uppercase tracking-widest mb-6">{formData.targetPosition || "VỊ TRÍ ỨNG TUYỂN"}</h2>
        
        <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-600">
          {formData.phone && <span className="flex items-center gap-1.5"><Phone className="size-4 text-slate-400" /> {formData.phone}</span>}
          {formData.email && <span className="flex items-center gap-1.5"><Mail className="size-4 text-slate-400" /> {formData.email}</span>}
          {formData.address && <span className="flex items-center gap-1.5"><MapPin className="size-4 text-slate-400" /> {formData.address}</span>}
          {formData.linkedinUrl && <span className="flex items-center gap-1.5"><Briefcase className="size-4 text-slate-400" /> {formData.linkedinUrl}</span>}
        </div>
      </div>

      {/* Main Content */}
      <div className="p-10 flex flex-col gap-8">
        
        {/* Summary */}
        {formData.summary && (
          <section>
            <h3 className="text-xl font-medium text-slate-800 mb-4 flex items-center gap-3">
              <span className="w-8 border-t border-slate-300"></span>
              HỒ SƠ CÁ NHÂN
              <span className="flex-1 border-t border-slate-300"></span>
            </h3>
            <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{formData.summary}</p>
          </section>
        )}

        {/* Experience */}
        {formData.experienceItems && formData.experienceItems.length > 0 && (
          <section>
            <h3 className="text-xl font-medium text-slate-800 mb-4 flex items-center gap-3">
              <span className="w-8 border-t border-slate-300"></span>
              KINH NGHIỆM LÀM VIỆC
              <span className="flex-1 border-t border-slate-300"></span>
            </h3>
            <div className="space-y-6">
              {formData.experienceItems.map((exp: any, idx: number) => (
                <div key={idx} className="relative pl-6 border-l-2 border-slate-200">
                  <div className="absolute w-3 h-3 bg-white border-2 border-slate-300 rounded-full -left-[7px] top-1.5"></div>
                  <h4 className="font-semibold text-slate-900 text-lg">{exp.position}</h4>
                  <div className="flex items-center gap-2 text-slate-500 text-sm mb-2">
                    <span className="font-medium">{exp.companyName}</span>
                    <span>•</span>
                    <span>{exp.startDate} - {exp.endDate}</span>
                  </div>
                  {exp.description && (
                    <div className="text-slate-600 text-sm whitespace-pre-wrap leading-relaxed">
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
          </section>
        )}

        {/* Education */}
        {formData.educationItems && formData.educationItems.length > 0 && (
          <section>
            <h3 className="text-xl font-medium text-slate-800 mb-4 flex items-center gap-3">
              <span className="w-8 border-t border-slate-300"></span>
              HỌC VẤN
              <span className="flex-1 border-t border-slate-300"></span>
            </h3>
            <div className="space-y-6">
              {formData.educationItems.map((edu: any, idx: number) => (
                <div key={idx} className="relative pl-6 border-l-2 border-slate-200">
                  <div className="absolute w-3 h-3 bg-white border-2 border-slate-300 rounded-full -left-[7px] top-1.5"></div>
                  <h4 className="font-semibold text-slate-900 text-lg">{edu.schoolName}</h4>
                  <div className="flex items-center gap-2 text-slate-500 text-sm mb-2">
                    <span className="font-medium">{edu.major}</span>
                    <span>•</span>
                    <span>{edu.startDate} - {edu.endDate}</span>
                  </div>
                  {edu.description && <p className="text-slate-600 text-sm whitespace-pre-wrap">{edu.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills & Projects grid */}
        <div className="grid grid-cols-2 gap-8">
          {/* Skills */}
          {formData.skillItems && formData.skillItems.length > 0 && (
            <section>
              <h3 className="text-xl font-medium text-slate-800 mb-4 flex items-center gap-3">
                <span className="w-8 border-t border-slate-300"></span>
                KỸ NĂNG
                <span className="flex-1 border-t border-slate-300"></span>
              </h3>
              <ul className="space-y-3">
                {formData.skillItems.map((skill: any, idx: number) => (
                  <li key={idx} className="flex flex-col text-sm">
                    <span className="font-semibold text-slate-700">{skill.name}</span>
                    <span className="text-slate-500">{skill.content}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Basic Info / Hobbies */}
          {(formData.dob || formData.gender || formData.hobbies) && (
            <section>
              <h3 className="text-xl font-medium text-slate-800 mb-4 flex items-center gap-3">
                <span className="w-8 border-t border-slate-300"></span>
                THÔNG TIN THÊM
                <span className="flex-1 border-t border-slate-300"></span>
              </h3>
              <ul className="space-y-3 text-sm">
                {formData.dob && (
                  <li><strong className="text-slate-700">Ngày sinh:</strong> <span className="text-slate-500">{new Date(formData.dob).toLocaleDateString("vi-VN")}</span></li>
                )}
                {formData.gender && (
                  <li><strong className="text-slate-700">Giới tính:</strong> <span className="text-slate-500">{formData.gender}</span></li>
                )}
                {formData.hobbies && (
                  <li>
                    <strong className="text-slate-700 block mb-1">Sở thích:</strong>
                    <span className="text-slate-500 block whitespace-pre-wrap">{formData.hobbies}</span>
                  </li>
                )}
              </ul>
            </section>
          )}
        </div>

      </div>
    </div>
  );
}
