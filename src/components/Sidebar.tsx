"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Inbox, 
  Calendar,
  CalendarDays,
  Target, 
  Flag, 
  FolderKanban, 
  CheckSquare, 
  Activity,
  Timer,
  BookOpen,
  Settings,
  Search,
  Plus
} from "lucide-react";

const navigation = [
  { name: "Inbox", href: "/", icon: Inbox },
  { name: "Today", href: "/schedule", icon: Calendar },
  { name: "Next 7 Days", href: "/schedule?view=week", icon: CalendarDays },
];

const lists = [
  { name: "Tasks", href: "/tasks", icon: CheckSquare, color: "text-blue-500" },
  { name: "Projects", href: "/projects", icon: FolderKanban, color: "text-indigo-500" },
  { name: "Goals", href: "/goals", icon: Target, color: "text-red-500" },
  { name: "Milestones", href: "/milestones", icon: Flag, color: "text-orange-500" },
  { name: "Learning", href: "/learning", icon: BookOpen, color: "text-emerald-500" },
  { name: "Activities", href: "/activities", icon: Activity, color: "text-purple-500" },
  { name: "Focus", href: "/focus", icon: Timer, color: "text-pink-500" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-[260px] flex-col border-r border-gray-200 bg-[#fafafa] pt-4">
      
      {/* Header Profile / Search */}
      <div className="px-4 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
            L
          </div>
          <span className="text-[15px] font-semibold text-gray-800">LifeOS</span>
        </div>
        <div className="flex gap-1 text-gray-400">
          <button className="p-1 hover:bg-gray-200 rounded">
            <Search className="h-4 w-4" />
          </button>
          <button className="p-1 hover:bg-gray-200 rounded">
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 space-y-6">
        
        {/* Core Nav */}
        <div className="space-y-0.5">
          {navigation.map((item) => {
            const isActive = pathname === item.href && !item.href.includes("?");
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center gap-3 rounded-lg px-2.5 py-1.5 text-[14px] transition-colors ${
                  isActive 
                    ? "bg-[#e5efff] text-blue-600 font-medium" 
                    : "text-gray-700 hover:bg-gray-200/50"
                }`}
              >
                <item.icon className={`h-[18px] w-[18px] ${isActive ? "text-blue-600" : "text-blue-500"}`} />
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* Lists */}
        <div>
          <div className="px-2.5 mb-1 flex items-center justify-between group cursor-pointer">
            <span className="text-xs font-semibold text-gray-500 group-hover:text-gray-700">Lists</span>
            <Plus className="h-3.5 w-3.5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="space-y-0.5">
            {lists.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center gap-3 rounded-lg px-2.5 py-1.5 text-[14px] transition-colors ${
                    isActive 
                      ? "bg-[#e5efff] text-blue-600 font-medium" 
                      : "text-gray-700 hover:bg-gray-200/50"
                  }`}
                >
                  <item.icon className={`h-[18px] w-[18px] ${isActive ? "text-blue-600" : item.color}`} />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>

      </nav>

      {/* Footer */}
      <div className="p-2 border-t border-gray-200 bg-[#fafafa]">
        <Link
          href="/settings"
          className="flex items-center gap-3 rounded-lg px-2.5 py-1.5 text-[14px] text-gray-700 hover:bg-gray-200/50 transition-colors"
        >
          <Settings className="h-[18px] w-[18px] text-gray-400" />
          Settings
        </Link>
      </div>
    </div>
  );
}
