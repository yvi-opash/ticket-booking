import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store";

const Navbar = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-brand-dark/40 backdrop-blur-3xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-24">
          <div className="flex items-center gap-12">
            <Link
              to="/"
              className="text-3xl font-black text-brand-primary tracking-tighter flex items-center gap-2"
            >
              <div className="w-8 h-8 bg-brand-primary rounded-lg rotate-12 flex items-center justify-center">
                <div className="w-4 h-4 bg-black rounded-sm -rotate-12" />
              </div>
              CINEPLEX
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <Link to="/" className="nav-link">Home</Link>
              <Link to="/" className="nav-link">Movies</Link>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6">
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="text-xs font-bold uppercase tracking-widest text-white/70 hover:text-brand-primary transition-colors">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="glass-button-primary"
                >
                  Join Now
                </Link>
              </>
            ) : (
              <div className="relative group">
                <button className="flex items-center gap-3 p-2 rounded-2xl hover:bg-white/5 transition-all">
                  <div className="text-right">
                    <p className="text-xs font-black uppercase text-brand-primary tracking-widest leading-none">
                      {user?.name}
                    </p>
                    <p className="text-[10px] text-white/40 uppercase font-bold tracking-tighter">
                      {user?.role}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-brand-primary flex items-center justify-center text-black font-black text-lg shadow-[0_0_20px_rgba(229,9,20,0.2)]">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                </button>
                <div className="absolute right-0 top-full pt-2 w-56 hidden group-hover:block animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="glass-card overflow-hidden shadow-2xl">
                    <div className="p-2 space-y-1">
                      <Link
                        to="/my-bookings"
                        className="flex items-center gap-3 px-4 py-4 text-sm text-white/90 hover:text-brand-primary hover:bg-white/10 rounded-xl transition-all font-bold"
                      >
                        <span className="text-brand-primary">→</span> My Tickets
                      </Link>
                      {(user?.role === "admin" ||
                        user?.role === "organizer") && (
                        <Link
                          to={user.role === "admin" ? "/admin" : "/organizer"}
                          className="flex items-center gap-3 px-4 py-4 text-sm text-white/90 hover:text-brand-primary hover:bg-white/10 rounded-xl transition-all font-bold"
                        >
                          <span className="text-brand-primary">→</span> Dashboard
                        </Link>
                      )}
                      <div className="h-px bg-white/10 my-2 mx-2" />
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-4 text-sm text-white/60 hover:text-white hover:bg-white/10 rounded-xl transition-all font-bold group"
                      >
                        <span className="text-brand-primary group-hover:scale-125 transition-transform">×</span> Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-3 rounded-xl bg-white/5 text-brand-primary"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 p-4 animate-in slide-in-from-top-4 duration-300">
          <div className="glass-card p-6 space-y-6 shadow-2xl">
            <div className="flex flex-col gap-4">
              <Link to="/" className="nav-link">Home</Link>
              <Link to="/" className="nav-link">Movies</Link>
            </div>
            {!isAuthenticated ? (
              <div className="flex flex-col gap-3 pt-6 border-t border-white/5">
                <Link to="/login" className="glass-button text-center">Login</Link>
                <Link to="/register" className="glass-button-primary text-center">Register</Link>
              </div>
            ) : (
              <div className="flex flex-col gap-3 pt-6 border-t border-white/5">
                <Link to="/my-bookings" className="nav-link">My Bookings</Link>
                <button onClick={handleLogout} className="text-white/40 font-bold uppercase text-xs tracking-widest text-left">Logout</button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
