import { User, Bell, Palette, Database, Shield } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Settings</h1>

      {/* Profile */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <User className="h-5 w-5 text-gray-500" />
          <h2 className="text-lg font-semibold">Profile</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Display Name</label>
            <input type="text" defaultValue="Test User" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input type="email" defaultValue="test@example.com" disabled className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Timezone</label>
            <select className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black">
              <option>Africa/Lagos (WAT)</option>
              <option>Europe/London (GMT)</option>
              <option>America/New_York (EST)</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Week Starts On</label>
            <select className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black">
              <option>Monday</option>
              <option>Sunday</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="h-5 w-5 text-gray-500" />
          <h2 className="text-lg font-semibold">Notifications</h2>
        </div>
        <div className="space-y-4">
          {[
            { label: "Daily Morning Brief", desc: "Get a summary of today's schedule at 5:00 AM" },
            { label: "Task Reminders", desc: "Notify 15 minutes before scheduled tasks" },
            { label: "Weekly Review Prompt", desc: "Remind you to complete your weekly review on Sundays" },
            { label: "Goal Deadline Alerts", desc: "Alert when a goal deadline is approaching" },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium">{item.label}</p>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input type="checkbox" defaultChecked className="peer sr-only" />
                <div className="h-6 w-11 rounded-full bg-gray-200 peer-checked:bg-black after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-full" />
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Appearance */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <Palette className="h-5 w-5 text-gray-500" />
          <h2 className="text-lg font-semibold">Appearance</h2>
        </div>
        <div className="flex gap-4">
          <button className="flex flex-col items-center gap-2 rounded-lg border-2 border-black p-4 w-28">
            <div className="h-8 w-8 rounded-full bg-white border border-gray-300" />
            <span className="text-xs font-medium">Light</span>
          </button>
          <button className="flex flex-col items-center gap-2 rounded-lg border-2 border-gray-200 p-4 w-28 hover:border-gray-400 transition">
            <div className="h-8 w-8 rounded-full bg-gray-900" />
            <span className="text-xs font-medium text-gray-500">Dark</span>
          </button>
          <button className="flex flex-col items-center gap-2 rounded-lg border-2 border-gray-200 p-4 w-28 hover:border-gray-400 transition">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-white to-gray-900" />
            <span className="text-xs font-medium text-gray-500">System</span>
          </button>
        </div>
      </div>

      {/* Data */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <Database className="h-5 w-5 text-gray-500" />
          <h2 className="text-lg font-semibold">Data & Privacy</h2>
        </div>
        <div className="space-y-3">
          <button className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50 transition">
            Export All Data (JSON)
          </button>
          <button className="rounded-md border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition ml-3">
            Delete Account
          </button>
        </div>
      </div>

      <div className="flex justify-end">
        <button className="rounded-md bg-black px-6 py-2 text-sm font-medium text-white hover:bg-gray-800 transition">
          Save Changes
        </button>
      </div>
    </div>
  );
}
