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
    <div className="min-h-screen bg-brand-dark flex items-center justify-center px-4 py-24 relative overflow-hidden">
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-brand-primary/5 blur-[150px] -rotate-45" />
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-brand-primary/5 blur-[150px] rotate-45" />

      <div className="w-full max-w-2xl z-10 animate-in fade-in zoom-in-95 duration-700">
        <div className="text-center mb-12">
          <Link
            to="/"
            className="text-5xl font-black text-brand-primary tracking-tighter mb-4 inline-block drop-shadow-[0_0_20px_rgba(229,9,20,0.3)]"
          >
            CINEPLEX
          </Link>
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-8 bg-brand-primary/20" />
            <p className="text-white/40 uppercase tracking-[0.4em] text-[10px] font-black">
              Start Your Cinematic Journey
            </p>
            <div className="h-px w-8 bg-brand-primary/20" />
          </div>
        </div>

        <div className="glass-card p-12 relative overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)]">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-brand-primary to-transparent" />
          
          <h2 className="text-4xl font-black text-white mb-10 text-center uppercase tracking-tighter">
            Register
          </h2>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black tracking-[0.3em] text-white/40 ml-1 block">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="glass-input w-full"
                  placeholder="John Wick"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black tracking-[0.3em] text-white/40 ml-1 block">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="glass-input w-full"
                  placeholder="wick@high-table.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black tracking-[0.3em] text-white/40 ml-1 block">
                  Secure Password
                </label>
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="glass-input w-full"
                  placeholder="••••••••"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black tracking-[0.3em] text-white/40 ml-1 block">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="glass-input w-full"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black tracking-[0.3em] text-white/40 ml-1 block">
                Membership Type
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="glass-input w-full cursor-pointer appearance-none"
              >
                <option value="customer" className="bg-brand-dark">Customer / Movie Buff</option>
                <option value="organizer" className="bg-brand-dark">Theater Organizer</option>
              </select>
            </div>

            {error && (
              <div className="p-4 bg-brand-primary/10 border border-brand-primary/20 rounded-xl text-brand-primary text-xs font-bold uppercase tracking-widest text-center animate-in shake duration-300">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="glass-button-primary w-full py-5 flex items-center justify-center"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-black border-t-transparent" />
              ) : (
                "Initialize Membership"
              )}
            </button>
          </form>

          <div className="mt-12 text-center text-[10px] text-white/30 uppercase tracking-[0.2em] font-bold">
            Already Member?{" "}
            <Link
              to="/login"
              className="text-brand-primary font-black hover:underline"
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
