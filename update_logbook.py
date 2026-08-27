import re

content = """
import { CheckCircle2, Zap, Target, Clock, TrendingDown, TrendingUp, AlertCircle, Activity as ActivityIcon } from "lucide-react";
import { getActivities, getTasks, getGoals } from "@/app/actions";
import { VarianceTable } from "@/components/VarianceTable";

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
      meta: \\ mins\,
    })),
    ...completedTasks.map(t => ({
      id: t.id,
      type: "Task" as const,
      title: t.title,
      date: t.updatedAt,
    })),
    ...completedGoals.map(g => ({
      id: g.id,
      type: "Goal" as const,
      title: g.title,
      date: g.updatedAt,
    })),
  ].sort((a, b) => b.date.getTime() - a.date.getTime());

  const groupedLogs = logs.reduce((acc: any, log) => {
    const dateStr = log.date.toLocaleDateString("en-US", { weekday: 'long', month: 'long', day: 'numeric' });
    if (!acc[dateStr]) acc[dateStr] = [];
    acc[dateStr].push(log);
    return acc;
  }, {});

  // VARIANCE ENGINE STATS
  const tasksWithVariance = tasks.filter(t => t.estimatedTime !== null && t.actualTime !== null);
  const totalEstimated = tasksWithVariance.reduce((sum, t) => sum + (t.estimatedTime || 0), 0);
  const totalActual = tasksWithVariance.reduce((sum, t) => sum + (t.actualTime || 0), 0);
  
  let accuracy = 0;
  if (totalEstimated > 0) {
    const error = Math.abs(totalActual - totalEstimated);
    accuracy = Math.max(0, 100 - (error / totalEstimated) * 100);
  }

  const isOverestimating = totalEstimated > totalActual;
  const isUnderestimating = totalActual > totalEstimated;

  return (
    <div className="space-y-10 max-w-5xl mx-auto pt-4 pb-20">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Review & Audit</h1>
      </div>

      {/* VARIANCE ENGINE */}
      <section className="space-y-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-zinc-100 flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-500" /> Planned vs Actual Variance Engine
          </h2>
          <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">
            Track your estimation accuracy. Are you underestimating how long tasks take?
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-gray-500 dark:text-zinc-400">Total Planned</span>
              <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg"><Target className="h-4 w-4" /></div>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{Math.round(totalEstimated / 60)}<span className="text-lg font-normal text-gray-500 ml-1">hrs</span> {totalEstimated % 60}<span className="text-lg font-normal text-gray-500 ml-1">m</span></p>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-gray-500 dark:text-zinc-400">Total Actual</span>
              <div className="p-2 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-lg"><Clock className="h-4 w-4" /></div>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{Math.round(totalActual / 60)}<span className="text-lg font-normal text-gray-500 ml-1">hrs</span> {totalActual % 60}<span className="text-lg font-normal text-gray-500 ml-1">m</span></p>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-gray-500 dark:text-zinc-400">Estimation Accuracy</span>
              <div className={\p-2 rounded-lg \\}>
                <ActivityIcon className="h-4 w-4" />
              </div>
            </div>
            <div className="flex items-end gap-3">
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{accuracy.toFixed(1)}%</p>
              {tasksWithVariance.length > 0 && (
                <p className={\	ext-sm font-medium mb-1 flex items-center \\}>
                  {isUnderestimating ? <><TrendingUp className="h-3 w-3 mr-1"/> Underestimating</> : isOverestimating ? <><TrendingDown className="h-3 w-3 mr-1"/> Overestimating</> : <><CheckCircle2 className="h-3 w-3 mr-1"/> Perfect</>}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Time Audit Table (Client Component) */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900/50">
            <h3 className="text-sm font-bold text-gray-900 dark:text-zinc-100">Time Audit Sheet</h3>
            <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">Input your estimates and actuals in minutes. It auto-saves.</p>
          </div>
          <VarianceTable tasks={tasks} />
        </div>
      </section>

      {/* TIMELINE */}
      <section className="space-y-6 pt-10 border-t border-gray-200 dark:border-zinc-800">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-zinc-100 flex items-center gap-2">
            <Zap className="h-5 w-5 text-amber-500" /> Activity Timeline
          </h2>
        </div>

        <div className="relative border-l-2 border-gray-200 dark:border-zinc-800 ml-4 space-y-10 pb-12 pt-2">
          {Object.entries(groupedLogs).map(([date, dayLogs]: [string, any]) => (
            <div key={date} className="relative pl-8">
              <span className="absolute -left-[9px] top-1 h-4 w-4 rounded-full border-4 border-gray-50 dark:border-zinc-950 bg-gray-300 dark:bg-zinc-700" />
              <h2 className="text-xs font-bold text-gray-500 dark:text-zinc-500 uppercase tracking-wider mb-4 mt-0.5">{date}</h2>
              
              <div className="space-y-3">
                {dayLogs.map((log: LogItem) => (
                  <div key={\\-\\} className="flex items-start gap-4 p-4 rounded-xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-sm hover:border-gray-300 dark:hover:border-zinc-600 transition">
                    <div className={\mt-0.5 flex items-center justify-center h-8 w-8 rounded-full shrink-0 \\}>
                      {log.type === 'Focus' && <Zap className="h-4 w-4" />}
                      {log.type === 'Task' && <CheckCircle2 className="h-4 w-4" />}
                      {log.type === 'Goal' && <Target className="h-4 w-4" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold text-gray-500 dark:text-zinc-500 uppercase tracking-wider">{log.type}</span>
                        {log.meta && <span className="text-xs text-gray-400 dark:text-zinc-500">? {log.meta}</span>}
                        <span className="text-xs text-gray-400 dark:text-zinc-500">? {log.date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                      </div>
                      <p className="text-sm font-medium text-gray-900 dark:text-zinc-200">
                        {log.type === 'Focus' && \Focused on \}
                        {log.type === 'Task' && \Completed task \}
                        {log.type === 'Goal' && \Achieved goal \}
                        <span className="font-bold text-gray-900 dark:text-white">{log.title}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {logs.length === 0 && (
            <div className="pl-8 text-sm text-gray-400 dark:text-zinc-500 italic">No activity logged yet. Time to get to work!</div>
          )}
        </div>
      </section>

    </div>
  );
}
"""

with open("src/app/logbook/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated logbook/page.tsx")
