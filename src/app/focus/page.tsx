"use client";

import { useState, useEffect } from "react";
import { Play, Pause, Square, CheckCircle2 } from "lucide-react";
import { logFocusActivity } from "@/app/actions";

export default function FocusPage() {
  const [isActive, setIsActive] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [taskTitle, setTaskTitle] = useState("");
  const [isLogging, setIsLogging] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((seconds) => seconds + 1);
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
      await logFocusActivity(taskTitle, minutes);
      alert(`Logged ${minutes} minute focus session!`);
      reset();
      setTaskTitle("");
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
    <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-12">
      <div className="w-full max-w-sm">
        <input
          type="text"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          placeholder="What are you focusing on?"
          className="w-full bg-transparent border-b-2 border-gray-200 focus:border-blue-600 px-2 py-3 text-center text-xl font-semibold text-gray-900 placeholder:text-gray-400 focus:outline-none transition-colors"
        />
      </div>

      <div className="relative flex items-center justify-center w-72 h-72 rounded-full border-[10px] border-[#fafafa] shadow-inner bg-white">
        {isActive && (
          <div className="absolute inset-0 rounded-full border-[10px] border-blue-600 opacity-20 animate-ping" />
        )}
        <div className="absolute font-mono text-7xl font-bold tracking-tighter text-blue-600">
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
