import { CheckCircle2, Zap, Target } from "lucide-react";
import { getActivities, getTasks, getGoals } from "@/app/actions";

export default async function LogbookPage() {
  const [activities, tasks, goals] = await Promise.all([
    getActivities(),
    getTasks(),
    getGoals(),
  ]);

  const completedTasks = tasks.filter(t => t.status === "Done");
  const completedGoals = goals.filter(g => g.status === "Completed");

  type LogItem = {
    id: string;
    type: "Task" | "Focus" | "Goal";
    title: string;
    date: Date;
    meta?: string;
  };

  const logs: LogItem[] = [
    ...activities.map(a => ({
      id: a.id,
      type: "Focus" as const,
      title: a.type,
      date: a.createdAt,
      meta: `${a.actualDuration || 0} mins`,
    })),
    ...completedTasks.map(t => ({
      id: t.id,
      type: "Task" as const,
      title: t.title,
      date: t.updatedAt, // assuming it was completed recently
    })),
    ...completedGoals.map(g => ({
      id: g.id,
      type: "Goal" as const,
      title: g.title,
      date: g.updatedAt,
    })),
  ].sort((a, b) => b.date.getTime() - a.date.getTime());

  // Group by date
  const groupedLogs = logs.reduce((acc: any, log) => {
    const dateStr = log.date.toLocaleDateString("en-US", { weekday: 'long', month: 'long', day: 'numeric' });
    if (!acc[dateStr]) acc[dateStr] = [];
    acc[dateStr].push(log);
    return acc;
  }, {});

  return (
    <div className="space-y-8 max-w-3xl mx-auto pt-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Logbook</h1>
      </div>

      <div className="relative border-l-2 border-gray-100 ml-4 space-y-12 pb-12 pt-4">
        {Object.entries(groupedLogs).map(([date, dayLogs]: [string, any]) => (
          <div key={date} className="relative pl-8">
            <span className="absolute -left-[9px] top-1 h-4 w-4 rounded-full border-4 border-white bg-gray-300" />
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6 mt-0.5">{date}</h2>
            
            <div className="space-y-4">
              {dayLogs.map((log: LogItem) => (
                <div key={`${log.type}-${log.id}`} className="flex items-start gap-4 p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition">
                  <div className={`mt-0.5 flex items-center justify-center h-8 w-8 rounded-full shrink-0 ${
                    log.type === 'Focus' ? 'bg-blue-50 text-blue-600' :
                    log.type === 'Task' ? 'bg-green-50 text-green-600' : 'bg-purple-50 text-purple-600'
                  }`}>
                    {log.type === 'Focus' && <Zap className="h-4 w-4" />}
                    {log.type === 'Task' && <CheckCircle2 className="h-4 w-4" />}
                    {log.type === 'Goal' && <Target className="h-4 w-4" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{log.type}</span>
                      {log.meta && <span className="text-xs text-gray-400">• {log.meta}</span>}
                      <span className="text-xs text-gray-400">• {log.date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      {log.type === 'Focus' && `Focused on `}
                      {log.type === 'Task' && `Completed task `}
                      {log.type === 'Goal' && `Achieved goal `}
                      <span className="font-bold text-gray-900">{log.title}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        {logs.length === 0 && (
          <div className="pl-8 text-sm text-gray-400 italic">No activity logged yet. Time to get to work!</div>
        )}
      </div>
    </div>
  );
}
