import re

with open("src/app/trackers/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Backgrounds
content = content.replace('bg-white', 'bg-white dark:bg-zinc-900')

# Borders
content = content.replace('border-gray-200', 'border-gray-200 dark:border-zinc-700')

# Texts
content = content.replace('text-gray-900', 'text-gray-900 dark:text-zinc-100')
content = content.replace('text-gray-600', 'text-gray-600 dark:text-zinc-400')
content = content.replace('text-gray-500', 'text-gray-500 dark:text-zinc-400')

with open("src/app/trackers/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("trackers/page.tsx dark mode enabled")
