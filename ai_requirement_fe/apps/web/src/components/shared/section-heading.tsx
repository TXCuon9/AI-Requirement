import { type ReactNode } from "react";

type SectionHeadingProps = {
  title: string;
  subtitle?: string;
  action?: ReactNode;
};

export function SectionHeading({ title, subtitle, action }: SectionHeadingProps) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <p className="text-xs font-semibold text-cyan-600">{subtitle}</p>
        <h1 className="font-display text-2xl font-semibold text-slate-900">{title}</h1>
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  );
}
