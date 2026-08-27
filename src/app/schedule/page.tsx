import { Clock, MoreVertical, PlayCircle, Plus, Trash2, CheckCircle2 } from "lucide-react";
import { getScheduleSlots, createScheduleSlot, updateScheduleSlotStatus, deleteScheduleSlot } from "@/app/actions";

export default async function SchedulePage() {
  const schedule = await getScheduleSlots();

  return (
    <div className="space-y-8 max-w-4xl mx-auto pt-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Today's Schedule</h1>
        </div>
      </div>

      {/* Create Slot Form */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold mb-4">Add Schedule Block</h2>
        <form action={createScheduleSlot} className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1 w-full space-y-1">
            <label className="text-xs font-medium text-gray-700">What are you doing?</label>
            <input
              name="title"
              required
              type="text"
              placeholder="e.g. Deep Work, Gym, Reading"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div className="w-full sm:w-32 space-y-1">
            <label className="text-xs font-medium text-gray-700">Start Time</label>
            <input
              name="startTime"
              required
              type="time"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div className="w-full sm:w-32 space-y-1">
            <label className="text-xs font-medium text-gray-700">End Time</label>
            <input
              name="endTime"
              required
              type="time"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition h-[38px]"
          >
            <Plus className="h-4 w-4" />
            Add Block
          </button>
        </form>
      </div>

      {/* Timeline */}
      {schedule.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center shadow-sm">
          <p className="text-gray-500 text-sm">No schedule blocks added yet. Start planning your day!</p>
        </div>
      ) : (
        <div className="relative border-l-2 border-gray-200 ml-4 space-y-6 pb-8 pt-4">
          {schedule.map((slot) => {
            const setCompletedAction = updateScheduleSlotStatus.bind(null, slot.id, "completed");
            const setActiveAction = updateScheduleSlotStatus.bind(null, slot.id, "active");
            const setPendingAction = updateScheduleSlotStatus.bind(null, slot.id, "pending");
            const deleteAction = deleteScheduleSlot.bind(null, slot.id);

            return (
              <div key={slot.id} className="relative pl-8 group">
                {/* Timeline Dot */}
                <span className={`absolute -left-[9px] top-1.5 h-4 w-4 rounded-full border-2 border-white ${
                  slot.status === 'completed' ? 'bg-green-500' :
                  slot.status === 'active' ? 'bg-blue-500 animate-pulse' :
                  'bg-gray-300'
                }`} />

                <div className={`rounded-lg border p-4 shadow-sm transition-all ${
                  slot.status === 'active' ? 'bg-[#e5efff] border-blue-200' : 'bg-white hover:bg-gray-50'
                }`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-1">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{slot.startTime} – {slot.endTime}</span>
                      </div>
                      <h3 className={`text-base font-semibold ${slot.status === 'completed' ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                        {slot.title}
                      </h3>
                    </div>
                    
                    <div className="flex items-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      {slot.status === 'pending' && (
                        <form action={setActiveAction}>
                          <button className="flex items-center gap-1.5 bg-blue-600 text-white px-3 py-1.5 rounded-md text-xs font-medium hover:bg-blue-700 transition">
                            <PlayCircle className="h-3.5 w-3.5" />
                            Start
                          </button>
                        </form>
                      )}
                      {slot.status === 'active' && (
                        <form action={setCompletedAction}>
                          <button className="flex items-center gap-1.5 bg-green-600 text-white px-3 py-1.5 rounded-md text-xs font-medium hover:bg-green-700 transition">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Finish
                          </button>
                        </form>
                      )}
                      {slot.status === 'completed' && (
                        <form action={setPendingAction}>
                          <button className="text-xs font-medium text-gray-400 hover:text-gray-600 transition px-2">
                            Undo
                          </button>
                        </form>
                      )}
                      
                      <form action={deleteAction}>
                        <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
