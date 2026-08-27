import { Clock, PlayCircle, Plus, Trash2, CheckCircle2, Circle, MoreHorizontal } from "lucide-react";
import { 
  getTasks, createTask, toggleTaskStatus, deleteTask, 
  getScheduleSlots, createScheduleSlot, updateScheduleSlotStatus, deleteScheduleSlot 
} from "@/app/actions";
import { FocusTimerClient } from "@/components/FocusTimerClient";

export default async function ExecutionHubPage() {
  const [tasks, schedule] = await Promise.all([getTasks(), getScheduleSlots()]);

  const activeTasks = tasks.filter((task) => task.status !== "Done");
  const completedTasks = tasks.filter((task) => task.status === "Done");
  
  const simplifiedActiveTasks = activeTasks.map(t => ({
    id: t.id,
    title: t.title
  }));

  return (
    <div className="h-full flex flex-col xl:flex-row gap-6 p-4">
      
      {/* COLUMN 1: TASKS (INBOX) */}
      <div className="flex-1 xl:max-w-md flex flex-col bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <h2 className="text-lg font-bold text-gray-900">Task Inbox</h2>
          <MoreHorizontal className="h-5 w-5 text-gray-400" />
        </div>
        
        <div className="p-4 border-b border-gray-100 bg-white">
          <form action={createTask} className="relative flex items-center bg-gray-50 rounded-lg border border-gray-200 focus-within:ring-2 focus-within:ring-blue-500 overflow-hidden">
            <div className="pl-3 text-gray-400"><Plus className="h-4 w-4" /></div>
            <input
              name="title"
              required
              type="text"
              placeholder="Add a new task..."
              className="flex-1 py-2 px-3 text-sm focus:outline-none bg-transparent"
            />
            <input type="hidden" name="priority" value="Medium" />
            <button type="submit" className="hidden">Add</button>
          </form>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {tasks.length === 0 ? (
            <div className="text-center p-8 text-gray-400 text-sm">No tasks here.</div>
          ) : (
            <div className="space-y-6">
              <ul className="space-y-1">
                {activeTasks.map((task) => {
                  const toggleAction = toggleTaskStatus.bind(null, task.id, task.status);
                  const deleteAction = deleteTask.bind(null, task.id);
                  return (
                    <li key={task.id} className="group flex flex-col p-2 rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <form action={toggleAction} className="flex-shrink-0">
                          <button type="submit" className="text-gray-300 hover:text-blue-500 mt-0.5"><Circle className="h-4 w-4" /></button>
                        </form>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-800 truncate">{task.title}</p>
                        </div>
                        <form action={deleteAction} className="opacity-0 group-hover:opacity-100">
                          <button type="submit" className="text-gray-400 hover:text-red-500 p-1"><Trash2 className="h-3.5 w-3.5" /></button>
                        </form>
                      </div>
                      
                      {/* Context Badges */}
                      {(task.goal || task.project || task.milestone) && (
                        <div className="flex flex-wrap gap-1 mt-1 pl-7">
                          {task.goal && (
                            <span className="inline-flex items-center rounded-sm bg-purple-50 px-1.5 py-0.5 text-[10px] font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10">
                              Goal: {task.goal.title}
                            </span>
                          )}
                          {task.milestone && (
                            <span className="inline-flex items-center rounded-sm bg-orange-50 px-1.5 py-0.5 text-[10px] font-medium text-orange-700 ring-1 ring-inset ring-orange-700/10">
                              Milestone: {task.milestone.title}
                            </span>
                          )}
                          {task.project && (
                            <span className="inline-flex items-center rounded-sm bg-blue-50 px-1.5 py-0.5 text-[10px] font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                              Project: {task.project.title}
                            </span>
                          )}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
              {completedTasks.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 mb-2">Completed</h3>
                  <ul className="space-y-1 opacity-60">
                    {completedTasks.map((task) => {
                      const toggleAction = toggleTaskStatus.bind(null, task.id, task.status);
                      const deleteAction = deleteTask.bind(null, task.id);
                      return (
                        <li key={task.id} className="group flex flex-col p-2 rounded-lg hover:bg-gray-50">
                          <div className="flex items-center gap-3">
                            <form action={toggleAction} className="flex-shrink-0">
                              <button type="submit" className="text-blue-500 mt-0.5"><CheckCircle2 className="h-4 w-4" /></button>
                            </form>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-gray-500 line-through truncate">{task.title}</p>
                            </div>
                            <form action={deleteAction} className="opacity-0 group-hover:opacity-100">
                              <button type="submit" className="text-gray-400 hover:text-red-500 p-1"><Trash2 className="h-3.5 w-3.5" /></button>
                            </form>
                          </div>
                          
                          {/* Context Badges */}
                          {(task.goal || task.project || task.milestone) && (
                            <div className="flex flex-wrap gap-1 mt-1 pl-7 opacity-75">
                              {task.goal && (
                                <span className="inline-flex items-center rounded-sm bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-500">
                                  Goal: {task.goal.title}
                                </span>
                              )}
                              {task.milestone && (
                                <span className="inline-flex items-center rounded-sm bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-500">
                                  Milestone: {task.milestone.title}
                                </span>
                              )}
                              {task.project && (
                                <span className="inline-flex items-center rounded-sm bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-500">
                                  Project: {task.project.title}
                                </span>
                              )}
                            </div>
                          )}
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

      {/* COLUMN 2: SCHEDULE (TIMELINE) */}
      <div className="flex-1 xl:max-w-md flex flex-col bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <h2 className="text-lg font-bold text-gray-900">Today's Schedule</h2>
          <Clock className="h-5 w-5 text-gray-400" />
        </div>

        <div className="p-4 border-b border-gray-100 bg-white">
          <form action={createScheduleSlot} className="flex gap-2">
            <input name="title" required type="text" placeholder="Block title..." className="flex-1 rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-600" />
            <input name="startTime" required type="time" className="w-24 rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:outline-none" />
            <input name="endTime" required type="time" className="w-24 rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:outline-none" />
            <button type="submit" className="bg-blue-600 text-white p-1.5 rounded-md hover:bg-blue-700 transition"><Plus className="h-4 w-4" /></button>
          </form>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {schedule.length === 0 ? (
            <div className="text-center text-gray-400 text-sm mt-8">No schedule blocks added yet.</div>
          ) : (
            <div className="relative border-l-2 border-gray-100 ml-2 space-y-6">
              {schedule.map((slot) => {
                const setCompletedAction = updateScheduleSlotStatus.bind(null, slot.id, "completed");
                const setActiveAction = updateScheduleSlotStatus.bind(null, slot.id, "active");
                const deleteAction = deleteScheduleSlot.bind(null, slot.id);

                return (
                  <div key={slot.id} className="relative pl-6 group">
                    <span className={`absolute -left-[9px] top-2 h-4 w-4 rounded-full border-2 border-white ${
                      slot.status === 'completed' ? 'bg-green-500' :
                      slot.status === 'active' ? 'bg-blue-500 animate-pulse' : 'bg-gray-300'
                    }`} />
                    <div className={`rounded-xl border p-3 shadow-sm transition-all ${
                      slot.status === 'active' ? 'bg-blue-50/50 border-blue-200' : 'bg-white hover:border-gray-300'
                    }`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                            {slot.startTime} - {slot.endTime}
                          </div>
                          <h3 className={`text-sm font-semibold ${slot.status === 'completed' ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                            {slot.title}
                          </h3>
                        </div>
                        <div className="flex items-center gap-1">
                          {slot.status === 'pending' && (
                            <form action={setActiveAction}>
                              <button className="text-blue-600 hover:bg-blue-50 p-1.5 rounded transition" title="Start"><PlayCircle className="h-4 w-4" /></button>
                            </form>
                          )}
                          {slot.status === 'active' && (
                            <form action={setCompletedAction}>
                              <button className="text-green-600 hover:bg-green-50 p-1.5 rounded transition" title="Finish"><CheckCircle2 className="h-4 w-4" /></button>
                            </form>
                          )}
                          <form action={deleteAction}>
                            <button className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded transition opacity-0 group-hover:opacity-100"><Trash2 className="h-3.5 w-3.5" /></button>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* COLUMN 3: FOCUS TIMER */}
      <div className="flex-1 xl:max-w-md flex flex-col bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <h2 className="text-lg font-bold text-gray-900">Focus Timer</h2>
          <PlayCircle className="h-5 w-5 text-gray-400" />
        </div>
        <div className="flex-1 flex items-center justify-center p-6 bg-gray-50/30">
          <FocusTimerClient tasks={simplifiedActiveTasks} />
        </div>
      </div>

    </div>
  );
}
