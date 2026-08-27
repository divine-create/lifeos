import { Flag, CheckCircle2, Circle, Clock } from "lucide-react";

export default function MilestonesPage() {
  const milestones = [
    {
      id: "1",
      title: "Complete ML Course 1 & 2",
      goal: "ML Specialization",
      deadline: "Sep 15, 2026",
      status: "Completed",
      progress: 100,
      tasks: [
        { title: "Finish all Course 1 assignments", done: true },
        { title: "Finish all Course 2 assignments", done: true },
        { title: "Write summary notes", done: true },
      ],
    },
    {
      id: "2",
      title: "CLATS MVP Launch",
      goal: "Launch SaaS Product",
      deadline: "Oct 1, 2026",
      status: "In Progress",
      progress: 58,
      tasks: [
        { title: "User authentication flow", done: true },
        { title: "Lab test scheduling module", done: true },
        { title: "Payment integration", done: false },
        { title: "Admin dashboard", done: false },
        { title: "Deploy to production", done: false },
      ],
    },
    {
      id: "3",
      title: "Complete ML Course 3",
      goal: "ML Specialization",
      deadline: "Oct 15, 2026",
      status: "Not Started",
      progress: 0,
      tasks: [
        { title: "Watch all lecture videos", done: false },
        { title: "Complete programming assignments", done: false },
        { title: "Pass final quiz", done: false },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Milestones</h1>
      </div>

      <div className="space-y-6">
        {milestones.map((milestone) => (
          <div key={milestone.id} className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                  milestone.status === "Completed" ? "bg-green-50" : "bg-orange-50"
                }`}>
                  <Flag className={`h-5 w-5 ${
                    milestone.status === "Completed" ? "text-green-600" : "text-orange-600"
                  }`} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">{milestone.title}</h2>
                  <p className="text-sm text-gray-500">{milestone.goal}</p>
                </div>
              </div>
              <div className="text-right">
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${
                  milestone.status === "Completed"
                    ? "bg-green-50 text-green-700 ring-green-600/20"
                    : milestone.status === "In Progress"
                    ? "bg-blue-50 text-blue-700 ring-blue-600/20"
                    : "bg-gray-50 text-gray-600 ring-gray-500/10"
                }`}>
                  {milestone.status}
                </span>
                <div className="flex items-center gap-1 text-xs text-gray-400 mt-2">
                  <Clock className="h-3 w-3" />
                  {milestone.deadline}
                </div>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Progress</span>
                <span className="text-gray-500">{milestone.progress}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-100">
                <div className={`h-2 rounded-full transition-all ${
                  milestone.status === "Completed" ? "bg-green-500" : "bg-black"
                }`} style={{ width: `${milestone.progress}%` }} />
              </div>
            </div>

            <div className="border-t pt-4">
              <p className="text-xs font-semibold text-gray-500 mb-3">KEY TASKS</p>
              <ul className="space-y-2">
                {milestone.tasks.map((task, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    {task.done ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                    ) : (
                      <Circle className="h-4 w-4 text-gray-300 flex-shrink-0" />
                    )}
                    <span className={task.done ? "text-gray-400 line-through" : ""}>{task.title}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
