import type { ReactNode } from "react";

const themeStyles = {
  blue: {
    accent: "text-blue-600",
    iconBackground: "bg-blue-100",
    border: "border-blue-100",
  },
  emerald: {
    accent: "text-emerald-600",
    iconBackground: "bg-emerald-100",
    border: "border-emerald-100",
  },
  amber: {
    accent: "text-amber-600",
    iconBackground: "bg-amber-100",
    border: "border-amber-100",
  },
  violet: {
    accent: "text-violet-600",
    iconBackground: "bg-violet-100",
    border: "border-violet-100",
  },
};

export type StatCardTheme = keyof typeof themeStyles;

interface StatCardProps {
  title: string;
  value: string;
  icon: ReactNode;
  theme?: StatCardTheme;
}

export function StatCard({
  title,
  value,
  icon,
  theme = "blue",
}: StatCardProps) {
  const styles = themeStyles[theme];

  return (
    <div
      className={`rounded-[8px] border bg-white p-5 shadow-sm ${styles.border}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
        </div>
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-full ${styles.iconBackground} ${styles.accent}`}
        >
          {icon}
        </div>
      </div>
      <p className={`mt-4 text-xs font-medium ${styles.accent}`}>
        查看详情
      </p>
    </div>
  );
}
