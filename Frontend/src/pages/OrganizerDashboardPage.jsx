import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../axiosInstance";
import LoadingSkeleton from "../components/LoadingSkeleton";
import Modal from "../components/Modal";

const OrganizerDashboardPage = () => {
  const [activeTab, setActiveTab] = useState("theaters");
  const [selectedTheater, setSelectedTheater] = useState(null);
  const [isTheaterModalOpen, setIsTheaterModalOpen] = useState(false);
  const [isScreenModalOpen, setIsScreenModalOpen] = useState(false);
  const [isShowtimeModalOpen, setIsShowtimeModalOpen] = useState(false);
  const [selectedScreen, setSelectedScreen] = useState(null);
  const [newTheater, setNewTheater] = useState({
    name: "",
    city: "",
    address: "",
  });
  const [newScreen, setNewScreen] = useState({
    name: "",
    rows: 10,
    seatsPerRow: 10,
  });
  const [newShowtime, setNewShowtime] = useState({
    movieId: "",
    startsAt: "",
    price: 0,
  });

  const queryClient = useQueryClient();

  // Queries
  const { data: theatersData, isLoading: isTheatersLoading } = useQuery({
    queryKey: ["my-theaters"],
    queryFn: async () => {
      const response = await axiosInstance.get("/theaters/my-theaters");
      return response.data;
    },
  });

  const { data: screensData, isLoading: isScreensLoading } = useQuery({
    queryKey: ["screens", selectedTheater?._id],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `/screens/theater/${selectedTheater?._id}`,
      );
      return response.data;
    },
    enabled: !!selectedTheater,
  });

  // Fetch Movies for Showtime Selection
  const { data: moviesData } = useQuery({
    queryKey: ["movies"],
    queryFn: async () => {
      const response = await axiosInstance.get("/movies");
      return response.data;
    },
  });

  // Mutations
  const addTheaterMutation = useMutation({
    mutationFn: async (data) => {
      const response = await axiosInstance.post("/theaters", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-theaters"] });
      setIsTheaterModalOpen(false);
      setNewTheater({ name: "", city: "", address: "" });
      alert("Theater added successfully!");
    },
    onError: (err) => {
      alert(err.response?.data?.message || "Failed to add theater");
    },
  });

  const addScreenMutation = useMutation({
    mutationFn: async (data) => {
      const response = await axiosInstance.post("/screens", {
        ...data,
        theaterId: selectedTheater?._id,
        tiers: [
          { tier: "Standard", rowStart: 1, rowEnd: data.rows, price: 12 },
        ],
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["screens", selectedTheater?._id],
      });
      setIsScreenModalOpen(false);
      setNewScreen({ name: "", rows: 10, seatsPerRow: 10 });
      alert("Screen added successfully!");
    },
    onError: (err) => {
      alert(err.response?.data?.message || "Failed to add screen");
    },
  });

  const addShowtimeMutation = useMutation({
    mutationFn: async (data) => {
      const response = await axiosInstance.post("/showtimes", {
        ...data,
        screenId: selectedScreen?._id,
      });
      return response.data;
    },
    onSuccess: () => {
      setIsShowtimeModalOpen(false);
      setNewShowtime({ movieId: "", startsAt: "", price: 0 });
      alert("Showtime added successfully!");
    },
    onError: (err) => {
      alert(err.response?.data?.message || "Failed to add showtime");
    },
  });

  const updateScreenMutation = useMutation({
    mutationFn: async (data) => {
      const response = await axiosInstance.put(
        `/screens/${selectedScreen?._id}`,
        data,
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["screens", selectedTheater?._id],
      });
      setIsScreenModalOpen(false);
      alert("Screen layout updated!");
    },
    onError: (err) => {
      alert(err.response?.data?.message || "Failed to update layout");
    },
  });

  const handleAddShowtime = (e) => {
    e.preventDefault();
    addShowtimeMutation.mutate(newShowtime);
  };

  const handleAddTheater = (e) => {
    e.preventDefault();
    addTheaterMutation.mutate(newTheater);
  };

  const handleAddScreen = (e) => {
    e.preventDefault();
    addScreenMutation.mutate(newScreen);
  };

  return (
    <div className="min-h-screen bg-brand-dark py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-display text-brand-primary mb-12 uppercase tracking-[0.2em]">
          Organizer Dashboard
        </h1>

        {/* Tab Navigation */}
        <div className="flex space-x-8 border-b border-white border-opacity-5 mb-12 overflow-x-auto pb-1 scrollbar-hide">
          {["theaters", "screens", "showtimes"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-xs font-bold uppercase tracking-widest transition-all ${
                activeTab === tab
                  ? "text-brand-primary border-b-2 border-brand-primary"
                  : "text-white/40 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "theaters" && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-display text-white uppercase tracking-widest">
                My Theaters
              </h2>
              <button
                onClick={() => setIsTheaterModalOpen(true)}
                className="glass-button-primary text-xs py-2 px-6 tracking-widest"
              >
                + Add Theater
              </button>
            </div>

            {isTheatersLoading ? (
              <LoadingSkeleton type="row" count={3} />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {theatersData?.data.map((theater) => (
                  <div
                    key={theater._id}
                    className="glass-card p-6 border-l-2 border-brand-primary group hover:border-brand-primary/50 transition-all"
                  >
                    <h3 className="text-xl font-display text-white mb-2 uppercase">
                      {theater.name}
                    </h3>
                    <p className="text-xs text-white/40 uppercase tracking-widest mb-6">
                      {theater.city} • {theater.address}
                    </p>
                    <button
                      onClick={() => {
                        setSelectedTheater(theater);
                        setActiveTab("screens");
                      }}
                      className="text-xs text-brand-primary font-bold uppercase tracking-widest group-hover:underline"
                    >
                      Manage Screens →
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "screens" && (
          <div className="animate-in fade-in duration-500">
            {!selectedTheater ? (
              <div className="text-center py-20 glass-card">
                <p className="text-white/40 uppercase tracking-widest text-xs">
                  Please select a theater first.
                </p>
                <button
                  onClick={() => setActiveTab("theaters")}
                  className="btn-outline mt-6 text-xs px-6 py-2"
                >
                  Go to Theaters
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h2 className="text-2xl font-display text-white uppercase tracking-widest">
                      Screens: {selectedTheater.name}
                    </h2>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest">
                      {selectedTheater.city}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setIsScreenModalOpen(true);
                      setSelectedScreen(null);
                    }}
                    className="glass-button-primary text-xs py-2 px-6 tracking-widest"
                  >
                    + Add Screen
                  </button>
                </div>

                {isScreensLoading ? (
                  <LoadingSkeleton type="row" count={3} />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {screensData?.data.map((screen) => (
                      <div
                        key={screen._id}
                        className="glass-card p-8 border-t-2 border-brand-primary"
                      >
                        <div className="flex justify-between items-start mb-6">
                          <div>
                            <h3 className="text-xl font-display text-white mb-1 uppercase tracking-widest">
                              {screen.name}
                            </h3>
                            <p className="text-xs text-white/40 uppercase tracking-widest">
                              {screen.rows} Rows • {screen.seatsPerRow}{" "}
                              Seats/Row
                            </p>
                          </div>
                          <span className="bg-white/5 px-3 py-1 text-[10px] uppercase font-bold text-brand-primary rounded">
                            {screen.rows * screen.seatsPerRow} Capacity
                          </span>
                        </div>
                        <div className="flex space-x-4">
                          <button
                            onClick={() => {
                              setSelectedScreen(screen);
                              setNewScreen({
                                name: screen.name,
                                rows: screen.rows,
                                seatsPerRow: screen.seatsPerRow,
                              });
                              setIsScreenModalOpen(true);
                            }}
                            className="btn-outline flex-1 py-2 text-[10px] tracking-widest"
                          >
                            Edit Layout
                          </button>
                          <button
                            onClick={() => {
                              setSelectedScreen(screen);
                              setIsShowtimeModalOpen(true);
                            }}
                            className="glass-button-primary flex-1 py-2 text-[10px] tracking-widest"
                          >
                            Add Showtime
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === "showtimes" && (
          <div className="text-center py-20 glass-card animate-in fade-in duration-500">
            <p className="text-white/40 uppercase tracking-widest text-xs">
              Showtime management interface coming soon.
            </p>
          </div>
        )}
      </div>

      {/* Add Theater Modal */}
      <Modal
        isOpen={isTheaterModalOpen}
        onClose={() => setIsTheaterModalOpen(false)}
        title="Add New Theater"
      >
        <form onSubmit={handleAddTheater} className="space-y-6">
          <div>
            <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-white/40 mb-2 block">
              Theater Name
            </label>
            <input
              type="text"
              required
              value={newTheater.name}
              onChange={(e) =>
                setNewTheater({ ...newTheater, name: e.target.value })
              }
              className="input-field"
              placeholder="e.g. IMAX Central"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-white/40 mb-2 block">
                City
              </label>
              <input
                type="text"
                required
                value={newTheater.city}
                onChange={(e) =>
                  setNewTheater({ ...newTheater, city: e.target.value })
                }
                className="input-field"
                placeholder="Ahmedabad"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-white/40 mb-2 block">
                Address
              </label>
              <input
                type="text"
                required
                value={newTheater.address}
                onChange={(e) =>
                  setNewTheater({ ...newTheater, address: e.target.value })
                }
                className="input-field"
                placeholder="Main St, Area"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={addTheaterMutation.isPending}
            className="w-full glass-button-primary py-3 text-xs tracking-widest uppercase"
          >
            {addTheaterMutation.isPending ? "Adding..." : "Add Theater"}
          </button>
        </form>
      </Modal>

      {/* Add/Edit Screen Modal */}
      <Modal
        isOpen={isScreenModalOpen}
        onClose={() => setIsScreenModalOpen(false)}
        title={
          selectedScreen
            ? `Edit Layout: ${selectedScreen.name}`
            : `Add Screen to ${selectedTheater?.name}`
        }
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (selectedScreen) updateScreenMutation.mutate(newScreen);
            else handleAddScreen(e);
          }}
          className="space-y-6"
        >
          <div>
            <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-white/40 mb-2 block">
              Screen Name
            </label>
            <input
              type="text"
              required
              value={newScreen.name}
              onChange={(e) =>
                setNewScreen({ ...newScreen, name: e.target.value })
              }
              className="input-field"
              placeholder="e.g. Screen 1 / IMAX"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-white/40 mb-2 block">
                Rows
              </label>
              <input
                type="number"
                required
                min="1"
                max="26"
                value={newScreen.rows === "" ? "" : newScreen.rows}
                onChange={(e) =>
                  setNewScreen({ ...newScreen, rows: e.target.value === "" ? "" : parseInt(e.target.value) })
                }
                className="input-field"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-white/40 mb-2 block">
                Seats Per Row
              </label>
              <input
                type="number"
                required
                min="1"
                value={newScreen.seatsPerRow === "" ? "" : newScreen.seatsPerRow}
                onChange={(e) =>
                  setNewScreen({
                    ...newScreen,
                    seatsPerRow: e.target.value === "" ? "" : parseInt(e.target.value),
                  })
                }
                className="input-field"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={
              addScreenMutation.isPending || updateScreenMutation.isPending
            }
            className="w-full glass-button-primary py-3 text-xs tracking-widest uppercase"
          >
            {selectedScreen ? "Update Layout" : "Add Screen"}
          </button>
        </form>
      </Modal>

      {/* Add Showtime Modal */}
      <Modal
        isOpen={isShowtimeModalOpen}
        onClose={() => setIsShowtimeModalOpen(false)}
        title={`Add Showtime to ${selectedScreen?.name}`}
      >
        <form onSubmit={handleAddShowtime} className="space-y-6">
          <div>
            <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-white/40 mb-2 block">
              Select Movie
            </label>
            <select
              required
              value={newShowtime.movieId}
              onChange={(e) =>
                setNewShowtime({ ...newShowtime, movieId: e.target.value })
              }
              className="input-field cursor-pointer"
            >
              <option value="">Select a Movie</option>
              {moviesData?.data.map((movie) => (
                <option key={movie._id} value={movie._id}>
                  {movie.title}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-white/40 mb-2 block">
                Date & Time
              </label>
              <input
                type="datetime-local"
                required
                value={newShowtime.startsAt}
                onChange={(e) =>
                  setNewShowtime({ ...newShowtime, startsAt: e.target.value })
                }
                className="input-field"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-white/40 mb-2 block">
                Base Price (₹)
              </label>
              <input
                type="number"
                required
                min="1"
                value={newShowtime.price}
                onChange={(e) =>
                  setNewShowtime({
                    ...newShowtime,
                    price: parseFloat(e.target.value),
                  })
                }
                className="input-field"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={addShowtimeMutation.isPending}
            className="w-full glass-button-primary py-3 text-xs tracking-widest uppercase"
          >
            {addShowtimeMutation.isPending ? "Adding..." : "Add Showtime"}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default OrganizerDashboardPage;
