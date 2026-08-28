function toDateString(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function calculateTrackerStats(tracker: any) {
  const logs = tracker?.logs || [];
  
  const logMap = new Map();
  for (const log of logs) {
    const d = new Date(log.date);
    if (!isNaN(d.getTime())) {
      const dateStr = toDateString(d);
      if (!logMap.has(dateStr)) {
        logMap.set(dateStr, log);
      }
    }
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 1. Current Streak
  let currentStreak = 0;
  let startD = new Date(today);
  let todayStr = toDateString(startD);
  let tLog = logMap.get(todayStr);
  
  // If today is missing, streak is based on yesterday
  if (!tLog) {
    startD.setDate(startD.getDate() - 1);
  }

  let tempStreak = 0;
  let loopD = new Date(startD);
  while (true) {
    let str = toDateString(loopD);
    let log = logMap.get(str);
    if (log) {
      if (log.status === 'Successful') {
        tempStreak++;
      } else if (log.status === 'Skipped') {
        // Protects streak, does not increment
      } else {
        break; // Failed or other status breaks
      }
    } else {
      break; // Missing day breaks
    }
    loopD.setDate(loopD.getDate() - 1);
  }
  currentStreak = tempStreak;

  // 2. Longest Streak & 4. Day of Week Stats
  let longestStreak = 0;
  let dowSuccess = [0, 0, 0, 0, 0, 0, 0];
  let dowTotal = [0, 0, 0, 0, 0, 0, 0];

  if (logs.length > 0) {
    let oldestDate = new Date(logs[logs.length - 1].date);
    if (!isNaN(oldestDate.getTime())) {
      oldestDate.setHours(0, 0, 0, 0);
      
      let iterD = new Date(oldestDate);
      let currLongest = 0;
      while (iterD <= today) {
        let str = toDateString(iterD);
        let log = logMap.get(str);
        const day = iterD.getDay();

        if (log) {
          if (log.status === 'Successful') {
            currLongest++;
            if (currLongest > longestStreak) longestStreak = currLongest;
            dowTotal[day]++;
            dowSuccess[day]++;
          } else if (log.status === 'Skipped') {
            // Protects streak, doesn't count in Day of Week denominator
          } else {
            currLongest = 0;
            dowTotal[day]++;
          }
        } else {
          currLongest = 0;
          dowTotal[day]++; // Missing day counts as a fail
        }
        iterD.setDate(iterD.getDate() + 1);
      }
    }
  }

  // 3. Completion Rate 30d
  let complete30 = 0;
  let total30 = 0;
  let iter30 = new Date(today);
  iter30.setDate(iter30.getDate() - 29); // 30 days ending today
  
  for (let i = 0; i < 30; i++) {
    let str = toDateString(iter30);
    let log = logMap.get(str);
    
    if (log && log.status === 'Skipped') {
      // ignore in denominator
    } else {
      total30++;
      if (log && log.status === 'Successful') {
        complete30++;
      }
    }
    iter30.setDate(iter30.getDate() + 1);
  }
  
  const completionRate30d = total30 === 0 ? 0 : (complete30 / total30);
  const dayOfWeekStats = dowTotal.map((total, i) => total === 0 ? 0 : dowSuccess[i] / total);

  return {
    currentStreak,
    longestStreak,
    completionRate30d,
    dayOfWeekStats
  };
}
