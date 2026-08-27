content = """
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, Target, CheckSquare, Activity, 
  Settings, Menu, X, LogOut, Flame, Moon, Sun
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useTheme } from "next-themes";

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsOpen(false);
  }, [pathname]);

  const navGroups = [
    {
      title: "OVERVIEW",
      items: [
        { name: "Dashboard", href: "/", icon: LayoutDashboard, color: "text-blue-500 dark:text-blue-400" },
      ]
    },
    {
      title: "PLANNING",
      items: [
        { name: "Vision Board", href: "/planning", icon: Target, color: "text-rose-500 dark:text-rose-400" },
      ]
    },
    {
      title: "EXECUTION",
      items: [
        { name: "Today & Focus", href: "/execution", icon: CheckSquare, color: "text-emerald-500 dark:text-emerald-400" },
        { name: "Habit Tracker", href: "/trackers", icon: Flame, color: "text-orange-500 dark:text-orange-400" },
      ]
    },
    {
      title: "REVIEW",
      items: [
        { name: "Logbook", href: "/logbook", icon: Activity, color: "text-purple-500 dark:text-purple-400" },
      ]
    }
  ];

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed top-3 left-4 z-40 p-2 bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-800 text-gray-700 dark:text-zinc-300"
      >
        <Menu className="h-5 w-5" />
      </button>

      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 z-40 bg-gray-900/50 dark:bg-black/50 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div className={\ixed md:static inset-y-0 left-0 z-50 flex h-full w-[260px] flex-col border-r border-gray-200 dark:border-zinc-800 bg-[#fafafa] dark:bg-zinc-900 
pt-4 transform transition-transform duration-200 ease-in-out \\}>
        
        <div className="px-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 dark:bg-blue-500 text-xs font-bold text-white shadow-sm">
              L
            </div>
            <span className="text-[15px] font-bold text-gray-900 dark:text-white tracking-tight">LifeOS</span>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="md:hidden p-1 hover:bg-gray-200 dark:hover:bg-zinc-800 rounded-md text-gray-500 dark:text-zinc-400 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 space-y-6">
          {navGroups.map((group) => (
            <div key={group.title}>
              <div className="px-2 mb-2">
                <span className="text-[11px] font-bold tracking-wider text-gray-400 dark:text-zinc-500">{group.title}</span>
              </div>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={\group flex items-center gap-3 rounded-lg px-3 py-2 text-[14px] transition-all duration-200 \\}
                    >
                      <item.icon className={\h-[18px] w-[18px] \\} />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-3 border-t border-gray-200 dark:border-zinc-800 bg-[#fafafa] dark:bg-zinc-900 flex flex-col gap-1">
          {mounted && (
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="flex items-center gap-3 w-full rounded-lg px-3 py-2 text-[14px] text-gray-700 dark:text-zinc-400 hover:bg-gray-200/50 dark:hover:bg-zinc-800/50 transition-colors"
            >
              {theme === 'dark' ? <Sun className="h-[18px] w-[18px] text-yellow-500" /> : <Moon className="h-[18px] w-[18px] text-gray-500" />}
              <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
          )}

          <Link
            href="/settings"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-[14px] text-gray-700 dark:text-zinc-400 hover:bg-gray-200/50 dark:hover:bg-zinc-800/50 transition-colors"
          >
            <Settings className="h-[18px] w-[18px] text-gray-400 dark:text-zinc-500" />
            <span>Settings</span>
          </Link>
          
          <button
            onClick={() => signOut()}
            className="flex items-center gap-3 w-full rounded-lg px-3 py-2 text-[14px] text-gray-700 dark:text-zinc-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 transition-colors text-left group"
          >
            <LogOut className="h-[18px] w-[18px] text-gray-400 dark:text-zinc-500 group-hover:text-red-600 dark:group-hover:text-red-400" />
            <span>Sign out</span>
          </button>
        </div>
      </div>
    </>
  );
}
"""

with open("src/components/Sidebar.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Sidebar updated")
