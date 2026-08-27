"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

// Bypassing NextAuth for local testing
async function getUserId() {
  const dummyEmail = "test@example.com";
  try {
    let user = await prisma.user.findUnique({ where: { email: dummyEmail } });
    if (!user) {
      user = await prisma.user.create({
        data: { email: dummyEmail, name: "Test User" }
      });
    }
    return user.id;
  } catch (error) {
    console.error("Database connection failed or user could not be created:", error);
    return null;
  }
}

// --- GOALS ---

export async function getGoals() {
  const userId = await getUserId();
  if (!userId) return [];
  try {
    return await prisma.goal.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Failed to fetch goals:", error);
    return [];
  }
}

export async function createGoal(formData: FormData) {
  const userId = await getUserId();
  if (!userId) throw new Error("Database not ready or unauthorized");

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const type = formData.get("type") as string;

  if (!title) throw new Error("Title is required");

  await prisma.goal.create({
    data: {
      userId,
      title,
      description,
      type: type || "Achievement",
      status: "Active",
    },
  });

  revalidatePath("/goals");
  revalidatePath("/");
}

// --- TASKS ---

export async function getTasks() {
  const userId = await getUserId();
  if (!userId) return [];
  try {
    return await prisma.task.findMany({
      where: { userId },
      include: { project: true, goal: true },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Failed to fetch tasks:", error);
    return [];
  }
}

export async function createTask(formData: FormData) {
  const userId = await getUserId();
  if (!userId) throw new Error("Database not ready or unauthorized");

  const title = formData.get("title") as string;
  const priority = formData.get("priority") as string;
  
  if (!title) throw new Error("Title is required");

  await prisma.task.create({
    data: {
      userId,
      title,
      priority: priority || "Medium",
      status: "Todo",
    },
  });

  revalidatePath("/tasks");
  revalidatePath("/");
}

export async function toggleTaskStatus(taskId: string, currentStatus: string) {
  const userId = await getUserId();
  if (!userId) throw new Error("Database not ready or unauthorized");

  const newStatus = currentStatus === "Done" ? "Todo" : "Done";

  await prisma.task.update({
    where: { id: taskId, userId },
    data: { status: newStatus },
  });

  revalidatePath("/tasks");
  revalidatePath("/");
}

// --- ACTIVITIES ---

export async function getActivities() {
  const userId = await getUserId();
  if (!userId) return [];
  try {
    return await prisma.activity.findMany({
      where: { userId },
      orderBy: { startTime: "desc" },
      take: 10,
    });
  } catch (error) {
    console.error("Failed to fetch activities:", error);
    return [];
  }
}
