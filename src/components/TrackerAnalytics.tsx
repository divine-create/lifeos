import React from 'react';

export function TrackerAnalytics({ tracker, stats }: { tracker: any, stats: any }) {
  // 1. Year in Pixels Heatmap
  const today = new Date();
  const days = Array.from({ length: 365 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (364 - i));
    return d;
  });

  const logMap = new Map();
  if (tracker?.logs) {
    tracker.logs.forEach((log: any) => {
      if (log.date) {
        // Extract YYYY-MM-DD safely
        const dateStr = typeof log.date === 'string' 
          ? log.date.split('T')[0] 
          : new Date(log.date).toISOString().split('T')[0];
        logMap.set(dateStr, log.status);
      }
    });
  }

  const getColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'successful': return 'bg-emerald-500 dark:bg-emerald-400';
      case 'skipped': return 'bg-zinc-400 dark:bg-zinc-600';
      case 'failed': return 'bg-red-500 dark:bg-red-400';
      default: return 'bg-zinc-100 dark:bg-zinc-800';
    }
  };

  // 2. Day of Week Success Rate
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dowStats = stats?.dayOfWeekStats || [0, 0, 0, 0, 0, 0, 0];

  return (
    <div className="space-y-8 p-6 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800">
      
      {/* Heatmap Section */}
      <div>
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">Year in Pixels</h3>
        <div className="overflow-x-auto pb-4">
          <div className="grid grid-rows-[7] grid-flow-col gap-1 w-max">
            {days.map((day, i) => {
              const year = day.getFullYear();
              const month = String(day.getMonth() + 1).padStart(2, '0');
              const date = String(day.getDate()).padStart(2, '0');
              const dateStr = `${year}-${month}-${date}`;
              
              const status = logMap.get(dateStr);
              return (
                <div
                  key={i}
                  title={`${dateStr}${status ? `: ${status}` : ''}`}
                  className={`w-3 h-3 rounded-[2px] ${getColor(status)}`}
                />
              );
            })}
          </div>
        </div>
        <div className="flex items-center gap-4 mt-2 text-xs text-zinc-500 dark:text-zinc-400 font-medium">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-[2px] bg-zinc-100 dark:bg-zinc-800"></div> 
            Empty
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-[2px] bg-emerald-500 dark:bg-emerald-400"></div> 
            Successful
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-[2px] bg-zinc-400 dark:bg-zinc-600"></div> 
            Skipped
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-[2px] bg-red-500 dark:bg-red-400"></div> 
            Failed
          </div>
        </div>
      </div>

      {/* Day of Week Chart Section */}
      <div>
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">Success Rate by Day</h3>
        <div className="flex items-end gap-3 h-48 pt-6">
          {daysOfWeek.map((day, i) => {
            const rawVal = dowStats[i];
            const rate = typeof rawVal === 'number' ? rawVal : (rawVal?.rate || 0);
            return (
              <div key={day} className="flex flex-col items-center flex-1 gap-3 h-full justify-end group">
                <div className="w-full relative h-32 bg-zinc-100 dark:bg-zinc-800 rounded-t-md flex items-end">
                  <div 
                    className="w-full bg-indigo-500 dark:bg-indigo-500/80 hover:bg-indigo-600 dark:hover:bg-indigo-400 rounded-t-md transition-all duration-300 relative group-hover:opacity-90"
                    style={{ height: `${Math.max(0, Math.min(100, rate))}%` }}
                  >
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold text-indigo-600 dark:text-indigo-400 whitespace-nowrap">
                      {Math.round(rate)}%
                    </div>
                  </div>
                </div>
                <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  {day}
                </span>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
