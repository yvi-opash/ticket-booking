import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../axiosInstance";
import StatCard from "../components/StatCard";
import LoadingSkeleton from "../components/LoadingSkeleton";
import Modal from "../components/Modal";

const AdminDashboardPage = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isMovieModalOpen, setIsMovieModalOpen] = useState(false);
  const [newMovie, setNewMovie] = useState({
    title: "",
    description: "",
    language: "English",
    genre: "",
    duration: 120,
    rating: 8.5,
    posterUrl: "",
  });

  const queryClient = useQueryClient();

  // Queries
  const { data: usersData, isLoading: isUsersLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const response = await axiosInstance.get("/admin/users");
      return response.data;
    },
    enabled: activeTab === "users" || activeTab === "overview",
  });

  const { data: moviesData, isLoading: isMoviesLoading } = useQuery({
    queryKey: ["admin-movies"],
    queryFn: async () => {
      const response = await axiosInstance.get("/movies");
      return response.data;
    },
    enabled: activeTab === "movies" || activeTab === "overview",
  });

  const { data: bookingsData, isLoading: isBookingsLoading } = useQuery({
    queryKey: ["admin-bookings"],
    queryFn: async () => {
      const response = await axiosInstance.get("/bookings/all");
      return response.data;
    },
    enabled: activeTab === "bookings" || activeTab === "overview",
  });

  // Mutations
  const approveMutation = useMutation({
    mutationFn: async (id) => {
      await axiosInstance.put(`/admin/users/${id}/approve-organizer`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      alert("Organizer approved.");
    },
  });

  const changeRoleMutation = useMutation({
    mutationFn: async ({ id, role }) => {
      await axiosInstance.put(`/admin/users/${id}/role`, { role });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      alert("Role updated.");
    },
  });

  const addMovieMutation = useMutation({
    mutationFn: async (data) => {
      const response = await axiosInstance.post("/movies", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-movies"] });
      setIsMovieModalOpen(false);
      setNewMovie({
        title: "",
        description: "",
        language: "English",
        genre: "",
        duration: 120,
        rating: 8.5,
        posterUrl: "",
      });
      alert("Movie added successfully!");
    },
    onError: (err) => {
      alert(err.response?.data?.message || "Failed to add movie");
    },
  });

  const deleteMovieMutation = useMutation({
    mutationFn: async (id) => {
      await axiosInstance.delete(`/movies/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-movies"] });
      alert("Movie deleted.");
    },
  });

  const handleAddMovie = (e) => {
    e.preventDefault();
    addMovieMutation.mutate(newMovie);
  };

  return (
    <div className="min-h-screen bg-brand-dark py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-display text-brand-primary mb-12 mt-10 uppercase tracking-[0.2em]">
          Super Admin Dashboard
        </h1>

        {/* Tab Navigation */}
        <div className="flex space-x-8 border-b border-white border-opacity-5 mb-12 overflow-x-auto pb-1 scrollbar-hide">
          {["overview", "users", "movies", "bookings"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-xs font-bold uppercase tracking-widest transition-all ${activeTab === tab
                  ? "text-brand-primary border-b-2 border-brand-primary"
                  : "text-white/40 hover:text-white"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="space-y-12 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                label="Total Users"
                value={usersData?.data.length || 0}
              />
              <StatCard
                label="Total Movies"
                value={moviesData?.data.length || 0}
              />
              <StatCard
                label="Total Bookings"
                value={bookingsData?.data.length || 0}
              />
              <StatCard
                label="Total Revenue"
                value={`₹${bookingsData?.data.reduce((sum, b) => sum + b.totalAmount, 0).toFixed(2) || "0.00"}`}
              />
            </div>

            <div className="glass-card p-8">
              <h3 className="text-xl font-display text-white mb-6 uppercase tracking-widest">
                Recent Activity
              </h3>
              <div className="space-y-4">
                {bookingsData?.data.slice(0, 5).map((b) => (
                  <div
                    key={b._id}
                    className="flex justify-between items-center text-xs py-3 border-b border-white border-opacity-5"
                  >
                    <span className="text-gray-400">
                      New booking for{" "}
                      <span className="text-white font-bold">
                        {b.showtime?.movie?.title || "Deleted Movie"}
                      </span>
                    </span>
                    <span className="text-brand-primary font-display text-lg">
                      ₹{b.totalAmount}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "users" && (
          <div className="glass-card overflow-hidden animate-in fade-in duration-500">
            {isUsersLoading ? (
              <LoadingSkeleton type="row" count={5} />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-brand-primary/10 text-[10px] uppercase font-black tracking-[0.2em] text-brand-primary border-b border-brand-primary/20">
                    <tr>
                      <th className="px-6 py-4">Name</th>
                      <th className="px-6 py-4">Email</th>
                      <th className="px-6 py-4">Role</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white divide-opacity-5">
                    {usersData?.data.map((user) => (
                      <tr
                        key={user._id}
                        className="text-xs text-gray-300 hover:bg-white hover:bg-opacity-[0.02]"
                      >
                        <td className="px-6 py-4 font-bold text-white uppercase">
                          {user.name}
                        </td>
                        <td className="px-6 py-4">{user.email}</td>
                        <td className="px-6 py-4 uppercase">
                          <select
                            value={user.role}
                            onChange={(e) =>
                              changeRoleMutation.mutate({
                                id: user._id,
                                role: e.target.value,
                              })
                            }
                            className="bg-cinema-dark border border-white border-opacity-10 rounded px-2 py-1 text-[10px]"
                          >
                            <option value="customer">User</option>
                            <option value="organizer">Organizer</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                        <td className="px-6 py-4">
                          {user.role === "organizer" ? (
                            <span
                              className={
                                user.isApproved
                                  ? "text-green-500"
                                  : "text-white/20 font-bold uppercase text-[10px]"
                              }
                            >
                              {user.isApproved
                                ? "Approved"
                                : "Pending Approval"}
                            </span>
                          ) : (
                            "-"
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          {user.role === "organizer" && !user.isApproved && (
                            <button
                              onClick={() => approveMutation.mutate(user._id)}
                              className="glass-button-primary text-[10px] py-1 px-4 tracking-widest"
                            >
                              Approve
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === "movies" && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-4 px-2">
              <h2 className="text-2xl font-display text-white uppercase tracking-widest">
                Movie Library
              </h2>
              <button
                onClick={() => setIsMovieModalOpen(true)}
                className="glass-button-primary text-xs py-2 px-6 tracking-widest"
              >
                + Add Movie
              </button>
            </div>

            <div className="glass-card overflow-hidden">
              {isMoviesLoading ? (
                <LoadingSkeleton type="row" count={5} />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-white/5 text-[10px] uppercase font-bold tracking-widest text-white/40">
                      <tr>
                        <th className="px-6 py-4">Poster</th>
                        <th className="px-6 py-4">Title</th>
                        <th className="px-6 py-4">Genre</th>
                        <th className="px-6 py-4">Language</th>
                        <th className="px-6 py-4">Duration</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white divide-opacity-5">
                      {moviesData?.data.map((movie) => (
                        <tr
                          key={movie._id}
                          className="text-xs text-gray-300 hover:bg-white hover:bg-opacity-[0.02]"
                        >
                          <td className="px-6 py-2">
                            <img
                              src={movie.posterUrl}
                              alt={movie.title}
                              className="h-10 w-8 object-cover rounded shadow-lg"
                            />
                          </td>
                          <td className="px-6 py-4 font-bold text-white uppercase tracking-wider">
                            {movie.title}
                          </td>
                          <td className="px-6 py-4">{movie.genre}</td>
                          <td className="px-6 py-4 uppercase">
                            {movie.language}
                          </td>
                          <td className="px-6 py-4">{movie.duration}m</td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => {
                                if (confirm("Delete movie?"))
                                  deleteMovieMutation.mutate(movie._id);
                              }}
                              className="text-white/20 hover:underline text-[10px] uppercase font-bold tracking-widest"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "bookings" && (
          <div className="glass-card overflow-hidden animate-in fade-in duration-500">
            {isBookingsLoading ? (
              <LoadingSkeleton type="row" count={5} />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-brand-primary/10 text-[10px] uppercase font-black tracking-[0.2em] text-brand-primary border-b border-brand-primary/20">
                    <tr>
                      <th className="px-6 py-4">Booking ID</th>
                      <th className="px-6 py-4">User</th>
                      <th className="px-6 py-4">Movie</th>
                      <th className="px-6 py-4">Amount</th>
                      <th className="px-6 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white divide-opacity-5">
                    {bookingsData?.data.map((booking) => (
                      <tr key={booking._id} className="text-xs text-gray-300">
                        <td className="px-6 py-4 font-mono text-brand-primary">
                          {booking.bookingId}
                        </td>
                        <td className="px-6 py-4">
                          {typeof booking.user === "object"
                            ? booking.user.name
                            : "User"}
                        </td>
                        <td className="px-6 py-4">
                          {booking.showtime?.movie?.title || "Deleted Movie"}
                        </td>
                        <td className="px-6 py-4 font-bold text-white">
                          ₹{booking.totalAmount}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2 py-1 rounded-full text-[8px] uppercase font-bold ${booking.status === "confirmed"
                                ? "bg-green-500/20 text-green-500"
                                : "bg-white/20/20 text-white/20"
                              }`}
                          >
                            {booking.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Movie Modal */}
      <Modal
        isOpen={isMovieModalOpen}
        onClose={() => setIsMovieModalOpen(false)}
        title="Add New Movie"
      >
        <form onSubmit={handleAddMovie} className="space-y-4">
          <div>
            <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-white/40 mb-2 block">
              Title
            </label>
            <input
              type="text"
              required
              value={newMovie.title}
              onChange={(e) =>
                setNewMovie({ ...newMovie, title: e.target.value })
              }
              className="input-field"
              placeholder="e.g. Inception"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-white/40 mb-2 block">
                Genre
              </label>
              <select
                required
                value={newMovie.genre}
                onChange={(e) =>
                  setNewMovie({ ...newMovie, genre: e.target.value })
                }
                className="input-field py-2 text-xs"
              >
                <option value="">Select Genre</option>
                <option value="Action">Action</option>
                <option value="Comedy">Comedy</option>
                <option value="Drama">Drama</option>
                <option value="Horror">Horror</option>
                <option value="Sci-Fi">Sci-Fi</option>
                <option value="Romance">Romance</option>
                <option value="Thriller">Thriller</option>
                <option value="Animation">Animation</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-white/40 mb-2 block">
                Language
              </label>
              <select
                required
                value={newMovie.language}
                onChange={(e) =>
                  setNewMovie({ ...newMovie, language: e.target.value })
                }
                className="input-field py-2 text-xs"
              >
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
                <option value="Gujarati">Gujarati</option>
                <option value="Marathi">Marathi</option>
                <option value="Tamil">Tamil</option>
                <option value="Telugu">Telugu</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-white/40 mb-2 block">
                Duration (min)
              </label>
              <input
                type="number"
                required
                value={newMovie.duration}
                onChange={(e) =>
                  setNewMovie({
                    ...newMovie,
                    duration: parseInt(e.target.value),
                  })
                }
                className="input-field"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-white/40 mb-2 block">
                Rating (0-10)
              </label>
              <input
                type="number"
                step="0.1"
                required
                min="0"
                max="10"
                value={newMovie.rating}
                onChange={(e) =>
                  setNewMovie({
                    ...newMovie,
                    rating: parseFloat(e.target.value),
                  })
                }
                className="input-field"
              />
            </div>
          </div>
          <div>
            <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-white/40 mb-2 block">
              Poster URL
            </label>
            <input
              type="text"
              required
              value={newMovie.posterUrl}
              onChange={(e) =>
                setNewMovie({ ...newMovie, posterUrl: e.target.value })
              }
              className="input-field"
              placeholder="https://image..."
            />
          </div>
          <div>
            <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-white/40 mb-2 block">
              Description
            </label>
            <textarea
              required
              rows={3}
              value={newMovie.description}
              onChange={(e) =>
                setNewMovie({ ...newMovie, description: e.target.value })
              }
              className="input-field py-3"
              placeholder="Enter movie synopsis..."
            ></textarea>
          </div>
          <button
            type="submit"
            disabled={addMovieMutation.isPending}
            className="w-full glass-button-primary py-3 text-xs tracking-widest uppercase mt-4"
          >
            {addMovieMutation.isPending ? "Adding..." : "Add Movie"}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default AdminDashboardPage;
