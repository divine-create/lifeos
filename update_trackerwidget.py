import re

with open("src/components/TrackerWidget.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Add imports
imports = """import { useState } from "react";
import { Plus, Flame, Check, X as XIcon, Trash2, BarChart2, SkipForward, Trophy } from "lucide-react";
import { createTracker, logTrackerEntry, deleteTracker } from "@/app/actions";
import toast from "react-hot-toast";
import { calculateTrackerStats } from "@/lib/trackerStats";
import { TrackerAnalytics } from "@/components/TrackerAnalytics";"""

content = re.sub(r'import \{ useState \} from "react";.*?import toast from "react-hot-toast";', imports, content, flags=re.DOTALL)

# Add state for expanded tracker
content = content.replace('const [showForm, setShowForm] = useState(false);', 'const [showForm, setShowForm] = useState(false);\n  const [expandedId, setExpandedId] = useState<string | null>(null);')

# Calculate stats inside map
tracker_render_start = """              {trackers.map((tracker) => {
                const stats = calculateTrackerStats(tracker);
                const isExpanded = expandedId === tracker.id;"""
content = re.sub(r'              \{trackers.map\(\(tracker\) => \{', tracker_render_start, content)

# Expand wrapper
wrapper_open = """                  <div key={tracker.id} className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-100 dark:border-zinc-800 shadow-sm overflow-hidden transition-all hover:border-gray-200 dark:hover:border-zinc-700">
                    <div className="group relative flex items-center justify-between p-3">"""
content = re.sub(r'                  <div key=\{tracker\.id\} className="group relative flex items-center justify-between rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800/50 p-2 transition border border-transparent hover:border-gray-100 dark:hover:border-zinc-700">', wrapper_open, content)

# Add Streaks to Left side
left_side = """                    {/* Left: Tracker Info */}
                    <div className="w-1/3 min-w-[200px] pr-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setExpandedId(isExpanded ? null : tracker.id)} className="text-gray-400 hover:text-blue-500 transition">
                          <BarChart2 className="h-4 w-4" />
                        </button>
                        <p className="text-sm font-semibold text-gray-900 dark:text-zinc-100 truncate">{tracker.title}</p>
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <p className="text-[10px] text-gray-500 dark:text-zinc-500 uppercase tracking-wider truncate">
                          {tracker.type} {tracker.targetValue ? •   : ''}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="flex items-center gap-1 text-[10px] font-bold text-orange-500 bg-orange-50 dark:bg-orange-900/20 px-1.5 py-0.5 rounded">
                            <Flame className="h-3 w-3" /> {stats.currentStreak}
                          </span>
                          <span className="flex items-center gap-1 text-[10px] font-bold text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 px-1.5 py-0.5 rounded">
                            <Trophy className="h-3 w-3" /> {stats.longestStreak}
                          </span>
                        </div>
                      </div>
                    </div>"""
content = re.sub(r'                    \{\/\* Left: Tracker Info \*\/.*?<\/div>', left_side, content, flags=re.DOTALL)

# Add Skip button to boolean/abstinence form
skip_btn = """                              <button type="submit" className={lex h-8 w-8 items-center justify-center rounded-md border transition-all }>
                                {log?.status === "Skipped" ? <SkipForward className="h-4 w-4" /> : isBool ? <Check className="h-4 w-4" /> : <XIcon className="h-4 w-4" />}
                              </button>
                            </form>
                            {!log && (
                              <form action={async (formData) => { await logTrackerEntry(formData); toast.success("Skipped"); }} className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <input type="hidden" name="trackerId" value={tracker.id} />
                                <input type="hidden" name="date" value={dateIso} />
                                <input type="hidden" name="status" value="Skipped" />
                                <button type="submit" title="Skip Day" className="bg-zinc-100 border border-zinc-300 text-zinc-500 rounded-full p-0.5 hover:bg-zinc-200 shadow-sm">
                                  <SkipForward className="h-3 w-3" />
                                </button>
                              </form>
                            )}
                          </div>"""

# Wait, orm is inside a div? No, I need to wrap the orm in a div relative group.
boolean_form = """                        if (tracker.type === "BOOLEAN" || tracker.type === "ABSTINENCE") {
                          const isBool = tracker.type === "BOOLEAN";
                          const isActive = isBool ? isSuccess : isFailed;
                          
                          return (
                            <div key={i} className="relative group/cell w-10 flex justify-center">
                              <form action={async (formData) => { await logTrackerEntry(formData); toast.success("Saved"); }}>
                                <input type="hidden" name="trackerId" value={tracker.id} />
                                <input type="hidden" name="date" value={dateIso} />
                                {!isBool && <input type="hidden" name="status" value="Failed" />}
                                {isActive && <input type="hidden" name="toggleOff" value="true" />}
                                
                                <button type="submit" className={lex h-8 w-8 items-center justify-center rounded-md border transition-all }>
                                  {log?.status === "Skipped" ? <SkipForward className="h-4 w-4" /> : isBool ? <Check className="h-4 w-4" /> : <XIcon className="h-4 w-4" />}
                                </button>
                              </form>
                              {(!log || log.status !== "Skipped") && (
                                <form action={async (formData) => { await logTrackerEntry(formData); toast.success("Skipped"); }} className="absolute -top-1.5 -right-1.5 opacity-0 group-hover/cell:opacity-100 transition-opacity z-10">
                                  <input type="hidden" name="trackerId" value={tracker.id} />
                                  <input type="hidden" name="date" value={dateIso} />
                                  <input type="hidden" name="status" value="Skipped" />
                                  <button type="submit" title="Skip Day" className="bg-zinc-100 dark:bg-zinc-700 border border-zinc-300 dark:border-zinc-500 text-zinc-500 dark:text-zinc-300 rounded-full p-0.5 hover:bg-zinc-200 dark:hover:bg-zinc-600 shadow-sm">
                                    <SkipForward className="h-2.5 w-2.5" />
                                  </button>
                                </form>
                              )}
                            </div>
                          );
                        }"""
content = re.sub(r'                        if \(tracker.type === "BOOLEAN".*?                            \);.*?                        \}', boolean_form, content, flags=re.DOTALL)

# Add Expanded Analytics block and close the wrapper
analytics_block = """                    </div>
                    {isExpanded && (
                      <div className="border-t border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50 p-4">
                        <TrackerAnalytics tracker={tracker} stats={stats} />
                      </div>
                    )}
                  </div>"""
content = re.sub(r'                    <\/div>\s+<\/div>', analytics_block, content)

with open("src/components/TrackerWidget.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated TrackerWidget.tsx")
