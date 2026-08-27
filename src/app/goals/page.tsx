import { Target, Plus } from "lucide-react";
import { getGoals, createGoal } from "@/app/actions";

export default async function GoalsPage() {
  const dbGoals = await getGoals();
  
  // Use mock data if database isn't connected or empty
  const goals = dbGoals.length > 0 ? dbGoals : [
    {
      id: "mock1",
      title: "Fully understand ML Specialization",
      type: "Learning",
      status: "On Track",
      progress: 68,
      successCriteria: "Complete Course 1, 2, 3, assignments, and understand major concepts.",
    },
    {
      id: "mock2",
      title: "Complete Cityconnect beta testing",
      type: "Achievement",
      status: "At Risk",
      progress: 32,
      successCriteria: "Deadline: October 15. Requires higher velocity.",
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Goals</h1>
      </div>

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Create New Goal</h2>
        <form action={createGoal} className="flex gap-4 items-end">
          <div className="flex-1 space-y-1">
            <label className="text-sm font-medium text-gray-700">Goal Title</label>
            <input 
              name="title" 
              required 
              type="text" 
              placeholder="e.g. Master Machine Learning" 
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <div className="w-48 space-y-1">
            <label className="text-sm font-medium text-gray-700">Type</label>
            <select name="type" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black">
              <option value="Achievement">Achievement</option>
              <option value="Learning">Learning</option>
              <option value="Habit">Habit</option>
            </select>
          </div>
          <button type="submit" className="flex items-center gap-2 rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition h-9">
            <Plus className="h-4 w-4" />
            Add Goal
          </button>
        </form>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {goals.map((goal: any) => (
          <div key={goal.id} className="rounded-xl border bg-white p-6 shadow-sm flex flex-col h-full">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 mb-2">
                  {goal.type}
                </span>
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Target className="h-5 w-5 text-gray-400" />
                  {goal.title}
                </h2>
              </div>
              <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                goal.status === 'On Track' ? 'bg-green-50 text-green-700 ring-green-600/20' :
                goal.status === 'At Risk' ? 'bg-yellow-50 text-yellow-800 ring-yellow-600/20' :
                'bg-gray-50 text-gray-600 ring-gray-500/10'
              }`}>
                {goal.status}
              </span>
            </div>

            <p className="text-sm text-gray-500 mb-6 flex-1">
              {goal.successCriteria || goal.description || "No description provided."}
            </p>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Progress</span>
                <span className="text-gray-500">{goal.progress || 0}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-100">
                <div className="h-2 rounded-full bg-black" style={{ width: `${goal.progress || 0}%` }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
