import { FolderKanban, Plus, Trash2, CheckCircle2 } from "lucide-react";
import { getProjects, createProject, getGoals, deleteProject, createTask, toggleTaskStatus } from "@/app/actions";

export default async function ProjectsPage() {
  const [projects, goals] = await Promise.all([getProjects(), getGoals()]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
      </div>

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Create New Project</h2>
        <form action={createProject} className="grid gap-4 md:grid-cols-4 items-end">
          <div className="space-y-1 md:col-span-1">
            <label className="text-sm font-medium text-gray-700">Project Title</label>
            <input
              name="title"
              required
              type="text"
              placeholder="e.g. LifeOS Redesign"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div className="space-y-1 md:col-span-1">
            <label className="text-sm font-medium text-gray-700">Description</label>
            <input
              name="description"
              type="text"
              placeholder="Brief description"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div className="space-y-1 md:col-span-1">
            <label className="text-sm font-medium text-gray-700">Linked Goal</label>
            <select
              name="goalId"
              defaultValue=""
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="">No linked goal</option>
              {goals.map((goal) => (
                <option key={goal.id} value={goal.id}>
                  {goal.title}
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-1">
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition h-[38px]"
            >
              <Plus className="h-4 w-4" />
              Add Project
            </button>
          </div>
        </form>
      </div>

      {projects.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-white p-12 text-center shadow-sm">
          <FolderKanban className="mx-auto h-12 w-12 text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">
            No projects yet. Create your first project above!
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((project) => {
            const totalTasks = project.tasks?.length || 0;
            const doneTasks =
              project.tasks?.filter((task) => task.status === "Done").length || 0;
            const progress =
              totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;
            const deleteAction = deleteProject.bind(null, project.id);

            return (
              <div
                key={project.id}
                className="rounded-xl border bg-white p-6 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 shrink-0">
                        <FolderKanban className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold">{project.title}</h2>
                        {project.goal?.title && (
                          <p className="text-sm text-gray-500">{project.goal.title}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${
                          project.status === "Active"
                            ? "bg-green-50 text-green-700 ring-green-600/20"
                            : project.status === "Completed"
                            ? "bg-blue-50 text-blue-700 ring-blue-600/20"
                            : project.status === "Paused"
                            ? "bg-yellow-50 text-yellow-700 ring-yellow-600/20"
                            : "bg-gray-50 text-gray-600 ring-gray-500/10"
                        }`}
                      >
                        {project.status}
                      </span>
                      <form action={deleteAction}>
                        <button
                          type="submit"
                          className="p-1 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
                          title="Delete project"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </form>
                    </div>
                  </div>

                  <p className="text-sm text-gray-500 mb-6">
                    {project.description || "No description provided."}
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <div className="flex items-center gap-2 text-gray-500">
                      <CheckCircle2 className="h-4 w-4 text-gray-400" />
                      <span>
                        {doneTasks} / {totalTasks} tasks
                      </span>
                    </div>
                    <span className="font-medium">{progress}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-100 mb-4">
                    <div
                      className="h-2 rounded-full bg-blue-600 transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <div className="border-t border-gray-100 pt-4 mt-4">
                    {project.tasks && project.tasks.length > 0 && (
                      <ul className="space-y-2 mb-4">
                        {project.tasks.map((task) => {
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
                                      <div className="h-4 w-4 rounded-full border-2 border-gray-300 group-hover:border-blue-500 transition-colors" />
                                    )}
                                  </button>
                                </form>
                                <span
                                  className={`text-sm truncate ${
                                    isTaskDone ? "text-gray-400 line-through" : "text-gray-700"
                                  }`}
                                >
                                  {task.title}
                                </span>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    )}

                    <form action={createTask} className="relative flex items-center mt-2">
                      <input type="hidden" name="projectId" value={project.id} />
                      <input type="hidden" name="goalId" value={project.goalId || ""} />
                      <div className="absolute left-2 text-gray-400">
                        <Plus className="h-4 w-4" />
                      </div>
                      <input
                        name="title"
                        required
                        type="text"
                        placeholder="Add task to project..."
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
