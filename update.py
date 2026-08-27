import re

with open("src/app/actions.ts", "r", encoding="utf-8") as f:
    content = f.read()

old_block = '''export async function createTracker(formData: FormData) {
  const userId = await getUserId();
  if (!userId) throw new Error("Not authenticated");

  await prisma.tracker.create({
    data: {
      userId,
      title: formData.get("title") as string,
      type: (formData.get("type") as string) || "Positive Habit",
      frequency: (formData.get("frequency") as string) || "Daily",
    },
  });
  revalidatePath("/");
}

export async function logTrackerEntry(formData: FormData) {
  const userId = await getUserId();
  if (!userId) throw new Error("Not authenticated");

  const trackerId = formData.get("trackerId") as string;
  // Verify ownership
  const tracker = await prisma.tracker.findFirst({ where: { id: trackerId, userId } });
  if (!tracker) throw new Error("Tracker not found");

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Upsert today's log
  const existing = await prisma.trackerLog.findFirst({
    where: { trackerId, date: today },
  });

  if (existing) {
    await prisma.trackerLog.update({
      where: { id: existing.id },
      data: {
        value: 1,
        status: "Successful",
      },
    });
  } else {
    await prisma.trackerLog.create({
      data: {
        trackerId,
        date: today,
        value: 1,
        status: "Successful",
      },
    });
  }
  revalidatePath("/");
}'''

new_block = '''export async function createTracker(formData: FormData) {
  const userId = await getUserId();
  if (!userId) throw new Error("Not authenticated");

  const targetValueStr = formData.get("targetValue") as string;
  const targetValue = targetValueStr ? parseFloat(targetValueStr) : null;

  await prisma.tracker.create({
    data: {
      userId,
      title: formData.get("title") as string,
      type: (formData.get("type") as string) || "BOOLEAN",
      frequency: (formData.get("frequency") as string) || "DAILY",
      targetValue,
      unit: (formData.get("unit") as string) || null,
    },
  });
  revalidatePath("/");
}

export async function logTrackerEntry(formData: FormData) {
  const userId = await getUserId();
  if (!userId) throw new Error("Not authenticated");

  const trackerId = formData.get("trackerId") as string;
  const tracker = await prisma.tracker.findFirst({ where: { id: trackerId, userId } });
  if (!tracker) throw new Error("Tracker not found");

  const valueStr = formData.get("value") as string;
  const value = valueStr ? parseFloat(valueStr) : 1;
  const status = (formData.get("status") as string) || "Successful";
  
  const dateStr = formData.get("date") as string;
  const logDate = dateStr ? new Date(dateStr) : new Date();
  logDate.setHours(0, 0, 0, 0);

  const existing = await prisma.trackerLog.findFirst({
    where: { trackerId, date: logDate },
  });

  if (existing) {
    const isToggleOff = formData.get("toggleOff") === "true";
    if (isToggleOff) {
      await prisma.trackerLog.delete({ where: { id: existing.id } });
    } else {
      await prisma.trackerLog.update({
        where: { id: existing.id },
        data: { value, status },
      });
    }
  } else {
    await prisma.trackerLog.create({
      data: {
        trackerId,
        date: logDate,
        value,
        status,
      },
    });
  }
  revalidatePath("/");
  revalidatePath("/logbook");
}

export async function deleteTracker(id: string) {
  const userId = await getUserId();
  if (!userId) throw new Error("Not authenticated");
  await prisma.tracker.delete({ where: { id, userId } });
  revalidatePath("/");
}'''

new_content = content.replace(old_block, new_block)
with open("src/app/actions.ts", "w", encoding="utf-8") as f:
    f.write(new_content)
print("Updated successfully")
