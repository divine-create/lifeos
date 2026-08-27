import re

with open("src/app/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Backgrounds
content = content.replace('bg-white', 'bg-white dark:bg-zinc-900')
content = content.replace('bg-gray-50', 'bg-gray-50 dark:bg-zinc-800/50')
content = content.replace('bg-gray-100', 'bg-gray-100 dark:bg-zinc-800')

# Borders
content = content.replace('border-gray-100', 'border-gray-100 dark:border-zinc-800')
content = content.replace('border-gray-200', 'border-gray-200 dark:border-zinc-700')
content = content.replace('border-gray-300', 'border-gray-300 dark:border-zinc-600')

# Texts
content = content.replace('text-gray-900', 'text-gray-900 dark:text-zinc-100')
content = content.replace('text-gray-800', 'text-gray-800 dark:text-zinc-200')
content = content.replace('text-gray-700', 'text-gray-700 dark:text-zinc-300')
content = content.replace('text-gray-600', 'text-gray-600 dark:text-zinc-400')
content = content.replace('text-gray-500', 'text-gray-500 dark:text-zinc-400')
content = content.replace('text-gray-400', 'text-gray-400 dark:text-zinc-500')
content = content.replace('placeholder:text-gray-400', 'placeholder:text-gray-400 dark:placeholder:text-zinc-600')

with open("src/app/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("page.tsx dark mode enabled")
