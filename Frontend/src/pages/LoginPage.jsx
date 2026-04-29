import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import axiosInstance from "../axiosInstance";
import { setCredentials } from "../store";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.post("/auth/login", {
        email,
        password,
      });
      const { token, ...user } = response.data.data;
      dispatch(setCredentials({ user, token }));
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center px-4 relative overflow-hidden">
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-brand-primary/5 blur-[150px] -rotate-45" />
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-brand-primary/5 blur-[150px] rotate-45" />

      <div className="w-full max-w-lg z-10 animate-in fade-in zoom-in-95 duration-700">
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
              Modern Cinema Experience
            </p>
            <div className="h-px w-8 bg-brand-primary/20" />
          </div>
        </div>

        <div className="glass-card p-12 relative overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)]">
          {/* Subtle line at top */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-brand-primary to-transparent" />
          
          <h2 className="text-4xl font-black text-white mb-10 text-center uppercase tracking-tighter">
            Sign In
          </h2>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black tracking-[0.3em] text-white/40 ml-1 block">
                Access ID (Email)
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="glass-input w-full"
                placeholder="operator@cineplex.com"
              />
            </div>

            <div className="space-y-2 relative">
              <label className="text-[10px] uppercase font-black tracking-[0.3em] text-white/40 ml-1 block">
                Security Key
              </label>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="glass-input w-full pr-12"
                placeholder="••••••••••••"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 bottom-3 text-white/20 hover:text-brand-primary transition-colors"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.956 9.956 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
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
                "Authorize Access"
              )}
            </button>
          </form>

          <div className="mt-12 text-center text-[10px] text-white/30 uppercase tracking-[0.2em] font-bold">
            No Authorization?{" "}
            <Link
              to="/register"
              className="text-brand-primary font-black hover:underline"
            >
              Request Access
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
