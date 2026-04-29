import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../axiosInstance";
import BookingCard from "../components/BookingCard";
import LoadingSkeleton from "../components/LoadingSkeleton";

const MyBookingsPage = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["my-bookings"],
    queryFn: async () => {
      const response = await axiosInstance.get("/bookings/my-bookings");
      return response.data;
    },
  });

  const cancelMutation = useMutation({
    mutationFn: async (id) => {
      await axiosInstance.post(`/bookings/${id}/cancel`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-bookings"] });
      alert("Booking cancelled successfully.");
    },
    onError: (error) => {
      alert(error.response?.data?.message || "Failed to cancel booking.");
    },
  });

  const handleCancel = (id) => {
    if (
      window.confirm(
        "Are you sure you want to cancel this booking? This action cannot be undone.",
      )
    ) {
      cancelMutation.mutate(id);
    }
  };

  return (
    <div className="min-h-screen bg-cinema-black py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-display text-cinema-gold mb-12 uppercase tracking-[0.2em]">
          My Tickets
        </h1>

        {isLoading ? (
          <LoadingSkeleton type="row" count={3} />
        ) : isError ? (
          <div className="text-center py-20 glass-card">
            <h2 className="text-2xl font-display text-cinema-red mb-2">
              Error loading bookings
            </h2>
            <p className="text-cinema-muted uppercase tracking-widest text-xs">
              Could not fetch your ticket history.
            </p>
          </div>
        ) : data?.data.length === 0 ? (
          <div className="text-center py-20 glass-card border-dashed border-2 border-white border-opacity-5">
            <div className="w-16 h-16 bg-white bg-opacity-5 rounded-full flex items-center justify-center mx-auto mb-6 text-cinema-muted">
              <svg
                className="w-8 h-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-display text-white mb-2 uppercase tracking-widest">
              No Bookings Yet
            </h2>
            <p className="text-cinema-muted uppercase tracking-widest text-xs mb-8">
              You haven't reserved any movie tickets yet.
            </p>
            <a href="/" className="btn-outline text-xs px-8 py-3">
              Explore Movies
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {data?.data.map((booking) => (
              <BookingCard
                key={booking._id}
                booking={booking}
                onCancel={handleCancel}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookingsPage;
