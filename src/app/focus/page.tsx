import { getTasks } from "@/app/actions";
import { FocusTimerClient } from "@/components/FocusTimerClient";

export default async function FocusPage() {
  const allTasks = await getTasks();
  const activeTasks = allTasks.filter(t => t.status !== "Done" && t.status !== "Cancelled");

  const simplifiedTasks = activeTasks.map(t => ({
    id: t.id,
    title: t.title
  }));

  return <FocusTimerClient tasks={simplifiedTasks} />;
}
