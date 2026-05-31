import { SectionHeading } from "@/components/shared/section-heading";

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <SectionHeading title="Người dùng" subtitle="Danh bạ người dùng" />
      <div className="rounded-3xl border border-slate-200 bg-white p-6">
        <p className="text-sm text-slate-600">Khung mô-đun người dùng.</p>
      </div>
    </div>
  );
}
