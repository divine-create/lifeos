import re

with open("src/components/Sidebar.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# The block to remove:
block_to_remove = """          {mounted && (
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="flex items-center gap-3 w-full rounded-lg px-3 py-2 text-[14px] text-gray-700 dark:text-zinc-400 hover:bg-gray-200/50 dark:hover:bg-zinc-800/50 transition-colors"
            >
              {theme === 'dark' ? <Sun className="h-[18px] w-[18px] text-yellow-500" /> : <Moon className="h-[18px] w-[18px] text-gray-500" />}
              <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
          )}"""

content = content.replace(block_to_remove, "")
# Remove Moon, Sun from lucide-react if present, though harmless.
# Remove useTheme import, mounted state... Actually, it's safer to just replace the block.
# Since my regex might not perfectly match indentation, I will just rewrite it to remove the button.

with open("src/components/Sidebar.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated Sidebar.tsx")
