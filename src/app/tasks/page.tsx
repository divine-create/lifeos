import { Circle, CheckCircle2, Plus, Trash2, Clock } from "lucide-react";
import { getTasks, createTask, toggleTaskStatus, deleteTask } from "@/app/actions";

export default async function TasksPage() {
  const tasks = await getTasks();

  const activeTasks = tasks.filter((task) => task.status !== "Done");
  const completedTasks = tasks.filter((task) => task.status === "Done");

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
      </div>

      {/* Create Task Form */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Add Task</h2>
        <form action={createTask} className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1 w-full space-y-1">
            <label htmlFor="task-title" className="text-sm font-medium text-gray-700">
              Task Title
            </label>
            <input
              id="task-title"
              name="title"
              required
              type="text"
              placeholder="What needs to be done?"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <div className="w-full sm:w-36 space-y-1">
            <label htmlFor="task-priority" className="text-sm font-medium text-gray-700">
              Priority
            </label>
            <select
              id="task-priority"
              name="priority"
              defaultValue="Medium"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <button
            type="submit"
            className="flex items-center justify-center gap-2 rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition h-[38px] w-full sm:w-auto"
          >
            <Plus className="h-4 w-4" />
            Add Task
          </button>
        </form>
      </div>

      {/* Task List or Empty State */}
      {tasks.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center shadow-sm">
          <p className="text-gray-500 font-medium">No tasks yet. Add your first task above!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Active Tasks Section */}
          <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
            <div className="border-b bg-gray-50/50 px-6 py-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-700">
                ACTIVE TASKS ({activeTasks.length})
              </h2>
            </div>
            {activeTasks.length === 0 ? (
              <div className="px-6 py-8 text-center text-sm text-gray-500">
                No active tasks. Great job!
              </div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {activeTasks.map((task) => {
                  const toggleAction = toggleTaskStatus.bind(null, task.id, task.status);
                  const deleteAction = deleteTask.bind(null, task.id);

                  return (
                    <li
                      key={task.id}
                      className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition"
                    >
                      <form action={toggleAction}>
                        <button
                          type="submit"
                          className="flex items-center justify-center text-gray-400 hover:text-black transition"
                          title="Mark as done"
                        >
                          <Circle className="h-5 w-5" />
                        </button>
                      </form>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {task.title}
                        </p>
                      </div>

                      {task.estimatedTime && (
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock className="h-3.5 w-3.5" />
                          <span>{task.estimatedTime}m</span>
                        </div>
                      )}

                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${
                          task.priority === "High"
                            ? "bg-red-50 text-red-700 ring-red-600/20"
                            : task.priority === "Low"
                            ? "bg-blue-50 text-blue-700 ring-blue-700/10"
                            : "bg-yellow-50 text-yellow-800 ring-yellow-600/20"
                        }`}
                      >
                        {task.priority}
                      </span>

                      <form action={deleteAction}>
                        <button
                          type="submit"
                          className="flex items-center justify-center text-gray-400 hover:text-red-600 transition p-1"
                          title="Delete task"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </form>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Completed Tasks Section */}
          {completedTasks.length > 0 && (
            <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
              <div className="border-b bg-gray-50/50 px-6 py-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-gray-500">
                  COMPLETED TASKS ({completedTasks.length})
                </h2>
              </div>
              <ul className="divide-y divide-gray-100">
                {completedTasks.map((task) => {
                  const toggleAction = toggleTaskStatus.bind(null, task.id, task.status);
                  const deleteAction = deleteTask.bind(null, task.id);

                  return (
                    <li
                      key={task.id}
                      className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition opacity-75"
                    >
                      <form action={toggleAction}>
                        <button
                          type="submit"
                          className="flex items-center justify-center text-green-500 hover:text-green-600 transition"
                          title="Mark as active"
                        >
                          <CheckCircle2 className="h-5 w-5" />
                        </button>
                      </form>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-400 line-through truncate">
                          {task.title}
                        </p>
                      </div>

                      {task.estimatedTime && (
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <Clock className="h-3.5 w-3.5" />
                          <span>{task.estimatedTime}m</span>
                        </div>
                      )}

                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${
                          task.priority === "High"
                            ? "bg-red-50/50 text-red-600 ring-red-600/10"
                            : task.priority === "Low"
                            ? "bg-blue-50/50 text-blue-600 ring-blue-700/10"
                            : "bg-yellow-50/50 text-yellow-700 ring-yellow-600/10"
                        }`}
                      >
                        {task.priority}
                      </span>

                      <form action={deleteAction}>
                        <button
                          type="submit"
                          className="flex items-center justify-center text-gray-400 hover:text-red-600 transition p-1"
                          title="Delete task"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </form>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
