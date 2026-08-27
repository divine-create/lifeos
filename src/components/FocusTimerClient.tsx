"use client";

import { useState, useEffect } from "react";
import { Play, Pause, Square, CheckCircle2 } from "lucide-react";
import { logFocusActivity } from "@/app/actions";

interface Task {
  id: string;
  title: string;
}

export function FocusTimerClient({ tasks }: { tasks: Task[] }) {
  const [isActive, setIsActive] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [selectedTaskId, setSelectedTaskId] = useState("");
  const [customTaskTitle, setCustomTaskTitle] = useState("");
  const [isLogging, setIsLogging] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  const toggle = () => setIsActive(!isActive);

  const reset = () => {
    setIsActive(false);
    setSeconds(0);
  };

  const logSession = async () => {
    if (seconds < 60) {
      alert("Sessions under 1 minute are not logged.");
      reset();
      return;
    }
    
    setIsLogging(true);
    try {
      const minutes = Math.round(seconds / 60);
      let titleToLog = customTaskTitle;
      
      if (selectedTaskId) {
        const task = tasks.find(t => t.id === selectedTaskId);
        if (task) titleToLog = task.title;
      }

      await logFocusActivity(titleToLog, minutes);
      alert(`Logged ${minutes} minute focus session!`);
      reset();
      setCustomTaskTitle("");
      setSelectedTaskId("");
    } catch (e) {
      alert("Failed to log session.");
    } finally {
      setIsLogging(false);
    }
  };

  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    
    if (hrs > 0) {
      return `${hrs.toString().padStart(2, "0")}:${mins
        .toString()
        .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col items-center justify-center w-full space-y-8">
      <div className="w-full max-w-sm space-y-4">
        
        <select
          value={selectedTaskId}
          onChange={(e) => {
            setSelectedTaskId(e.target.value);
            setCustomTaskTitle(""); // clear custom title if a task is selected
          }}
          className="w-full rounded-md border border-gray-300 px-3 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-sm bg-white"
        >
          <option value="">-- Select an active task --</option>
          {tasks.map(t => (
            <option key={t.id} value={t.id}>{t.title}</option>
          ))}
        </select>

        {!selectedTaskId && (
          <div className="relative">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-[#fafafa] px-2 text-xs text-gray-400 uppercase tracking-widest">or type custom</span>
            </div>
          </div>
        )}

        {!selectedTaskId && (
          <input
            type="text"
            value={customTaskTitle}
            onChange={(e) => setCustomTaskTitle(e.target.value)}
            placeholder="What are you focusing on?"
            className="w-full bg-transparent border-b-2 border-gray-300 focus:border-blue-600 px-2 py-2 text-center text-lg font-semibold text-gray-900 placeholder:text-gray-400 focus:outline-none transition-colors"
          />
        )}
      </div>

      <div className="relative flex items-center justify-center w-56 h-56 rounded-full border-8 border-white shadow-inner bg-white">
        {isActive && (
          <div className="absolute inset-0 rounded-full border-8 border-blue-600 opacity-20 animate-ping" />
        )}
        <div className="absolute font-mono text-5xl font-bold tracking-tighter text-blue-600">
          {formatTime(seconds)}
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button
          onClick={toggle}
          disabled={isLogging}
          className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition shadow-md disabled:opacity-50"
        >
          {isActive ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8 ml-1" />}
        </button>

        <button
          onClick={reset}
          disabled={seconds === 0 || isLogging}
          className="flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600 transition disabled:opacity-50"
        >
          <Square className="h-6 w-6" />
        </button>

        <button 
          onClick={logSession}
          disabled={seconds === 0 || isLogging}
          className="flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 text-gray-600 hover:bg-green-100 hover:text-green-600 transition disabled:opacity-50"
        >
          <CheckCircle2 className="h-8 w-8" />
        </button>
      </div>
      
      <div className="text-sm text-gray-400 mt-8 text-center max-w-xs">
        Press <span className="font-semibold text-green-600">Check</span> to finish and log this activity to your database.
      </div>
    </div>
  );
}
