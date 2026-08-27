import { Flag, Plus, Clock, CheckCircle2, Circle } from "lucide-react";
import { getMilestones, createMilestone, getGoals, createTask, toggleTaskStatus } from "@/app/actions";

export default async function MilestonesPage() {
  const [milestones, goals] = await Promise.all([
    getMilestones(),
    getGoals(),
  ]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Milestones</h1>
      </div>

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Create New Milestone</h2>
        <form action={createMilestone} className="grid gap-4 md:grid-cols-4 items-end">
          <div className="space-y-1 md:col-span-1">
            <label className="text-sm font-medium text-gray-700">Milestone Title</label>
            <input
              name="title"
              required
              type="text"
              placeholder="e.g. Complete MVP Phase 1"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div className="space-y-1 md:col-span-1">
            <label className="text-sm font-medium text-gray-700">Linked Goal</label>
            <select
              name="goalId"
              required
              defaultValue={goals[0]?.id || ""}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              {goals.length === 0 ? (
                <option value="" disabled>
                  No goals found — create a goal first
                </option>
              ) : (
                <>
                  <option value="" disabled>
                    Select a goal
                  </option>
                  {goals.map((goal) => (
                    <option key={goal.id} value={goal.id}>
                      {goal.title}
                    </option>
                  ))}
                </>
              )}
            </select>
          </div>
          <div className="space-y-1 md:col-span-1">
            <label className="text-sm font-medium text-gray-700">Deadline</label>
            <input
              name="deadline"
              type="date"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div className="md:col-span-1">
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition h-[38px]"
            >
              <Plus className="h-4 w-4" />
              Add Milestone
            </button>
          </div>
        </form>
      </div>

      {milestones.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-white p-12 text-center shadow-sm">
          <Flag className="mx-auto h-12 w-12 text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">
            No milestones yet. Create your first milestone above!
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {milestones.map((milestone) => {
            const totalTasks = milestone.tasks?.length || 0;
            const doneTasks =
              milestone.tasks?.filter((task) => task.status === "Done").length || 0;
            const progress =
              totalTasks > 0
                ? Math.round((doneTasks / totalTasks) * 100)
                : milestone.status === "Completed"
                ? 100
                : Math.round(milestone.progress || 0);
            const isCompleted =
              milestone.status === "Completed" ||
              (totalTasks > 0 && doneTasks === totalTasks);

            const deadlineFormatted = milestone.deadline
              ? new Date(milestone.deadline).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : null;

            return (
              <div
                key={milestone.id}
                className="rounded-xl border bg-white p-6 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-lg shrink-0 ${
                          isCompleted ? "bg-green-50" : "bg-orange-50"
                        }`}
                      >
                        <Flag
                          className={`h-5 w-5 ${
                            isCompleted ? "text-green-600" : "text-orange-600"
                          }`}
                        />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold">{milestone.title}</h2>
                        {milestone.goal?.title && (
                          <p className="text-sm text-gray-500">{milestone.goal.title}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${
                          isCompleted
                            ? "bg-green-50 text-green-700 ring-green-600/20"
                            : milestone.status === "In Progress"
                            ? "bg-blue-50 text-blue-700 ring-blue-600/20"
                            : "bg-gray-50 text-gray-600 ring-gray-500/10"
                        }`}
                      >
                        {milestone.status}
                      </span>
                      {deadlineFormatted && (
                        <div className="flex items-center justify-end gap-1 text-xs text-gray-400 mt-2">
                          <Clock className="h-3 w-3" />
                          {deadlineFormatted}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Progress</span>
                      <span className="text-gray-500">
                        {progress}% {totalTasks > 0 && `(${doneTasks}/${totalTasks} tasks)`}
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-100">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          isCompleted ? "bg-green-500" : "bg-blue-600"
                        }`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="border-t pt-4 mt-auto">
                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                      Tasks
                    </h3>
                    {milestone.tasks && milestone.tasks.length > 0 ? (
                      <ul className="space-y-2 mb-4">
                        {milestone.tasks.map((task) => {
                          const isTaskDone = task.status === "Done";
                          const toggleAction = toggleTaskStatus.bind(null, task.id, task.status);
                          return (
                            <li key={task.id} className="group flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                <form action={toggleAction} className="flex-shrink-0">
                                  <button type="submit" className="flex items-center justify-center hover:opacity-80 transition-opacity">
                                    {isTaskDone ? (
                                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                                    ) : (
                                      <Circle className="h-4 w-4 text-gray-300 hover:text-blue-500" />
                                    )}
                                  </button>
                                </form>
                                <span
                                  className={`text-sm truncate ${
                                    isTaskDone
                                      ? "text-gray-400 line-through"
                                      : "text-gray-700"
                                  }`}
                                >
                                  {task.title}
                                </span>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    ) : (
                      <p className="text-xs text-gray-400 italic mb-4">No tasks linked yet</p>
                    )}

                    {/* Quick Add Task to Milestone */}
                    <form action={createTask} className="relative flex items-center mt-2">
                      <input type="hidden" name="milestoneId" value={milestone.id} />
                      <input type="hidden" name="goalId" value={milestone.goalId || ""} />
                      <div className="absolute left-2 text-gray-400">
                        <Plus className="h-4 w-4" />
                      </div>
                      <input
                        name="title"
                        required
                        type="text"
                        placeholder="Add task..."
                        className="w-full bg-gray-50 border border-gray-200 rounded-md py-1.5 pl-8 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition-colors"
                      />
                      <button type="submit" className="hidden">Add</button>
                    </form>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
