import React, { useState, useEffect } from "react";

const HoldTimer = ({ startTime, onExpire }) => {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (!startTime) return;

    const calculateTimeLeft = () => {
      const tenMinutes = 10 * 60 * 1000;
      const difference = startTime + tenMinutes - Date.now();
      return Math.max(0, difference);
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);
      if (remaining <= 0) {
        clearInterval(timer);
        onExpire();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime, onExpire]);

  if (!startTime || timeLeft <= 0) return null;

  const minutes = Math.floor(timeLeft / 60000);
  const seconds = Math.floor((timeLeft % 60000) / 1000);

  const isWarning = timeLeft < 2 * 60 * 1000;

  return (
    <div className="flex flex-col items-center justify-center py-4 px-6 text-center">
      <p className="text-[10px] uppercase font-black tracking-[0.3em] text-white/40 mb-3">
        Session <span className="text-brand-primary">Security</span>
      </p>
      <div className="flex items-center gap-4">
        <div className={`text-4xl font-black tabular-nums transition-colors duration-500 ${isWarning ? "text-brand-primary animate-pulse" : "text-white"}`}>
          {minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
        </div>
      </div>
      <p className="text-[9px] uppercase font-bold tracking-widest text-white/20 mt-3">
        Remaining time to complete
      </p>
    </div>
  );
};

export default HoldTimer;
