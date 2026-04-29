import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axiosInstance from "./axiosInstance";
import { setUser, setLoading } from "./store";

// Components
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import HomePage from "./pages/HomePage";
import MovieDetailPage from "./pages/MovieDetailPage";
import SeatSelectionPage from "./pages/SeatSelectionPage";
import CheckoutPage from "./pages/CheckoutPage";
import MyBookingsPage from "./pages/MyBookingsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import OrganizerDashboardPage from "./pages/OrganizerDashboardPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await axiosInstance.get("/auth/me");
          dispatch(setUser(response.data.data));
        } catch (error) {
          localStorage.removeItem("token");
        }
      }
      dispatch(setLoading(false));
    };

    initAuth();
  }, [dispatch]);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-brand-dark">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-brand-primary"></div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/movies/:id" element={<MovieDetailPage />} />
              <Route
                path="/login"
                element={
                  isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />
                }
              />

              <Route
                path="/register"
                element={
                  isAuthenticated ? (
                    <Navigate to="/" replace />
                  ) : (
                    <RegisterPage />
                  )
                }
              />

              {/* Protected Routes (Any Role) */}
              <Route element={<ProtectedRoute />}>
                <Route
                  path="/showtimes/:id/seats"
                  element={<SeatSelectionPage />}
                />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/my-bookings" element={<MyBookingsPage />} />
              </Route>

              {/* Organizer & Admin Routes */}
              <Route
                element={<ProtectedRoute roles={["organizer", "admin"]} />}
              >
                <Route path="/organizer" element={<OrganizerDashboardPage />} />
              </Route>

              {/* Admin Only Routes */}
              <Route element={<ProtectedRoute roles={["admin"]} />}>
                <Route path="/admin" element={<AdminDashboardPage />} />
              </Route>

              {/* 404 Route */}
              <Route
                path="*"
                element={
                  <div className="h-screen flex flex-col items-center justify-center text-center px-4 bg-brand-dark">
                    <h1 className="text-9xl font-display text-brand-primary opacity-10 absolute z-0 select-none">
                      404
                    </h1>
                    <div className="relative z-10">
                      <h2 className="text-4xl font-display text-white mb-4 uppercase tracking-widest">
                        Page Not Found
                      </h2>
                      <p className="text-white/30 uppercase tracking-[0.2em] text-xs mb-8">
                        The film you are looking for has been discontinued.
                      </p>
                      <button
                        onClick={() => (window.location.href = "/")}
                        className="glass-button-primary py-3 px-10"
                      >
                        Back to Reality
                      </button>
                    </div>
                  </div>
                }
              />
            </Routes>
          </main>

          <footer className="bg-brand-dark border-t border-white border-opacity-5 py-10 text-center">
            <p className="text-[10px] text-white/20 uppercase font-bold tracking-[0.5em]">
              © 2026 CINEPLEX PLATINUM • DEVELOPED FOR EXCELLENCE
            </p>
          </footer>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
