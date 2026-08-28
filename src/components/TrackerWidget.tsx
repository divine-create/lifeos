"use client";

import { useState } from "react";
import { Plus, Flame, Check, X as XIcon, Trash2, BarChart2, SkipForward, Trophy } from "lucide-react";
import { createTracker, logTrackerEntry, deleteTracker } from "@/app/actions";
import toast from "react-hot-toast";
import { calculateTrackerStats } from "@/lib/trackerStats";
import { TrackerAnalytics } from "@/components/TrackerAnalytics";

export function TrackerWidget({ trackers }: { trackers: any[] }) {
  const [showForm, setShowForm] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  // Generate the last 7 days
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d;
  });

  const getLogForDate = (tracker: any, date: Date) => {
    const dateStr = date.toISOString().split("T")[0];
    return tracker.logs?.find((log: any) => {
      const logDateStr = new Date(log.date).toISOString().split("T")[0];
      return logDateStr === dateStr || new Date(log.date).toDateString() === date.toDateString();
    });
  };

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex-1 flex flex-col justify-between overflow-x-auto pb-4">
        {trackers.length > 0 ? (
          <div className="min-w-[600px] pr-8">
            {/* Header Row */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-200 dark:border-zinc-700 px-2">
              <div className="w-1/3 font-semibold text-xs text-gray-500 dark:text-zinc-500 uppercase tracking-wider">Habit</div>
              <div className="flex-1 flex justify-end gap-2">
                {last7Days.map((d, i) => (
                  <div key={i} className="w-10 text-center">
                    <div className="text-[10px] text-gray-400 dark:text-zinc-500 font-medium uppercase">{d.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                    <div className={`text-xs font-bold ${i === 6 ? 'text-blue-600' : 'text-gray-600 dark:text-zinc-400'}`}>{d.getDate()}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tracker Rows */}
            <div className="space-y-2">
              {trackers.map((tracker) => {
                const stats = calculateTrackerStats(tracker);
                const isExpanded = expandedId === tracker.id;
                
                return (
                  <div key={tracker.id} className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-100 dark:border-zinc-800 shadow-sm overflow-hidden transition-all hover:border-gray-200 dark:hover:border-zinc-700">
                    <div className="group relative flex items-center justify-between p-3">
                      
                      {/* Left: Tracker Info */}
                      <div className="w-1/3 min-w-[200px] pr-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => setExpandedId(isExpanded ? null : tracker.id)} className="text-gray-400 hover:text-blue-500 transition">
                            <BarChart2 className={`h-4 w-4 ${isExpanded ? 'text-blue-500' : ''}`} />
                          </button>
                          <p className="text-sm font-semibold text-gray-900 dark:text-zinc-100 truncate">{tracker.title}</p>
                        </div>
                        <div className="flex items-center gap-3 mt-1 pl-6">
                          <p className="text-[10px] text-gray-500 dark:text-zinc-500 uppercase tracking-wider truncate">
                            {tracker.type} {tracker.targetValue ? `• ${tracker.targetValue} ${tracker.unit || ''}` : ''}
                          </p>
                          <div className="flex items-center gap-2">
                            <span className="flex items-center gap-1 text-[10px] font-bold text-orange-500 bg-orange-50 dark:bg-orange-900/20 px-1.5 py-0.5 rounded" title="Current Streak">
                              <Flame className="h-3 w-3" /> {stats.currentStreak}
                            </span>
                            <span className="flex items-center gap-1 text-[10px] font-bold text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 px-1.5 py-0.5 rounded" title="Longest Streak">
                              <Trophy className="h-3 w-3" /> {stats.longestStreak}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Right: 7-Day Grid */}
                      <div className="flex-1 flex justify-end gap-2">
                        {last7Days.map((d, i) => {
                          const isToday = i === 6;
                          const log = getLogForDate(tracker, d);
                          const isSuccess = log?.status === "Successful";
                          const isFailed = log?.status === "Failed";
                          const isSkipped = log?.status === "Skipped";
                          
                          const dateIso = d.toISOString();

                          if (tracker.type === "BOOLEAN" || tracker.type === "ABSTINENCE") {
                            const isBool = tracker.type === "BOOLEAN";
                            const isActive = isBool ? isSuccess : isFailed;
                            
                            return (
                              <div key={i} className="relative group/cell w-10 flex justify-center">
                                <form action={async (formData) => { await logTrackerEntry(formData); toast.success("Saved"); }}>
                                  <input type="hidden" name="trackerId" value={tracker.id} />
                                  <input type="hidden" name="date" value={dateIso} />
                                  {!isBool && <input type="hidden" name="status" value="Failed" />}
                                  {isActive && <input type="hidden" name="toggleOff" value="true" />}
                                  
                                  <button type="submit" className={`flex h-8 w-8 items-center justify-center rounded-md border transition-all ${
                                    isActive 
                                      ? (isBool ? "bg-emerald-500 border-emerald-500 text-white shadow-sm" : "bg-red-500 border-red-500 text-white shadow-sm") 
                                      : isSkipped ? "bg-zinc-200 border-zinc-300 dark:bg-zinc-700 dark:border-zinc-600 text-zinc-500 dark:text-zinc-400 shadow-sm"
                                      : "border-gray-200 dark:border-zinc-700 bg-gray-50/50 dark:bg-zinc-800/50 text-transparent hover:border-gray-400 dark:hover:border-zinc-500 hover:text-gray-300 dark:hover:text-zinc-500"
                                  }`}>
                                    {isSkipped ? <SkipForward className="h-4 w-4" /> : isBool ? <Check className="h-4 w-4" /> : <XIcon className="h-4 w-4" />}
                                  </button>
                                </form>
                                {(!log || !isSkipped) && (
                                  <form action={async (formData) => { await logTrackerEntry(formData); toast.success("Skipped"); }} className="absolute -top-2 -right-2 opacity-0 group-hover/cell:opacity-100 transition-opacity z-10">
                                    <input type="hidden" name="trackerId" value={tracker.id} />
                                    <input type="hidden" name="date" value={dateIso} />
                                    <input type="hidden" name="status" value="Skipped" />
                                    <button type="submit" title="Skip Day" className="bg-zinc-100 dark:bg-zinc-700 border border-zinc-300 dark:border-zinc-500 text-zinc-500 dark:text-zinc-300 rounded-full p-0.5 hover:bg-zinc-200 dark:hover:bg-zinc-600 shadow-sm">
                                      <SkipForward className="h-3 w-3" />
                                    </button>
                                  </form>
                                )}
                              </div>
                            );
                          }

                          if (isToday) {
                            return (
                              <div key={i} className="w-10 flex justify-center relative group/input">
                                {tracker.type === "RATING" ? (
                                  <form action={async (formData) => { await logTrackerEntry(formData); toast.success("Saved"); }} className="flex flex-col items-center">
                                    <input type="hidden" name="trackerId" value={tracker.id} />
                                    <input type="hidden" name="date" value={dateIso} />
                                    <select name="value" defaultValue={log?.value || ""} onChange={(e) => e.target.form?.requestSubmit()} className="h-8 w-10 text-xs border border-gray-300 dark:border-zinc-600 rounded text-center appearance-none bg-white dark:bg-zinc-900 cursor-pointer focus:ring-1 focus:ring-blue-500 pl-1 dark:text-zinc-100">
                                      <option value="">-</option>
                                      {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                                    </select>
                                  </form>
                                ) : (
                                  <form action={async (formData) => { await logTrackerEntry(formData); toast.success("Saved"); }} className="flex flex-col items-center">
                                    <input type="hidden" name="trackerId" value={tracker.id} />
                                    <input type="hidden" name="date" value={dateIso} />
                                    <input 
                                      type="number" 
                                      name="value" 
                                      defaultValue={log?.value || ""} 
                                      placeholder="-" 
                                      onBlur={(e) => { if(e.target.value !== (log?.value?.toString()||"")) e.target.form?.requestSubmit() }}
                                      className="h-8 w-10 text-xs text-center border border-gray-300 dark:border-zinc-600 rounded bg-white dark:bg-zinc-900 focus:ring-1 focus:ring-blue-500 p-0 dark:text-zinc-100" 
                                    />
                                  </form>
                                )}
                              </div>
                            );
                          } else {
                            return (
                              <div key={i} title={log ? `${log.value} ${tracker.unit||''}` : "No data"} className="w-10 flex justify-center items-center">
                                <div className={`flex h-8 w-8 items-center justify-center rounded-md border ${
                                  log 
                                    ? (isSuccess ? "bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400" : "bg-blue-50 dark:bg-blue-900/30 border-blue-100 dark:border-blue-800 text-blue-700 dark:text-blue-400") 
                                    : "bg-gray-50/50 dark:bg-zinc-800/50 border-gray-100 dark:border-zinc-800 text-gray-300 dark:text-zinc-500"
                                }`}>
                                  <span className="text-[10px] font-bold">{log ? log.value : '-'}</span>
                                </div>
                              </div>
                            );
                          }
                        })}
                      </div>

                      {/* Delete Button */}
                      <div className="absolute top-1/2 -translate-y-1/2 -right-6 hidden group-hover:block">
                        <form action={async () => { await deleteTracker(tracker.id); toast.success("Deleted"); }}>
                          <button type="submit" className="p-1.5 bg-white dark:bg-zinc-800 rounded-md border border-gray-200 dark:border-zinc-700 text-red-500 shadow-sm hover:bg-red-50 dark:hover:bg-red-900/20 transition"><Trash2 className="h-3.5 w-3.5" /></button>
                        </form>
                      </div>
                    </div>
                    
                    {/* Expanded Analytics View */}
                    {isExpanded && (
                      <div className="border-t border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50 p-4">
                        <TrackerAnalytics tracker={tracker} stats={stats} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-zinc-800 text-gray-400 dark:text-zinc-500 mb-4">
              <Flame className="h-6 w-6" />
            </div>
            <p className="text-base font-medium text-gray-900 dark:text-zinc-100">No habits tracked yet</p>
            <p className="text-sm text-gray-500 dark:text-zinc-500 mt-1 max-w-sm">Build consistency by adding habits, abstinence rules, and daily goals to your sheet.</p>
          </div>
        )}

        {/* Add Tracker Form */}
        <div className="mt-8 border-t border-gray-100 dark:border-zinc-800 pt-6">
          {!showForm ? (
            <button onClick={() => setShowForm(true)} className="flex items-center gap-2 rounded-lg border-2 border-dashed border-gray-300 dark:border-zinc-700 px-4 py-3 text-sm font-medium text-gray-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-600 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition">
              <Plus className="h-4 w-4" /> Add New Habit
            </button>
          ) : (
            <form action={async (data) => { await createTracker(data); setShowForm(false); toast.success("Habit created"); }} className="max-w-xl space-y-4 bg-white dark:bg-zinc-900 p-5 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-gray-900 dark:text-zinc-100">Create Habit</span>
                <button type="button" onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300"><XIcon className="h-5 w-5" /></button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1 space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700 dark:text-zinc-300">Habit Name</label>
                  <input type="text" name="title" required placeholder="e.g. Morning Run" className="w-full rounded-md border border-gray-300 dark:border-zinc-700 px-3 py-2 text-sm text-gray-900 dark:text-zinc-100 placeholder:text-gray-400 dark:placeholder:text-zinc-600 dark:bg-zinc-800 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none" />
                </div>
                <div className="col-span-2 sm:col-span-1 space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700 dark:text-zinc-300">Type</label>
                  <select name="type" className="w-full rounded-md border border-gray-300 dark:border-zinc-700 px-3 py-2 text-sm text-gray-900 dark:text-zinc-100 dark:bg-zinc-800 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none">
                    <option value="BOOLEAN">Boolean (Yes/No)</option>
                    <option value="ABSTINENCE">Abstinence (Avoid)</option>
                    <option value="QUANTITY">Quantity (e.g. 3 Liters)</option>
                    <option value="DURATION">Duration (e.g. 60 Mins)</option>
                    <option value="COUNTER">Counter (e.g. 10 Pages)</option>
                    <option value="RATING">Rating (1-5 Scale)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700 dark:text-zinc-300">Target Value (Optional)</label>
                  <input type="number" name="targetValue" placeholder="e.g. 30" className="w-full rounded-md border border-gray-300 dark:border-zinc-700 px-3 py-2 text-sm text-gray-900 dark:text-zinc-100 placeholder:text-gray-400 dark:placeholder:text-zinc-600 dark:bg-zinc-800 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700 dark:text-zinc-300">Unit (Optional)</label>
                  <input type="text" name="unit" placeholder="e.g. Mins, Pages" className="w-full rounded-md border border-gray-300 dark:border-zinc-700 px-3 py-2 text-sm text-gray-900 dark:text-zinc-100 placeholder:text-gray-400 dark:placeholder:text-zinc-600 dark:bg-zinc-800 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700 dark:text-zinc-300">Frequency Target (Optional)</label>
                  <input type="number" name="frequencyTarget" placeholder="e.g. 3 (times per week)" className="w-full rounded-md border border-gray-300 dark:border-zinc-700 px-3 py-2 text-sm text-gray-900 dark:text-zinc-100 placeholder:text-gray-400 dark:placeholder:text-zinc-600 dark:bg-zinc-800 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700 dark:text-zinc-300">Specific Days (Optional)</label>
                  <input type="text" name="frequencyDays" placeholder="e.g. Mon,Wed,Fri" className="w-full rounded-md border border-gray-300 dark:border-zinc-700 px-3 py-2 text-sm text-gray-900 dark:text-zinc-100 placeholder:text-gray-400 dark:placeholder:text-zinc-600 dark:bg-zinc-800 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none" />
                </div>
              </div>

              <input type="hidden" name="frequency" value="DAILY" />
              
              <div className="pt-2">
                <button type="submit" className="w-full flex justify-center items-center gap-2 rounded-md bg-gray-900 dark:bg-white py-2.5 text-sm font-semibold text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 transition">
                  <Check className="h-4 w-4" /> Save Habit
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
