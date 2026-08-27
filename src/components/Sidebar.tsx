"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard,
  Target, 
  
  
  
  CheckSquare, 
  
  Activity,
  
  
  Settings,
  
  
  Menu,
  X,
  
  
  Flame
} from "lucide-react";


export function Sidebar() {
  const pathname = usePathname();
  
  const [isOpen, setIsOpen] = useState(false);

  // Close sidebar on route change on mobile
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

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
        { name: "Vision Board", href: "/planning", icon: Target, color: "text-red-500" },
      ]
    },
    {
      title: "EXECUTION",
      items: [
        { name: "Today & Focus", href: "/execution", icon: CheckSquare, color: "text-emerald-500" },
        { name: "Habit Tracker", href: "/trackers", icon: Flame, color: "text-orange-500" },
      ]
    },
    {
      title: "REVIEW",
      items: [
        { name: "Logbook", href: "/logbook", icon: Activity, color: "text-purple-500" },
      ]
    }
  ];

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed top-3 left-4 z-40 p-2 bg-white rounded-md shadow-sm border border-gray-200 text-gray-700"
      >
        <Menu className="h-5 w-5" />
      </button>

      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div className={`fixed md:static inset-y-0 left-0 z-50 flex h-full w-[260px] flex-col border-r border-gray-200 bg-[#fafafa] pt-4 transform transition-transform duration-200 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
        
        {/* Header Profile / Search */}
        <div className="px-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-600 text-xs font-bold text-white shadow-sm">
              L
            </div>
            <span className="text-[15px] font-bold text-gray-900 tracking-tight">LifeOS</span>
          </div>
          <div className="flex gap-1 text-gray-400">
            <button 
              className="md:hidden p-1 hover:bg-gray-200 rounded text-gray-500 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-5 w-5" />
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
    </>
  );
}
