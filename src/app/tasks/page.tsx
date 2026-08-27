import { Circle, CheckCircle2, Plus, Trash2, Clock, Calendar as CalendarIcon, Tag, MoreHorizontal } from "lucide-react";
import { getTasks, createTask, toggleTaskStatus, deleteTask } from "@/app/actions";

export default async function TasksPage() {
  const tasks = await getTasks();

  const activeTasks = tasks.filter((task) => task.status !== "Done");
  const completedTasks = tasks.filter((task) => task.status === "Done");

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col pt-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 px-2">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Tasks</h1>
        <div className="flex gap-2">
          <button className="text-gray-400 hover:text-gray-600 p-1.5 rounded-md hover:bg-gray-100">
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Quick Add */}
      <div className="mb-6 px-2">
        <form action={createTask} className="relative flex items-center bg-white rounded-lg border border-gray-200 shadow-sm focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500 overflow-hidden">
          <div className="pl-3 pr-2 text-gray-400">
            <Plus className="h-5 w-5" />
          </div>
          <input
            name="title"
            required
            type="text"
            placeholder="Add a task to 'Tasks', press Enter to save"
            className="flex-1 py-3 text-[15px] focus:outline-none placeholder:text-gray-400 text-gray-800"
          />
          <div className="pr-3 flex items-center gap-2 text-gray-400">
            <button type="button" className="p-1 hover:text-gray-600"><CalendarIcon className="h-4 w-4" /></button>
            <button type="button" className="p-1 hover:text-gray-600"><Tag className="h-4 w-4" /></button>
          </div>
          <input type="hidden" name="priority" value="Medium" />
          {/* Hide actual submit button, allow Enter key */}
          <button type="submit" className="hidden">Add</button>
        </form>
      </div>

      {/* Lists */}
      <div className="flex-1 overflow-y-auto px-2 pb-20">
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center pt-20 text-gray-400">
            <CheckCircle2 className="h-16 w-16 mb-4 opacity-20" />
            <p className="text-[15px]">No tasks here.</p>
          </div>
        ) : (
          <div className="space-y-8">
            
            {/* Active */}
            <div>
              <ul className="space-y-0.5">
                {activeTasks.map((task) => {
                  const toggleAction = toggleTaskStatus.bind(null, task.id, task.status);
                  const deleteAction = deleteTask.bind(null, task.id);

                  return (
                    <li key={task.id} className="group flex items-center gap-3 py-2.5 px-2 rounded-lg hover:bg-[#f7f7f7] transition-colors border-b border-gray-100 last:border-0">
                      <form action={toggleAction} className="flex-shrink-0">
                        <button type="submit" className="flex items-center justify-center text-gray-300 hover:text-blue-500 transition-colors">
                          <Circle className="h-5 w-5" />
                        </button>
                      </form>

                      <div className="flex-1 min-w-0">
                        <p className="text-[15px] text-gray-800 truncate leading-snug">{task.title}</p>
                      </div>

                      <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <form action={deleteAction}>
                          <button type="submit" className="text-gray-400 hover:text-red-500 p-1 rounded hover:bg-white border border-transparent hover:border-gray-200">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </form>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Completed */}
            {completedTasks.length > 0 && (
              <div>
                <button className="flex items-center gap-2 text-xs font-semibold text-gray-500 mb-2 px-2 hover:text-gray-700 uppercase tracking-wider">
                  Completed
                </button>
                <ul className="space-y-0.5 opacity-60">
                  {completedTasks.map((task) => {
                    const toggleAction = toggleTaskStatus.bind(null, task.id, task.status);
                    const deleteAction = deleteTask.bind(null, task.id);

                    return (
                      <li key={task.id} className="group flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0">
                        <form action={toggleAction} className="flex-shrink-0">
                          <button type="submit" className="flex items-center justify-center text-blue-500">
                            <CheckCircle2 className="h-5 w-5" />
                          </button>
                        </form>

                        <div className="flex-1 min-w-0">
                          <p className="text-[14px] text-gray-500 line-through truncate leading-snug">{task.title}</p>
                        </div>

                        <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <form action={deleteAction}>
                            <button type="submit" className="text-gray-400 hover:text-red-500 p-1 rounded hover:bg-white">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </form>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
            
          </div>
        )}
      </div>
    </div>
  );
}
