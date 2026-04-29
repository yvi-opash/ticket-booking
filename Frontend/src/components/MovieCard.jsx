import React from "react";
import { Link } from "react-router-dom";

const MovieCard = ({ movie }) => {
  return (
    <Link
      to={`/movies/${movie._id}`}
      className="group relative glass-card p-2 block hover:translate-y-[-8px]"
    >
      <div className="relative aspect-[10/14] overflow-hidden rounded-xl">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Overlay Details */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-6">
          <div className="space-y-4 transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
             <div className="flex gap-2">
                <span className="bg-brand-primary text-black text-[8px] font-black px-2 py-1 rounded uppercase">
                  HD 4K
                </span>
                <span className="bg-white/20 backdrop-blur-md text-white text-[8px] font-black px-2 py-1 rounded uppercase">
                  {movie.language}
                </span>
             </div>
             <p className="text-white/60 text-[10px] line-clamp-3 leading-relaxed">
                {movie.description || "Experience the thrill of " + movie.title + " on the big screen with premium sound."}
             </p>
             <div className="glass-button-primary w-full text-center py-3 text-[10px]">
                Book Tickets
             </div>
          </div>
        </div>

        {/* Badge */}
        <div className="absolute top-4 left-4">
          <div className="bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full">
            <span className="text-[10px] font-black text-brand-primary uppercase tracking-widest">
              {movie.genre}
            </span>
          </div>
        </div>
      </div>

      <div className="p-4 pt-6">
        <h3 className="text-lg font-black text-white mb-2 truncate group-hover:text-brand-primary transition-colors uppercase tracking-tighter">
          {movie.title}
        </h3>
        <div className="flex items-center justify-between text-[10px] text-white/40 uppercase font-bold tracking-widest">
          <span className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
            {movie.language}
          </span>
          <span>{movie.duration} MIN</span>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
