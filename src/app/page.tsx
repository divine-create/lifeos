import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import {
  getDashboardStats,
  getGoals,
  getTasks,
  getTrackers,
  
  toggleTaskStatus,
  
} from "@/app/actions";
import {
  Target,
  CheckCircle2,
  Circle,
  
  Zap,
  CheckSquare,
  ShieldCheck,
  Plus,
  ArrowRight,
  
  Clock,
  
  
} from "lucide-react";
import { LandingPage } from "@/components/LandingPage";
import { DashboardWidgets } from "@/components/DashboardWidgets";import { TrackerStatsWidget } from "@/components/TrackerStatsWidget";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  // If no session, show landing page
  if (!session || !session.user) {
    return <LandingPage />;
  }

  // Fetch real data from server actions
  const [stats, goals, tasks, trackers] = await Promise.all([
    getDashboardStats(),
    getGoals(),
    getTasks(),
    getTrackers(),
  ]);

  const activeTasks = tasks.filter((t) => t.status !== "Done").slice(0, 3);
  const activeGoalsCount = stats?.activeGoals ?? goals.filter((g) => g.status === "Active").length;
  const executionRate = stats?.executionRate ?? 0;
  const doneTasks = stats?.doneTasks ?? tasks.filter((t) => t.status === "Done").length;
  const totalTasks = stats?.totalTasks ?? tasks.length;

  const todayFormatted = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  const todayDateStr = new Date().toISOString().split("T")[0];

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-zinc-100">
            Good morning, {session.user.name || "User"}
          </h1>
          <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">{todayFormatted}</p>
        </div>
        <div className="flex items-center gap-3 mt-4 sm:mt-0">
          <Link
            href="/execution"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 px-3.5 py-2 text-sm font-medium text-gray-700 dark:text-zinc-300 shadow-sm transition hover:bg-gray-50 dark:bg-zinc-800/50"
          >
            <CheckSquare className="h-4 w-4" />
            Tasks
          </Link>
          <Link
            href="/planning"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3.5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
          >
            <Target className="h-4 w-4" />
            Goals
          </Link>
        </div>
      </header>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Execution Rate */}
        <div className="rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-zinc-400">
              Today's Execution
            </span>
            <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
              <Zap className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-bold tracking-tight text-gray-900 dark:text-zinc-100">
              {executionRate}%
            </span>
            <span className="text-xs font-medium text-gray-500 dark:text-zinc-400">
              {stats?.todayActivities ?? 0} activities today
            </span>
          </div>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-zinc-800">
            <div
              className="h-full rounded-full bg-blue-600 transition-all duration-300"
              style={{ width: `${Math.min(100, Math.max(0, executionRate))}%` }}
            />
          </div>
        </div>

        {/* Active Goals */}
        <div className="rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-zinc-400">
              Active Goals
            </span>
            <div className="rounded-lg bg-purple-50 p-2 text-purple-600">
              <Target className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-bold tracking-tight text-gray-900 dark:text-zinc-100">
              {activeGoalsCount}
            </span>
            <span className="text-xs font-medium text-gray-500 dark:text-zinc-400">
              {goals.length} total goals
            </span>
          </div>
          <p className="mt-3 text-xs text-gray-500 dark:text-zinc-400">
            {goals.length > 0
              ? `${goals.filter((g) => (g.progress || 0) >= 100).length} goals achieved so far`
              : "Set your first vision and milestones"}
          </p>
        </div>

        {/* Tasks Done / Total */}
        <div className="rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-zinc-400">
              Tasks Done / Total
            </span>
            <div className="rounded-lg bg-green-50 p-2 text-green-600">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-bold tracking-tight text-gray-900 dark:text-zinc-100">
              {doneTasks} <span className="text-xl text-gray-400 dark:text-zinc-500 font-normal">/ {totalTasks}</span>
            </span>
            <span className="text-xs font-medium text-gray-500 dark:text-zinc-400">
              {totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0}% completed
            </span>
          </div>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-zinc-800">
            <div
              className="h-full rounded-full bg-green-600 transition-all duration-300"
              style={{
                width: `${totalTasks > 0 ? Math.min(100, Math.round((doneTasks / totalTasks) * 100)) : 0}%`,
              }}
            />
          </div>
        </div>
      </div>
      
      <DashboardWidgets />

      {/* Main Grid: Priorities, Goals & Discipline */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column: Top Priorities & Goals */}
        <div className="space-y-6 lg:col-span-2">
          {/* Top Priorities Section */}
          <div className="rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-zinc-800 px-6 py-4">
              <div className="flex items-center gap-2">
                <CheckSquare className="h-5 w-5 text-gray-600 dark:text-zinc-400" />
                <h2 className="font-semibold text-gray-900 dark:text-zinc-100">Top Priorities</h2>
              </div>
              <Link
                href="/execution"
                className="flex items-center gap-1 text-xs font-medium text-gray-600 dark:text-zinc-400 hover:text-blue-600 transition"
              >
                View all tasks
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="p-6">
              {activeTasks.length > 0 ? (
                <ul className="space-y-3">
                  {activeTasks.map((task, index) => {
                    const toggleAction = toggleTaskStatus.bind(null, task.id, task.status);
                    return (
                      <li
                        key={task.id}
                        className="flex items-center justify-between rounded-lg border border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/50/50 px-4 py-3 transition hover:bg-gray-50 dark:bg-zinc-800/50"
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <form action={toggleAction}>
                            <button
                              type="submit"
                              className="text-gray-400 dark:text-zinc-500 hover:text-green-600 transition flex items-center justify-center"
                              title="Mark as Done"
                            >
                              <Circle className="h-5 w-5 cursor-pointer" />
                            </button>
                          </form>
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gray-200 text-xs font-medium text-gray-600 dark:text-zinc-400">
                              {index + 1}
                            </span>
                            <span className="truncate text-sm font-medium text-gray-800 dark:text-zinc-200">
                              {task.title}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0 ml-3">
                          {task.estimatedTime && (
                            <span className="hidden sm:flex items-center gap-1 text-xs text-gray-500 dark:text-zinc-400">
                              <Clock className="h-3.5 w-3.5" />
                              {task.estimatedTime}m
                            </span>
                          )}
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${
                              task.priority === "High"
                                ? "bg-red-50 text-red-700 ring-red-600/20"
                                : task.priority === "Low"
                                ? "bg-blue-50 text-blue-700 ring-blue-600/20"
                                : "bg-yellow-50 text-yellow-800 ring-yellow-600/20"
                            }`}
                          >
                            {task.priority || "Medium"}
                          </span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div className="py-8 text-center">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-zinc-800 text-gray-400 dark:text-zinc-500 mb-3">
                    <CheckSquare className="h-5 w-5" />
                  </div>
                  <p className="text-sm font-medium text-gray-700 dark:text-zinc-300">No tasks yet</p>
                  <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">
                    Add new tasks to keep track of your daily priorities.
                  </p>
                  <Link
                    href="/execution"
                    className="inline-flex items-center gap-1.5 mt-4 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 transition"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Create Task
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Goal Progress Section */}
          <div className="rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-zinc-800 px-6 py-4">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-gray-600 dark:text-zinc-400" />
                <h2 className="font-semibold text-gray-900 dark:text-zinc-100">Goal Progress</h2>
              </div>
              <Link
                href="/planning"
                className="flex items-center gap-1 text-xs font-medium text-gray-600 dark:text-zinc-400 hover:text-blue-600 transition"
              >
                View all goals
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="p-6">
              {goals.length > 0 ? (
                <div className="space-y-5">
                  {goals.slice(0, 4).map((goal) => {
                    const progress = Math.min(100, Math.max(0, Math.round(goal.progress || 0)));
                    return (
                      <div key={goal.id} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="truncate font-medium text-gray-900 dark:text-zinc-100">
                              {goal.title}
                            </span>
                            <span className="inline-flex items-center rounded-full bg-gray-100 dark:bg-zinc-800 px-2 py-0.5 text-xs font-medium text-gray-600 dark:text-zinc-400">
                              {goal.type}
                            </span>
                          </div>
                          <span className="text-xs font-semibold text-gray-600 dark:text-zinc-400 shrink-0 ml-3">
                            {progress}%
                          </span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-zinc-800">
                          <div
                            className="h-full rounded-full bg-blue-600 transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-zinc-800 text-gray-400 dark:text-zinc-500 mb-3">
                    <Target className="h-5 w-5" />
                  </div>
                  <p className="text-sm font-medium text-gray-700 dark:text-zinc-300">No goals yet</p>
                  <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">
                    Set up your vision and break it down into actionable goals.
                  </p>
                  <Link
                    href="/planning"
                    className="inline-flex items-center gap-1.5 mt-4 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 transition"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Create Goal
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Discipline Section */}
        <div className="lg:col-span-1">
          <div className="rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-sm overflow-hidden flex flex-col h-full">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-zinc-800 px-6 py-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-gray-600 dark:text-zinc-400" />
                <h2 className="font-semibold text-gray-900 dark:text-zinc-100">Discipline</h2>
              </div>
              <span className="text-xs text-gray-500 dark:text-zinc-400">Today</span>
            </div>
            
            <div className="p-6 flex-1 flex flex-col justify-between">
              <TrackerStatsWidget trackers={trackers} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
