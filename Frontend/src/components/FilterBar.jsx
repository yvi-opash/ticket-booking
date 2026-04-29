import React from "react";

const FilterBar = ({ filters, onChange }) => {
  const genres = [
    "All",
    "Action",
    "Drama",
    "Comedy",
    "Horror",
    "Sci-Fi",
    "Thriller",
    "Romance",
    "Animation",
  ];
  const languages = [
    "All",
    "English",
    "Hindi",
    "Tamil",
    "Telugu",
    "Gujarati",
    "Marathi",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({
      ...filters,
      [name]: value === "All" ? undefined : value,
    });
  };

  return (
    <div className="sticky top-24 z-40 w-full">
      <div className="max-w-7xl mx-auto px-6">
        <div className="glass-card p-6 flex flex-wrap gap-8 items-end shadow-2xl">
          {/* Movie Title Filter */}
          <div className="flex-1 min-w-[200px]">
            <label className="text-[10px] uppercase font-black tracking-[0.3em] text-white/30 mb-3 ml-1 block">
              Search Title
            </label>
            <div className="relative">
              <input
                type="text"
                name="title"
                value={filters.title || ""}
                onChange={handleChange}
                placeholder="The Dark Knight..."
                className="glass-input w-full"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20 text-xs">🔍</span>
            </div>
          </div>

          {/* City Filter */}
          <div className="flex-1 min-w-[200px]">
            <label className="text-[10px] uppercase font-black tracking-[0.3em] text-white/30 mb-3 ml-1 block">
              Select City
            </label>
            <input
              type="text"
              name="city"
              value={filters.city || ""}
              onChange={handleChange}
              placeholder="Ahmedabad..."
              className="glass-input w-full"
            />
          </div>

          {/* Language Filter */}
          <div className="w-44">
            <label className="text-[10px] uppercase font-black tracking-[0.3em] text-white/30 mb-3 ml-1 block">
              Language
            </label>
            <select
              name="language"
              value={filters.language || "All"}
              onChange={handleChange}
              className="glass-input w-full cursor-pointer appearance-none"
            >
              {languages.map((l) => (
                <option key={l} value={l} className="bg-brand-dark">
                  {l}
                </option>
              ))}
            </select>
          </div>

          {/* Genre Filter */}
          <div className="w-44">
            <label className="text-[10px] uppercase font-black tracking-[0.3em] text-white/30 mb-3 ml-1 block">
              Genre
            </label>
            <select
              name="genre"
              value={filters.genre || "All"}
              onChange={handleChange}
              className="glass-input w-full cursor-pointer appearance-none"
            >
              {genres.map((g) => (
                <option key={g} value={g} className="bg-brand-dark">
                  {g}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Button */}
          <button
            onClick={() => onChange({})}
            className="h-11 px-6 text-[10px] text-white/30 uppercase font-black tracking-widest hover:text-brand-primary transition-colors"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
