import { SectionHeading } from "@/components/shared/section-heading";

export default function CompaniesPage() {
  return (
    <div className="space-y-6">
      <SectionHeading title="Công ty" subtitle="Quản lý tài khoản" />
      <div className="rounded-3xl border border-slate-200 bg-white p-6">
        <p className="text-sm text-slate-600">Khung mô-đun công ty.</p>
      </div>
    </div>
  );
}
