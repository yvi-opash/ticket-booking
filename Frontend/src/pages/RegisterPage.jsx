import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axiosInstance from "../axiosInstance";
import { setCredentials } from "../store";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "customer",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match");
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.post("/auth/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });
      const { token, ...user } = response.data.data;
      dispatch(setCredentials({ user, token }));
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cinema-black flex items-center justify-center px-4 py-20 relative">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -right-20 w-96 h-96 bg-cinema-gold opacity-[0.03] blur-[100px] rounded-full" />
        <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-cinema-red opacity-[0.03] blur-[100px] rounded-full" />
      </div>

      <div className="w-full max-w-lg z-10 animate-in fade-in zoom-in-95 duration-500">
        <div className="text-center mb-10">
          <Link
            to="/"
            className="text-5xl font-display text-cinema-gold tracking-tighter mb-4 inline-block"
          >
            CINEPLEX
          </Link>
          <p className="text-cinema-muted uppercase tracking-[0.3em] text-[10px] font-bold">
            Premium Cinema Experience
          </p>
        </div>

        <div className="glass-card p-10 border-t-2 border-cinema-gold">
          <h2 className="text-3xl font-display text-white mb-8 text-center uppercase tracking-widest">
            Register
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-cinema-muted mb-2 block">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="input-field"
                placeholder="JOHN DOE"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-cinema-muted mb-2 block">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                placeholder="yours@example.com"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-cinema-muted mb-2 block">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-cinema-muted mb-2 block">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-cinema-muted mb-2 block">
                Register as
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="input-field cursor-pointer"
              >
                <option value="customer">Customer / Movie Buff</option>
                <option value="organizer">Theater Organizer</option>
              </select>
            </div>

            {error && (
              <div className="p-3 bg-cinema-red bg-opacity-10 border border-cinema-red rounded text-cinema-red text-xs font-bold uppercase tracking-widest text-center animate-in shake duration-300">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-4 text-sm tracking-widest uppercase font-bold disabled:opacity-50 flex items-center justify-center"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-black border-t-transparent" />
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-xs text-cinema-muted uppercase tracking-widest">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-cinema-gold font-bold hover:underline"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
