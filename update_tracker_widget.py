import re

content = """
"use client";

import { useState } from "react";
import { Plus, Flame, Check, X as XIcon, Trash2, Edit2 } from "lucide-react";
import { createTracker, logTrackerEntry, deleteTracker } from "@/app/actions";
import toast from "react-hot-toast";

export function TrackerWidget({ trackers }: { trackers: any[] }) {
  const [showForm, setShowForm] = useState(false);
  
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
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-200 px-2">
              <div className="w-1/3 font-semibold text-xs text-gray-500 uppercase tracking-wider">Habit</div>
              <div className="flex-1 flex justify-end gap-2">
                {last7Days.map((d, i) => (
                  <div key={i} className="w-10 text-center">
                    <div className="text-[10px] text-gray-400 font-medium uppercase">{d.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                    <div className={\	ext-xs font-bold \\}>{d.getDate()}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tracker Rows */}
            <div className="space-y-1">
              {trackers.map((tracker) => {
                return (
                  <div key={tracker.id} className="group relative flex items-center justify-between rounded-lg hover:bg-gray-50 p-2 transition border border-transparent hover:border-gray-100">
                    
                    {/* Left: Tracker Info */}
                    <div className="w-1/3 min-w-[200px] pr-4">
                      <p className="text-sm font-semibold text-gray-900 truncate">{tracker.title}</p>
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider truncate">
                        {tracker.type} {tracker.targetValue ? \• \ \\ : ''}
                      </p>
                    </div>
                    
                    {/* Right: 7-Day Grid */}
                    <div className="flex-1 flex justify-end gap-2">
                      {last7Days.map((d, i) => {
                        const isToday = i === 6;
                        const log = getLogForDate(tracker, d);
                        const isSuccess = log?.status === "Successful";
                        const isFailed = log?.status === "Failed";
                        
                        const dateIso = d.toISOString();

                        // For Booleans / Abstinence, make the cell itself a toggle button (even for past days!)
                        if (tracker.type === "BOOLEAN" || tracker.type === "ABSTINENCE") {
                          const isBool = tracker.type === "BOOLEAN";
                          const isActive = isBool ? isSuccess : isFailed;
                          
                          return (
                            <form key={i} action={async (formData) => { await logTrackerEntry(formData); toast.success("Saved"); }} className="w-10 flex justify-center">
                              <input type="hidden" name="trackerId" value={tracker.id} />
                              <input type="hidden" name="date" value={dateIso} />
                              {!isBool && <input type="hidden" name="status" value="Failed" />}
                              {isActive && <input type="hidden" name="toggleOff" value="true" />}
                              
                              <button type="submit" className={\lex h-8 w-8 items-center justify-center rounded-md border transition-all \\}>
                                {isBool ? <Check className="h-4 w-4" /> : <XIcon className="h-4 w-4" />}
                              </button>
                            </form>
                          );
                        }

                        // For Quantity/Duration/Counter/Rating
                        // If it's today, show the interactive input. If past, show a colored square with value.
                        if (isToday) {
                          return (
                            <div key={i} className="w-10 flex justify-center relative group/input">
                              {tracker.type === "RATING" ? (
                                <form action={async (formData) => { await logTrackerEntry(formData); toast.success("Saved"); }} className="flex flex-col items-center">
                                  <input type="hidden" name="trackerId" value={tracker.id} />
                                  <input type="hidden" name="date" value={dateIso} />
                                  <select name="value" defaultValue={log?.value || ""} onChange={(e) => e.target.form?.requestSubmit()} className="h-8 w-10 text-xs border border-gray-300 rounded text-center appearance-none bg-white cursor-pointer focus:ring-1 focus:ring-blue-500 pl-1">
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
                                    className="h-8 w-10 text-xs text-center border border-gray-300 rounded bg-white focus:ring-1 focus:ring-blue-500 p-0" 
                                  />
                                </form>
                              )}
                            </div>
                          );
                        } else {
                          // Past days for quantitative trackers: show a small static block
                          return (
                            <div key={i} title={log ? \\ \\ : "No data"} className="w-10 flex justify-center items-center">
                              <div className={\lex h-8 w-8 items-center justify-center rounded-md border \\}>
                                <span className="text-[10px] font-bold">{log ? log.value : '-'}</span>
                              </div>
                            </div>
                          );
                        }
                      })}
                    </div>

                    {/* Delete Button (hover only) */}
                    <div className="absolute top-1/2 -translate-y-1/2 -right-6 hidden group-hover:block">
                      <form action={async () => { await deleteTracker(tracker.id); toast.success("Deleted"); }}>
                        <button type="submit" className="p-1.5 bg-white rounded-md border border-gray-200 text-red-500 shadow-sm hover:bg-red-50 transition"><Trash2 className="h-3.5 w-3.5" /></button>
                      </form>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400 mb-4">
              <Flame className="h-6 w-6" />
            </div>
            <p className="text-base font-medium text-gray-900">No habits tracked yet</p>
            <p className="text-sm text-gray-500 mt-1 max-w-sm">Build consistency by adding habits, abstinence rules, and daily goals to your sheet.</p>
          </div>
        )}

        {/* Add Tracker Form */}
        <div className="mt-8 border-t border-gray-100 pt-6">
          {!showForm ? (
            <button onClick={() => setShowForm(true)} className="flex items-center gap-2 rounded-lg border-2 border-dashed border-gray-300 px-4 py-3 text-sm font-medium text-gray-600 hover:text-blue-600 hover:border-blue-600 hover:bg-blue-50/50 transition">
              <Plus className="h-4 w-4" /> Add New Habit
            </button>
          ) : (
            <form action={async (data) => { await createTracker(data); setShowForm(false); toast.success("Habit created"); }} className="max-w-xl space-y-4 bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-gray-900">Create Habit</span>
                <button type="button" onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600"><XIcon className="h-5 w-5" /></button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1 space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700">Habit Name</label>
                  <input type="text" name="title" required placeholder="e.g. Morning Run" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none" />
                </div>
                <div className="col-span-2 sm:col-span-1 space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700">Type</label>
                  <select name="type" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none">
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
                  <label className="text-xs font-semibold text-gray-700">Target Value (Optional)</label>
                  <input type="number" name="targetValue" placeholder="e.g. 30" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700">Unit (Optional)</label>
                  <input type="text" name="unit" placeholder="e.g. Mins, Pages" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none" />
                </div>
              </div>

              <input type="hidden" name="frequency" value="DAILY" />
              
              <div className="pt-2">
                <button type="submit" className="w-full flex justify-center items-center gap-2 rounded-md bg-gray-900 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 transition">
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
"""

with open("src/components/TrackerWidget.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Updated TrackerWidget.tsx to a full Habit Tracker Sheet!")
