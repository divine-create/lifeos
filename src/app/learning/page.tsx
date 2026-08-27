import { BookOpen, Plus, Play, CheckCircle2, Clock, BarChart3 } from "lucide-react";

export default function LearningPage() {
  const courses = [
    {
      id: "1",
      title: "Machine Learning Specialization",
      provider: "Coursera / Stanford",
      status: "In Progress",
      progress: 68,
      totalModules: 12,
      completedModules: 8,
      weeklyTarget: "10 hours",
      currentStreak: 14,
      nextLesson: "Week 9: Anomaly Detection",
      notes: "Need to review backpropagation math before moving forward.",
    },
    {
      id: "2",
      title: "System Design Interview",
      provider: "Self-study / Book",
      status: "In Progress",
      progress: 40,
      totalModules: 15,
      completedModules: 6,
      weeklyTarget: "5 hours",
      currentStreak: 3,
      nextLesson: "Chapter 7: Design a URL Shortener",
      notes: "Practice drawing diagrams on whiteboard.",
    },
    {
      id: "3",
      title: "Advanced TypeScript Patterns",
      provider: "Matt Pocock / Total TypeScript",
      status: "Queued",
      progress: 0,
      totalModules: 8,
      completedModules: 0,
      weeklyTarget: "—",
      currentStreak: 0,
      nextLesson: "Module 1: Type Transformations",
      notes: "Start after ML specialization is complete.",
    },
  ];

  const recentLogs = [
    { date: "Today", topic: "Neural Networks - Batch Normalization", duration: "2h 15m", quality: 4 },
    { date: "Yesterday", topic: "System Design - Rate Limiter", duration: "1h 30m", quality: 5 },
    { date: "Aug 25", topic: "ML - Regularization Techniques", duration: "3h 00m", quality: 3 },
    { date: "Aug 24", topic: "ML - Decision Trees & Random Forests", duration: "2h 45m", quality: 4 },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Learning</h1>
        <button className="flex items-center gap-2 rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition">
          <Plus className="h-4 w-4" />
          Add Course
        </button>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-500">Weekly Study Hours</h3>
          <p className="text-3xl font-bold mt-2">12.5h</p>
          <p className="text-sm text-green-600 mt-1">↑ 2.5h vs last week</p>
        </div>
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-500">Active Courses</h3>
          <p className="text-3xl font-bold mt-2">2</p>
          <p className="text-sm text-gray-500 mt-1">1 queued</p>
        </div>
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-500">Longest Streak</h3>
          <p className="text-3xl font-bold mt-2">14 days</p>
          <p className="text-sm text-gray-500 mt-1">ML Specialization</p>
        </div>
      </div>

      {/* Courses */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Courses & Programs</h2>
        {courses.map((course) => (
          <div key={course.id} className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{course.title}</h3>
                  <p className="text-sm text-gray-500">{course.provider}</p>
                </div>
              </div>
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${
                course.status === "In Progress"
                  ? "bg-blue-50 text-blue-700 ring-blue-600/20"
                  : "bg-gray-50 text-gray-600 ring-gray-500/10"
              }`}>
                {course.status}
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
              <div>
                <p className="text-gray-500">Modules</p>
                <p className="font-semibold">{course.completedModules} / {course.totalModules}</p>
              </div>
              <div>
                <p className="text-gray-500">Weekly Target</p>
                <p className="font-semibold">{course.weeklyTarget}</p>
              </div>
              <div>
                <p className="text-gray-500">Current Streak</p>
                <p className="font-semibold">{course.currentStreak} days</p>
              </div>
              <div>
                <p className="text-gray-500">Next Up</p>
                <p className="font-semibold truncate">{course.nextLesson}</p>
              </div>
            </div>

            <div className="space-y-2 mb-3">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Progress</span>
                <span className="text-gray-500">{course.progress}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-100">
                <div className="h-2 rounded-full bg-black transition-all" style={{ width: `${course.progress}%` }} />
              </div>
            </div>

            {course.notes && (
              <p className="text-sm text-gray-500 italic border-l-2 border-gray-200 pl-3">
                {course.notes}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Recent Study Log */}
      <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
        <div className="border-b bg-gray-50/50 px-6 py-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-500">RECENT STUDY LOG</h2>
          <BarChart3 className="h-4 w-4 text-gray-400" />
        </div>
        <table className="w-full text-sm text-left">
          <thead className="text-gray-500 font-medium border-b">
            <tr>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Topic</th>
              <th className="px-6 py-3">Duration</th>
              <th className="px-6 py-3">Quality</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {recentLogs.map((log, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-6 py-3 text-gray-500">{log.date}</td>
                <td className="px-6 py-3 font-medium">{log.topic}</td>
                <td className="px-6 py-3 flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-gray-400" />
                  {log.duration}
                </td>
                <td className="px-6 py-3">
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                    log.quality >= 4
                      ? "bg-green-50 text-green-700"
                      : "bg-yellow-50 text-yellow-700"
                  }`}>
                    {log.quality}/5
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
