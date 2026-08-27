import Link from "next/link";
import { BookOpen, Clock, BarChart3, Plus, Trash2 } from "lucide-react";
import { getGoals, getActivities, createGoal, deleteGoal } from "@/app/actions";

export default async function LearningPage() {
  const [goals, activities] = await Promise.all([
    getGoals(),
    getActivities(),
  ]);

  // Filter goals where goal.type === 'Learning'
  const learningGoals = goals.filter(
    (goal) => goal.type?.toLowerCase() === "learning"
  );

  // Filter activities where type includes 'Study'
  const studyActivities = activities.filter((activity) =>
    activity.type?.toLowerCase().includes("study")
  );

  // Calculate start of current week (Monday at 00:00:00)
  const now = new Date();
  const dayOfWeek = now.getDay();
  const distanceToMonday = (dayOfWeek + 6) % 7;
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - distanceToMonday);
  startOfWeek.setHours(0, 0, 0, 0);

  // Sum actualDuration for total study time this week
  const thisWeekStudyActivities = studyActivities.filter((activity) => {
    if (!activity.startTime) return false;
    const actDate = new Date(activity.startTime);
    return actDate >= startOfWeek && actDate <= now;
  });

  const totalWeeklyStudyMinutes = thisWeekStudyActivities.reduce(
    (sum, activity) => sum + (activity.actualDuration || activity.plannedDuration || 0),
    0
  );

  const weeklyHours = Math.floor(totalWeeklyStudyMinutes / 60);
  const weeklyMinutes = totalWeeklyStudyMinutes % 60;
  const formattedWeeklyStudyTime =
    weeklyHours > 0
      ? `${weeklyHours}h ${weeklyMinutes > 0 ? `${weeklyMinutes}m` : ""}`.trim()
      : `${weeklyMinutes}m`;

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
      case "draft":
        return "bg-gray-50 text-gray-700 ring-gray-600/20";
      default:
        return "bg-gray-50 text-gray-600 ring-gray-500/10";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Learning</h1>
      </div>

      {/* Study Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-500">Weekly Study Time</h3>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-bold mt-3 text-gray-900">{formattedWeeklyStudyTime}</p>
          <p className="text-sm text-gray-500 mt-1">
            {thisWeekStudyActivities.length} session{thisWeekStudyActivities.length === 1 ? "" : "s"} this week
          </p>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-500">Study Sessions</h3>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <BookOpen className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-bold mt-3 text-gray-900">{studyActivities.length}</p>
          <p className="text-sm text-gray-500 mt-1">Total study activities logged</p>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-500">Learning Goals</h3>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
              <BarChart3 className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-bold mt-3 text-gray-900">{learningGoals.length}</p>
          <p className="text-sm text-gray-500 mt-1">
            {learningGoals.filter((g) => g.status?.toLowerCase() === "active" || g.status?.toLowerCase() === "on track").length} active
          </p>
        </div>
      </div>

      {/* Create Learning Goal Form */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Add Learning Goal</h2>
        <form action={createGoal} className="flex flex-col sm:flex-row gap-4 items-end">
          <input type="hidden" name="type" value="Learning" />
          <div className="flex-1 w-full space-y-1">
            <label htmlFor="title" className="text-sm font-medium text-gray-700">
              Course / Topic Title
            </label>
            <input
              id="title"
              name="title"
              required
              type="text"
              placeholder="e.g. Master Distributed Systems"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div className="flex-1 w-full space-y-1">
            <label htmlFor="description" className="text-sm font-medium text-gray-700">
              Description / Resource
            </label>
            <input
              id="description"
              name="description"
              type="text"
              placeholder="e.g. Coursera / Stanford Online"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition h-[38px] whitespace-nowrap"
          >
            <Plus className="h-4 w-4" />
            Add Goal
          </button>
        </form>
      </div>

      {/* Courses / Learning Goals Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Courses & Learning Goals</h2>
        </div>

        {learningGoals.length === 0 ? (
          <div className="rounded-xl border border-dashed bg-white p-12 text-center shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 mb-4">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-base font-semibold text-gray-900">No learning goals yet</h3>
            <p className="mt-1 text-sm text-gray-500 max-w-sm mx-auto">
              No learning goals yet. Create a Learning type goal in the Goals page to get started!
            </p>
            <div className="mt-4">
              <Link
                href="/goals"
                className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
              >
                Go to Goals
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {learningGoals.map((goal) => {
              const progress = Math.min(100, Math.max(0, Math.round(goal.progress || 0)));
              const deleteAction = deleteGoal.bind(null, goal.id);

              return (
                <div key={goal.id} className="rounded-xl border bg-white p-6 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                          <BookOpen className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{goal.title}</h3>
                          {goal.description && (
                            <p className="text-sm text-gray-500 mt-1">{goal.description}</p>
                          )}
                        </div>
                      </div>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${getStatusBadgeClass(
                          goal.status
                        )}`}
                      >
                        {goal.status}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs text-gray-500 font-medium">
                        <span>Progress</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-blue-600 transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t text-xs text-gray-400">
                      <span>Created {new Date(goal.createdAt).toLocaleDateString()}</span>
                      <form action={deleteAction}>
                        <button
                          type="submit"
                          className="text-gray-400 hover:text-red-600 transition p-1"
                          title="Delete Goal"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent Study Log Table */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Recent Study Log</h2>
        <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
          {studyActivities.length === 0 ? (
            <div className="p-8 text-center text-sm text-gray-500">
              No study activities recorded yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 font-medium border-b">
                  <tr>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Notes / Topic</th>
                    <th className="px-6 py-4">Duration</th>
                    <th className="px-6 py-4">Quality</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {studyActivities.map((activity) => {
                    const durationMinutes =
                      activity.actualDuration ?? activity.plannedDuration ?? 0;
                    const hours = Math.floor(durationMinutes / 60);
                    const mins = durationMinutes % 60;
                    const durationDisplay =
                      hours > 0
                        ? `${hours}h ${mins > 0 ? `${mins}m` : ""}`.trim()
                        : `${mins}m`;

                    const formattedDate = activity.startTime
                      ? new Date(activity.startTime).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "—";

                    return (
                      <tr key={activity.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                          {formattedDate}
                        </td>
                        <td className="px-6 py-4 text-gray-600 max-w-xs truncate">
                          {activity.notes || "—"}
                        </td>
                        <td className="px-6 py-4 text-gray-900 font-medium whitespace-nowrap">
                          {durationDisplay}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {activity.qualityRating ? (
                            <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                              {activity.qualityRating}/5
                            </span>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
