"use client";

import { useState } from "react";
import { Plus, Flame, Check, X as XIcon, Trash2 } from "lucide-react";
import { createTracker, logTrackerEntry, deleteTracker } from "@/app/actions";

export function TrackerWidget({ trackers }: { trackers: any[] }) {
  const [showForm, setShowForm] = useState(false);
  
  const todayDateStr = new Date().toISOString().split("T")[0];

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex flex-col justify-between">
        {trackers.length > 0 ? (
          <div className="space-y-3">
            {trackers.map((tracker) => {
              const todayLog = tracker.logs?.find((log: any) => {
                const logDateStr = new Date(log.date).toISOString().split("T")[0];
                return logDateStr === todayDateStr || new Date(log.date).toDateString() === new Date().toDateString();
              });

              return (
                <div key={tracker.id} className="group relative flex flex-col justify-between rounded-lg border border-gray-100 bg-gray-50/30 hover:bg-gray-50 p-3 transition">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{tracker.title}</p>
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider">{tracker.type}</p>
                    </div>
                    
                    {/* Log Actions based on Type */}
                    <div className="flex items-center gap-2">
                      {tracker.type === "BOOLEAN" && (
                        <form action={logTrackerEntry}>
                          <input type="hidden" name="trackerId" value={tracker.id} />
                          {todayLog?.status === "Successful" && <input type="hidden" name="toggleOff" value="true" />}
                          <button type="submit" className={`flex h-7 w-7 items-center justify-center rounded-full border ${todayLog?.status === "Successful" ? "bg-green-500 border-green-500 text-white" : "border-gray-300 text-transparent hover:border-green-500"}`}>
                            <Check className="h-4 w-4" />
                          </button>
                        </form>
                      )}

                      {tracker.type === "ABSTINENCE" && (
                        <form action={logTrackerEntry}>
                          <input type="hidden" name="trackerId" value={tracker.id} />
                          <input type="hidden" name="status" value="Failed" />
                          {todayLog?.status === "Failed" && <input type="hidden" name="toggleOff" value="true" />}
                          <button type="submit" className={`px-3 py-1 rounded text-xs font-medium border ${todayLog?.status === "Failed" ? "bg-red-500 border-red-500 text-white" : "border-gray-300 text-gray-500 hover:border-red-500 hover:text-red-500"}`}>
                            {todayLog?.status === "Failed" ? "Failed" : "Fail"}
                          </button>
                        </form>
                      )}

                      {(tracker.type === "QUANTITY" || tracker.type === "DURATION" || tracker.type === "COUNTER") && (
                        <form action={logTrackerEntry} className="flex items-center gap-1">
                          <input type="hidden" name="trackerId" value={tracker.id} />
                          <input type="number" name="value" defaultValue={todayLog?.value || ""} placeholder={tracker.targetValue ? String(tracker.targetValue) : "0"} className="w-16 h-7 text-xs text-right border border-gray-300 rounded px-2" />
                          {tracker.unit && <span className="text-xs text-gray-500">{tracker.unit}</span>}
                          <button type="submit" className="px-2 h-7 bg-blue-100 text-blue-700 rounded text-xs font-medium ml-1">Save</button>
                        </form>
                      )}

                      {tracker.type === "RATING" && (
                        <form action={logTrackerEntry} className="flex items-center gap-1">
                          <input type="hidden" name="trackerId" value={tracker.id} />
                          <select name="value" defaultValue={todayLog?.value || ""} className="h-7 text-xs border border-gray-300 rounded pl-1 pr-4">
                            <option value="">-</option>
                            {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                          </select>
                          <button type="submit" className="px-2 h-7 bg-blue-100 text-blue-700 rounded text-xs font-medium">Save</button>
                        </form>
                      )}
                    </div>
                  </div>

                  {/* Delete Button (hover only) */}
                  <div className="absolute -top-2 -right-2 hidden group-hover:block">
                    <form action={() => deleteTracker(tracker.id)}>
                      <button type="submit" className="p-1 bg-white rounded-full border border-gray-200 text-red-500 shadow-sm hover:bg-red-50"><Trash2 className="h-3 w-3" /></button>
                    </form>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-6">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-400 mb-3">
              <Flame className="h-5 w-5" />
            </div>
            <p className="text-sm font-medium text-gray-700">No trackers yet</p>
            <p className="text-xs text-gray-500 mt-1">Add habits to track your discipline.</p>
          </div>
        )}

        {/* Add Tracker Form */}
        <div className="mt-6 border-t border-gray-100 pt-4">
          {!showForm ? (
            <button onClick={() => setShowForm(true)} className="w-full flex items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 py-2 text-sm text-gray-500 hover:text-blue-600 hover:border-blue-600 transition">
              <Plus className="h-4 w-4" /> Create Custom Tracker
            </button>
          ) : (
            <form action={(data) => { createTracker(data); setShowForm(false); }} className="space-y-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-gray-700">New Tracker</span>
                <button type="button" onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600"><XIcon className="h-4 w-4" /></button>
              </div>
              <input type="text" name="title" required placeholder="Tracker name (e.g. Exercise)" className="w-full rounded border border-gray-300 px-2 py-1.5 text-xs text-gray-900 placeholder:text-gray-400 focus:ring-1 focus:ring-blue-600" />
              
              <select name="type" className="w-full rounded border border-gray-300 px-2 py-1.5 text-xs text-gray-900 focus:ring-1 focus:ring-blue-600">
                <option value="BOOLEAN">Boolean (Yes/No)</option>
                <option value="ABSTINENCE">Abstinence (Don't do it)</option>
                <option value="QUANTITY">Quantity (e.g. 3 Liters)</option>
                <option value="DURATION">Duration (e.g. 60 Mins)</option>
                <option value="COUNTER">Counter (e.g. 10 Pages)</option>
                <option value="RATING">Rating (1-5 Scale)</option>
              </select>

              <div className="flex gap-2">
                <input type="number" name="targetValue" placeholder="Target (Opt.)" className="flex-1 rounded border border-gray-300 px-2 py-1.5 text-xs text-gray-900 placeholder:text-gray-400 focus:ring-1 focus:ring-blue-600" />
                <input type="text" name="unit" placeholder="Unit (Opt.)" className="flex-1 rounded border border-gray-300 px-2 py-1.5 text-xs text-gray-900 placeholder:text-gray-400 focus:ring-1 focus:ring-blue-600" />
              </div>

              <input type="hidden" name="frequency" value="DAILY" />
              <button type="submit" className="w-full flex justify-center items-center gap-1 rounded bg-blue-600 py-1.5 text-xs font-medium text-white hover:bg-blue-700 transition">
                <Plus className="h-3.5 w-3.5" /> Add Tracker
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
