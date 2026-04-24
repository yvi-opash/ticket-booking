import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import { initSocket } from "./config/socket.js";
import errorHandler from "./middleware/errorHandler.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 8000;

connectDB();

// Error handler middleware (must be registered after routes, but we can add it here for now)
// Note: When you add routes, make sure they are placed BEFORE this line.
app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(`Server is running on port - ${PORT}`);
});


initSocket(server);