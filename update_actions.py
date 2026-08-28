import re

with open("src/app/actions.ts", "r", encoding="utf-8") as f:
    content = f.read()

# Update createTracker
create_func = """export async function createTracker(formData: FormData) {
  const userId = await getUserId();
  if (!userId) throw new Error("Not authenticated");

  const title = formData.get("title") as string;
  const type = formData.get("type") as string;
  const targetValue = formData.get("targetValue") as string;
  const unit = formData.get("unit") as string;
  const frequency = formData.get("frequency") as string || "DAILY";
  const frequencyDays = formData.get("frequencyDays") as string;
  const frequencyTargetStr = formData.get("frequencyTarget") as string;
  const goalId = formData.get("goalId") as string;

  await prisma.tracker.create({
    data: {
      userId,
      title,
      type,
      targetValue: targetValue ? parseFloat(targetValue) : null,
      unit,
      frequency,
      frequencyDays: frequencyDays || null,
      frequencyTarget: frequencyTargetStr ? parseInt(frequencyTargetStr, 10) : null,
      goalId: goalId || null
    },
  });

  revalidatePath("/trackers");
  revalidatePath("/");
}"""
content = re.sub(r'export async function createTracker\(formData: FormData\) \{.*?revalidatePath\("/"\);\n\}', create_func, content, flags=re.DOTALL)

with open("src/app/actions.ts", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated createTracker in actions.ts")
