import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { User, LogOut, Palette, Database } from "lucide-react";
import { getGoalTypes, createGoalType, deleteGoalType } from "@/app/actions";
import { ThemeToggle } from "@/components/ThemeToggle";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  const goalTypes = await getGoalTypes();

  return (
    <div className="space-y-8 pb-20">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-zinc-100">Settings</h1>
      </div>

      {/* Profile Section */}
      <div className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <User className="h-5 w-5 text-gray-500 dark:text-zinc-500" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-zinc-100">Profile</h2>
        </div>

        {session?.user ? (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-zinc-300">Display Name</label>
                <input
                  type="text"
                  value={session.user.name || ""}
                  readOnly
                  disabled
                  className="w-full rounded-md border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-950 px-3 py-2 text-sm text-gray-700 dark:text-zinc-400 cursor-not-allowed"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-zinc-300">Email</label>
                <input
                  type="email"
                  value={session.user.email || ""}
                  readOnly
                  disabled
                  className="w-full rounded-md border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-950 px-3 py-2 text-sm text-gray-700 dark:text-zinc-400 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/api/auth/signout"
                className="inline-flex items-center gap-2 rounded-md border border-gray-300 dark:border-zinc-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 transition"
              >
                <LogOut className="h-4 w-4 text-gray-500 dark:text-zinc-500" />
                Sign Out
              </Link>
            </div>
          </div>
        ) : (
          <div className="py-4 space-y-4">
            <p className="text-sm text-gray-600 dark:text-zinc-400">Please sign in to view settings</p>
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
      <div className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <Palette className="h-5 w-5 text-gray-500 dark:text-zinc-500" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-zinc-100">Appearance</h2>
        </div>
        <div>
          <ThemeToggle />
        </div>
      </div>

      {/* Goal Types Section */}
      <div className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <Database className="h-5 w-5 text-gray-500 dark:text-zinc-500" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-zinc-100">Goal Types</h2>
        </div>
        
        <form action={createGoalType} className="flex gap-2 mb-4 max-w-sm">
          <input
            name="name"
            required
            type="text"
            placeholder="New Goal Type (e.g. Fitness)"
            className="flex-1 rounded-md border border-gray-300 dark:border-zinc-700 bg-transparent dark:bg-zinc-950 px-3 py-2 text-sm text-gray-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
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
              <div key={gt.id} className="inline-flex items-center gap-2 rounded-full border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 px-3 py-1 text-sm font-medium text-gray-700 dark:text-zinc-300">
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
      <div className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <Database className="h-5 w-5 text-gray-500 dark:text-zinc-500" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-zinc-100">Data</h2>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            className="rounded-md border border-gray-300 dark:border-zinc-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 transition"
          >
            Export Data
          </button>
          <button
            type="button"
            className="rounded-md border border-red-300 dark:border-red-900 px-4 py-2 text-sm font-medium text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
