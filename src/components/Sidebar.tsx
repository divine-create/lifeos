"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  Target, 
  Flag, 
  FolderKanban, 
  CheckSquare, 
  Calendar,
  Activity,
  Timer,
  BookOpen,
  Settings
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Goals", href: "/goals", icon: Target },
  { name: "Milestones", href: "/milestones", icon: Flag },
  { name: "Projects", href: "/projects", icon: FolderKanban },
  { name: "Tasks", href: "/tasks", icon: CheckSquare },
  { name: "Schedule", href: "/schedule", icon: Calendar },
  { name: "Activities", href: "/activities", icon: Activity },
  { name: "Focus Timer", href: "/focus", icon: Timer },
  { name: "Learning", href: "/learning", icon: BookOpen },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col border-r bg-white px-4 py-6">
      <div className="flex items-center gap-2 px-2 mb-8">
        <div className="h-8 w-8 rounded bg-black flex items-center justify-center">
          <span className="text-white font-bold">L</span>
        </div>
        <span className="text-xl font-bold">LifeOS</span>
      </div>

      <nav className="flex-1 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActive 
                  ? "bg-black text-white" 
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <item.icon className={`h-5 w-5 ${isActive ? "text-white" : "text-gray-400"}`} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t pt-4">
        <Link
          href="/settings"
          className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <Settings className="h-5 w-5 text-gray-400" />
          Settings
        </Link>
      </div>
    </div>
  );
}
