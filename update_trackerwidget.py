import re

with open("src/components/TrackerWidget.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Headers / backgrounds
content = content.replace('bg-white', 'bg-white dark:bg-zinc-900')
content = content.replace('bg-gray-50/30', 'bg-gray-50/30 dark:bg-zinc-800/30')
content = content.replace('bg-gray-50', 'bg-gray-50 dark:bg-zinc-800/50')
content = content.replace('hover:bg-gray-50', 'hover:bg-gray-50 dark:hover:bg-zinc-800/50')
content = content.replace('bg-gray-100', 'bg-gray-100 dark:bg-zinc-800')

# Borders
content = content.replace('border-gray-100', 'border-gray-100 dark:border-zinc-800')
content = content.replace('border-gray-200', 'border-gray-200 dark:border-zinc-700')
content = content.replace('border-gray-300', 'border-gray-300 dark:border-zinc-600')
content = content.replace('hover:border-gray-100', 'hover:border-gray-100 dark:hover:border-zinc-700')

# Text colors
content = content.replace('text-gray-900', 'text-gray-900 dark:text-zinc-100')
content = content.replace('text-gray-700', 'text-gray-700 dark:text-zinc-300')
content = content.replace('text-gray-600', 'text-gray-600 dark:text-zinc-400')
content = content.replace('text-gray-500', 'text-gray-500 dark:text-zinc-500')
content = content.replace('text-gray-400', 'text-gray-400 dark:text-zinc-500')
content = content.replace('placeholder:text-gray-400', 'placeholder:text-gray-400 dark:placeholder:text-zinc-600')

with open("src/components/TrackerWidget.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("TrackerWidget dark mode enabled")
