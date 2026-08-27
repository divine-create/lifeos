import { getTasks, getActivities } from "@/app/actions";


export async function DashboardWidgets() {
  const [tasks, activities] = await Promise.all([getTasks(), getActivities()]);

  const activeTasks = tasks.filter(t => t.status !== "Done");
  const overdueTasks = activeTasks.filter(t => t.deadline && t.deadline < new Date());

  // Simple Heatmap calculation
  const today = new Date();
  const days = Array.from({ length: 90 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (89 - i));
    return d.toISOString().split("T")[0];
  });

  const activityMap = activities.reduce((acc: any, act) => {
    const dateStr = act.createdAt.toISOString().split("T")[0];
    acc[dateStr] = (acc[dateStr] || 0) + (act.actualDuration || 0);
    return acc;
  }, {});

  return (
    <div className="grid gap-6 md:grid-cols-2 mt-8">
      
      {/* Attention Required */}
      <div className="rounded-xl border border-red-200 bg-red-50/30 p-6 shadow-sm">
        <h2 className="text-sm font-bold text-red-800 uppercase tracking-wider mb-4 flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
          Attention Required
        </h2>
        {overdueTasks.length === 0 ? (
          <p className="text-sm text-gray-500">All clear! No overdue items.</p>
        ) : (
          <ul className="space-y-3">
            {overdueTasks.slice(0, 5).map(task => (
              <li key={task.id} className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{task.title}</p>
                  <p className="text-xs text-red-600 font-medium">Overdue: {task.deadline!.toLocaleDateString()}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Consistency Heatmap */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4">90-Day Focus Consistency</h2>
        <div className="flex flex-wrap gap-1">
          {days.map(dayStr => {
            const minutes = activityMap[dayStr] || 0;
            let bgColor = "bg-gray-100";
            if (minutes > 0 && minutes <= 30) bgColor = "bg-green-200";
            else if (minutes > 30 && minutes <= 60) bgColor = "bg-green-300";
            else if (minutes > 60 && minutes <= 120) bgColor = "bg-green-500";
            else if (minutes > 120) bgColor = "bg-green-700";

            return (
              <div 
                key={dayStr} 
                className={`h-3 w-3 rounded-sm ${bgColor}`} 
                title={`${dayStr}: ${minutes} mins`}
              />
            );
          })}
        </div>
        <div className="flex justify-between items-center mt-4 text-xs text-gray-500">
          <span>{days[0]}</span>
          <div className="flex items-center gap-1">
            <span>Less</span>
            <div className="h-2 w-2 rounded-sm bg-gray-100" />
            <div className="h-2 w-2 rounded-sm bg-green-200" />
            <div className="h-2 w-2 rounded-sm bg-green-500" />
            <div className="h-2 w-2 rounded-sm bg-green-700" />
            <span>More</span>
          </div>
          <span>Today</span>
        </div>
      </div>

    </div>
  );
}
