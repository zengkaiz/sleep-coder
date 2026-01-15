interface ActivityItem {
  id: string;
  type: string;
  description: string;
  time: string;
}

interface ActivityListProps {
  activities: ActivityItem[];
}

export function ActivityList({ activities }: ActivityListProps) {
  return (
    <div className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">最近活动</h2>
        <span className="text-sm text-blue-600">查看全部</span>
      </div>
      <ul className="mt-4 space-y-4">
        {activities.map((activity) => (
          <li
            key={activity.id}
            className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4 last:border-b-0 last:pb-0"
          >
            <div>
              <p className="text-sm font-semibold text-slate-800">
                {activity.type}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                {activity.description}
              </p>
            </div>
            <span className="text-xs text-slate-400">{activity.time}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
