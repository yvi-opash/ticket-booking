import React from "react";

const StatCard = ({ label, value, icon }) => {
  return (
    <div className="glass-card p-6 border-b-2 border-cinema-gold">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-cinema-muted">
          {label}
        </span>
        {icon && <div className="text-cinema-gold">{icon}</div>}
      </div>
      <div className="text-4xl font-display text-white tracking-wider">
        {value}
      </div>
    </div>
  );
};

export default StatCard;
