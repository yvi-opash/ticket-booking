# API Mapping Documentation

This document maps the backend API endpoints to the frontend files where they are consumed.

## Summary Table

| Feature Area | Endpoint | Method | Backend Route File | Frontend Component/Page |
| :--- | :--- | :--- | :--- | :--- |
| **Authentication** | `/auth/register` | POST | `authRoutes.js` | `RegisterPage.jsx` |
| | `/auth/login` | POST | `authRoutes.js` | `LoginPage.jsx` |
| | `/auth/me` | GET | `authRoutes.js` | `App.jsx` |
| **Movies** | `/movies` | GET | `movieRoutes.js` | `HomePage.jsx`, `OrganizerDashboardPage.jsx`, `AdminDashboardPage.jsx` |
| | `/movies` | POST | `movieRoutes.js` | `AdminDashboardPage.jsx` |
| | `/movies/:id` | GET | `movieRoutes.js` | `MovieDetailPage.jsx` |
| | `/movies/:id` | DELETE | `movieRoutes.js` | `AdminDashboardPage.jsx` |
| **Theaters** | `/theaters` | GET | `theaterRoutes.js` | *Used for general theater listing* |
| | `/theaters/my-theaters`| GET | `theaterRoutes.js` | `OrganizerDashboardPage.jsx` |
| | `/theaters` | POST | `theaterRoutes.js` | `OrganizerDashboardPage.jsx` |
| **Screens** | `/screens/theater/:id` | GET | `screenRoutes.js` | `OrganizerDashboardPage.jsx` |
| | `/screens` | POST | `screenRoutes.js` | `OrganizerDashboardPage.jsx` |
| | `/screens/:id` | PUT | `screenRoutes.js` | `OrganizerDashboardPage.jsx` |
| **Showtimes** | `/showtimes` | GET | `showtimeRoutes.js` | `MovieDetailPage.jsx` |
| | `/showtimes/:id` | GET | `showtimeRoutes.js` | `SeatSelectionPage.jsx` |
| | `/showtimes/:id/seats` | GET | `showtimeRoutes.js` | `SeatSelectionPage.jsx` |
| | `/showtimes` | POST | `showtimeRoutes.js` | `OrganizerDashboardPage.jsx` |
| **Seats** | `/seats/hold` | POST | `seatRoutes.js` | `SeatSelectionPage.jsx` |
| | `/seats/release` | POST | `seatRoutes.js` | `SeatSelectionPage.jsx` |
| **Bookings** | `/bookings` | POST | `bookingRoutes.js` | `CheckoutPage.jsx` |
| | `/bookings/my-bookings`| GET | `bookingRoutes.js` | `MyBookingsPage.jsx` |
| | `/bookings/:id/cancel` | POST | `bookingRoutes.js` | `MyBookingsPage.jsx` |
| | `/bookings/all` | GET | `bookingRoutes.js` | `AdminDashboardPage.jsx` |
| **Admin** | `/admin/users` | GET | `adminRoutes.js` | `AdminDashboardPage.jsx` |
| | `/admin/users/:id/approve-organizer` | PUT | `adminRoutes.js` | `AdminDashboardPage.jsx` |
| | `/admin/users/:id/role` | PUT | `adminRoutes.js` | `AdminDashboardPage.jsx` |

## Detailed Breakdown

### Backend Route Files
- **`Backend/src/routes/authRoutes.js`**: Handles user registration, login, and profile fetching.
- **`Backend/src/routes/movieRoutes.js`**: Handles CRUD operations for movies.
- **`Backend/src/routes/theaterRoutes.js`**: Manages theater information and organizer-specific theaters.
- **`Backend/src/routes/screenRoutes.js`**: Manages screens and layouts within theaters.
- **`Backend/src/routes/showtimeRoutes.js`**: Manages movie showtimes and seat availability.
- **`Backend/src/routes/seatRoutes.js`**: Handles temporary seat holds and releases during booking.
- **`Backend/src/routes/bookingRoutes.js`**: Manages the booking lifecycle (creation, cancellation, retrieval).
- **`Backend/src/routes/adminRoutes.js`**: Provides administrative user management capabilities.

### Frontend API Utility
- **`Frontend/src/axiosInstance.js`**: Centralized Axios configuration with base URL `http://localhost:8000/api` and automatic Authorization header injection.
