import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import { initSocket } from "./config/socket.js";
import errorHandler from "./middleware/errorHandler.js";


import authRoutes from "./routes/authRoutes.js";
import movieRoutes from "./routes/movieRoutes.js";
import theaterRoutes from "./routes/theaterRoutes.js";
import screenRoutes from "./routes/screenRoutes.js";
import showtimeRoutes from "./routes/showtimeRoutes.js";
import seatRoutes from "./routes/seatRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 8000;

connectDB();


app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/theaters", theaterRoutes);
app.use("/api/screens", screenRoutes);
app.use("/api/showtimes", showtimeRoutes);
app.use("/api/seats", seatRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRoutes);

app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(`Server is running on port - ${PORT}`);
});


initSocket(server);