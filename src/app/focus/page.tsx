"use client";

import { useState, useEffect } from "react";
import { Play, Pause, Square, CheckCircle2 } from "lucide-react";

export default function FocusPage() {
  const [isActive, setIsActive] = useState(false);
  const [seconds, setSeconds] = useState(0);

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

  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col items-center justify-center h-[80vh] space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Machine Learning</h1>
        <p className="text-gray-500">Current Task: Fix authentication token refresh</p>
      </div>

      <div className="relative flex items-center justify-center w-80 h-80 rounded-full border-8 border-gray-100 shadow-inner bg-white">
        <div className="absolute font-mono text-6xl font-bold tracking-tighter">
          {formatTime(seconds)}
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button
          onClick={toggle}
          className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          {isActive ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8 ml-1" />}
        </button>

        <button
          onClick={reset}
          className="flex items-center justify-center h-16 w-16 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition"
        >
          <Square className="h-6 w-6" />
        </button>

        <button className="flex items-center justify-center h-16 w-16 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition">
          <CheckCircle2 className="h-8 w-8" />
        </button>
      </div>
      
      <div className="text-sm text-gray-400 mt-8">
        Press <span className="font-semibold text-green-600">Check</span> to log this activity to your dashboard.
      </div>
    </div>
  );
}
