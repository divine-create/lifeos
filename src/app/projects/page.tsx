import { FolderKanban, Plus, Clock, CheckCircle2 } from "lucide-react";

export default function ProjectsPage() {
  const projects = [
    {
      id: "1",
      title: "CLATS Platform",
      goal: "Launch SaaS Product",
      status: "Active",
      description: "Full-stack platform for clinical laboratory test scheduling and management.",
      tasksTotal: 24,
      tasksDone: 14,
      updatedAt: "2 hours ago",
    },
    {
      id: "2",
      title: "LifeOS Dashboard",
      goal: "Personal Productivity System",
      status: "Active",
      description: "Next.js application for personal goal tracking, scheduling, and review loops.",
      tasksTotal: 18,
      tasksDone: 6,
      updatedAt: "Just now",
    },
    {
      id: "3",
      title: "ML Coursework Portfolio",
      goal: "ML Specialization",
      status: "Active",
      description: "Jupyter notebooks and writeups for each course in the Machine Learning specialization.",
      tasksTotal: 12,
      tasksDone: 9,
      updatedAt: "1 day ago",
    },
    {
      id: "4",
      title: "Cityconnect Mobile App",
      goal: "Launch Cityconnect",
      status: "Paused",
      description: "React Native mobile application for urban community networking and local services.",
      tasksTotal: 32,
      tasksDone: 8,
      updatedAt: "5 days ago",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
        <button className="flex items-center gap-2 rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition">
          <Plus className="h-4 w-4" />
          New Project
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {projects.map((project) => {
          const progress = Math.round((project.tasksDone / project.tasksTotal) * 100);
          return (
            <div key={project.id} className="rounded-xl border bg-white p-6 shadow-sm flex flex-col">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                    <FolderKanban className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">{project.title}</h2>
                    <p className="text-sm text-gray-500">{project.goal}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${
                  project.status === "Active"
                    ? "bg-green-50 text-green-700 ring-green-600/20"
                    : "bg-yellow-50 text-yellow-700 ring-yellow-600/20"
                }`}>
                  {project.status}
                </span>
              </div>

              <p className="text-sm text-gray-500 mb-4 flex-1">{project.description}</p>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-gray-500">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>{project.tasksDone} / {project.tasksTotal} tasks</span>
                  </div>
                  <span className="font-medium">{progress}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-100">
                  <div className="h-2 rounded-full bg-black transition-all" style={{ width: `${progress}%` }} />
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <Clock className="h-3 w-3" />
                  Updated {project.updatedAt}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
