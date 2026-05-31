import { SectionHeading } from "@/components/shared/section-heading";

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <SectionHeading title="Quản trị" subtitle="Trung tâm điều hành doanh nghiệp" />
      <div className="rounded-3xl border border-slate-200 bg-white p-6">
        <p className="text-sm text-slate-600">Khung mô-đun quản trị.</p>
      </div>
    </div>
  );
}
