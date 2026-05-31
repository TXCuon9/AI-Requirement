import { SectionHeading } from "@/components/shared/section-heading";

export default function JobsPage() {
  return (
    <div className="space-y-6">
      <SectionHeading title="Việc làm" subtitle="Quản lý tin tuyển dụng" />
      <div className="rounded-3xl border border-slate-200 bg-white p-6">
        <p className="text-sm text-slate-600">Khung mô-đun việc làm.</p>
      </div>
    </div>
  );
}
