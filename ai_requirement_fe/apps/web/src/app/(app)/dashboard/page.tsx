import { SectionHeading } from "@/components/shared/section-heading";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <SectionHeading title="Bảng điều khiển" subtitle="Tổng quan" />
      <div className="grid gap-4 sm:grid-cols-3">
        {["Việc làm đang mở", "Ứng viên mới", "Lời mời phỏng vấn"].map((item) => (
          <div key={item} className="rounded-3xl border border-slate-200 bg-white p-4">
            <p className="text-xs text-slate-500">{item}</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">0</p>
          </div>
        ))}
      </div>
    </div>
  );
}
