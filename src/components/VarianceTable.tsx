"use client";

import { updateTaskTimes } from "@/app/actions";
import toast from "react-hot-toast";
import { CheckCircle2, Circle } from "lucide-react";

export function VarianceTable({ tasks }: { tasks: any[] }) {
  // Sort tasks by updated at so newest are on top, or just show active vs done
  const sortedTasks = [...tasks].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  if (tasks.length === 0) {
    return <div className="p-8 text-center text-sm text-gray-500 dark:text-zinc-500">No tasks to audit yet.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm text-gray-700 dark:text-zinc-300">
        <thead className="bg-gray-50 dark:bg-zinc-900/50 text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
          <tr>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Task</th>
            <th className="px-4 py-3 font-medium w-32">Estimated (m)</th>
            <th className="px-4 py-3 font-medium w-32">Actual (m)</th>
            <th className="px-4 py-3 font-medium w-32 text-right">Variance</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-zinc-800 bg-white dark:bg-zinc-900">
          {sortedTasks.map(task => {
            const est = task.estimatedTime;
            const act = task.actualTime;
            
            let varianceText = "-";
            let varianceColor = "text-gray-400";
            
            if (est !== null && act !== null) {
              const diff = act - est;
              if (diff > 0) {
                varianceText = `+${diff}m`;
                varianceColor = "text-red-500";
              } else if (diff < 0) {
                varianceText = `${diff}m`;
                varianceColor = "text-green-500";
              } else {
                varianceText = "0m";
                varianceColor = "text-blue-500";
              }
            }

            return (
              <tr key={task.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition">
                <td className="px-4 py-3 whitespace-nowrap">
                  {task.status === "Done" ? (
                    <span className="flex items-center gap-1.5 text-xs font-medium text-green-600 dark:text-green-400">
                      <CheckCircle2 className="h-4 w-4" /> Done
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-zinc-500">
                      <Circle className="h-4 w-4" /> Active
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 font-medium text-gray-900 dark:text-white max-w-[200px] truncate">
                  {task.title}
                </td>
                <td className="px-4 py-3">
                  <form action={async (fd) => { await updateTaskTimes(fd); toast.success("Saved"); }}>
                    <input type="hidden" name="id" value={task.id} />
                    <input type="hidden" name="actualTime" value={task.actualTime || ""} />
                    <input 
                      type="number" 
                      name="estimatedTime" 
                      defaultValue={task.estimatedTime || ""}
                      placeholder="-"
                      className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-700 rounded px-2 py-1 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                      onBlur={(e) => { if(e.target.value !== (task.estimatedTime?.toString()||"")) e.target.form?.requestSubmit() }}
                    />
                  </form>
                </td>
                <td className="px-4 py-3">
                  <form action={async (fd) => { await updateTaskTimes(fd); toast.success("Saved"); }}>
                    <input type="hidden" name="id" value={task.id} />
                    <input type="hidden" name="estimatedTime" value={task.estimatedTime || ""} />
                    <input 
                      type="number" 
                      name="actualTime" 
                      defaultValue={task.actualTime || ""}
                      placeholder="-"
                      className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-700 rounded px-2 py-1 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                      onBlur={(e) => { if(e.target.value !== (task.actualTime?.toString()||"")) e.target.form?.requestSubmit() }}
                    />
                  </form>
                </td>
                <td className={`px-4 py-3 text-right font-medium ${varianceColor}`}>
                  {varianceText}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
