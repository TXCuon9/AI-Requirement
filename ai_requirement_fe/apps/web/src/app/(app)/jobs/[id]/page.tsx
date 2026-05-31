import Link from "next/link";
import { ArrowUpRight, Bookmark, Briefcase, Building2, MapPin, Sparkles } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";

type JobDetail = {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  employmentType: string;
  level: string;
  experience: string;
  openings: string;
  deadline: string;
  tags: string[];
  skills: string[];
  summary: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  workLocation: string[];
  companyInfo: {
    name: string;
    field: string;
    size: string;
    address: string;
    website: string;
    description: string;
  };
};

const jobs: JobDetail[] = [
  {
    id: "job-02",
    title: "Trưởng nhóm Marketing sản phẩm - HR Tech",
    company: "Nova Digital",
    location: "Hồ Chí Minh",
    salary: "30 - 45 triệu",
    employmentType: "Toàn thời gian",
    level: "Leader",
    experience: "5 năm",
    openings: "02",
    deadline: "30/06/2026",
    tags: ["Onsite", "Toàn thời gian", "5 năm", "Leader"],
    skills: ["Product Marketing", "Go-to-market", "B2B SaaS", "HR Tech", "Growth"],
    summary:
      "Dẫn dắt chiến lược marketing sản phẩm cho nền tảng HR Tech, phối hợp chặt chẽ với Product và Sales để tăng trưởng người dùng chất lượng.",
    responsibilities: [
      "Xây dựng kế hoạch GTM và chiến dịch truyền thông theo từng phân khúc khách hàng.",
      "Làm việc với Product để định vị giá trị và ưu tiên roadmap theo nhu cầu thị trường.",
      "Quản lý ngân sách, theo dõi hiệu quả CAC, LTV và tối ưu chuyển đổi.",
      "Phát triển nội dung enablement cho đội Sales/CS và đối tác chiến lược.",
    ],
    requirements: [
      "5+ năm kinh nghiệm marketing sản phẩm, ưu tiên B2B SaaS.",
      "Am hiểu xây dựng funnel và phân tích dữ liệu tăng trưởng.",
      "Kỹ năng lãnh đạo nhóm, phối hợp đa phòng ban.",
      "Tư duy sản phẩm và khả năng trình bày chiến lược rõ ràng.",
    ],
    benefits: [
      "Lương cạnh tranh, thưởng hiệu suất theo OKR.",
      "Bảo hiểm sức khỏe nâng cao, khám sức khỏe định kỳ.",
      "Lộ trình phát triển lên Head of Growth trong 12-18 tháng.",
      "Làm việc với đội ngũ Product/AI hàng đầu trong ngành HR Tech.",
    ],
    workLocation: [
      "Văn phòng Nova Digital, Quận 3, Hồ Chí Minh.",
      "Thời gian: Thứ 2 - Thứ 6, linh hoạt 1 ngày remote/tuần.",
    ],
    companyInfo: {
      name: "Nova Digital",
      field: "HR Tech / SaaS",
      size: "250-500 nhân sự",
      address: "89 Nguyễn Đình Chiểu, Quận 3, TP.HCM",
      website: "novadigital.vn",
      description:
        "Nova Digital xây dựng hệ sinh thái tuyển dụng thông minh giúp doanh nghiệp tăng tốc tuyển dụng, tối ưu vận hành và nâng cao trải nghiệm ứng viên.",
    },
  },
  {
    id: "job-01",
    title: "Chuyên viên kinh doanh B2B (Data sẵn)",
    company: "TopTalent Global",
    location: "Hà Nội",
    salary: "18 - 30 triệu",
    employmentType: "Toàn thời gian",
    level: "Senior",
    experience: "3 năm",
    openings: "05",
    deadline: "15/06/2026",
    tags: ["Hybrid", "Toàn thời gian", "3 năm"],
    skills: ["B2B Sales", "Negotiation", "CRM", "Presentation"],
    summary:
      "Tư vấn giải pháp tuyển dụng cho doanh nghiệp vừa và lớn, khai thác data tiềm năng có sẵn từ hệ thống AI Recruit.",
    responsibilities: [
      "Tư vấn và demo sản phẩm cho khách hàng B2B.",
      "Phối hợp đội Marketing xử lý lead, theo dõi pipeline trên CRM.",
      "Đàm phán hợp đồng, chăm sóc và mở rộng tài khoản.",
    ],
    requirements: [
      "3+ năm kinh nghiệm bán hàng B2B hoặc HR Tech.",
      "Kỹ năng đàm phán, xử lý phản hồi khách hàng tốt.",
      "Tư duy mục tiêu và làm việc với chỉ số KPI/OKR.",
    ],
    benefits: [
      "Thu nhập gồm lương cứng + hoa hồng hấp dẫn.",
      "Thưởng quý theo doanh số, hỗ trợ chi phí đi lại.",
      "Đào tạo kỹ năng bán hàng và kiến thức HR Tech chuyên sâu.",
    ],
    workLocation: [
      "Tòa nhà AI Recruit, Cầu Giấy, Hà Nội.",
      "Thời gian: Thứ 2 - Thứ 6, sáng thứ 7 linh hoạt.",
    ],
    companyInfo: {
      name: "TopTalent Global",
      field: "Recruitment Solutions",
      size: "150-200 nhân sự",
      address: "32 Duy Tân, Cầu Giấy, Hà Nội",
      website: "toptalent.global",
      description:
        "TopTalent Global cung cấp giải pháp tuyển dụng trọn gói, tập trung vào data ứng viên chất lượng và công nghệ AI matching.",
    },
  },
];

