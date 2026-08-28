"use client";

import { useState } from "react";
import { Plus, Flame, Check, X as XIcon, Trash2, BarChart2, SkipForward, Trophy, Settings, Activity } from "lucide-react";
import { createTracker, logTrackerEntry, deleteTracker } from "@/app/actions";
import toast from "react-hot-toast";
import { calculateTrackerStats } from "@/lib/trackerStats";
import { TrackerAnalytics } from "@/components/TrackerAnalytics";

export function TrackerWidget({ trackers }: { trackers: any[] }) {
  const [showForm, setShowForm] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  
  // Generate the last 7 days for the mini-trend
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

  const todayIso = new Date().toISOString();

  return (
    <div className="flex flex-col h-full w-full max-w-6xl mx-auto">
      
      {/* HEADER & ADD BUTTON */}
      <div className="flex items-center justify-between mb-6 px-2">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-zinc-100 flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-500" /> Habits
          </h2>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)} 
          className="flex items-center gap-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm font-medium transition shadow-sm"
        >
          {showForm ? <XIcon className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showForm ? "Cancel" : "New Habit"}
        </button>
      </div>

      {/* CREATE FORM */}
      {showForm && (
        <form action={async (data) => { await createTracker(data); setShowForm(false); toast.success("Habit created"); }} className="mb-8 max-w-2xl bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm animate-in fade-in slide-in-from-top-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 dark:text-zinc-300">Habit Name</label>
              <input type="text" name="title" required placeholder="e.g. Read 10 Pages" className="w-full rounded-lg border border-gray-300 dark:border-zinc-700 px-3 py-2 text-sm text-gray-900 dark:text-zinc-100 placeholder:text-gray-400 dark:bg-zinc-800 focus:ring-2 focus:ring-blue-600 outline-none" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 dark:text-zinc-300">Type</label>
              <select name="type" className="w-full rounded-lg border border-gray-300 dark:border-zinc-700 px-3 py-2 text-sm text-gray-900 dark:text-zinc-100 dark:bg-zinc-800 focus:ring-2 focus:ring-blue-600 outline-none">
                <option value="BOOLEAN">Yes / No (Checkbox)</option>
                <option value="QUANTITY">Quantity (Number)</option>
              </select>
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-semibold text-gray-700 dark:text-zinc-300">Target Value (Optional, for Quantity)</label>
              <div className="flex gap-2">
                <input type="number" name="targetValue" placeholder="e.g. 3" className="flex-1 rounded-lg border border-gray-300 dark:border-zinc-700 px-3 py-2 text-sm text-gray-900 dark:text-zinc-100 placeholder:text-gray-400 dark:bg-zinc-800 focus:ring-2 focus:ring-blue-600 outline-none" />
                <input type="text" name="unit" placeholder="Unit (e.g. Liters)" className="flex-1 rounded-lg border border-gray-300 dark:border-zinc-700 px-3 py-2 text-sm text-gray-900 dark:text-zinc-100 placeholder:text-gray-400 dark:bg-zinc-800 focus:ring-2 focus:ring-blue-600 outline-none" />
              </div>
            </div>
          </div>
          <input type="hidden" name="frequency" value="DAILY" />
          <div className="mt-4 flex justify-end">
            <button type="submit" className="rounded-lg bg-gray-900 dark:bg-zinc-100 px-6 py-2 text-sm font-semibold text-white dark:text-gray-900 hover:opacity-90 transition">
              Save Habit
            </button>
          </div>
        </form>
      )}

      {/* HABIT CARDS GRID */}
      {trackers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 pb-10">
          {trackers.map((tracker) => {
            const stats = calculateTrackerStats(tracker);
            const todayLog = getLogForDate(tracker, new Date());
            const isDone = todayLog?.status === "Successful";
            const isSkipped = todayLog?.status === "Skipped";

            return (
              <div key={tracker.id} className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col">
                
                {/* Card Header */}
                <div className="p-4 pb-2 flex justify-between items-start">
                  <div className="pr-2">
                    <h3 className="font-bold text-gray-900 dark:text-zinc-100 line-clamp-1">{tracker.title}</h3>
                    <p className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-zinc-500 font-medium mt-0.5">
                      {tracker.type} {tracker.targetValue ? `• ${tracker.targetValue} ${tracker.unit||''}` : ''}
                    </p>
                  </div>
                  <button onClick={() => setActiveModal(tracker.id)} className="text-gray-400 hover:text-blue-500 transition p-1">
                    <BarChart2 className="h-4 w-4" />
                  </button>
                </div>

                {/* Card Center (TODAY ACTION) */}
                <div className="flex-1 flex flex-col items-center justify-center py-6">
                  {tracker.type === "BOOLEAN" || tracker.type === "ABSTINENCE" ? (
                    <form action={async (formData) => { await logTrackerEntry(formData); toast.success(isDone ? "Unchecked" : "Done!"); }}>
                      <input type="hidden" name="trackerId" value={tracker.id} />
                      <input type="hidden" name="date" value={todayIso} />
                      {isDone && <input type="hidden" name="toggleOff" value="true" />}
                      <button 
                        type="submit" 
                        className={`h-20 w-20 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${
                          isDone 
                            ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/30 scale-105' 
                            : isSkipped 
                              ? 'bg-zinc-200 border-zinc-200 dark:bg-zinc-700 dark:border-zinc-700 text-zinc-500' 
                              : 'bg-transparent border-gray-200 dark:border-zinc-700 text-gray-300 dark:text-zinc-600 hover:border-emerald-200 dark:hover:border-emerald-900/50 hover:bg-emerald-50 dark:hover:bg-emerald-900/10'
                        }`}
                      >
                        {isSkipped ? <SkipForward className="h-8 w-8" /> : <Check className={`h-10 w-10 ${isDone ? 'opacity-100' : 'opacity-50'}`} strokeWidth={isDone ? 3 : 2} />}
                      </button>
                    </form>
                  ) : (
                    <form action={async (formData) => { await logTrackerEntry(formData); toast.success("Saved"); }} className="flex flex-col items-center">
                      <input type="hidden" name="trackerId" value={tracker.id} />
                      <input type="hidden" name="date" value={todayIso} />
                      <div className="relative">
                        <input 
                          type="number" 
                          name="value" 
                          defaultValue={todayLog?.value || ""} 
                          placeholder="0" 
                          onBlur={(e) => { if(e.target.value !== (todayLog?.value?.toString()||"")) e.target.form?.requestSubmit() }}
                          className="h-16 w-24 text-3xl font-bold text-center bg-transparent border-b-2 border-gray-200 dark:border-zinc-700 focus:border-blue-500 dark:focus:border-blue-500 outline-none text-gray-900 dark:text-zinc-100 transition-colors"
                        />
                      </div>
                      {tracker.unit && <span className="text-xs text-gray-500 dark:text-zinc-500 mt-2 font-medium uppercase tracking-widest">{tracker.unit}</span>}
                    </form>
                  )}
                </div>

                {/* Card Footer (Mini Trend & Streaks) */}
                <div className="bg-gray-50 dark:bg-zinc-800/50 px-4 py-3 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-between">
                  <div className="flex gap-1.5" title="Last 7 Days">
                    {last7Days.map((d, i) => {
                      const log = getLogForDate(tracker, d);
                      const s = log?.status;
                      let color = "bg-gray-200 dark:bg-zinc-700"; // empty
                      if (s === "Successful") color = "bg-emerald-500";
                      else if (s === "Skipped") color = "bg-gray-400 dark:bg-zinc-500";
                      else if (s === "Failed") color = "bg-red-500";
                      return <div key={i} className={`h-2.5 w-2.5 rounded-full ${color}`} />
                    })}
                  </div>
                  <div className="flex items-center gap-1.5 font-bold text-xs" title="Current Streak">
                    <Flame className={`h-4 w-4 ${stats.currentStreak > 0 ? 'text-orange-500' : 'text-gray-400 dark:text-zinc-600'}`} />
                    <span className={stats.currentStreak > 0 ? 'text-gray-900 dark:text-zinc-100' : 'text-gray-400 dark:text-zinc-600'}>{stats.currentStreak}</span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-20">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-zinc-800 text-gray-400 dark:text-zinc-500 mb-4">
            <Flame className="h-8 w-8" />
          </div>
          <p className="text-lg font-bold text-gray-900 dark:text-zinc-100">No habits tracked yet</p>
          <p className="text-sm text-gray-500 dark:text-zinc-500 mt-2 max-w-sm mx-auto">Click "New Habit" to start building your daily routines.</p>
        </div>
      )}

      {/* ANALYTICS & SETTINGS MODAL */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          {trackers.filter(t => t.id === activeModal).map(tracker => {
            const stats = calculateTrackerStats(tracker);
            return (
              <div key={tracker.id} className="relative w-full max-w-3xl bg-white dark:bg-zinc-950 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95">
                
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-zinc-800">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{tracker.title}</h2>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="flex items-center gap-1.5 text-sm font-bold text-orange-600 dark:text-orange-500 bg-orange-50 dark:bg-orange-900/20 px-2.5 py-1 rounded-md">
                        <Flame className="h-4 w-4" /> {stats.currentStreak} Streak
                      </span>
                      <span className="flex items-center gap-1.5 text-sm font-bold text-yellow-700 dark:text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 px-2.5 py-1 rounded-md">
                        <Trophy className="h-4 w-4" /> {stats.longestStreak} Best
                      </span>
                    </div>
                  </div>
                  <button onClick={() => setActiveModal(null)} className="p-2 bg-gray-100 dark:bg-zinc-900 hover:bg-gray-200 dark:hover:bg-zinc-800 rounded-full transition text-gray-500 dark:text-zinc-400">
                    <XIcon className="h-6 w-6" />
                  </button>
                </div>

                {/* Modal Body: Analytics */}
                <div className="p-6">
                  <TrackerAnalytics tracker={tracker} stats={stats} />
                </div>

                {/* Modal Footer: Actions */}
                <div className="p-6 bg-gray-50 dark:bg-zinc-900/50 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-between">
                  
                  {/* Skip Today Button */}
                  <form action={async (formData) => { await logTrackerEntry(formData); toast.success("Skipped Today"); setActiveModal(null); }}>
                    <input type="hidden" name="trackerId" value={tracker.id} />
                    <input type="hidden" name="date" value={todayIso} />
                    <input type="hidden" name="status" value="Skipped" />
                    <button type="submit" className="flex items-center gap-2 px-4 py-2 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-lg text-sm font-semibold transition">
                      <SkipForward className="h-4 w-4" /> Skip Today (Protect Streak)
                    </button>
                  </form>

                  {/* Delete Button */}
                  <form action={async () => { await deleteTracker(tracker.id); toast.success("Deleted"); setActiveModal(null); }}>
                    <button type="submit" className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-sm font-semibold transition">
                      <Trash2 className="h-4 w-4" /> Delete Habit
                    </button>
                  </form>

                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
