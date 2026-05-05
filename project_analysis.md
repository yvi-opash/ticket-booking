# Cineplex Platinum: Deep Project Analysis & Documentation

This document provides an exhaustive explanation of every file and logical block in the ticket booking platform.

---

## 🏗️ 1. Architecture Overview
The project is built using the **MERN** stack (MongoDB, Express, React, Node.js) with **Socket.io** for real-time capabilities. It follows a **Service-Controller-Model** pattern on the backend to ensure the business logic is decoupled from the request handling.

---

## ⚙️ 2. Backend Deep Dive (`/Backend/src/`)

### A. Core Configuration
- **`server.js`**: The central nervous system.
  - **Purpose**: Initializes Express, connects to the DB, and sets up Socket.io.
  - **Key Logic**: It defines the `/api` route prefixes and attaches the global `errorHandler` middleware.
- **`config/db.js`**:
  - **Purpose**: Manages the Mongoose connection.
  - **Detail**: Uses `process.env.MONGO_URL`. If the connection fails, it performs a `process.exit(1)` to prevent the app from running in a broken state.
- **`config/socket.js`**:
  - **Purpose**: Manages bi-directional communication.
  - **Key Logic**: Creates "Rooms" for each showtime (`showtime-[id]`). This ensures that if you are booking seats for *Movie A*, you don't receive seat updates for *Movie B*.

### B. Data Models (`/models/`)
- **`user.model.js`**: Stores profiles. Uses an `enum` for roles: `admin`, `customer`, `organizer`.
- **`movie.model.js`**: Stores film metadata (title, duration, genre, etc.).
- **`showtimes.model.js`**: The bridge between a Movie and a Screen. It dictates when a movie starts and how much it costs.
- **`seats.model.js`**: **The most active model.** Each document represents one physical seat for a specific showtime. Statuses: `available`, `held`, `sold`.
- **`holds.model.js`**: Tracks temporary locks. If a user selects a seat but doesn't pay within the time limit, this record is used to release the seat back to `available`.
- **`booking.model.js`**: Stores the final purchase. Generates a unique `bookingId` (e.g., BKG-A1B2) and a QR code URL for digital entry.

### C. Services (The Brains) (`/services/`)
- **`auth.services.js`**: Handles Bcrypt hashing and JWT generation.
- **`booking.services.js`**: 
  - **`createBooking`**: Performs an atomic update. It ensures a seat is only sold if it was previously "held" by that specific user, preventing double-booking.
- **`showtime.services.js`**: 
  - **`createShowtime`**: When a new showtime is added, this service automatically loops through the screen's layout (rows x columns) and creates all the individual `Seat` entries in the database.
- **`seat.services.js`**: Manages the real-time "Hold" and "Release" logic.

### D. Middleware (`/middleware/`)
- **`auth.js`**:
  - **`protect`**: Verifies the JWT in the request header.
  - **`requireRole`**: A gatekeeper that blocks unauthorized users (e.g., prevents a Customer from accessing the Admin dashboard).
- **`errorHandler.js`**: Catches every error across the backend and returns a clean, uniform JSON response to the frontend.

---

## 🎨 3. Frontend Deep Dive (`/Frontend/src/`)

### A. Core Setup
- **`App.jsx`**: Manages the React Router. It handles "Auth Persistence"—checking if a user is already logged in when they refresh the page.
- **`store.js`**: The Redux state manager. It keeps track of the `user` object globally so the Navbar knows whether to show "Login" or "Logout".
- **`axiosInstance.js`**: Configures the API base URL and automatically injects the Bearer token into every request.

### B. Key Pages (`/pages/`)
- **`HomePage.jsx`**: The main entry. Uses `FilterBar` to allow users to drill down by genre or title.
- **`SeatSelectionPage.jsx`**:
  - **Logic**: It manages a local `selectedSeats` state. It communicates with the backend to "Hold" seats as you click them.
- **`AdminDashboardPage.jsx`**: A high-level view for system owners to manage the entire platform.
- **`OrganizerDashboardPage.jsx`**: A specialized view for theater owners to add their own movies and showtimes.

### C. Critical Components (`/components/`)
- **`SeatMap.jsx`**:
  - **Deep Detail**: Listens to Socket.io events. If another user in another city clicks a seat, this component receives a `seat:held` message and turns that seat orange on your screen instantly.
- **`HoldTimer.jsx`**: A visual countdown. If it reaches zero, it calls a function to "Release" the seats and alerts the user.
- **`ProtectedRoute.jsx`**: A security component that wraps sensitive pages, redirecting guests to the `/login` page.

---

## ⚡ 4. The Real-Time Booking Logic Flow
1. **User Interaction**: User clicks a seat.
2. **API Call**: Frontend calls `POST /seats/hold`.
3. **Database Change**: Backend updates seat status to `held` and creates a `Hold` record.
4. **Socket Broadcast**: Backend emits `seat:held` to the specific room.
5. **Global Sync**: Every other user looking at that movie sees the seat change color without refreshing.
6. **Finalization**: On successful payment, the status changes to `sold` and another broadcast (`seat:sold`) removes it from the "available" pool permanently.

---

## 🔒 5. Security Summary
- **Authentication**: JWT (JSON Web Tokens) used for all private actions.
- **Data Integrity**: Bcrypt used for password encryption.
- **Access Control**: Role-based permissions (Admin/Organizer/Customer) enforced at both the Frontend (UI visibility) and Backend (API protection) levels.
