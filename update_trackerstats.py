content = """
import { Flame, CheckCircle2, TrendingUp } from "lucide-react";
import Link from "next/link";

export function TrackerStatsWidget({ trackers }: { trackers: any[] }) {
  if (trackers.length === 0) {
    return (
      <div className="flex flex-col h-full items-center justify-center py-6 text-center">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-zinc-800 text-gray-400 dark:text-zinc-500 mb-3">
          <Flame className="h-5 w-5" />
        </div>
        <p className="text-sm font-medium text-gray-700 dark:text-zinc-300">No habits tracked yet</p>
        <Link href="/trackers" className="mt-2 text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline">Go to Habit Tracker</Link>
      </div>
    );
  }

  const todayDateStr = new Date().toISOString().split("T")[0];
  
  // Calculate stats
  let totalHabits = trackers.length;
  let completedToday = 0;
  
  trackers.forEach(tracker => {
    const todayLog = tracker.logs?.find((log: any) => {
      const logDateStr = new Date(log.date).toISOString().split("T")[0];
      return logDateStr === todayDateStr || new Date(log.date).toDateString() === new Date().toDateString();
    });
    if (todayLog?.status === "Successful") {
      completedToday++;
    }
  });

  const completionRate = Math.round((completedToday / totalHabits) * 100) || 0;

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex-1">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-zinc-300">Today's Completion</span>
          <span className="text-sm font-bold text-gray-900 dark:text-white">{completionRate}%</span>
        </div>
        <div className="w-full bg-gray-100 dark:bg-zinc-800 rounded-full h-2.5 mb-6">
          <div className="bg-green-500 h-2.5 rounded-full transition-all" style={{ width: \\%\ }}></div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900/50 p-3 flex items-center gap-3">
            <div className="p-2 bg-white dark:bg-zinc-800 rounded shadow-sm text-green-500"><CheckCircle2 className="h-4 w-4" /></div>
            <div>
              <p className="text-xs text-gray-500 dark:text-zinc-400">Done Today</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{completedToday} <span className="text-xs font-normal text-gray-400">/ {totalHabits}</span></p>
            </div>
          </div>
          <div className="rounded-lg border border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900/50 p-3 flex items-center gap-3">
            <div className="p-2 bg-white dark:bg-zinc-800 rounded shadow-sm text-orange-500"><TrendingUp className="h-4 w-4" /></div>
            <div>
              <p className="text-xs text-gray-500 dark:text-zinc-400">Active Habits</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{totalHabits}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="pt-4 border-t border-gray-100 dark:border-zinc-800">
        <Link href="/trackers" className="w-full block text-center rounded-lg bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 py-2 text-sm font-medium text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 transition shadow-sm">
          Open Habit Tracker Sheet
        </Link>
      </div>
    </div>
  );
}
"""

with open("src/components/TrackerStatsWidget.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("TrackerStatsWidget updated")
