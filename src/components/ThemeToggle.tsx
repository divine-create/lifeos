"use client";

import { useTheme } from "next-themes";
import { Moon, Sun, Monitor } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex bg-gray-100 dark:bg-zinc-800 p-1 rounded-lg w-fit">
      <button
        onClick={() => setTheme('light')}
        className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
          theme === 'light' 
            ? 'bg-white text-gray-900 shadow-sm' 
            : 'text-gray-500 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-zinc-200'
        }`}
      >
        <Sun className="h-4 w-4" /> Light
      </button>
      <button
        onClick={() => setTheme('dark')}
        className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
          theme === 'dark' 
            ? 'bg-zinc-900 text-white shadow-sm' 
            : 'text-gray-500 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-zinc-200'
        }`}
      >
        <Moon className="h-4 w-4" /> Dark
      </button>
      <button
        onClick={() => setTheme('system')}
        className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
          theme === 'system' 
            ? 'bg-white dark:bg-zinc-900 text-gray-900 dark:text-white shadow-sm' 
            : 'text-gray-500 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-zinc-200'
        }`}
      >
        <Monitor className="h-4 w-4" /> System
      </button>
    </div>
  );
}
