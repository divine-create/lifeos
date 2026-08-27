import { Target, Flag, FolderKanban, Plus, Trash2, CheckCircle2, Circle, ChevronRight } from "lucide-react";
import { getGoals, getGoalTypes, createGoal, createMilestone, createProject, createTask, toggleTaskStatus, deleteGoal, updateGoal } from "@/app/actions";

export default async function PlanningHubPage() {
  const goals = await getGoals();
  const goalTypes = await getGoalTypes();

  const getTypeBadgeClass = (type: string) => {
    switch (type?.toLowerCase()) {
      case "learning": return "bg-blue-50 text-blue-700 ring-blue-700/10";
      case "habit": return "bg-emerald-50 text-emerald-700 ring-emerald-700/10";
      case "achievement": return "bg-purple-50 text-purple-700 ring-purple-700/10";
      default: return "bg-gray-50 text-gray-700 ring-gray-700/10";
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active": case "on track": return "bg-green-50 text-green-700 ring-green-600/20";
      case "completed": return "bg-blue-50 text-blue-700 ring-blue-600/20";
      case "at risk": return "bg-yellow-50 text-yellow-800 ring-yellow-600/20";
      case "paused": return "bg-orange-50 text-orange-700 ring-orange-600/20";
      default: return "bg-gray-50 text-gray-600 ring-gray-500/10";
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Vision Board</h1>
      </div>

      {/* Create Goal Form */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Create New Goal</h2>
        <form action={createGoal} className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-4 items-start">
            <div className="flex-1 w-full space-y-1">
              <label className="text-sm font-medium text-gray-700">Goal Title</label>
              <input name="title" required type="text" placeholder="e.g. Master Machine Learning" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-blue-600 focus:outline-none" />
            </div>
            <div className="flex-1 w-full space-y-1">
              <label className="text-sm font-medium text-gray-700">First Milestone <span className="text-gray-400 font-normal">(Optional)</span></label>
              <input name="milestoneTitle" type="text" placeholder="e.g. Complete Course 1" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-blue-600 focus:outline-none" />
            </div>
            <div className="w-full md:w-48 space-y-1">
              <label className="text-sm font-medium text-gray-700">Type</label>
              <select name="type" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-blue-600 focus:outline-none">
                {goalTypes.map(gt => <option key={gt.id} value={gt.name}>{gt.name}</option>)}
              </select>
            </div>
          </div>
          <div className="flex justify-end mt-2">
            <button type="submit" className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-md bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 transition">
              <Plus className="h-4 w-4" /> Add Goal
            </button>
          </div>
        </form>
      </div>

      {/* Vision Hierarchy */}
      {goals.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-white p-12 text-center shadow-sm">
          <Target className="mx-auto h-12 w-12 text-gray-300 mb-4" />
          <h3 className="text-base font-semibold text-gray-900">No goals yet</h3>
          <p className="mt-1 text-sm text-gray-500">Create your first goal to start planning your vision.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {goals.map((goal) => {
            const deleteAction = deleteGoal.bind(null, goal.id);
            const progress = Math.min(100, Math.max(0, Math.round(goal.progress || 0)));
            
            return (
              <details key={goal.id} className="group rounded-xl border bg-white shadow-sm overflow-hidden" open>
                <summary className="list-none cursor-pointer p-6 hover:bg-gray-50 transition-colors relative">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="mt-1 flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-600 group-open:bg-blue-600 group-open:text-white transition-colors">
                        <Target className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h2 className="text-xl font-bold text-gray-900">{goal.title}</h2>
                          <ChevronRight className="h-4 w-4 text-gray-400 group-open:rotate-90 transition-transform" />
                        </div>
                        {goal.description && <p className="text-sm text-gray-500 mb-3">{goal.description}</p>}
                        
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${getTypeBadgeClass(goal.type)}`}>{goal.type}</span>
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${getStatusBadgeClass(goal.status)}`}>{goal.status}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2 w-32 shrink-0">
                      <form action={deleteAction} onClick={(e) => e.stopPropagation()}>
                        <button type="submit" className="text-gray-400 hover:text-red-600 p-1"><Trash2 className="h-4 w-4" /></button>
                      </form>
                      <div className="w-full mt-2">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-medium text-gray-500">Progress</span>
                          <span className="font-bold text-blue-600">{progress}%</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-gray-100"><div className="h-1.5 rounded-full bg-blue-600 transition-all" style={{ width: `${progress}%` }} /></div>
                      </div>
                    </div>
                  </div>
                </summary>

                <div className="border-t border-gray-100 bg-gray-50 p-6">
                  <div className="ml-12 space-y-6">
                    
                    {/* Milestones inside Goal */}
                    {goal.milestones?.map(milestone => {
                      const isCompleted = milestone.status === "Completed";
                      return (
                        <div key={milestone.id} className="rounded-lg border bg-white p-4 shadow-sm relative">
                          <div className="absolute -left-7 top-6 h-full w-px bg-gray-200" />
                          <div className="absolute -left-[31px] top-5 h-2 w-2 rounded-full bg-orange-400 ring-4 ring-gray-50" />
                          
                          <div className="flex items-start gap-3">
                            <div className="mt-0.5"><Flag className={`h-5 w-5 ${isCompleted ? 'text-green-500' : 'text-orange-500'}`} /></div>
                            <div className="flex-1">
                              <h3 className="text-base font-semibold text-gray-900">{milestone.title}</h3>
                              
                              {/* Projects inside Milestone */}
                              {milestone.projects && milestone.projects.length > 0 && (
                                <div className="mt-4 space-y-3">
                                  {milestone.projects.map(project => (
                                    <div key={project.id} className="rounded-md border border-gray-100 bg-gray-50/50 p-3">
                                      <div className="flex items-center gap-2 mb-2">
                                        <FolderKanban className="h-4 w-4 text-gray-500" />
                                        <h4 className="text-sm font-semibold text-gray-900">{project.title}</h4>
                                      </div>
                                      
                                      {/* Tasks inside Project */}
                                      <ul className="space-y-1 ml-6 mb-3">
                                        {project.tasks?.map(task => {
                                          const toggleAction = toggleTaskStatus.bind(null, task.id, task.status);
                                          return (
                                            <li key={task.id} className="flex items-center gap-2">
                                              <form action={toggleAction}><button type="submit" className="mt-1">{task.status === "Done" ? <CheckCircle2 className="h-3.5 w-3.5 text-green-600" /> : <Circle className="h-3.5 w-3.5 text-gray-400" />}</button></form>
                                              <span className={`text-xs ${task.status === "Done" ? "text-gray-400 line-through" : "text-gray-700"}`}>{task.title}</span>
                                            </li>
                                          )
                                        })}
                                      </ul>
                                      {/* Add Task to Project */}
                                      <form action={createTask} className="relative ml-6">
                                        <input type="hidden" name="projectId" value={project.id} />
                                        <input type="hidden" name="milestoneId" value={milestone.id} />
                                        <input type="hidden" name="goalId" value={goal.id} />
                                        <div className="absolute left-2 top-1.5 text-gray-400"><Plus className="h-3 w-3" /></div>
                                        <input name="title" required type="text" placeholder="Add task to project..." className="w-full bg-white border border-gray-200 rounded py-1 pl-6 pr-2 text-xs focus:ring-1 focus:ring-blue-500" />
                                      </form>
                                    </div>
                                  ))}
                                </div>
                              )}
                              
                              {/* Tasks directly on Milestone */}
                              {milestone.tasks && milestone.tasks.length > 0 && (
                                <ul className="mt-4 space-y-1">
                                  {milestone.tasks.filter(t => !t.projectId).map(task => {
                                    const toggleAction = toggleTaskStatus.bind(null, task.id, task.status);
                                    return (
                                      <li key={task.id} className="flex items-center gap-2">
                                        <form action={toggleAction}><button type="submit" className="mt-1">{task.status === "Done" ? <CheckCircle2 className="h-3.5 w-3.5 text-green-600" /> : <Circle className="h-3.5 w-3.5 text-gray-400" />}</button></form>
                                        <span className={`text-xs ${task.status === "Done" ? "text-gray-400 line-through" : "text-gray-700"}`}>{task.title}</span>
                                      </li>
                                    )
                                  })}
                                </ul>
                              )}

                              <div className="mt-4 flex gap-2">
                                {/* Add Task directly to Milestone */}
                                <form action={createTask} className="relative flex-1">
                                  <input type="hidden" name="milestoneId" value={milestone.id} />
                                  <input type="hidden" name="goalId" value={goal.id} />
                                  <div className="absolute left-2 top-1.5 text-gray-400"><Plus className="h-3 w-3" /></div>
                                  <input name="title" required type="text" placeholder="Add task to milestone..." className="w-full bg-gray-50 border border-gray-200 rounded py-1 pl-6 pr-2 text-xs focus:ring-1 focus:ring-blue-500" />
                                </form>
                                {/* Add Project to Milestone */}
                                <form action={createProject} className="relative flex-1">
                                  <input type="hidden" name="milestoneId" value={milestone.id} />
                                  <input type="hidden" name="goalId" value={goal.id} />
                                  <div className="absolute left-2 top-1.5 text-gray-400"><FolderKanban className="h-3 w-3" /></div>
                                  <input name="title" required type="text" placeholder="Add project..." className="w-full bg-gray-50 border border-gray-200 rounded py-1 pl-6 pr-2 text-xs focus:ring-1 focus:ring-blue-500" />
                                </form>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}

                    {/* Add Milestone to Goal */}
                    <div className="relative pl-7">
                      <div className="absolute left-[3px] top-3 h-2 w-2 rounded-full border-2 border-gray-300" />
                      <form action={createMilestone} className="relative max-w-sm">
                        <input type="hidden" name="goalId" value={goal.id} />
                        <div className="absolute left-3 top-2.5 text-gray-400"><Flag className="h-4 w-4" /></div>
                        <input name="title" required type="text" placeholder="Add new milestone..." className="w-full bg-white border border-gray-200 rounded-md py-2 pl-9 pr-3 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                      </form>
                    </div>

                  </div>
                </div>
              </details>
            )
          })}
        </div>
      )}
    </div>
  );
}
