import React, { useEffect, useState } from "react";
import { socket } from "../socket";

const SeatMap = ({
  seats: initialSeats,
  selectedSeatIds,
  onSeatClick,
  showtimeId,
}) => {
  const [seats, setSeats] = useState(initialSeats);

  useEffect(() => {
    setSeats(initialSeats);
  }, [initialSeats]);

  useEffect(() => {
    // Socket.IO listeners
    const handleSeatHeld = (data) => {
      if (data.showtimeId === showtimeId) {
        setSeats((prev) =>
          prev.map((s) =>
            s._id === data.seatId ? { ...s, status: "held" } : s,
          ),
        );
      }
    };

    const handleSeatSold = (data) => {
      if (data.showtimeId === showtimeId) {
        setSeats((prev) =>
          prev.map((s) =>
            s._id === data.seatId ? { ...s, status: "sold" } : s,
          ),
        );
      }
    };

    const handleSeatReleased = (data) => {
      if (data.showtimeId === showtimeId) {
        setSeats((prev) =>
          prev.map((s) =>
            s._id === data.seatId ? { ...s, status: "available" } : s,
          ),
        );
      }
    };

    socket.on("seat:held", handleSeatHeld);
    socket.on("seat:sold", handleSeatSold);
    socket.on("seat:released", handleSeatReleased);

    return () => {
      socket.off("seat:held", handleSeatHeld);
      socket.off("seat:sold", handleSeatSold);
      socket.off("seat:released", handleSeatReleased);
    };
  }, [showtimeId]);

  // Group seats by row
  const rows = seats.reduce((acc, seat) => {
    if (!acc[seat.row]) acc[seat.row] = [];
    acc[seat.row].push(seat);
    return acc;
  }, {});

  const rowLabels = Object.keys(rows).sort((a, b) => Number(a) - Number(b));

  const getSeatColor = (seat) => {
    if (selectedSeatIds.includes(seat._id)) return "bg-blue-500"; // Selected by current user
    if (seat.status === "sold") return "bg-white/20";
    if (seat.status === "held") return "bg-orange-500";
    return "bg-brand-primary"; // Available
  };

  return (
    <div className="theatre-container w-full max-w-5xl mx-auto py-24 px-6 flex flex-col items-center">
      {/* Immersive Screen */}
      <div className="relative w-full mb-32">
        <div className="theatre-screen" />
        <div className="absolute top-10 left-1/2 -translate-x-1/2">
          <span className="text-[10px] font-black uppercase tracking-[2em] text-brand-primary opacity-60">
            S C R E E N
          </span>
        </div>
      </div>

      {/* Seat Grid with Perspective */}
      <div className="seat-grid w-full overflow-x-auto pb-16 hide-scrollbar">
        <div className="flex flex-col space-y-6 min-w-max items-center">
          {rowLabels.map((rowLabel) => (
            <div key={rowLabel} className="flex items-center gap-12">
              <span className="w-8 text-[11px] font-black text-white/10 text-center uppercase tracking-widest">
                {String.fromCharCode(64 + Number(rowLabel))}
              </span>
              <div className="flex gap-4">
                {rows[Number(rowLabel)]
                  .sort((a, b) => a.number - b.number)
                  .map((seat) => {
                    const isSelected = selectedSeatIds.includes(seat._id);
                    const tierClass = 
                      seat.tier === "VIP" ? "seat-vip" : 
                      seat.tier === "Premium" ? "seat-premium" : 
                      "seat-standard";

                    const statusClass = isSelected 
                      ? "seat-selected" 
                      : seat.status === "sold" 
                        ? "seat-sold" 
                        : seat.status === "held" 
                          ? "seat-held" 
                          : `seat-available ${tierClass}`;
                    
                    return (
                      <button
                        key={seat._id}
                        onClick={() => onSeatClick(seat)}
                        disabled={seat.status !== "available" && !isSelected}
                        className={`seat-base ${statusClass}`}
                        title={`${seat.tier} - Row ${String.fromCharCode(64 + Number(rowLabel))}${seat.number} - ₹${seat.price}`}
                      >
                        {seat.number}
                      </button>
                    );
                  })}
              </div>
              <span className="w-8 text-[11px] font-black text-white/10 text-center uppercase tracking-widest">
                {String.fromCharCode(64 + Number(rowLabel))}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Modern Status Legend */}
      <div className="glass-card px-12 py-8 flex flex-wrap justify-center gap-12 mt-16 max-w-4xl">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded bg-white/5 border border-white/10" />
          <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Standard</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded bg-white/5 border border-blue-400" />
          <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Premium</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded bg-white/5 border border-yellow-500" />
          <span className="text-[9px] font-black text-yellow-500 uppercase tracking-widest">VIP</span>
        </div>
        <div className="w-[1px] h-4 bg-white/10 hidden md:block" />
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded bg-brand-primary" />
          <span className="text-[9px] font-black text-brand-primary uppercase tracking-widest">Selected</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded bg-orange-500/40 border border-orange-500/40" />
          <span className="text-[9px] font-black text-orange-500 uppercase tracking-widest">Held</span>
        </div>
        <div className="flex items-center gap-3 opacity-20">
          <div className="w-4 h-4 rounded bg-white/5" />
          <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">Sold</span>
        </div>
      </div>
    </div>
  );
};

export default SeatMap;
