import re

with open("src/components/DashboardWidgets.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Backgrounds
content = content.replace('bg-white', 'bg-white dark:bg-zinc-900')
content = content.replace('bg-gray-50', 'bg-gray-50 dark:bg-zinc-800/50')
content = content.replace('bg-blue-50', 'bg-blue-50 dark:bg-blue-900/20')
content = content.replace('bg-green-50', 'bg-green-50 dark:bg-green-900/20')
content = content.replace('bg-purple-50', 'bg-purple-50 dark:bg-purple-900/20')

# Borders
content = content.replace('border-gray-100', 'border-gray-100 dark:border-zinc-800')
content = content.replace('border-gray-200', 'border-gray-200 dark:border-zinc-700')

# Texts
content = content.replace('text-gray-900', 'text-gray-900 dark:text-zinc-100')
content = content.replace('text-gray-500', 'text-gray-500 dark:text-zinc-400')

with open("src/components/DashboardWidgets.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("DashboardWidgets dark mode enabled")
