"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard,
  Target, 
  Flag, 
  FolderKanban, 
  Calendar,
  CheckSquare, 
  Timer,
  Activity,
  BookOpen,
  Settings,
  Search,
  Plus
} from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();

  const navGroups = [
    {
      title: "OVERVIEW",
      items: [
        { name: "Dashboard", href: "/", icon: LayoutDashboard, color: "text-blue-500" },
      ]
    },
    {
      title: "PLANNING",
      items: [
        { name: "Goals", href: "/goals", icon: Target, color: "text-red-500" },
        { name: "Milestones", href: "/milestones", icon: Flag, color: "text-orange-500" },
        { name: "Projects", href: "/projects", icon: FolderKanban, color: "text-indigo-500" },
      ]
    },
    {
      title: "EXECUTION",
      items: [
        { name: "Today & Focus", href: "/execution", icon: CheckSquare, color: "text-emerald-500" },
      ]
    },
    {
      title: "REVIEW",
      items: [
        { name: "Activities", href: "/activities", icon: Activity, color: "text-purple-500" },
        { name: "Learning", href: "/learning", icon: BookOpen, color: "text-yellow-600" },
      ]
    }
  ];

  return (
    <div className="flex h-full w-[260px] flex-col border-r border-gray-200 bg-[#fafafa] pt-4">
      
      {/* Header Profile / Search */}
      <div className="px-4 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-600 text-xs font-bold text-white shadow-sm">
            L
          </div>
          <span className="text-[15px] font-bold text-gray-900 tracking-tight">LifeOS</span>
        </div>
        <div className="flex gap-1 text-gray-400">
          <button className="p-1 hover:bg-gray-200 rounded text-gray-500 transition-colors">
            <Search className="h-4 w-4" />
          </button>
          <button className="p-1 hover:bg-gray-200 rounded text-gray-500 transition-colors">
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 space-y-6">
        {navGroups.map((group) => (
          <div key={group.title}>
            <div className="px-2.5 mb-1.5">
              <span className="text-[11px] font-bold tracking-wider text-gray-400">{group.title}</span>
            </div>
            <div className="space-y-0.5">
              {group.items.map((item) => {
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
        ))}
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
