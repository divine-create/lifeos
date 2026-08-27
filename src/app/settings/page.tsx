import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { User, LogOut, Palette, Database } from "lucide-react";
import { getGoalTypes, createGoalType, deleteGoalType } from "@/app/actions";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  const goalTypes = await getGoalTypes();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
      </div>

      {/* Profile Section */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <User className="h-5 w-5 text-gray-500" />
          <h2 className="text-lg font-semibold">Profile</h2>
        </div>

        {session?.user ? (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Display Name</label>
                <input
                  type="text"
                  value={session.user.name || ""}
                  readOnly
                  disabled
                  className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 cursor-not-allowed"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={session.user.email || ""}
                  readOnly
                  disabled
                  className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/api/auth/signout"
                className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
              >
                <LogOut className="h-4 w-4 text-gray-500" />
                Sign Out
              </Link>
            </div>
          </div>
        ) : (
          <div className="py-4 space-y-4">
            <p className="text-sm text-gray-600">Please sign in to view settings</p>
            <Link
              href="/api/auth/signin"
              className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
            >
              Sign In
            </Link>
          </div>
        )}
      </div>

      {/* Appearance Section */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <Palette className="h-5 w-5 text-gray-500" />
          <h2 className="text-lg font-semibold">Appearance</h2>
        </div>
        <div className="flex flex-wrap gap-4">
          <button
            type="button"
            className="flex flex-col items-center gap-2 rounded-lg border-2 border-black p-4 w-28 text-center"
          >
            <div className="h-8 w-8 rounded-full bg-white border border-gray-300 shadow-sm" />
            <span className="text-xs font-medium">Light</span>
          </button>
          <button
            type="button"
            className="flex flex-col items-center gap-2 rounded-lg border-2 border-gray-200 p-4 w-28 text-center hover:border-gray-400 transition"
          >
            <div className="h-8 w-8 rounded-full bg-gray-900 shadow-sm" />
            <span className="text-xs font-medium text-gray-500">Dark</span>
          </button>
          <button
            type="button"
            className="flex flex-col items-center gap-2 rounded-lg border-2 border-gray-200 p-4 w-28 text-center hover:border-gray-400 transition"
          >
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-white to-gray-900 border border-gray-200 shadow-sm" />
            <span className="text-xs font-medium text-gray-500">System</span>
          </button>
        </div>
      </div>

      {/* Goal Types Section */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <Database className="h-5 w-5 text-gray-500" />
          <h2 className="text-lg font-semibold">Goal Types</h2>
        </div>
        
        <form action={createGoalType} className="flex gap-2 mb-4 max-w-sm">
          <input
            name="name"
            required
            type="text"
            placeholder="New Goal Type (e.g. Fitness)"
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <button
            type="submit"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
          >
            Add
          </button>
        </form>

        <div className="flex flex-wrap gap-2">
          {goalTypes.map(gt => {
            const deleteAction = deleteGoalType.bind(null, gt.id);
            return (
              <div key={gt.id} className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-sm font-medium text-gray-700">
                {gt.name}
                <form action={deleteAction}>
                  <button type="submit" className="text-gray-400 hover:text-red-600 transition">
                    &times;
                  </button>
                </form>
              </div>
            );
          })}
        </div>
      </div>

      {/* Data Section */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <Database className="h-5 w-5 text-gray-500" />
          <h2 className="text-lg font-semibold">Data</h2>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            Export Data
          </button>
          <button
            type="button"
            className="rounded-md border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
