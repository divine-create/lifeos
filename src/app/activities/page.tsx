import { Activity, Plus, Clock } from "lucide-react";
import { getActivities, createActivity } from "@/app/actions";

export default async function ActivitiesPage() {
  const activities = await getActivities();

  // Calculate statistics from activities array
  const totalPlanned = activities.reduce(
    (sum, a) => sum + (a.plannedDuration || 0),
    0
  );
  const totalActual = activities.reduce(
    (sum, a) => sum + (a.actualDuration || 0),
    0
  );
  const totalVariance = totalActual - totalPlanned;

  const ratedActivities = activities.filter(
    (a) => a.qualityRating !== null && a.qualityRating !== undefined
  );
  const avgQuality =
    ratedActivities.length > 0
      ? (
          ratedActivities.reduce((sum, a) => sum + (a.qualityRating || 0), 0) /
          ratedActivities.length
        ).toFixed(1)
      : null;

  const formatDuration = (minutes: number | null | undefined) => {
    if (minutes === null || minutes === undefined) return "-";
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hrs > 0 && mins > 0) return `${hrs}h ${mins}m`;
    if (hrs > 0) return `${hrs}h`;
    return `${mins}m`;
  };

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case "coding":
        return "bg-purple-500";
      case "study":
        return "bg-blue-500";
      case "exercise":
        return "bg-emerald-500";
      case "reading":
        return "bg-amber-500";
      case "planning":
        return "bg-indigo-500";
      default:
        return "bg-gray-500";
    }
  };

  const getQualityBadgeClass = (rating: number | null | undefined) => {
    if (!rating) return "bg-gray-50 text-gray-600 ring-gray-500/10";
    if (rating >= 4) return "bg-green-50 text-green-700 ring-green-600/20";
    if (rating === 3) return "bg-yellow-50 text-yellow-700 ring-yellow-600/20";
    return "bg-red-50 text-red-700 ring-red-600/20";
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Activity Log</h1>
          <p className="text-sm text-gray-500 mt-1">
            Track your daily focus sessions, planned vs actual durations, and quality ratings.
          </p>
        </div>
      </div>

      {/* Log Activity Form */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="h-5 w-5 text-gray-700" />
          <h2 className="text-lg font-semibold">Log New Activity</h2>
        </div>
        <form action={createActivity} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-1">
              <label htmlFor="type" className="text-sm font-medium text-gray-700">
                Activity Type
              </label>
              <input
                id="type"
                name="type"
                required
                type="text"
                placeholder="e.g. Study, Coding, Exercise"
                list="activity-suggestions"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <datalist id="activity-suggestions">
                <option value="Study" />
                <option value="Coding" />
                <option value="Exercise" />
                <option value="Reading" />
                <option value="Planning" />
                <option value="Meeting" />
              </datalist>
            </div>

            <div className="space-y-1">
              <label htmlFor="plannedDuration" className="text-sm font-medium text-gray-700">
                Planned Duration (minutes)
              </label>
              <input
                id="plannedDuration"
                name="plannedDuration"
                type="number"
                min="0"
                step="1"
                placeholder="e.g. 60"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="actualDuration" className="text-sm font-medium text-gray-700">
                Actual Duration (minutes)
              </label>
              <input
                id="actualDuration"
                name="actualDuration"
                type="number"
                min="0"
                step="1"
                placeholder="e.g. 45"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="startTime" className="text-sm font-medium text-gray-700">
                Start Time
              </label>
              <input
                id="startTime"
                name="startTime"
                required
                type="datetime-local"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="qualityRating" className="text-sm font-medium text-gray-700">
                Quality Rating
              </label>
              <select
                id="qualityRating"
                name="qualityRating"
                defaultValue="4"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="5">5 - Excellent</option>
                <option value="4">4 - Good</option>
                <option value="3">3 - Average</option>
                <option value="2">2 - Fair</option>
                <option value="1">1 - Poor</option>
              </select>
            </div>

            <div className="space-y-1 sm:col-span-2 lg:col-span-1">
              <label htmlFor="notes" className="text-sm font-medium text-gray-700">
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={1}
                placeholder="Notes or reflections..."
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
            >
              <Plus className="h-4 w-4" />
              Log Activity
            </button>
          </div>
        </form>
      </div>

      {/* Stats Row */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">Planned Time</h3>
            <Clock className="h-4 w-4 text-gray-400" />
          </div>
          <p className="text-2xl font-bold mt-2 text-gray-900">
            {formatDuration(totalPlanned)}
          </p>
          <p className="text-xs text-gray-500 mt-1">{totalPlanned} total minutes</p>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">Actual Time</h3>
            <Activity className="h-4 w-4 text-gray-400" />
          </div>
          <p className="text-2xl font-bold mt-2 text-gray-900">
            {formatDuration(totalActual)}
          </p>
          <p className="text-xs text-gray-500 mt-1">{totalActual} total minutes</p>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">Planned vs Actual</h3>
            <Clock className="h-4 w-4 text-gray-400" />
          </div>
          <p
            className={`text-2xl font-bold mt-2 ${
              totalVariance > 0
                ? "text-green-600"
                : totalVariance < 0
                ? "text-red-600"
                : "text-gray-900"
            }`}
          >
            {totalPlanned > 0
              ? `${Math.round((totalActual / totalPlanned) * 100)}%`
              : "100%"}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Variance: {totalVariance >= 0 ? `+${totalVariance}m` : `${totalVariance}m`}
          </p>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">Avg Quality Rating</h3>
            <Activity className="h-4 w-4 text-gray-400" />
          </div>
          <p className="text-2xl font-bold mt-2 text-gray-900">
            {avgQuality ? `${avgQuality} / 5` : "N/A"}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {ratedActivities.length} rated session{ratedActivities.length === 1 ? "" : "s"}
          </p>
        </div>
      </div>

      {/* Activities Table or Empty State */}
      {activities.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-white p-12 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 mb-4">
            <Activity className="h-6 w-6 text-gray-400" />
          </div>
          <h3 className="text-base font-semibold text-gray-900">No activities logged yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            No activities logged yet. Log your first activity above!
          </p>
        </div>
      ) : (
        <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Planned Duration</th>
                  <th className="px-6 py-4">Actual Duration</th>
                  <th className="px-6 py-4">Variance</th>
                  <th className="px-6 py-4">Quality Rating</th>
                  <th className="px-6 py-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {activities.map((activity) => {
                  const hasPlanned =
                    activity.plannedDuration !== null &&
                    activity.plannedDuration !== undefined;
                  const hasActual =
                    activity.actualDuration !== null &&
                    activity.actualDuration !== undefined;

                  let varianceDisplay: { text: string; className: string } = {
                    text: "-",
                    className: "text-gray-400",
                  };

                  if (hasPlanned && hasActual) {
                    const diff = activity.actualDuration! - activity.plannedDuration!;
                    if (diff > 0) {
                      varianceDisplay = {
                        text: `+${diff}m`,
                        className: "text-green-600 font-medium",
                      };
                    } else if (diff < 0) {
                      varianceDisplay = {
                        text: `${diff}m`,
                        className: "text-red-600 font-medium",
                      };
                    } else {
                      varianceDisplay = {
                        text: "0m",
                        className: "text-gray-600 font-medium",
                      };
                    }
                  } else if (hasActual && !hasPlanned) {
                    varianceDisplay = {
                      text: `+${activity.actualDuration}m`,
                      className: "text-gray-600",
                    };
                  }

                  return (
                    <tr key={activity.id} className="hover:bg-gray-50/75 transition">
                      <td className="px-6 py-4 font-medium">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2.5 h-2.5 rounded-full ${getTypeColor(
                              activity.type
                            )}`}
                          />
                          <span className="text-gray-900">{activity.type}</span>
                        </div>
                        {activity.notes && (
                          <p className="text-xs text-gray-500 mt-1 line-clamp-1 max-w-xs">
                            {activity.notes}
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {hasPlanned ? `${activity.plannedDuration}m` : "-"}
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {hasActual ? `${activity.actualDuration}m` : "-"}
                      </td>
                      <td className="px-6 py-4">
                        <span className={varianceDisplay.className}>
                          {varianceDisplay.text}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {activity.qualityRating ? (
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${getQualityBadgeClass(
                              activity.qualityRating
                            )}`}
                          >
                            {activity.qualityRating} / 5
                          </span>
                        ) : (
                          <span className="text-gray-400 text-xs">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                        {formatDate(activity.startTime)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
