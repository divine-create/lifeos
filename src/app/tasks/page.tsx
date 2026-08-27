import { Circle, CheckCircle2, Clock, Plus } from "lucide-react";
import { getTasks, createTask, toggleTaskStatus } from "@/app/actions";

export default async function TasksPage() {
  const dbTasks = await getTasks();
  
  const tasks = dbTasks.length > 0 ? dbTasks : [
    { id: "1", title: "Fix expired authentication token handling", status: "Todo", priority: "High", estimatedTime: 120 },
    { id: "2", title: "Add refresh-token validation test", status: "Done", priority: "Medium" },
    { id: "3", title: "Deploy CLATS", status: "Blocked", priority: "High" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
      </div>

      <div className="rounded-xl border bg-white p-6 shadow-sm mb-6">
        <h2 className="text-lg font-semibold mb-4">Add Task</h2>
        <form action={createTask} className="flex gap-4 items-end">
          <div className="flex-1 space-y-1">
            <input 
              name="title" 
              required 
              type="text" 
              placeholder="What needs to be done?" 
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <div className="w-32 space-y-1">
            <select name="priority" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black">
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <button type="submit" className="flex items-center gap-2 rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition h-9">
            <Plus className="h-4 w-4" />
            Add
          </button>
        </form>
      </div>

      <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
        <div className="border-b bg-gray-50/50 px-6 py-3">
          <h2 className="text-sm font-semibold text-gray-500">TODAY</h2>
        </div>
        <ul className="divide-y">
          {tasks.map((task: any) => {
            const isDone = task.status === "Done";
            const toggleAction = toggleTaskStatus.bind(null, task.id, task.status);

            return (
              <li key={task.id} className={`flex items-center gap-4 px-6 py-4 transition ${task.status === 'Blocked' ? 'opacity-50' : 'hover:bg-gray-50'}`}>
                <form action={toggleAction}>
                  <button type="submit" className="flex items-center justify-center">
                    {isDone ? (
                      <CheckCircle2 className="h-6 w-6 text-green-500" />
                    ) : (
                      <Circle className={`h-6 w-6 ${task.status === 'Blocked' ? 'text-gray-300' : 'text-gray-400 hover:text-black cursor-pointer'}`} />
                    )}
                  </button>
                </form>
                
                <div className="flex-1">
                  <p className={`font-medium ${isDone ? 'line-through text-gray-400' : ''}`}>
                    {task.title}
                  </p>
                  {task.status === 'Blocked' && (
                     <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                        <span className="inline-block w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                        Blocked
                     </p>
                  )}
                </div>
                
                {task.estimatedTime && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="h-4 w-4" />
                    <span>Est: {Math.round(task.estimatedTime / 60)}h</span>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
