import React from "react";
import { Link } from "react-router-dom";

const MovieCard = ({ movie }) => {
  return (
    <Link
      to={`/movies/${movie._id}`}
      className="group relative overflow-hidden rounded-lg transition-all duration-500 hover:shadow-[0_0_30px_rgba(245,197,24,0.3)]"
    >
      {/* Poster Image */}
      <div className="aspect-[2/3] overflow-hidden bg-cinema-dark">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-cinema-black via-transparent to-transparent opacity-80" />

        {/* Hover Book Now Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <button className="btn-primary transform translate-y-4 transition-transform duration-300 group-hover:translate-y-0">
            Book Now
          </button>
        </div>
      </div>

      {/* Genre Badge */}
      <div className="absolute top-3 right-3">
        <span className="bg-cinema-red text-[10px] font-bold px-2 py-1 rounded uppercase tracking-tighter">
          {movie.genre}
        </span>
      </div>

      {/* Movie Info */}
      <div className="p-4 bg-cinema-dark border-t border-white border-opacity-5">
        <h3 className="text-xl font-display text-white mb-1 truncate group-hover:text-cinema-gold transition-colors">
          {movie.title}
        </h3>
        <div className="flex items-center justify-between text-xs text-cinema-muted uppercase tracking-widest">
          <span>{movie.language}</span>
          <div className="flex items-center">
            <svg
              className="w-3 h-3 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" />
            </svg>
            {movie.duration} min
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
