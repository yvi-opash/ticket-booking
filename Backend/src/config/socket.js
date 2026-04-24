import { Server } from "socket.io";

let io;

export const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: process.env.CLIENT_URL || "*",
            methods: ["GET", "POST"]
        }
    });

    io.on("connection", (socket) => {
        console.log(`Socket connected: ${socket.id}`);

        // Client joins a room for a specific showtime seat map
        socket.on("join:showtime", (showtimeId) => {
            const room = `showtime-${showtimeId}`;
            socket.join(room);
            console.log(`Socket ${socket.id} joined room: ${room}`);
        });

        // Client leaves a room
        socket.on("leave:showtime", (showtimeId) => {
            const room = `showtime-${showtimeId}`;
            socket.leave(room);
            console.log(`Socket ${socket.id} left room: ${room}`);
        });

        socket.on("disconnect", () => {
            console.log(`Socket disconnected: ${socket.id}`);
        });
    });

    return io;
};

export const getIo = () => {
    if (!io) {
        throw new Error("Socket.io not initialized");
    }
    return io;
};

// Emits events to a specific showtime room
// eventType should be: 'seat:held', 'seat:released', or 'seat:sold'
export const emitSeatUpdate = (showtimeId, eventType, seatData) => {
    if (!io) return; // Fail silently if not initialized, useful for scripts/tests
    io.to(`showtime-${showtimeId}`).emit(eventType, seatData);
};
