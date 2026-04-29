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
    <div
      className={`flex flex-col items-center p-4 glass-card border-t-2 ${isWarning ? "border-cinema-red" : "border-cinema-gold"}`}
    >
      <span className="text-[10px] uppercase tracking-widest text-cinema-muted mb-1">
        Seats reserved for:
      </span>
      <span
        className={`text-3xl font-display ${isWarning ? "text-cinema-red animate-pulse" : "text-cinema-gold"}`}
      >
        {minutes.toString().padStart(2, "0")}:
        {seconds.toString().padStart(2, "0")}
      </span>
    </div>
  );
};

export default HoldTimer;