export function generateStaticParams() {
  return jobs.map((job) => ({ id: job.id }));
}

export default async function JobDetailPage(props: PageProps<"/jobs/[id]">) {
  const { id } = await props.params;
  const job = jobs.find((item) => item.id === id) ?? jobs[0];

  const overviewItems = [
    { label: "Mức lương", value: job.salary },
    { label: "Hình thức", value: job.employmentType },
    { label: "Cấp bậc", value: job.level },
    { label: "Kinh nghiệm", value: job.experience },
    { label: "Số lượng", value: job.openings },
    { label: "Hạn nộp", value: job.deadline },
  ];

  return (
    <div className="space-y-6">
      <SectionHeading
        title="Chi tiết công việc"
        subtitle="Thông tin tuyển dụng"
        action={
          <Link
            className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:border-cyan-200 hover:text-cyan-600"
            href="/jobs"
          >
            Quay lại danh sách
          </Link>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60">
            <div className="flex flex-wrap items-start justify-between gap-6">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-600">
                  <Sparkles className="h-3.5 w-3.5" />
                  AI Matching ưu tiên
                </div>
                <div className="space-y-2">
                  <h2 className="font-display text-3xl font-semibold text-slate-900">{job.title}</h2>
                  <p className="text-sm text-slate-600">{job.summary}</p>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                  <span className="inline-flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-cyan-500" />
                    {job.company}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-cyan-500" />
                    {job.location}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-cyan-500" />
                    {job.employmentType}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {job.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex w-full flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:w-[240px]">
                <div>
                  <p className="text-xs font-semibold text-slate-500">Mức lương</p>
                  <p className="text-2xl font-semibold text-slate-900">{job.salary}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-cyan-500 px-3 py-2 text-xs font-semibold text-white shadow-lg shadow-cyan-200 transition hover:bg-cyan-600"
                    type="button"
                  >
                    Ứng tuyển ngay
                    <ArrowUpRight className="h-4 w-4" />
                  </button>
                  <button
                    className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-3 py-2 text-slate-600 transition hover:border-cyan-200 hover:text-cyan-600"
                    type="button"
                  >
                    <Bookmark className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-xs text-slate-500">Hạn nộp: {job.deadline}</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6">
            <h3 className="font-display text-lg font-semibold text-slate-900">Mô tả công việc</h3>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              {job.responsibilities.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-cyan-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6">
            <h3 className="font-display text-lg font-semibold text-slate-900">Yêu cầu ứng viên</h3>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              {job.requirements.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-cyan-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6">
            <h3 className="font-display text-lg font-semibold text-slate-900">Quyền lợi</h3>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              {job.benefits.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-cyan-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6">
            <h3 className="font-display text-lg font-semibold text-slate-900">Địa điểm làm việc</h3>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              {job.workLocation.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-cyan-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-3xl border border-slate-200 bg-white p-6">
            <h3 className="font-display text-lg font-semibold text-slate-900">Thông tin chung</h3>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              {overviewItems.map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-slate-500">{item.label}</span>
                  <span className="font-semibold text-slate-900">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-sm font-semibold text-white">
                {job.companyInfo.name
                  .split(" ")
                  .map((word) => word[0])
                  .slice(0, 2)
                  .join("")}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">{job.companyInfo.name}</p>
                <p className="text-xs text-slate-500">{job.companyInfo.field}</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-slate-600">{job.companyInfo.description}</p>
            <div className="mt-4 space-y-2 text-xs text-slate-500">
              <p>
                <span className="font-semibold text-slate-700">Quy mô:</span> {job.companyInfo.size}
              </p>
              <p>
                <span className="font-semibold text-slate-700">Địa chỉ:</span> {job.companyInfo.address}
              </p>
              <p>
                <span className="font-semibold text-slate-700">Website:</span> {job.companyInfo.website}
              </p>
            </div>
            <Link
              className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-cyan-600"
              href="/companies"
            >
              Xem hồ sơ công ty
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6">
            <h3 className="font-display text-lg font-semibold text-slate-900">Kỹ năng cần thiết</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {job.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-cyan-100 bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
