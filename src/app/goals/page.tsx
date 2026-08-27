import { Target, Plus, Trash2, Edit2, Save } from "lucide-react";
import { getGoals, getGoalTypes, createGoal, deleteGoal, updateGoal } from "@/app/actions";

export default async function GoalsPage() {
  const goals = await getGoals();
  const goalTypes = await getGoalTypes();

  const getTypeBadgeClass = (type: string) => {
    switch (type?.toLowerCase()) {
      case "learning":
        return "bg-blue-50 text-blue-700 ring-blue-700/10";
      case "habit":
        return "bg-emerald-50 text-emerald-700 ring-emerald-700/10";
      case "achievement":
        return "bg-purple-50 text-purple-700 ring-purple-700/10";
      default:
        return "bg-gray-50 text-gray-700 ring-gray-700/10";
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
      case "on track":
        return "bg-green-50 text-green-700 ring-green-600/20";
      case "completed":
        return "bg-blue-50 text-blue-700 ring-blue-600/20";
      case "at risk":
        return "bg-yellow-50 text-yellow-800 ring-yellow-600/20";
      case "paused":
        return "bg-orange-50 text-orange-700 ring-orange-600/20";
      default:
        return "bg-gray-50 text-gray-600 ring-gray-500/10";
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Goals</h1>
      </div>

      {/* Create Goal Form */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Create New Goal</h2>
        <form action={createGoal} className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-4 items-start">
            <div className="flex-1 w-full space-y-1">
              <label htmlFor="title" className="text-sm font-medium text-gray-700">
                Goal Title
              </label>
              <input
                id="title"
                name="title"
                required
                type="text"
                placeholder="e.g. Master Machine Learning"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            
            <div className="flex-1 w-full space-y-1">
              <label htmlFor="milestoneTitle" className="text-sm font-medium text-gray-700">
                First Milestone <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <input
                id="milestoneTitle"
                name="milestoneTitle"
                type="text"
                placeholder="e.g. Complete Course 1"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="w-full md:w-48 space-y-1">
              <label htmlFor="type" className="text-sm font-medium text-gray-700">
                Type
              </label>
              <select
                id="type"
                name="type"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                {goalTypes.map(gt => (
                  <option key={gt.id} value={gt.name}>{gt.name}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex justify-end mt-2">
            <button
              type="submit"
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-md bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 transition h-[38px]"
            >
              <Plus className="h-4 w-4" />
              Add Goal
            </button>
          </div>
        </form>
      </div>

      {/* Goals Grid or Empty State */}
      {goals.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-white p-12 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 mb-4">
            <Target className="h-6 w-6 text-gray-400" />
          </div>
          <h3 className="text-base font-semibold text-gray-900">No goals yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            No goals yet. Create your first goal above!
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {goals.map((goal) => {
            const progress = Math.min(100, Math.max(0, Math.round(goal.progress || 0)));
            const deleteAction = deleteGoal.bind(null, goal.id);
            const updateAction = updateGoal.bind(null, goal.id);

            return (
              <div
                key={goal.id}
                className="rounded-xl border bg-white shadow-sm flex flex-col justify-between overflow-hidden"
              >
                {/* Main View */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3 gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${getTypeBadgeClass(
                          goal.type
                        )}`}
                      >
                        {goal.type}
                      </span>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${getStatusBadgeClass(
                          goal.status
                        )}`}
                      >
                        {goal.status}
                      </span>
                    </div>

                    <form action={deleteAction}>
                      <button
                        type="submit"
                        className="text-gray-400 hover:text-red-600 transition p-1 rounded-md hover:bg-red-50"
                        title="Delete goal"
                        aria-label="Delete goal"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </form>
                  </div>

                  <div className="flex items-start gap-2 mb-2">
                    <Target className="h-5 w-5 text-gray-400 shrink-0 mt-0.5" />
                    <h2 className="text-lg font-semibold text-gray-900 leading-tight">
                      {goal.title}
                    </h2>
                  </div>

                  {goal.description && (
                    <p className="text-sm text-gray-500 mb-6">
                      {goal.description}
                    </p>
                  )}

                  <div className="space-y-2 mt-4">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-gray-700">Progress</span>
                      <span className="text-gray-500 font-medium">{progress}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className="h-2 rounded-full bg-blue-600 transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Edit Drawer (using native HTML details/summary) */}
                <details className="group border-t border-gray-100">
                  <summary className="list-none cursor-pointer p-3 text-sm font-medium text-gray-500 hover:text-blue-600 hover:bg-gray-50 flex justify-center items-center gap-2 transition-colors">
                    <Edit2 className="h-4 w-4 group-open:hidden" /> 
                    <span className="group-open:hidden">Edit Goal</span>
                    <span className="hidden group-open:block">Cancel Edit</span>
                  </summary>
                  
                  <div className="p-6 bg-gray-50 border-t border-gray-100">
                    <form action={updateAction} className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-700">Goal Title</label>
                        <input
                          name="title"
                          type="text"
                          defaultValue={goal.title}
                          required
                          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-700">Description</label>
                        <textarea
                          name="description"
                          defaultValue={goal.description || ""}
                          rows={2}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                        />
                      </div>
                      <div className="flex gap-4">
                        <div className="flex-1 space-y-1">
                          <label className="text-xs font-medium text-gray-700">Type</label>
                          <select
                            name="type"
                            defaultValue={goal.type}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                          >
                            {goalTypes.map(gt => (
                              <option key={gt.id} value={gt.name}>{gt.name}</option>
                            ))}
                          </select>
                        </div>
                        <div className="flex-1 space-y-1">
                          <label className="text-xs font-medium text-gray-700">Status</label>
                          <select
                            name="status"
                            defaultValue={goal.status}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                          >
                            <option value="Draft">Draft</option>
                            <option value="Active">Active</option>
                            <option value="On Track">On Track</option>
                            <option value="At Risk">At Risk</option>
                            <option value="Paused">Paused</option>
                            <option value="Completed">Completed</option>
                          </select>
                        </div>
                      </div>
                      <button
                        type="submit"
                        className="w-full flex items-center justify-center gap-2 rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition"
                      >
                        <Save className="h-4 w-4" /> Save Changes
                      </button>
                    </form>
                  </div>
                </details>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
