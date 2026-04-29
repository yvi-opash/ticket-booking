import React from "react";

const BookingCard = ({ booking, onCancel }) => {
  const isCancellable =
    booking.status === "confirmed" &&
    new Date(booking.showtime.startsAt) > new Date();

  return (
    <div className="glass-card overflow-hidden flex flex-col md:flex-row mb-6 border-l-4 border-cinema-gold">
      {/* Poster Section */}
      <div className="w-full md:w-48 bg-cinema-black h-48 md:h-auto">
        <img
          src={booking.showtime?.movie?.posterUrl}
          alt={booking.showtime?.movie?.title}
          className="w-full h-full object-cover opacity-80"
        />
      </div>

      {/* Details Section */}
      <div className="flex-1 p-6 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-2xl font-display text-white tracking-wide">
              {booking.showtime.movie.title}
            </h3>
            <span
              className={`text-[10px] uppercase font-bold px-3 py-1 rounded-full ${
                booking.status === "confirmed"
                  ? "bg-green-500 text-black"
                  : "bg-cinema-red text-white"
              }`}
            >
              {booking.status}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs text-cinema-muted uppercase tracking-widest mt-4">
            <div>
              <p className="text-white mb-1">Date & Time</p>
              <p>
                {new Date(booking.showtime.startsAt).toLocaleDateString()} at{" "}
                {new Date(booking.showtime.startsAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <div>
              <p className="text-white mb-1">Seats</p>
              <p>
                {booking.seats
                  .map((s) => `${String.fromCharCode(64 + s.row)}${s.number}`)
                  .join(", ")}
              </p>
            </div>
            <div>
              <p className="text-white mb-1">Theater</p>
              <p>
                {booking.showtime?.screen?.theater?.name || "N/A"} -{" "}
                {booking.showtime?.screen?.name || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-white mb-1">Booking ID</p>
              <p className="text-cinema-gold">{booking.bookingId}</p>
            </div>
          </div>
        </div>

        {isCancellable && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => onCancel(booking._id)}
              className="text-cinema-red hover:text-white transition-colors text-[10px] uppercase font-bold tracking-widest"
            >
              Cancel Booking
            </button>
          </div>
        )}
      </div>

      {/* QR Code Section */}
      <div className="w-full md:w-48 p-6 flex flex-col items-center justify-center bg-white bg-opacity-5 border-t md:border-t-0 md:border-l border-white border-opacity-5">
        <div className="w-32 h-32 border-2 border-dashed border-cinema-gold p-1 mb-2 bg-white flex items-center justify-center">
          {booking.qrCode ? (
            <img
              src={booking.qrCode}
              alt="Booking QR Code"
              className="w-full h-full"
            />
          ) : (
            <div className="text-[10px] text-black font-bold text-center">
              QR CODE PENDING
            </div>
          )}
        </div>
        <span className="text-[10px] text-cinema-muted uppercase font-bold tracking-tighter">
          Scan at Entrance
        </span>
      </div>
    </div>
  );
};

export default BookingCard;
