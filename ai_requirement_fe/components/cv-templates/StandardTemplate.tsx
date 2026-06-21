import React from 'react';
import { Mail, Phone, MapPin, Briefcase, Code2 } from 'lucide-react';

interface TemplateProps {
  formData: any;
}

export default function StandardTemplate({ formData }: TemplateProps) {
  return (
    <div className="w-full max-w-[794px] min-h-[600px] h-fit bg-white shadow-xl mx-auto p-12 flex flex-col font-serif text-slate-800 print:shadow-none print:w-full print:max-w-none print:h-auto origin-top transition-all">

      {/* Header */}
      <div className="border-b-2 border-slate-800 pb-6 mb-6 flex flex-col items-center text-center">
        {formData.avatarUrl && (
          <div className="size-32 rounded-full overflow-hidden border-4 border-slate-200 mb-4 bg-slate-50 flex items-center justify-center">
            <img src={formData.avatarUrl.startsWith('/') ? `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'https://ai-recruitment-java.onrender.com'}${formData.avatarUrl}` : formData.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
          </div>
        )}
        <h1 className="text-4xl font-bold uppercase tracking-wider mb-2">{formData.fullName || "HỌ VÀ TÊN"}</h1>
        <h2 className="text-xl text-slate-600 mb-4">{formData.targetPosition || "VỊ TRÍ ỨNG TUYỂN"}</h2>

        <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-600">
          {formData.phone && <span className="flex items-center gap-1"><Phone className="size-4" /> {formData.phone}</span>}
          {formData.email && <span className="flex items-center gap-1"><Mail className="size-4" /> {formData.email}</span>}
          {formData.address && <span className="flex items-center gap-1"><MapPin className="size-4" /> {formData.address}</span>}
          {formData.linkedinUrl && <span className="flex items-center gap-1"><Briefcase className="size-4" /> {formData.linkedinUrl}</span>}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col gap-6">

        {/* Summary */}
        {formData.summary && (
          <section>
            <h3 className="text-lg font-bold uppercase tracking-widest border-b border-slate-300 mb-3 pb-1">Mục tiêu nghề nghiệp</h3>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{formData.summary}</p>
          </section>
        )}

        {/* Education */}
        {formData.educationItems && formData.educationItems.length > 0 && (
          <section>
            <h3 className="text-lg font-bold uppercase tracking-widest border-b border-slate-300 mb-3 pb-1">Học vấn</h3>
            <div className="space-y-4">
              {formData.educationItems.map((edu: any, idx: number) => (
                <div key={idx}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="font-bold">{edu.schoolName || "Tên Trường"}</h4>
                    <span className="text-sm italic">{edu.startDate} - {edu.endDate}</span>
                  </div>
                  {edu.major && <p className="text-sm font-semibold">{edu.major}</p>}
                  {edu.description && <p className="text-sm mt-1 whitespace-pre-wrap">{edu.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Experience */}
        {formData.experienceItems && formData.experienceItems.length > 0 && (
          <section>
            <h3 className="text-lg font-bold uppercase tracking-widest border-b border-slate-300 mb-3 pb-1">Kinh nghiệm làm việc</h3>
            <div className="space-y-4">
              {formData.experienceItems.map((exp: any, idx: number) => (
                <div key={idx}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="font-bold">{exp.companyName || "Tên Công ty"}</h4>
                    <span className="text-sm italic">{exp.startDate} - {exp.endDate}</span>
                  </div>
                  {exp.position && <p className="text-sm font-semibold mb-1">{exp.position}</p>}
                  {exp.description && (
                    <div className="text-sm whitespace-pre-wrap pl-4">
                      {exp.description.split('\n').map((line: string, i: number) => {
                        if (line.trim().startsWith('-')) {
                          return <li key={i} className="list-disc list-outside">{line.substring(1).trim()}</li>
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

        {/* Skills */}
        {formData.skillItems && formData.skillItems.length > 0 && (
          <section>
            <h3 className="text-lg font-bold uppercase tracking-widest border-b border-slate-300 mb-3 pb-1">Kỹ năng</h3>
            <div className="grid grid-cols-2 gap-2">
              {formData.skillItems.map((skill: any, idx: number) => (
                <div key={idx} className="text-sm">
                  <span className="font-bold">{skill.name}: </span>
                  <span>{skill.content}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {formData.projectItems && formData.projectItems.length > 0 && (
          <section>
            <h3 className="text-lg font-bold uppercase tracking-widest border-b border-slate-300 mb-3 pb-1">Dự án</h3>
            <div className="space-y-4">
              {formData.projectItems.map((proj: any, idx: number) => (
                <div key={idx}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="font-bold">{proj.projectName || "Tên Dự án"}</h4>
                    <span className="text-sm italic">{proj.startDate} - {proj.endDate}</span>
                  </div>
                  {proj.role && <p className="text-sm font-semibold">{proj.role}</p>}
                  {proj.description && (
                    <div className="text-sm mt-1 whitespace-pre-wrap pl-4">
                      {proj.description.split('\n').map((line: string, i: number) => {
                        if (line.trim().startsWith('-')) {
                          return <li key={i} className="list-disc list-outside">{line.substring(1).trim()}</li>
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

      </div>
    </div>
  );
}
