import { Activity, Clock, Target, Calendar } from "lucide-react";

export default function ActivitiesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Activity Log</h1>
        <button className="flex items-center gap-2 rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition">
          <Activity className="h-4 w-4" />
          Log Manual Activity
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-500">Planned vs Actual (Today)</h3>
          <p className="text-2xl font-bold mt-2 text-green-600">90.4%</p>
          <p className="text-sm text-gray-500 mt-1">Planned: 8h | Actual: 7h 14m</p>
        </div>
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-500">Highest Variance</h3>
          <p className="text-xl font-semibold mt-2">Coding Tasks</p>
          <p className="text-sm text-red-500 mt-1">Avg underestimate by 26%</p>
        </div>
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-500">Total Tracked Time (Week)</h3>
          <p className="text-2xl font-bold mt-2">48h 20m</p>
          <p className="text-sm text-gray-500 mt-1">Top category: Study (24h)</p>
        </div>
      </div>

      <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-500 font-medium">
            <tr>
              <th className="px-6 py-4">Activity</th>
              <th className="px-6 py-4">Goal</th>
              <th className="px-6 py-4">Planned</th>
              <th className="px-6 py-4">Actual</th>
              <th className="px-6 py-4">Variance</th>
              <th className="px-6 py-4">Quality</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            <tr className="hover:bg-gray-50">
              <td className="px-6 py-4 font-medium flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                Machine Learning
              </td>
              <td className="px-6 py-4 text-gray-500">ML Specialization</td>
              <td className="px-6 py-4">180m</td>
              <td className="px-6 py-4 font-semibold">148m</td>
              <td className="px-6 py-4 text-red-500">-32m</td>
              <td className="px-6 py-4">
                <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
                  4/5
                </span>
              </td>
            </tr>
            <tr className="hover:bg-gray-50">
              <td className="px-6 py-4 font-medium flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                Coding & Development
              </td>
              <td className="px-6 py-4 text-gray-500">CLATS</td>
              <td className="px-6 py-4">120m</td>
              <td className="px-6 py-4 font-semibold">135m</td>
              <td className="px-6 py-4 text-green-500">+15m</td>
              <td className="px-6 py-4">
                <span className="inline-flex items-center rounded-full bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-700">
                  3/5
                </span>
              </td>
            </tr>
            <tr className="hover:bg-gray-50">
              <td className="px-6 py-4 font-medium flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                Goal Review / Planning
              </td>
              <td className="px-6 py-4 text-gray-500">-</td>
              <td className="px-6 py-4">60m</td>
              <td className="px-6 py-4 font-semibold">45m</td>
              <td className="px-6 py-4 text-red-500">-15m</td>
              <td className="px-6 py-4">
                <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
                  5/5
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
