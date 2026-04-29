import React, { useState } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import axiosInstance from "../axiosInstance";
import Modal from "../components/Modal";

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state;

  const [loading, setLoading] = useState(false);
  const [successBooking, setSuccessBooking] = useState(null);
  const [error, setError] = useState(null);

  if (!state || !state.showtimeId || !state.seatIds) {
    return <Navigate to="/" />;
  }

  const handlePay = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.post("/bookings", {
        showtimeId: state.showtimeId,
        seatIds: state.seatIds,
      });
      setSuccessBooking(response.data.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Payment failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const totalPrice =
    state.selectedSeats.reduce((sum, s) => sum + s.price, 0) + 1.5;

  return (
    <div className="min-h-screen bg-cinema-black py-20 px-4">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Order Summary */}
        <div className="animate-in slide-in-from-left-8 duration-700">
          <h2 className="text-3xl font-display text-brand-primary mb-8 uppercase tracking-widest">
            Final Summary
          </h2>
          <div className="glass-card p-8 border-l-4 border-brand-primary">
            <h3 className="text-2xl font-display text-white mb-2">
              {state.movieTitle}
            </h3>
            <p className="text-xs text-cinema-muted uppercase tracking-widest mb-6">
              {new Date(state.startsAt).toLocaleString()} • {state.theaterName}
            </p>

            <div className="space-y-4 mb-8">
              {state.selectedSeats.map((seat) => (
                <div key={seat._id} className="flex justify-between text-sm">
                  <span className="text-gray-400">
                    Row {String.fromCharCode(64 + seat.row)} - Seat{" "}
                    {seat.number} ({seat.tier})
                  </span>
                  <span className="text-white">₹{seat.price}</span>
                </div>
              ))}
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Convenience Fee</span>
                <span className="text-white">₹1.50</span>
              </div>
            </div>

            <div className="pt-6 border-t border-white border-opacity-10 flex justify-between items-center">
              <span className="text-lg font-display text-brand-primary uppercase tracking-widest">
                Total Amount
              </span>
              <span className="text-4xl font-display text-white">
                ₹{totalPrice}
              </span>
            </div>
          </div>
        </div>

        {/* Mock Payment Form */}
        <div className="animate-in slide-in-from-right-8 duration-700">
          <h2 className="text-3xl font-display text-white mb-8 uppercase tracking-widest">
            Payment
          </h2>
          <form onSubmit={handlePay} className="glass-card p-8 space-y-6">
            <div>
              <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-cinema-muted mb-2 block">
                Cardholder Name
              </label>
              <input
                type="text"
                required
                className="input-field"
                placeholder="JOHN DOE"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-cinema-muted mb-2 block">
                Card Number
              </label>
              <input
                type="text"
                required
                className="input-field"
                placeholder="XXXX XXXX XXXX XXXX"
                maxLength={19}
              />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-cinema-muted mb-2 block">
                  Expiry Date
                </label>
                <input
                  type="text"
                  required
                  className="input-field"
                  placeholder="MM/YY"
                  maxLength={5}
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-cinema-muted mb-2 block">
                  CVV
                </label>
                <input
                  type="password"
                  required
                  className="input-field"
                  placeholder="***"
                  maxLength={3}
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-white/20 bg-opacity-10 border border-white/20 rounded text-white/20 text-xs font-bold uppercase tracking-widest">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-4 text-sm tracking-widest uppercase font-bold disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-black border-t-transparent" />
                  <span>Processing...</span>
                </>
              ) : (
                <span>Pay ₹{totalPrice}</span>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Success Modal */}
      <Modal
        isOpen={!!successBooking}
        onClose={() => navigate("/my-bookings")}
        title="Booking Confirmed!"
      >
        <div className="text-center py-4">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 text-black">
            <svg
              className="w-12 h-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <p className="text-gray-300 mb-8">
            Your seats have been successfully booked. Your booking ID is{" "}
            <span className="text-brand-primary font-bold">
              {successBooking?.bookingId}
            </span>
            .
          </p>
          <div className="w-40 h-40 bg-white mx-auto mb-8 flex items-center justify-center border-4 border-brand-primary p-2">
            {successBooking?.qrCode ? (
              <img
                src={successBooking.qrCode}
                alt="QR Code"
                className="w-full h-full"
              />
            ) : (
              <div className="text-black font-bold text-[10px] tracking-tighter uppercase">
                QR Code
                <br />
                Loading...
              </div>
            )}
          </div>
          <div className="flex flex-col space-y-3">
            <button
              onClick={() => navigate("/my-bookings")}
              className="btn-primary w-full py-3 text-xs tracking-widest "
            >
              View My Tickets
            </button>
            <button
              onClick={() => navigate("/")}
              className="text-xs text-cinema-muted uppercase tracking-widest font-bold hover:text-white transition-colors"
            >
              Go Home
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CheckoutPage;
