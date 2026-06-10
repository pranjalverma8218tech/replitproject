import React, { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";
import { useAdmin } from "./AdminContext";

export default function AdminLogin() {
  const { login } = useAdmin();
  const [, navigate] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }
    setLoading(true);
    setError("");
    await new Promise(r => setTimeout(r, 600));
    const ok = login(email, password);
    if (ok) {
      navigate("/admin/dashboard");
    } else {
      setError("Invalid email or password. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "radial-gradient(ellipse at top left, #1a0505 0%, #0a0a0a 60%)" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary mb-4" style={{ boxShadow: "0 0 32px rgba(229,62,62,0.35)" }}>
            <span className="text-white font-black text-xl tracking-tight">RD</span>
          </div>
          <h1 className="text-white font-black text-2xl tracking-tight">Radhe Digital</h1>
          <p className="text-gray-500 text-sm mt-1">Admin Panel · Restricted Access</p>
        </div>

        {/* Card */}
        <div className="bg-[#111111] border border-white/8 rounded-2xl p-8" style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.6)" }}>
          <h2 className="text-white font-bold text-xl mb-1">Sign In</h2>
          <p className="text-gray-500 text-sm mb-6">Enter your admin credentials to continue</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Email Address</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600" />
                <input
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError(""); }}
                  placeholder="admin@radhedigital.com"
                  className="w-full h-11 bg-[#1a1a1a] border border-white/12 rounded-xl pl-10 pr-4 text-sm text-white placeholder-gray-600 outline-none focus:border-primary/50 transition-colors"
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600" />
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(""); }}
                  placeholder="••••••••"
                  className="w-full h-11 bg-[#1a1a1a] border border-white/12 rounded-xl pl-10 pr-10 text-sm text-white placeholder-gray-600 outline-none focus:border-primary/50 transition-colors"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(p => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 transition-colors"
                >
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 bg-red-500/10 border border-red-500/25 rounded-xl px-4 py-3"
              >
                <AlertCircle size={14} className="text-red-400 flex-shrink-0" />
                <p className="text-red-400 text-sm">{error}</p>
              </motion.div>
            )}

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2 disabled:opacity-60 transition-opacity"
              style={{ background: "linear-gradient(135deg,#e53e3e,#c53030)", boxShadow: "0 4px 18px rgba(229,62,62,0.3)" }}
            >
              {loading ? <><Loader2 size={16} className="animate-spin" /> Signing in…</> : "Sign In to Admin Panel"}
            </motion.button>
          </form>
        </div>

        <p className="text-center text-gray-700 text-xs mt-6">
          This panel is for authorised personnel only.
        </p>
      </motion.div>
    </div>
  );
}
