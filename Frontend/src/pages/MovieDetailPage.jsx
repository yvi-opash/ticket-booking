import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../axiosInstance";

const MovieDetailPage = () => {
  const { id } = useParams();
  const [selectedDate, setSelectedDate] = useState("");

  const { data: movieData, isLoading: isMovieLoading } = useQuery({
    queryKey: ["movie", id],
    queryFn: async () => {
      const response = await axiosInstance.get(`/movies/${id}`);
      return response.data;
    },
  });

  const { data: showtimesData, isLoading: isShowtimesLoading } = useQuery({
    queryKey: ["showtimes", id],
    queryFn: async () => {
      const response = await axiosInstance.get(`/showtimes`, {
        params: { movie: id },
      });
      return response.data;
    },
  });

  const availableDates = React.useMemo(() => {
    if (!showtimesData?.data) return [];
    
    const dateMap = new Map();
    showtimesData.data.forEach(st => {
      const d = new Date(st.startsAt);
      const localDateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      if (!dateMap.has(localDateStr)) {
        dateMap.set(localDateStr, {
          full: localDateStr,
          day: d.toLocaleDateString("en-US", { weekday: "short" }),
          date: d.getDate(),
          timestamp: new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
        });
      }
    });
    
    return Array.from(dateMap.values()).sort((a, b) => a.timestamp - b.timestamp);
  }, [showtimesData]);

  React.useEffect(() => {
    if (availableDates.length > 0 && !selectedDate) {
      setSelectedDate(availableDates[0].full);
    }
  }, [availableDates, selectedDate]);

  const filteredShowtimes = React.useMemo(() => {
    if (!showtimesData?.data || !selectedDate) return [];
    return showtimesData.data.filter(st => {
      const d = new Date(st.startsAt);
      const localDateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      return localDateStr === selectedDate;
    });
  }, [showtimesData, selectedDate]);

  if (isMovieLoading) {
    return (
      <div className="min-h-screen bg-cinema-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-cinema-gold"></div>
      </div>
    );
  }

  const movie = movieData?.data;

  return (
    <div className="min-h-screen bg-cinema-black pb-20">
      {/* Hero Header */}
      <div className="relative h-[60vh] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={movie?.posterUrl}
            alt={movie?.title}
            className="w-full h-full object-cover blur-sm scale-110"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-cinema-black via-cinema-black/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 h-full flex flex-col md:flex-row items-end pb-12 gap-8">
          <div className="w-48 md:w-64 aspect-[2/3] rounded-lg overflow-hidden shadow-2xl border border-white/10 hidden sm:block">
            <img
              src={movie?.posterUrl}
              alt={movie?.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-cinema-red text-[10px] font-bold px-2 py-1 rounded uppercase tracking-tighter">
                {movie?.genre}
              </span>
              <span className="bg-white/10 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-tighter">
                {movie?.language}
              </span>
              <span className="bg-white/10 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-tighter">
                {movie?.duration} min
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-display text-white mb-4 tracking-wide">
              {movie?.title}
            </h1>
            <p className="text-gray-400 max-w-2xl text-sm md:text-base leading-relaxed">
              {movie?.description}
            </p>
          </div>
        </div>
      </div>

      {/* Showtime Selection */}
      <div className="max-w-7xl mx-auto px-4 mt-12">
        <h2 className="text-3xl font-display text-cinema-gold mb-8 tracking-widest uppercase">
          Select Showtime
        </h2>

        {/* Date Tabs */}
        <div className="flex space-x-4 mb-10 overflow-x-auto pb-4 scrollbar-hide">
          {availableDates.length === 0 && !isShowtimesLoading ? (
            <div className="text-cinema-muted uppercase tracking-widest text-sm py-4">No dates available</div>
          ) : (
            availableDates.map((d) => (
            <button
              key={d.full}
              onClick={() => setSelectedDate(d.full)}
              className={`flex flex-col items-center justify-center min-w-[80px] p-4 rounded-lg transition-all duration-300 ${
                selectedDate === d.full
                  ? "bg-cinema-gold text-black scale-105 shadow-[0_0_20px_rgba(245,197,24,0.3)]"
                  : "bg-cinema-dark text-cinema-muted hover:bg-white/5 hover:text-white"
              }`}
            >
              <span className="text-[10px] uppercase font-bold tracking-widest mb-1">
                {d.day}
              </span>
              <span className="text-2xl font-display">{d.date}</span>
            </button>
            ))
          )}
        </div>

        {/* Showtimes Grid */}
        {isShowtimesLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-32 shimmer rounded-lg opacity-10" />
            ))}
          </div>
        ) : filteredShowtimes.length === 0 ? (
          <div className="text-center py-12 glass-card">
            <p className="text-cinema-muted uppercase tracking-widest text-sm">
              No showtimes available for this date.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredShowtimes.map((showtime) => (
              <div
                key={showtime._id}
                className="glass-card p-6 flex items-center justify-between group hover:border-cinema-gold/30 transition-all"
              >
                <div>
                  <h4 className="text-lg font-bold text-white mb-1 uppercase tracking-wider">
                    {showtime.screen.theater.name}
                  </h4>
                  <p className="text-xs text-cinema-muted mb-2 uppercase tracking-widest">
                    {showtime.screen.name} • {showtime.screen.theater.city}
                  </p>
                  <div className="text-2xl font-display text-cinema-gold">
                    {new Date(showtime.startsAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-cinema-muted mb-3 uppercase tracking-widest">
                    From ₹{showtime.price || 12}
                  </div>
                  <Link
                    to={`/showtimes/${showtime._id}/seats`}
                    className="btn-primary py-2 px-4 text-xs tracking-widest"
                  >
                    Select Seats
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetailPage;
