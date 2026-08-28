import re

with open("prisma/schema.prisma", "r", encoding="utf-8") as f:
    content = f.read()

# Add Tracker relation to Goal
content = content.replace('    tasks            Task[]', '    tasks            Task[]\n  trackers         Tracker[]')

# Add fields to Tracker
tracker_fields = """    frequency   String   // Daily, Weekly
  frequencyDays String?  // e.g. "Mon,Wed,Fri"
  frequencyTarget Int?   // e.g. 3
  goalId        String?
  goal          Goal?    @relation(fields: [goalId], references: [id], onDelete: Cascade)"""
content = content.replace('    frequency   String   // Daily, Weekly', tracker_fields)

with open("prisma/schema.prisma", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated schema.prisma")
