import re
with open("src/components/TrackerWidget.tsx", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace('bg-green-100 border-green-200 text-green-700', 'bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400')
content = content.replace('bg-blue-50 border-blue-100 text-blue-700', 'bg-blue-50 dark:bg-blue-900/30 border-blue-100 dark:border-blue-800 text-blue-700 dark:text-blue-400')

# Also fix the hover on empty squares
content = content.replace('hover:text-gray-300', 'hover:text-gray-300 dark:hover:text-zinc-500')

with open("src/components/TrackerWidget.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Fixed tracker widget colors")
