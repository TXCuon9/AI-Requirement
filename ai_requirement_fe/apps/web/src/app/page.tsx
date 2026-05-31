import Link from "next/link";
import {
  ArrowUpRight,
  Bookmark,
  Briefcase,
  Building2,
  Flame,
  MapPin,
  Search,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";

const stats = [
  { label: "Tin tuyển dụng", value: "60,000+" },
  { label: "Doanh nghiệp", value: "6,200+" },
  { label: "Ứng viên hoạt động", value: "1.2M+" },
];

const quickFilters = [
  "Toàn thời gian",
  "Từ xa",
  "Kinh doanh",
  "Marketing",
  "IT - Phần mềm",
  "Tài chính",
  "Thực tập",
];

const trending = ["Bán hàng B2B", "Kế toán", "Dữ liệu", "Nhân sự", "UI/UX", "Vận hành"];

const jobs = [
  {
    id: "job-01",
    title: "Chuyên viên kinh doanh B2B (Data sẵn)",
    company: "TopTalent Global",
    salary: "18 - 30 triệu",
    location: "Hà Nội",
    tags: ["Làm việc hybrid", "Toàn thời gian", "3 năm"],
    badge: "HOT",
    match: "HR-AI gợi ý",
    logo: "TT",
    posted: "Mới 2h",
  },
  {
    id: "job-02",
    title: "Trưởng nhóm Marketing sản phẩm - HR Tech",
    company: "Nova Digital",
    salary: "30 - 45 triệu",
    location: "Hồ Chí Minh",
    tags: ["Tại văn phòng", "Toàn thời gian", "5 năm"],
    badge: "TOP",
    match: "Phù hợp cao",
    logo: "ND",
    posted: "Mới 4h",
  },
  {
    id: "job-03",
    title: "Chuyên viên tư vấn tuyển dụng",
    company: "PeopleUp",
    salary: "15 - 22 triệu",
    location: "Đà Nẵng",
    tags: ["Làm việc hybrid", "Toàn thời gian", "2 năm"],
    badge: "NEW",
    match: "Đề xuất cho bạn",
    logo: "PU",
    posted: "Hôm nay",
  },
  {
    id: "job-04",
    title: "Senior Frontend Engineer (Next.js)",
    company: "BrightLabs",
    salary: "40 - 60 triệu",
    location: "Hà Nội",
    tags: ["Từ xa", "Toàn thời gian", "4 năm"],
    badge: "VIP",
    match: "Hồ sơ phù hợp",
    logo: "BL",
    posted: "Mới 1 ngày",
  },
  {
    id: "job-05",
    title: "Chuyên viên CSKH cao cấp",
    company: "Skyline Service",
    salary: "12 - 18 triệu",
    location: "Cần Thơ",
    tags: ["Tại văn phòng", "Toàn thời gian", "1 năm"],
    badge: "HOT",
    match: "Ứng tuyển nhanh",
    logo: "SS",
    posted: "Mới 6h",
  },
  {
    id: "job-06",
    title: "Kế toán tổng hợp",
    company: "Greenway Logistics",
    salary: "15 - 25 triệu",
    location: "Hồ Chí Minh",
    tags: ["Tại văn phòng", "Toàn thời gian", "3 năm"],
    badge: "TOP",
    match: "Có thể phù hợp",
    logo: "GL",
    posted: "Mới 8h",
  },
];

const companies = [
  { name: "AI recruit Pro", roles: "120 vị trí", tag: "Pro" },
  { name: "VietFinance", roles: "45 vị trí", tag: "Finance" },
  { name: "Aether Tech", roles: "38 vị trí", tag: "IT" },
  { name: "Golden Retail", roles: "52 vị trí", tag: "Retail" },
];

const insights = [
  {
    title: "Bộ lọc AI",
    detail: "Tự động gợi ý công việc theo CV và kỹ năng.",
  },
  {
    title: "Tốc độ 24h",
    detail: "Cập nhật tin mới mỗi giờ trên toàn quốc.",
  },
  {
    title: "Ứng tuyển 1 chạm",
    detail: "Hồ sơ đồng bộ, ứng tuyển nhanh trên di động.",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-topcv-page text-slate-900">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-500 text-base font-semibold text-white shadow-lg shadow-cyan-200">
              AI
            </div>
            <div>
              <p className="font-display text-lg font-semibold">AI Recruit</p>
              <p className="text-xs text-slate-500">Việc làm thông minh 24/7</p>
            </div>
          </div>
          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 lg:flex">
            <a className="text-cyan-600" href="#jobs">
              Việc làm
            </a>
            <a href="#">Công ty</a>
            <a href="#">CV & Hồ sơ</a>
            <a href="#">Blog</a>
            <a href="#">Hỗ trợ</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link
              className="hidden rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:border-cyan-200 hover:text-cyan-600 sm:inline-flex"
              href="/login"
            >
              Đăng nhập
            </Link>
            <button className="rounded-full bg-cyan-500 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-cyan-200 transition hover:bg-cyan-600">
              Đăng tin miễn phí
            </button>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden hero-grid">
        <div className="pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full bg-cyan-400/40 blur-3xl animate-float" />
        <div className="pointer-events-none absolute left-[-10%] top-24 h-64 w-64 rounded-full bg-sky-400/30 blur-3xl animate-float" />
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 lg:grid-cols-[1.1fr_0.9fr] lg:py-16">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-xs font-semibold text-cyan-600 shadow-sm">
              <Sparkles className="h-4 w-4" />
              AI Matching - gợi ý việc làm phù hợp
            </div>
            <div className="space-y-4">
              <h1 className="font-display text-4xl font-semibold leading-tight text-slate-900 md:text-5xl">
                Tìm việc làm nhanh 24h, việc mới nhất trên toàn quốc
              </h1>
              <p className="max-w-xl text-sm text-slate-600 md:text-base">
                Tiếp cận hàng chục nghìn cơ hội từ doanh nghiệp uy tín. Bộ lọc thông minh giúp
                bạn chọn đúng việc, đúng mức lương, đúng địa điểm.
              </p>
            </div>

            <form className="grid gap-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-200/70 lg:grid-cols-[1.2fr_0.8fr_0.6fr_auto]">
              <label className="flex items-center gap-2 rounded-2xl bg-slate-50 px-3 py-2 text-sm text-slate-500">
                <Search className="h-4 w-4" />
                <input
                  className="w-full bg-transparent text-sm text-slate-700 outline-none"
                  placeholder="Vị trí, từ khóa, kỹ năng"
                  type="text"
                />
              </label>
              <label className="flex items-center gap-2 rounded-2xl bg-slate-50 px-3 py-2 text-sm text-slate-500">
                <MapPin className="h-4 w-4" />
                <select className="w-full bg-transparent text-sm text-slate-700 outline-none">
                  <option>Hà Nội</option>
                  <option>Hồ Chí Minh</option>
                  <option>Đà Nẵng</option>
                  <option>Từ xa</option>
                </select>
              </label>
              <label className="flex items-center gap-2 rounded-2xl bg-slate-50 px-3 py-2 text-sm text-slate-500">
                <Briefcase className="h-4 w-4" />
                <select className="w-full bg-transparent text-sm text-slate-700 outline-none">
                  <option>15 - 25 triệu</option>
                  <option>25 - 40 triệu</option>
                  <option>40 - 60 triệu</option>
                </select>
              </label>
              <button
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-200 transition hover:bg-cyan-600"
                type="submit"
              >
                Tìm việc ngay
                <ArrowUpRight className="h-4 w-4" />
              </button>
            </form>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1">
                <SlidersHorizontal className="h-3.5 w-3.5" />
                Bộ lọc nâng cao
              </span>
              <span>Gợi ý từ khóa:</span>
              {trending.map((tag) => (
                <button
                  key={tag}
                  className="rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs font-medium text-slate-600 transition hover:border-cyan-200 hover:text-cyan-600"
                  type="button"
                >
                  {tag}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-4">
              {stats.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-white/60 bg-white/70 px-4 py-3 text-center shadow-sm"
                >
                  <p className="font-display text-2xl font-semibold text-slate-900">{item.value}</p>
                  <p className="text-xs text-slate-500">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="rounded-3xl border border-white/60 bg-white/80 p-5 shadow-lg shadow-slate-200/70">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-cyan-600">Việc làm tốt nhất</p>
                  <h3 className="font-display text-xl font-semibold">HR-AI đề cử</h3>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-600">
                  <Flame className="h-3.5 w-3.5" />
                  Mới nhất
                </span>
              </div>
              <div className="mt-4 space-y-3">
                {jobs.slice(0, 3).map((job) => (
                  <div key={job.id} className="flex items-start gap-3 rounded-2xl bg-slate-50 p-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-xs font-semibold text-white">
                      {job.logo}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-cyan-600">{job.match}</p>
                      <p className="text-sm font-semibold text-slate-900">{job.title}</p>
                      <p className="text-xs text-slate-500">{job.company}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-cyan-200 px-3 py-2 text-xs font-semibold text-cyan-600 transition hover:bg-cyan-50">
                Xem toàn bộ việc làm phù hợp
                <ArrowUpRight className="h-4 w-4" />
              </button>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/60">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Building2 className="h-4 w-4 text-cyan-500" />
                Thương hiệu lớn đang tuyển
              </div>
              <div className="mt-4 grid gap-3">
                {companies.map((company) => (
                  <div key={company.name} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{company.name}</p>
                      <p className="text-xs text-slate-500">{company.roles}</p>
                    </div>
                    <span className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-semibold text-cyan-600">
                      {company.tag}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-6 max-w-6xl px-4 pb-10">
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
          <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-700">
            Bộ lọc nhanh
          </span>
          {quickFilters.map((filter) => (
            <button
              key={filter}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium transition hover:border-cyan-200 hover:text-cyan-600"
              type="button"
            >
              {filter}
            </button>
          ))}
        </div>
      </section>

      <section
        id="jobs"
        className="mx-auto mt-6 grid max-w-6xl gap-6 px-4 pb-16 lg:grid-cols-[minmax(0,1fr)_320px]"
      >
        <div className="space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-cyan-600">Việc làm tốt nhất</p>
              <h2 className="font-display text-3xl font-semibold text-slate-900 md:text-4xl">
                Cơ hội nổi bật cho bạn
              </h2>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="rounded-full bg-white px-3 py-1">Lọc theo: Địa điểm</span>
              <span className="rounded-full bg-white px-3 py-1">Sắp xếp: Mới nhất</span>
            </div>
          </div>

          <div className="space-y-4">
            {jobs.map((job, index) => (
              <article
                key={job.id}
                className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg animate-fade-up"
                style={{ animationDelay: `${index * 90}ms` }}
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-sm font-semibold text-white">
                      {job.logo}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-cyan-50 px-2 py-0.5 text-xs font-semibold text-cyan-600">
                          {job.badge}
                        </span>
                        <span className="text-xs text-slate-500">{job.posted}</span>
                      </div>
                      <h3 className="mt-1 text-lg font-semibold text-slate-900">{job.title}</h3>
                      <p className="text-sm text-slate-500">{job.company}</p>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col gap-3">
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                        {job.salary}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {job.location}
                      </span>
                      <span className="inline-flex items-center gap-1 text-cyan-600">
                        <Sparkles className="h-3.5 w-3.5" />
                        {job.match}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {job.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 md:flex-col">
                    <button className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:border-cyan-200 hover:text-cyan-600">
                      <Bookmark className="h-4 w-4" />
                      Lưu tin
                    </button>
                    <button className="inline-flex items-center gap-2 rounded-full bg-cyan-500 px-4 py-2 text-xs font-semibold text-white shadow shadow-cyan-200 transition hover:bg-cyan-600">
                      Ứng tuyển
                      <ArrowUpRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-500">
            <span>1 / 212 trang</span>
            <div className="flex items-center gap-2">
              <button className="rounded-full border border-slate-200 px-3 py-1">Trước</button>
              <button className="rounded-full bg-cyan-500 px-3 py-1 font-semibold text-white">1</button>
              <button className="rounded-full border border-slate-200 px-3 py-1">2</button>
              <button className="rounded-full border border-slate-200 px-3 py-1">3</button>
              <button className="rounded-full border border-slate-200 px-3 py-1">Sau</button>
            </div>
          </div>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/60">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <SlidersHorizontal className="h-4 w-4 text-cyan-500" />
              Bộ lọc nâng cao
            </div>
            <div className="mt-4 space-y-3 text-xs text-slate-600">
              {[
                "Cấp bậc", "Lương", "Kinh nghiệm", "Hình thức", "Ngành nghề", "Phúc lợi",
              ].map((item) => (
                <button
                  key={item}
                  className="flex w-full items-center justify-between rounded-2xl border border-slate-200 px-3 py-2 transition hover:border-cyan-200 hover:text-cyan-600"
                  type="button"
                >
                  {item}
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/60">
            <p className="text-sm font-semibold text-slate-700">Gợi ý bộ lọc thông minh</p>
            <div className="mt-4 space-y-3">
              {insights.map((item) => (
                <div key={item.title} className="rounded-2xl bg-slate-50 p-3">
                  <p className="text-xs font-semibold text-slate-800">{item.title}</p>
                  <p className="text-xs text-slate-500">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-cyan-200 bg-cyan-50 p-5 text-xs text-cyan-700">
            <p className="text-sm font-semibold text-cyan-700">Hotline tư vấn</p>
            <p className="mt-2">Tìm việc khó đã có AI Recruit</p>
            <p className="mt-3 text-base font-semibold">1900 068 889 - Nhánh 2</p>
            <button className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-500 px-3 py-2 text-xs font-semibold text-white">
              Gọi ngay
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
        </aside>
      </section>
    </main>
  );
}
