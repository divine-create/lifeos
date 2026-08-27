import { PlayCircle, CheckCircle2, Clock, BookOpenIcon } from "lucide-react";
import { getGoals, getTasks } from "./actions";

export default async function Dashboard() {
  const session = { user: { name: "Test User" } }; // Mock session
  const goals = await getGoals();
  const tasks = await getTasks();

  const activeTasks = tasks.filter((t: any) => t.status !== "Done").slice(0, 3);
  const activeGoals = goals.slice(0, 4);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">
          Good morning{session?.user?.name ? `, ${session.user.name}` : ""}
        </h1>
        <p className="text-gray-500 mt-2">
          Thursday, August 27 — Current Streak: 12 days
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        
        {/* Today's Execution */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-500 mb-4">TODAY'S EXECUTION</h2>
          <div className="flex items-end justify-between mb-2">
            <span className="text-4xl font-bold">78%</span>
            <span className="text-sm text-gray-500">7 / 9 activities</span>
          </div>
          <div className="h-2 w-full rounded-full bg-gray-100">
            <div className="h-2 rounded-full bg-black" style={{ width: "78%" }} />
          </div>
        </div>

        {/* Current Task */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-500 mb-4">CURRENT</h2>
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold flex items-center gap-2">
                <BookOpenIcon className="h-4 w-4" />
                Machine Learning
              </h3>
              <p className="text-sm text-gray-500 mt-1">03:00 AM – 06:00 AM</p>
              <p className="text-2xl font-mono mt-2">01:42:13</p>
            </div>
            <button className="rounded-full bg-black text-white p-2 hover:bg-gray-800 transition">
              <PlayCircle className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Discipline/Rules */}
        <div className="rounded-xl border bg-white p-6 shadow-sm row-span-2">
          <h2 className="text-sm font-semibold text-gray-500 mb-4">DISCIPLINE</h2>
          <div className="space-y-4">
            {[
              "Exercise",
              "Quiet Time",
              "No Caffeine",
              "No Social Media",
              "Devotion",
            ].map((rule) => (
              <div key={rule} className="flex items-center justify-between">
                <span className="text-sm font-medium">{rule}</span>
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              </div>
            ))}
          </div>
        </div>

        {/* Top Priorities */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-500 mb-4">TOP PRIORITIES</h2>
          <ul className="space-y-3">
            {activeTasks.length > 0 ? activeTasks.map((task: any, i: number) => (
              <li key={task.id} className="flex items-start gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-xs font-medium">{i + 1}</span>
                <span className="text-sm">{task.title}</span>
              </li>
            )) : (
              <li className="text-sm text-gray-500">No active priorities. Check your Tasks!</li>
            )}
          </ul>
        </div>

        {/* Goal Progress */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-500 mb-4">GOALS</h2>
          <div className="space-y-4">
            {activeGoals.length > 0 ? activeGoals.map((goal: any) => (
              <GoalProgress key={goal.id} title={goal.title} progress={goal.progress || 0} />
            )) : (
              <div className="text-sm text-gray-500">No active goals found.</div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

function GoalProgress({ title, progress }: { title: string, progress: number }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="font-medium truncate pr-4">{title}</span>
        <span className="text-gray-500">{progress}%</span>
      </div>
      <div className="h-2 w-full rounded-full bg-gray-100">
        <div className="h-2 rounded-full bg-black" style={{ width: `${progress}%` }} />
      </div>
    </div>
  )
}
