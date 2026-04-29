import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../axiosInstance";
import MovieCard from "../components/MovieCard";
import FilterBar from "../components/FilterBar";
import LoadingSkeleton from "../components/LoadingSkeleton";

const HomePage = () => {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 12,
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["movies", filters],
    queryFn: async () => {
      const response = await axiosInstance.get("/movies", { params: filters });
      return response.data;
    },
  });

  const handleFilterChange = (newFilters) => {
    setFilters({ ...newFilters, page: 1, limit: 12 });
  };

  return (
    <div className="min-h-screen bg-brand-dark">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(229,9,20,0.1),transparent_70%)]" />
          <img
            src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070&auto=format&fit=crop"
            alt="Hero Background"
            className="w-full h-full object-cover opacity-20 scale-110 animate-pulse duration-[10s]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/50 to-brand-dark" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <div className="inline-block mb-6 px-4 py-1 rounded-full border border-brand-primary/30 bg-brand-primary/5 animate-in fade-in zoom-in duration-1000">
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-brand-primary">
              The Future of Cinema
            </span>
          </div>
          <h1 className="text-7xl md:text-9xl font-black text-white mb-8 tracking-tighter leading-none animate-in slide-in-from-bottom-12 duration-1000">
            BEYOND <span className="text-brand-primary drop-shadow-[0_0_30px_rgba(229,9,20,0.5)]">SIGHT</span>
          </h1>
          <p className="text-lg md:text-xl text-white/50 font-medium mb-12 tracking-widest uppercase max-w-2xl mx-auto animate-in slide-in-from-bottom-8 duration-1000 delay-200">
            Experience movies in a new light with our state-of-the-art 
            glass booking interface.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-in fade-in duration-1000 delay-500">
            <a
              href="#movies-grid"
              className="glass-button-primary"
            >
              Start Booking
            </a>
            <button className="glass-button">
              Watch Trailer
            </button>
          </div>
        </div>

        {/* Floating Decorative Elements */}
        <div className="absolute top-1/4 -left-20 w-64 h-64 bg-brand-primary/10 blur-[100px] rounded-full animate-float" />
        <div className="absolute bottom-1/4 -right-20 w-64 h-64 bg-brand-primary/10 blur-[100px] rounded-full animate-float delay-1000" />
      </section>

      {/* Filter Bar */}
      <div className="relative z-20 -mt-12 px-4">
        <FilterBar filters={filters} onChange={handleFilterChange} />
      </div>

      {/* Movie Grid Section */}
      <section id="movies-grid" className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex items-center justify-between mb-16">
          <h2 className="text-4xl font-black text-white uppercase tracking-tighter">
            Now <span className="text-brand-primary">Playing</span>
          </h2>
          <div className="h-px flex-1 mx-8 bg-white/5" />
          <p className="text-[10px] font-black uppercase tracking-widest text-white/30">
            {data?.data.length || 0} Movie Available
          </p>
        </div>

        {isLoading ? (
          <LoadingSkeleton type="card" count={8} />
        ) : isError ? (
          <div className="glass-card p-20 text-center">
            <h2 className="text-2xl font-black text-brand-primary mb-4 uppercase tracking-tighter">
              Connection Lost
            </h2>
            <p className="text-white/40 uppercase tracking-widest text-xs font-bold">
              Unable to sync with central database.
            </p>
          </div>
        ) : data?.data.length === 0 ? (
          <div className="glass-card p-20 text-center">
            <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-tighter">
              No Data Found
            </h2>
            <p className="text-white/40 uppercase tracking-widest text-xs font-bold">
              No movies match your current search parameters.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
              {data?.data.map((movie) => (
                <MovieCard key={movie._id} movie={movie} />
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-24 flex items-center justify-center gap-12">
              <button
                disabled={filters.page === 1}
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    page: (prev.page || 1) - 1,
                  }))
                }
                className="text-xs font-black uppercase tracking-widest text-white/30 hover:text-brand-primary disabled:opacity-0 transition-all"
              >
                ← Prev
              </button>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center font-black text-brand-primary border border-white/5">
                  {filters.page}
                </div>
              </div>
              <button
                disabled={data?.data.length < (filters.limit || 12)}
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    page: (prev.page || 1) + 1,
                  }))
                }
                className="text-xs font-black uppercase tracking-widest text-white/30 hover:text-brand-primary disabled:opacity-0 transition-all"
              >
                Next →
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default HomePage;
