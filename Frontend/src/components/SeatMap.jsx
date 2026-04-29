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
    if (seat.status === "sold") return "bg-cinema-red";
    if (seat.status === "held") return "bg-orange-500";
    return "bg-cinema-gold"; // Available
  };

  return (
    <div className="seat-container w-full max-w-4xl mx-auto py-20 px-4 flex flex-col items-center">
      {/* Screen Indicator */}
      <div className="w-full h-2 bg-white bg-opacity-20 rounded-full mb-20 relative shadow-[0_-10px_30px_rgba(255,255,255,0.3)]">
        <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 text-xs font-display tracking-[1em] text-white opacity-40 uppercase">
          Screen
        </div>
      </div>

      {/* Seat Grid */}
      <div className="seat-grid w-full overflow-x-auto pb-10">
        <div className="flex flex-col space-y-4 min-w-max items-center">
          {rowLabels.map((rowLabel) => (
            <div key={rowLabel} className="flex items-center space-x-6">
              <span className="w-6 text-xs font-display text-white opacity-40 text-center">
                {String.fromCharCode(64 + Number(rowLabel))}
              </span>
              <div className="flex space-x-2">
                {rows[Number(rowLabel)]
                  .sort((a, b) => a.number - b.number)
                  .map((seat) => (
                    <button
                      key={seat._id}
                      onClick={() => onSeatClick(seat)}
                      disabled={
                        seat.status !== "available" &&
                        !selectedSeatIds.includes(seat._id)
                      }
                      className={`
                      w-6 h-6 sm:w-8 sm:h-8 rounded-sm transition-all duration-300 transform
                      ${getSeatColor(seat)}
                      ${seat.status === "available" || selectedSeatIds.includes(seat._id) ? "hover:scale-110 shadow-lg cursor-pointer" : "opacity-40 cursor-not-allowed"}
                      flex items-center justify-center text-[8px] sm:text-[10px] font-bold text-black
                    `}
                      title={`Row ${rowLabel}, Seat ${seat.number} - ${seat.tier} - ₹${seat.price}`}
                    >
                      {seat.number}
                    </button>
                  ))}
              </div>
              <span className="w-6 text-xs font-display text-white opacity-40 text-center">
                {String.fromCharCode(64 + Number(rowLabel))}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Tiers Legend */}
      <div className="mt-12 flex flex-wrap justify-center gap-8 text-xs font-medium uppercase tracking-widest text-cinema-muted">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded-sm bg-cinema-gold" />
          <span>Available</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded-sm bg-blue-500" />
          <span>Selected</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded-sm bg-orange-500" />
          <span>Held</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded-sm bg-cinema-red" />
          <span>Sold</span>
        </div>
      </div>
    </div>
  );
};

export default SeatMap;
