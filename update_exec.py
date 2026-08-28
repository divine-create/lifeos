import re

with open("src/app/execution/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Fix the white backgrounds
content = content.replace('bg-white', 'bg-white dark:bg-zinc-900')
content = content.replace('border-gray-100', 'border-gray-100 dark:border-zinc-800')
content = content.replace('border-gray-200', 'border-gray-200 dark:border-zinc-800')
content = content.replace('border-gray-300', 'border-gray-300 dark:border-zinc-700')
content = content.replace('text-gray-900', 'text-gray-900 dark:text-zinc-100')
content = content.replace('text-gray-400', 'text-gray-400 dark:text-zinc-500')
content = content.replace('text-gray-500', 'text-gray-500 dark:text-zinc-400')
content = content.replace('bg-gray-50', 'bg-gray-50 dark:bg-zinc-950')
content = content.replace('bg-blue-50/50', 'bg-blue-50/50 dark:bg-blue-900/20')
content = content.replace('border-blue-200', 'border-blue-200 dark:border-blue-800')
content = content.replace('hover:border-gray-300', 'hover:border-gray-300 dark:hover:border-zinc-700')

with open("src/app/execution/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated execution/page.tsx")
