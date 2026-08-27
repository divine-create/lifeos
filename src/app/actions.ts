"use server";

import { revalidatePath } from "next/cache";import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

async function getUserId(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  return user?.id ?? null;
}

// ─── GOALS ────────────────────────────────────────

export async function getGoals() {
  const userId = await getUserId();
  if (!userId) return [];
  return prisma.goal.findMany({
    where: { userId },
    include: {
      milestones: {
        include: {
          projects: {
            include: { tasks: true }
          },
          tasks: true
        }
      },
      projects: {
        include: { tasks: true }
      }
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function createGoal(formData: FormData) {
  const userId = await getUserId();
  if (!userId) throw new Error("Not authenticated");

  const goal = await prisma.goal.create({
    data: {
      userId,
      title: formData.get("title") as string,
      description: (formData.get("description") as string) || "",
      type: (formData.get("type") as string) || "Achievement",
      status: "Active",
    },
  });

  const milestoneTitle = formData.get("milestoneTitle") as string;
  if (milestoneTitle && milestoneTitle.trim() !== "") {
    await prisma.milestone.create({
      data: {
        userId,
        goalId: goal.id,
        title: milestoneTitle.trim(),
        status: "Pending",
      },
    });
  }

  revalidatePath("/planning");
  revalidatePath("/");
}

export async function deleteGoal(goalId: string) {
  const userId = await getUserId();
  if (!userId) throw new Error("Not authenticated");
  await prisma.goal.delete({ where: { id: goalId, userId } });
  revalidatePath("/planning");
  revalidatePath("/");
}

// ─── TASKS ────────────────────────────────────────

export async function getTasks() {
  const userId = await getUserId();
  if (!userId) return [];
  return prisma.task.findMany({
    where: { userId },
    include: { project: true, goal: true, milestone: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function createTask(formData: FormData) {
  const userId = await getUserId();
  if (!userId) throw new Error("Not authenticated");

  const deadlineStr = formData.get("deadline") as string;
  const deadline = deadlineStr ? new Date(deadlineStr) : null;

  const goalId = formData.get("goalId") as string;
  const milestoneId = formData.get("milestoneId") as string;
  const projectId = formData.get("projectId") as string;

  await prisma.task.create({
    data: {
      userId,
      title: formData.get("title") as string,
      priority: (formData.get("priority") as string) || "Medium",
      status: "Todo",
      deadline,
      goalId: goalId || null,
      milestoneId: milestoneId || null,
      projectId: projectId || null,
      estimatedTime: formData.get("estimatedTime")
        ? parseInt(formData.get("estimatedTime") as string)
        : null,
    },
  });
  revalidatePath("/execution");
  revalidatePath("/planning");
  revalidatePath("/planning");
  revalidatePath("/planning");
  revalidatePath("/");
}

export async function toggleTaskStatus(taskId: string, currentStatus: string) {
  const userId = await getUserId();
  if (!userId) throw new Error("Not authenticated");
  await prisma.task.update({
    where: { id: taskId, userId },
    data: { status: currentStatus === "Done" ? "Todo" : "Done" },
  });
  revalidatePath("/execution");
  revalidatePath("/planning");
  revalidatePath("/planning");
  revalidatePath("/");
}

export async function deleteTask(taskId: string) {
  const userId = await getUserId();
  if (!userId) throw new Error("Not authenticated");
  await prisma.task.delete({ where: { id: taskId, userId } });
  revalidatePath("/execution");
  revalidatePath("/");
}

// ─── PROJECTS ─────────────────────────────────────

export async function getProjects() {
  const userId = await getUserId();
  if (!userId) return [];
  return prisma.project.findMany({
    where: { userId },
    include: {
      goal: true,
      tasks: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function createProject(formData: FormData) {
  const userId = await getUserId();
  if (!userId) throw new Error("Not authenticated");

  const goalId = formData.get("goalId") as string;

  await prisma.project.create({
    data: {
      userId,
      title: formData.get("title") as string,
      description: (formData.get("description") as string) || "",
      status: "Active",
      goalId: goalId || null,
    },
  });
  revalidatePath("/planning");
  revalidatePath("/");
}

export async function deleteProject(projectId: string) {
  const userId = await getUserId();
  if (!userId) throw new Error("Not authenticated");
  await prisma.project.delete({ where: { id: projectId, userId } });
  revalidatePath("/planning");
}

// ─── MILESTONES ───────────────────────────────────

export async function getMilestones() {
  const userId = await getUserId();
  if (!userId) return [];
  return prisma.milestone.findMany({
    where: { userId },
    include: {
      goal: true,
      tasks: true,
    },
    orderBy: { deadline: "asc" },
  });
}

export async function createMilestone(formData: FormData) {
  const userId = await getUserId();
  if (!userId) throw new Error("Not authenticated");

  await prisma.milestone.create({
    data: {
      userId,
      goalId: formData.get("goalId") as string,
      title: formData.get("title") as string,
      deadline: formData.get("deadline")
        ? new Date(formData.get("deadline") as string)
        : null,
      status: "Pending",
    },
  });
  revalidatePath("/planning");
}

// ─── ACTIVITIES ───────────────────────────────────

export async function getActivities() {
  const userId = await getUserId();
  if (!userId) return [];
  return prisma.activity.findMany({
    where: { userId },
    orderBy: { startTime: "desc" },
    take: 50,
  });
}

export async function createActivity(formData: FormData) {
  const userId = await getUserId();
  if (!userId) throw new Error("Not authenticated");

  await prisma.activity.create({
    data: {
      userId,
      type: formData.get("type") as string,
      plannedDuration: formData.get("plannedDuration")
        ? parseInt(formData.get("plannedDuration") as string)
        : null,
      actualDuration: formData.get("actualDuration")
        ? parseInt(formData.get("actualDuration") as string)
        : null,
      startTime: new Date(formData.get("startTime") as string),
      endTime: formData.get("endTime")
        ? new Date(formData.get("endTime") as string)
        : null,
      qualityRating: formData.get("qualityRating")
        ? parseInt(formData.get("qualityRating") as string)
        : null,
      notes: (formData.get("notes") as string) || null,
    },
  });
  revalidatePath("/logbook");
  revalidatePath("/");
}

// ─── TRACKERS ─────────────────────────────────────

export async function getTrackers() {
  const userId = await getUserId();
  if (!userId) return [];
  return prisma.tracker.findMany({
    where: { userId },
    include: {
      logs: {
        orderBy: { date: "desc" },
        take: 7,
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function createTracker(formData: FormData) {
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
}

// ─── DASHBOARD STATS ──────────────────────────────

export async function getDashboardStats() {
  const userId = await getUserId();
  if (!userId) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [totalTasks, doneTasks, activeGoals, todayActivities] = await Promise.all([
    prisma.task.count({ where: { userId } }),
    prisma.task.count({ where: { userId, status: "Done" } }),
    prisma.goal.count({ where: { userId, status: "Active" } }),
    prisma.activity.findMany({
      where: { userId, startTime: { gte: today, lt: tomorrow } },
    }),
  ]);

  const totalPlanned = todayActivities.reduce((s, a) => s + (a.plannedDuration || 0), 0);
  const totalActual = todayActivities.reduce((s, a) => s + (a.actualDuration || 0), 0);

  return {
    totalTasks,
    doneTasks,
    activeGoals,
    todayActivities: todayActivities.length,
    executionRate: totalPlanned > 0 ? Math.round((totalActual / totalPlanned) * 100) : 0,
  };
}
// ─── SCHEDULE SLOTS ─────────────────────────────────

export async function getScheduleSlots() {
  const userId = await getUserId();
  if (!userId) return [];
  return prisma.scheduleSlot.findMany({
    where: { userId },
    orderBy: { startTime: "asc" },
  });
}

export async function createScheduleSlot(formData: FormData) {
  const userId = await getUserId();
  if (!userId) throw new Error("Not authenticated");

  await prisma.scheduleSlot.create({
    data: {
      userId,
      title: formData.get("title") as string,
      startTime: formData.get("startTime") as string,
      endTime: formData.get("endTime") as string,
      status: "pending",
    },
  });
  revalidatePath("/execution");
}

export async function updateScheduleSlotStatus(id: string, status: string) {
  const userId = await getUserId();
  if (!userId) throw new Error("Not authenticated");

  await prisma.scheduleSlot.update({
    where: { id, userId },
    data: { status },
  });
  revalidatePath("/execution");
}

export async function deleteScheduleSlot(id: string) {
  const userId = await getUserId();
  if (!userId) throw new Error("Not authenticated");

  await prisma.scheduleSlot.delete({
    where: { id, userId },
  });
  revalidatePath("/execution");
}

// ─── FOCUS TIMER ───────────────────────────────────

export async function logFocusActivity(title: string, durationMinutes: number) {
  const userId = await getUserId();
  if (!userId) throw new Error("Not authenticated");

  const endTime = new Date();
  const startTime = new Date(endTime.getTime() - durationMinutes * 60000);

  await prisma.activity.create({
    data: {
      userId,
      type: "Focus Session",
      plannedDuration: null,
      actualDuration: durationMinutes,
      startTime,
      endTime,
      qualityRating: null,
      notes: title || "Unlabeled Focus Session",
    },
  });
  revalidatePath("/logbook");
  revalidatePath("/");
}

// ─── GOAL TYPES ────────────────────────────────────

export async function getGoalTypes() {
  const userId = await getUserId();
  if (!userId) return [];
  
  // Ensure default types exist
  const existingTypes = await prisma.goalType.findMany({ where: { userId } });
  
  if (existingTypes.length === 0) {
    const defaults = ["Achievement", "Learning", "Habit", "Health", "Career", "Finance"];
    await prisma.goalType.createMany({
      data: defaults.map(name => ({ userId, name })),
      skipDuplicates: true
    });
    return prisma.goalType.findMany({ where: { userId } });
  }
  
  return existingTypes;
}

export async function createGoalType(formData: FormData) {
  const userId = await getUserId();
  if (!userId) throw new Error("Not authenticated");

  const name = formData.get("name") as string;
  if (!name || name.trim() === "") return;

  await prisma.goalType.create({
    data: { userId, name: name.trim() },
  });
  
  revalidatePath("/settings");
  revalidatePath("/planning");
}

export async function deleteGoalType(id: string) {
  const userId = await getUserId();
  if (!userId) throw new Error("Not authenticated");

  await prisma.goalType.delete({
    where: { id, userId },
  });
  
  revalidatePath("/settings");
  revalidatePath("/planning");
}

export async function updateGoal(id: string, formData: FormData) {
  const userId = await getUserId();
  if (!userId) throw new Error("Not authenticated");

  await prisma.goal.update({
    where: { id, userId },
    data: {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      type: formData.get("type") as string,
      status: formData.get("status") as string,
    },
  });
  revalidatePath("/planning");
  revalidatePath("/");
  redirect("/planning");
}
