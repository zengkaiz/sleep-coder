import { ActivityList } from "../components/dashboard/ActivityList";
import {
  StatCard,
  type StatCardTheme,
} from "../components/dashboard/StatCard";

const stats: Array<{
  title: string;
  value: string;
  theme: StatCardTheme;
  icon: JSX.Element;
}> = [
  {
    title: "总用户数",
    value: "12,480",
    theme: "blue",
    icon: (
      <svg
        aria-hidden="true"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zm4 14v-1a4 4 0 00-4-4H8a4 4 0 00-4 4v1"
        />
      </svg>
    ),
  },
  {
    title: "活跃用户",
    value: "3,620",
    theme: "emerald",
    icon: (
      <svg
        aria-hidden="true"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5 12h14M12 5v14"
        />
      </svg>
    ),
  },
  {
    title: "总收入",
    value: "¥ 86,400",
    theme: "amber",
    icon: (
      <svg
        aria-hidden="true"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8V6m0 12v-2"
        />
      </svg>
    ),
  },
  {
    title: "订单数量",
    value: "1,284",
    theme: "violet",
    icon: (
      <svg
        aria-hidden="true"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 7h18M5 7v11a2 2 0 002 2h10a2 2 0 002-2V7"
        />
      </svg>
    ),
  },
];

const activities = [
  {
    id: "activity-1",
    type: "新增订单",
    description: "北京客户完成了企业版订阅",
    time: "2 分钟前",
  },
  {
    id: "activity-2",
    type: "用户反馈",
    description: "App 评分更新为 4.9，新增 12 条评论",
    time: "1 小时前",
  },
  {
    id: "activity-3",
    type: "系统提醒",
    description: "晚间高峰期服务器负载稳定",
    time: "今天",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F9FAFB] px-6 py-10 text-slate-900">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <header className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
            Dashboard
          </p>
          <h1 className="text-3xl font-bold tracking-tight">业务概览</h1>
          <p className="text-base text-slate-500">
            这里汇总了核心指标与最新动态，方便快速掌握业务进展。
          </p>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">收入趋势</h2>
              <span className="text-sm text-blue-600">本月</span>
            </div>
            <div className="mt-6 flex h-56 items-center justify-center rounded-[8px] border border-dashed border-slate-200 bg-slate-50 text-sm text-slate-400">
              图表占位区域
            </div>
          </div>
          <div className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">用户增长</h2>
              <span className="text-sm text-blue-600">最近 7 天</span>
            </div>
            <div className="mt-6 flex h-56 items-center justify-center rounded-[8px] border border-dashed border-slate-200 bg-slate-50 text-sm text-slate-400">
              图表占位区域
            </div>
          </div>
        </section>

        <section>
          <ActivityList activities={activities} />
        </section>
      </div>
    </main>
  );
}
