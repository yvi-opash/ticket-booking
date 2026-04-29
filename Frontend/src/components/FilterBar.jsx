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
    <div className="sticky top-20 z-30 w-full py-6 bg-cinema-black bg-opacity-80 backdrop-blur-xl border-b border-white border-opacity-5">
      <div className="max-w-7xl mx-auto px-4 flex flex-wrap gap-4 items-end">
        {/* Movie Title Filter */}
        <div className="flex-1 min-w-[200px]">
          <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-cinema-muted mb-2 block">
            Movie Name
          </label>
          <input
            type="text"
            name="title"
            value={filters.title || ""}
            onChange={handleChange}
            placeholder="Search Movie..."
            className="input-field py-2"
          />
        </div>

        {/* City Filter */}
        <div className="flex-1 min-w-[200px]">
          <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-cinema-muted mb-2 block">
            Location
          </label>
          <input
            type="text"
            name="city"
            value={filters.city || ""}
            onChange={handleChange}
            placeholder="Search City..."
            className="input-field py-2"
          />
        </div>

        {/* Language Filter */}
        <div className="w-40">
          <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-cinema-muted mb-2 block">
            Language
          </label>
          <select
            name="language"
            value={filters.language || "All"}
            onChange={handleChange}
            className="input-field py-2 cursor-pointer"
          >
            {languages.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>

        {/* Genre Filter */}
        <div className="w-40">
          <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-cinema-muted mb-2 block">
            Genre
          </label>
          <select
            name="genre"
            value={filters.genre || "All"}
            onChange={handleChange}
            className="input-field py-2 cursor-pointer"
          >
            {genres.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>

        {/* Date Filter */}
        <div className="w-48">
          <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-cinema-muted mb-2 block">
            Show Date
          </label>
          <input
            type="date"
            name="date"
            value={filters.date || ""}
            onChange={handleChange}
            className="input-field py-2 cursor-pointer"
          />
        </div>

        {/* Reset Button */}
        <button
          onClick={() => onChange({})}
          className="text-[10px] text-cinema-muted uppercase font-bold tracking-widest h-10 hover:text-cinema-gold transition-colors pb-1"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
};

export default FilterBar;
