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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-brand-primary"></div>
      </div>
    );
  }

  const movie = movieData?.data;

  return (
    <div className="min-h-screen bg-brand-dark pb-32">
      {/* Dynamic Glass Hero */}
      <div className="relative h-[70vh] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={movie?.posterUrl}
            alt={movie?.title}
            className="w-full h-full object-cover blur-2xl scale-110 opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex flex-col md:flex-row items-end pb-16 gap-12">
          <div className="w-56 md:w-80 aspect-[10/14] rounded-2xl overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] border border-white/10 animate-in zoom-in duration-1000">
            <img
              src={movie?.posterUrl}
              alt={movie?.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 animate-in slide-in-from-left-12 duration-1000">
            <div className="flex flex-wrap gap-3 mb-6">
              <span className="bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                {movie?.genre}
              </span>
              <span className="bg-white/5 border border-white/10 text-white/60 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                {movie?.language}
              </span>
              <span className="bg-white/5 border border-white/10 text-white/60 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                {movie?.duration} MIN
              </span>
            </div>
            <h1 className="text-5xl md:text-8xl font-black text-white mb-6 tracking-tighter uppercase leading-none">
              {movie?.title}
            </h1>
            <p className="text-white/40 max-w-3xl text-sm md:text-lg leading-relaxed font-medium">
              {movie?.description}
            </p>
          </div>
        </div>
      </div>

      {/* Showtime Section */}
      <div className="max-w-7xl mx-auto px-6 mt-20">
        <div className="flex items-center gap-8 mb-12">
          <h2 className="text-4xl font-black text-white uppercase tracking-tighter">
            Select <span className="text-brand-primary">Showtime</span>
          </h2>
          <div className="h-px flex-1 bg-white/5" />
        </div>

        {/* Date Selector */}
        <div className="flex gap-4 mb-16 overflow-x-auto pb-4 scrollbar-hide">
          {availableDates.length === 0 && !isShowtimesLoading ? (
            <div className="glass-card p-12 text-center w-full">
              <p className="text-white/30 uppercase tracking-widest text-xs font-bold">No shows available at this time.</p>
            </div>
          ) : (
            availableDates.map((d) => (
            <button
              key={d.full}
              onClick={() => setSelectedDate(d.full)}
              className={`flex flex-col items-center justify-center min-w-[100px] p-6 rounded-2xl transition-all duration-500 border ${
                selectedDate === d.full
                  ? "bg-brand-primary border-brand-primary text-black scale-105 shadow-[0_0_40px_rgba(229,9,20,0.2)]"
                  : "bg-white/5 border-white/5 text-white/40 hover:border-white/20 hover:text-white"
              }`}
            >
              <span className="text-[10px] uppercase font-black tracking-widest mb-2">
                {d.day}
              </span>
              <span className="text-3xl font-black">{d.date}</span>
            </button>
            ))
          )}
        </div>

        {/* Showtimes Grid */}
        {isShowtimesLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-40 glass-card animate-pulse opacity-50" />
            ))}
          </div>
        ) : filteredShowtimes.length === 0 ? (
          <div className="glass-card p-20 text-center">
            <p className="text-white/30 uppercase tracking-widest text-xs font-bold">
              No showtimes synced for this date.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredShowtimes.map((showtime) => (
              <div
                key={showtime._id}
                className="glass-card p-8 group hover:translate-y-[-4px]"
              >
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h4 className="text-xl font-black text-white mb-2 uppercase tracking-tighter group-hover:text-brand-primary transition-colors">
                      {showtime.screen.theater.name}
                    </h4>
                    <p className="text-[10px] text-white/40 uppercase font-black tracking-widest">
                      {showtime.screen.name} • {showtime.screen.theater.city}
                    </p>
                  </div>
                  <div className="bg-brand-primary/10 px-3 py-1 rounded-full">
                    <span className="text-[10px] font-black text-brand-primary uppercase">
                      ATMOS
                    </span>
                  </div>
                </div>

                <div className="flex items-end justify-between">
                   <div className="text-4xl font-black text-white">
                      {new Date(showtime.startsAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false
                      })}
                   </div>
                   <div className="text-right">
                      <p className="text-[10px] text-white/30 uppercase font-bold tracking-widest mb-3">
                        Tickets from <span className="text-white">₹{showtime.price || 120}</span>
                      </p>
                      <Link
                        to={`/showtimes/${showtime._id}/seats`}
                        className="glass-button text-[10px] px-8"
                      >
                        Book Now
                      </Link>
                   </div>
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
