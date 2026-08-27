import { getTrackers } from "@/app/actions";
import { Flame, CheckSquare, Activity, Plus, Target, CheckCircle2 } from "lucide-react";
import { TrackerWidget } from "@/components/TrackerWidget";

export default async function TrackersPage() {
  const trackers = await getTrackers();
  
  return (
    <div className="mx-auto max-w-5xl space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Habit Tracker</h1>
        <p className="mt-2 text-gray-500">Manage your daily habits, abstinence rules, and quantifiable goals.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm min-h-[500px]">
            <TrackerWidget trackers={trackers} />
          </div>
        </div>
        
        <div className="md:col-span-1 space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-gray-900 mb-4">Why Track?</h2>
            <p className="text-sm text-gray-600 mb-3">
              Trackers help you measure consistency over time. By combining different tracker types, you can enforce discipline across all areas of your life.
            </p>
            <ul className="text-sm text-gray-600 space-y-2">
              <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" /> <b>Boolean:</b> Simple yes/no habits.</li>
              <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" /> <b>Abstinence:</b> Rules to not break.</li>
              <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" /> <b>Duration:</b> Time invested.</li>
              <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" /> <b>Quantity:</b> Volumes achieved.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
