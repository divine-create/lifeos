import { Clock, MoreVertical, PlayCircle } from "lucide-react";

export default function SchedulePage() {
  const schedule = [
    { time: "12:00 AM – 1:00 AM", title: "Goal Review / Planning", status: "completed" },
    { time: "1:00 AM – 3:00 AM", title: "Coding & Development", status: "completed" },
    { time: "3:00 AM – 6:00 AM", title: "1st Study Session (Machine Learning)", status: "active" },
    { time: "6:00 AM – 7:00 AM", title: "Morning Devotion / Bath", status: "pending" },
    { time: "7:00 AM – 12:00 PM", title: "2nd Study Session", status: "pending" },
    { time: "12:00 PM – 2:00 PM", title: "Rest / Quiet Time / Exercise / Lunch", status: "pending" },
  ];

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Today's Schedule</h1>
          <p className="text-gray-500 mt-2">Generated from Weekday Template</p>
        </div>
        <button className="text-sm border border-gray-300 rounded-md px-4 py-2 hover:bg-gray-50 transition">
          Edit Templates
        </button>
      </div>

      <div className="relative border-l-2 border-gray-200 ml-4 space-y-8 pb-8">
        {schedule.map((slot, idx) => (
          <div key={idx} className="relative pl-8">
            {/* Timeline Dot */}
            <span className={`absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 border-white ${
              slot.status === 'completed' ? 'bg-green-500' :
              slot.status === 'active' ? 'bg-blue-500 animate-pulse' :
              'bg-gray-300'
            }`} />

            <div className={`rounded-xl border p-5 shadow-sm transition-all ${
              slot.status === 'active' ? 'bg-blue-50 border-blue-200' : 'bg-white hover:bg-gray-50'
            }`}>
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                    <Clock className="h-4 w-4" />
                    <span>{slot.time}</span>
                  </div>
                  <h3 className={`text-lg font-semibold ${slot.status === 'completed' ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                    {slot.title}
                  </h3>
                </div>
                
                <div className="flex items-center gap-2">
                  {slot.status === 'active' && (
                    <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition">
                      <PlayCircle className="h-4 w-4" />
                      Start Focus
                    </button>
                  )}
                  {slot.status === 'pending' && (
                    <button className="text-sm font-medium text-blue-600 hover:text-blue-800 transition">
                      Start Early
                    </button>
                  )}
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <MoreVertical className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
