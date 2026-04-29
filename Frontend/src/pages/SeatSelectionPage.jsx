import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../axiosInstance";
import SeatMap from "../components/SeatMap";
import HoldTimer from "../components/HoldTimer";
import { connectSocket, disconnectSocket } from "../socket";

const SeatSelectionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [holdStartTime, setHoldStartTime] = useState(null);

  const { data: showtimeData, isLoading: isShowtimeLoading } = useQuery({
    queryKey: ["showtime", id],
    queryFn: async () => {
      const response = await axiosInstance.get(`/showtimes/${id}`);
      return response.data;
    },
  });

  const { data: seatsData, isLoading: isSeatsLoading } = useQuery({
    queryKey: ["seats", id],
    queryFn: async () => {
      const response = await axiosInstance.get(`/showtimes/${id}/seats`);
      return response.data;
    },
  });

  useEffect(() => {
    connectSocket();
    return () => disconnectSocket();
  }, []);

  const handleSeatClick = async (seat) => {
    // If already selected, release it
    if (selectedSeats.find((s) => s._id === seat._id)) {
      try {
        await axiosInstance.post("/seats/release", {
          seatId: seat._id,
          showtimeId: id,
        });
        const newSelected = selectedSeats.filter((s) => s._id !== seat._id);
        setSelectedSeats(newSelected);
        if (newSelected.length === 0) setHoldStartTime(null);
      } catch (err) {
        console.error("Failed to release seat", err);
      }
      return;
    }

    // Hold the seat
    try {
      await axiosInstance.post("/seats/hold", {
        seatId: seat._id,
        showtimeId: id,
      });
      if (selectedSeats.length === 0) setHoldStartTime(Date.now());
      setSelectedSeats([...selectedSeats, seat]);
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Could not hold seat. It might have been taken.",
      );
    }
  };

  const handleExpire = async () => {
    // Release all seats
    for (const seat of selectedSeats) {
      await axiosInstance.post("/seats/release", {
        seatId: seat._id,
        showtimeId: id,
      });
    }
    setSelectedSeats([]);
    setHoldStartTime(null);
    alert("Hold time expired. Your seats have been released.");
  };

  const handleReleaseAll = async () => {
    if (selectedSeats.length === 0) return;
    for (const seat of selectedSeats) {
      try {
        await axiosInstance.post("/seats/release", {
          seatId: seat._id,
          showtimeId: id,
        });
      } catch (e) {}
    }
    setSelectedSeats([]);
    setHoldStartTime(null);
  };

  const handleProceed = () => {
    if (selectedSeats.length === 0) return;
    navigate("/checkout", {
      state: {
        showtimeId: id,
        seatIds: selectedSeats.map((s) => s._id),
        movieTitle: showtimeData?.data.movie.title,
        theaterName: (showtimeData?.data.screen.theater).name,
        startsAt: showtimeData?.data.startsAt,
        selectedSeats: selectedSeats,
      },
    });
  };

  if (isShowtimeLoading || isSeatsLoading) {
    return (
      <div className="min-h-screen bg-cinema-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-cinema-gold"></div>
      </div>
    );
  }

  const showtime = showtimeData?.data;
  const totalPrice = selectedSeats.reduce((sum, s) => sum + s.price, 0);

  return (
    <div className="min-h-screen bg-cinema-black flex flex-col lg:flex-row">
      {/* Main Selection Area */}
      <div className="flex-1 overflow-y-auto pb-32">
        <div className="p-6 md:p-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-display text-white mb-1 uppercase tracking-wider">
                {showtime?.movie.title}
              </h1>
              <p className="text-xs text-cinema-muted uppercase tracking-[0.2em]">
                {new Date(showtime?.startsAt || "").toLocaleString([], {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                <span className="mx-2 opacity-20">|</span>
                {(showtime?.screen.theater).name} • {showtime?.screen.name}
              </p>
            </div>
            <button
              onClick={() => navigate(-1)}
              className="text-cinema-gold hover:text-white transition-colors uppercase font-bold text-[10px] tracking-widest"
            >
              ← Go Back
            </button>
          </div>

          <SeatMap
            seats={seatsData?.data || []}
            selectedSeatIds={selectedSeats.map((s) => s._id)}
            onSeatClick={handleSeatClick}
            showtimeId={id || ""}
          />
        </div>
      </div>

      {/* Summary Sidebar */}
      <div className="w-full lg:w-96 bg-cinema-dark border-l border-white border-opacity-5 p-8 flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-display text-cinema-gold mb-8 uppercase tracking-widest">
            Order Summary
          </h2>

          {selectedSeats.length === 0 ? (
            <div className="text-center py-20 opacity-20">
              <p className="text-xs uppercase tracking-widest font-bold">
                Select seats to proceed
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="max-h-[40vh] overflow-y-auto pr-2 space-y-4">
                {selectedSeats.map((seat) => (
                  <div
                    key={seat._id}
                    className="flex justify-between items-center bg-white bg-opacity-5 p-4 rounded border-l-2 border-cinema-gold animate-in slide-in-from-right-4"
                  >
                    <div>
                      <p className="text-sm font-bold text-white uppercase tracking-wider">
                        Row {String.fromCharCode(64 + seat.row)} - Seat{" "}
                        {seat.number}
                      </p>
                      <p className="text-[10px] text-cinema-muted uppercase tracking-widest">
                        {seat.tier}
                      </p>
                    </div>
                    <span className="text-cinema-gold font-display text-xl">
                      ₹{seat.price}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t border-white border-opacity-10">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-cinema-muted uppercase tracking-widest">
                    Subtotal
                  </span>
                  <span className="text-white font-bold">₹{totalPrice}</span>
                </div>
                <div className="flex justify-between items-center mb-6">
                  <span className="text-xs text-cinema-muted uppercase tracking-widest">
                    Convenience Fee
                  </span>
                  <span className="text-white font-bold">₹1.50</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-display text-cinema-gold uppercase tracking-widest">
                    Total Price
                  </span>
                  <span className="text-3xl font-display text-white">
                    ₹{totalPrice + 1.5}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-12 space-y-4">
          <HoldTimer startTime={holdStartTime} onExpire={handleExpire} />

          <button
            disabled={selectedSeats.length === 0}
            onClick={handleProceed}
            className="w-full btn-primary py-4 text-sm tracking-widest uppercase font-bold disabled:opacity-30 disabled:cursor-not-allowed shadow-[0_10px_20px_rgba(245,197,24,0.15)]"
          >
            Confirm & Checkout
          </button>

          {selectedSeats.length > 0 && (
            <button
              onClick={handleReleaseAll}
              className="w-full text-[10px] text-cinema-red hover:text-white uppercase font-bold tracking-widest transition-colors"
            >
              Cancel Selection
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SeatSelectionPage;
