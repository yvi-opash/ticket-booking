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
    <nav className="sticky top-0 z-40 bg-cinema-black bg-opacity-90 backdrop-blur-md border-b border-white border-opacity-5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <Link
              to="/"
              className="text-3xl font-display text-cinema-gold tracking-tighter"
            >
              CINEPLEX
            </Link>
            <div className="hidden md:block ml-10 flex items-baseline space-x-8">
              <Link
                to="/"
                className="text-gray-300 hover:text-cinema-gold transition-colors px-3 py-2 text-sm font-medium uppercase tracking-widest"
              >
                Home
              </Link>
              <Link
                to="/"
                className="text-gray-300 hover:text-cinema-gold transition-colors px-3 py-2 text-sm font-medium uppercase tracking-widest"
              >
                Movies
              </Link>
            </div>
          </div>

          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6 space-x-4">
              {!isAuthenticated ? (
                <>
                  <Link to="/login" className="btn-outline text-xs px-4 py-2">
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="btn-primary text-xs px-4 py-2"
                  >
                    Register
                  </Link>
                </>
              ) : (
                <div className="relative group">
                  <button className="flex items-center space-x-2 focus:outline-none">
                    <span className="text-sm font-medium text-gray-300 group-hover:text-cinema-gold transition-colors uppercase tracking-widest">
                      {user?.name}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-cinema-gold flex items-center justify-center text-black font-bold">
                      {user?.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                  </button>
                  <div className="absolute right-0 top-full pt-4 w-48 hidden group-hover:block z-50">
                    <div className="glass-card py-2 animate-in fade-in slide-in-from-top-2 duration-200 shadow-xl">
                      <Link
                        to="/my-bookings"
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-white hover:bg-opacity-5 hover:text-cinema-gold"
                      >
                        My Bookings
                      </Link>
                      {(user?.role === "admin" ||
                        user?.role === "organizer") && (
                        <Link
                          to={user.role === "admin" ? "/admin" : "/organizer"}
                          className="block px-4 py-2 text-sm text-gray-300 hover:bg-white hover:bg-opacity-5 hover:text-cinema-gold"
                        >
                          Dashboard
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-cinema-red hover:bg-white hover:bg-opacity-5"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden glass-card mx-4 mb-4 overflow-hidden animate-in slide-in-from-top-4 duration-300">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className="text-gray-300 block px-3 py-2 rounded-md text-base font-medium hover:text-cinema-gold"
            >
              Home
            </Link>
            <Link
              to="/"
              className="text-gray-300 block px-3 py-2 rounded-md text-base font-medium hover:text-cinema-gold"
            >
              Movies
            </Link>
            {!isAuthenticated ? (
              <div className="flex flex-col space-y-2 p-3">
                <Link to="/login" className="btn-outline text-center text-sm">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-primary text-center text-sm"
                >
                  Register
                </Link>
              </div>
            ) : (
              <>
                <Link
                  to="/my-bookings"
                  className="text-gray-300 block px-3 py-2 rounded-md text-base font-medium hover:text-cinema-gold"
                >
                  My Bookings
                </Link>
                {(user?.role === "admin" || user?.role === "organizer") && (
                  <Link
                    to={user.role === "admin" ? "/admin" : "/organizer"}
                    className="text-gray-300 block px-3 py-2 rounded-md text-base font-medium hover:text-cinema-gold"
                  >
                    Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="text-cinema-red block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-white hover:bg-opacity-5"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
