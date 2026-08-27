import re

with open("src/components/TrackerWidget.tsx", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace(
    'import { createTracker, logTrackerEntry, deleteTracker } from "@/app/actions";',
    'import { createTracker, logTrackerEntry, deleteTracker } from "@/app/actions";\nimport toast from "react-hot-toast";'
)

# Replace all <form action={logTrackerEntry} with a wrapper
content = content.replace(
    '<form action={logTrackerEntry}>',
    '<form action={async (formData) => { await logTrackerEntry(formData); toast.success("Saved"); }}>'
)
content = content.replace(
    '<form action={logTrackerEntry} className="flex items-center gap-1">',
    '<form action={async (formData) => { await logTrackerEntry(formData); toast.success("Saved"); }} className="flex items-center gap-1">'
)
content = content.replace(
    '<form action={() => deleteTracker(tracker.id)}>',
    '<form action={async () => { await deleteTracker(tracker.id); toast.success("Tracker deleted"); }}>'
)
content = content.replace(
    'createTracker(data); setShowForm(false);',
    'await createTracker(data); setShowForm(false); toast.success("Tracker created");'
)

with open("src/components/TrackerWidget.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated TrackerWidget")
