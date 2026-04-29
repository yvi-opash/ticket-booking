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
    <div className="min-h-screen bg-cinema-black">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070&auto=format&fit=crop"
            alt="Hero Background"
            className="w-full h-full object-cover opacity-30"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-cinema-black via-transparent to-cinema-black" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-display text-white mb-6 animate-in slide-in-from-bottom-8 duration-1000">
            BOOK YOUR <span className="text-cinema-gold">EXPERIENCE</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 font-body mb-10 tracking-widest uppercase animate-in slide-in-from-bottom-6 duration-1000 delay-200">
            Immerse yourself in the magic of cinema with premium seating and
            real-time booking.
          </p>
          <a
            href="#movies-grid"
            className="btn-primary text-sm tracking-widest py-4 px-10 animate-in fade-in duration-1000 delay-500"
          >
            Browse Movies
          </a>
        </div>

        {/* Film Strip Overlay */}
        <div className="absolute bottom-0 left-0 w-full h-24 overflow-hidden opacity-10 pointer-events-none">
          <div className="flex space-x-4 animate-marquee">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="w-40 h-24 bg-white bg-opacity-20 flex-shrink-0 border-x-4 border-dashed border-black"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      <FilterBar filters={filters} onChange={handleFilterChange} />

      {/* Movie Grid Section */}
      <section id="movies-grid" className="max-w-7xl mx-auto px-4 py-16">
        {isLoading ? (
          <LoadingSkeleton type="card" count={8} />
        ) : isError ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-display text-cinema-red mb-2">
              Failed to load movies
            </h2>
            <p className="text-cinema-muted uppercase tracking-widest text-xs">
              Please try again later or check your connection.
            </p>
          </div>
        ) : data?.data.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-display text-white mb-2">
              No movies found
            </h2>
            <p className="text-cinema-muted uppercase tracking-widest text-xs">
              Try adjusting your filters to find what you're looking for.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {data?.data.map((movie) => (
                <MovieCard key={movie._id} movie={movie} />
              ))}
            </div>

            {/* Pagination Placeholder */}
            <div className="mt-16 flex justify-center space-x-4">
              <button
                disabled={filters.page === 1}
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    page: (prev.page || 1) - 1,
                  }))
                }
                className="btn-outline disabled:opacity-30 disabled:cursor-not-allowed text-xs py-2 px-6"
              >
                Previous
              </button>
              <div className="flex items-center px-4 font-display text-cinema-gold text-xl">
                {filters.page}
              </div>
              <button
                disabled={data?.data.length < (filters.limit || 12)}
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    page: (prev.page || 1) + 1,
                  }))
                }
                className="btn-outline disabled:opacity-30 disabled:cursor-not-allowed text-xs py-2 px-6"
              >
                Next
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default HomePage;
