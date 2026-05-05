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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-brand-primary"></div>
      </div>
    );
  }

  const showtime = showtimeData?.data;
  const totalPrice = selectedSeats.reduce((sum, s) => sum + s.price, 0);

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col lg:flex-row">
      {/* Main Selection Area */}
      <div className="flex-1 overflow-y-auto pb-32">
        <div className="p-8 md:p-12">
          <div className="flex items-center justify-between mb-12 mt-12">
            <div>
              <h1 className="text-4xl font-black text-white mb-2 uppercase tracking-tighter">
                {showtime?.movie.title}
              </h1>
              <div className="flex items-center gap-4 text-[10px] text-white/40 uppercase font-black tracking-widest">
                <span>{new Date(showtime?.startsAt || "").toLocaleDateString()}</span>
                <div className="w-1 h-1 rounded-full bg-brand-primary" />
                <span className="text-brand-primary">{(showtime?.screen.theater).name}</span>
                <div className="w-1 h-1 rounded-full bg-white/10" />
                <span>{showtime?.screen.name}</span>
              </div>
            </div>
            <button
              onClick={() => navigate(-1)}
              className="glass-button text-[10px] px-6"
            >
              ← Go Back
            </button>
          </div>

          <div className="glass-card p-12 bg-white/[0.02]">
             <SeatMap
                seats={seatsData?.data || []}
                selectedSeatIds={selectedSeats.map((s) => s._id)}
                onSeatClick={handleSeatClick}
                showtimeId={id || ""}
             />
          </div>
        </div>
      </div>

      {/* Summary Sidebar */}
      <div className="w-full lg:w-[450px] bg-white/[0.02] backdrop-blur-3xl border-l border-white/5 p-10 flex flex-col justify-between">
        <div>
          <h2 className="text-3xl font-black text-white mb-12 uppercase tracking-tighter">
            Ticket <span className="text-brand-primary">Summary</span>
          </h2>

          {selectedSeats.length === 0 ? (
            <div className="text-center py-24 glass-card border-dashed">
              <p className="text-[10px] uppercase tracking-[0.3em] font-black text-white/20">
                Select seats to continue
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="max-h-[40vh] overflow-y-auto pr-4 space-y-4">
                {selectedSeats.map((seat) => (
                  <div
                    key={seat._id}
                    className="flex justify-between items-center glass-card p-5 animate-in slide-in-from-right-8"
                  >
                    <div>
                      <p className="text-xs font-black text-white uppercase tracking-widest">
                         {String.fromCharCode(64 + seat.row)}{seat.number}
                      </p>
                      <p className="text-[10px] text-brand-primary uppercase font-black tracking-tighter">
                        {seat.tier} • SEC A
                      </p>
                    </div>
                    <span className="text-2xl font-black text-white">
                      ₹{seat.price}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-8 border-t border-white/5 space-y-4">
                {/* <div className="flex justify-between items-center">
                  <span className="text-[10px] text-white/30 uppercase font-black tracking-widest">
                    Service Fee
                  </span>
                  <span className="text-white font-black text-sm">₹1.50</span>
                </div> */}
                <div className="flex justify-between items-center">
                  <span className="text-xl font-black text-brand-primary uppercase tracking-tighter">
                    Total
                  </span>
                  <span className="text-4xl font-black text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                    ₹{totalPrice}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-16 space-y-6">
          <div className="glass-card p-4 bg-brand-primary/5 border-brand-primary/10">
             <HoldTimer startTime={holdStartTime} onExpire={handleExpire} />
          </div>

          <button
            disabled={selectedSeats.length === 0}
            onClick={handleProceed}
            className="glass-button-primary w-full py-5 text-sm"
          >
            Confirm & Pay
          </button>

          {selectedSeats.length > 0 && (
            <button
              onClick={handleReleaseAll}
              className="w-full text-[10px] text-white/20 hover:text-white uppercase font-black tracking-widest transition-colors"
            >
              Clear Selection
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SeatSelectionPage;
