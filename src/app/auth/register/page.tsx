"use client";
import React, { useState } from "react";
import { FaEnvelope, FaUser, FaLock, FaArrowRight, FaCheckCircle, FaGlobeAmericas } from "react-icons/fa";

export default function Register() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const register = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, password, role }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStatus("success");
      } else {
        setStatus(data.error || "Registration failed.");
      }
    } catch (err) {
      setStatus("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-900">
        <div className="card max-w-md w-full text-center py-12">
          <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaCheckCircle size={40} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Account Created!</h2>
          <p className="text-slate-500 mb-8 font-medium">Your global journey begins here. Please login to continue.</p>
          <a href="/auth/login" className="btn-primary inline-flex items-center gap-2 px-8">
            Go to Login <FaArrowRight />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] flex items-center justify-center p-4 sm:p-6 bg-slate-50 dark:bg-slate-900 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 p-20 opacity-5 pointer-events-none">
        <FaGlobeAmericas size={400} className="text-slate-900 dark:text-white" />
      </div>

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-6 sm:mb-10">
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mb-1.5 tracking-tight">Join Overseas</h1>
          <p className="text-slate-500 font-black uppercase text-[9px] sm:text-[10px] tracking-[0.2em]">Start your international career today</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 sm:p-10 rounded-[2rem] sm:rounded-[3rem] shadow-2xl shadow-blue-500/10 border-t-4 border-t-blue-600">
          <form onSubmit={register} className="space-y-4 sm:space-y-6">
            <div>
              <label className="label">Full Name</label>
              <div className="relative group">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3.5 sm:p-4 bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-100 dark:border-slate-800 rounded-xl sm:rounded-2xl focus:outline-none focus:border-blue-600 focus:bg-white dark:focus:bg-slate-900 transition-all font-bold text-slate-900 dark:text-white placeholder:text-slate-400 pl-11 sm:pl-12"
                  placeholder="John Doe"
                />
                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors text-sm sm:text-base" />
              </div>
            </div>

            <div>
              <label className="label">Email Address</label>
              <div className="relative group">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3.5 sm:p-4 bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-100 dark:border-slate-800 rounded-xl sm:rounded-2xl focus:outline-none focus:border-blue-600 focus:bg-white dark:focus:bg-slate-900 transition-all font-bold text-slate-900 dark:text-white placeholder:text-slate-400 pl-11 sm:pl-12"
                  placeholder="john@example.com"
                />
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors text-sm sm:text-base" />
              </div>
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative group">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3.5 sm:p-4 bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-100 dark:border-slate-800 rounded-xl sm:rounded-2xl focus:outline-none focus:border-blue-600 focus:bg-white dark:focus:bg-slate-900 transition-all font-bold text-slate-900 dark:text-white placeholder:text-slate-400 pl-11 sm:pl-12"
                  placeholder="••••••••"
                />
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors text-sm sm:text-base" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl sm:rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {loading ? 'Creating Account...' : 'Initialize Journey'}
              <FaArrowRight className="text-xs" />
            </button>
          </form>

          {status && status !== 'success' && (
            <div className="mt-6 p-4 bg-rose-50 dark:bg-rose-900/20 text-rose-600 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest text-center">
              {status}
            </div>
          )}
        </div>

        <p className="text-center mt-8 text-slate-500 text-[10px] sm:text-xs font-bold uppercase tracking-widest">
          Already a pioneer? <a href="/auth/login" className="text-blue-600 hover:underline">Sign In</a>
        </p>
      </div>
    </div>
  );
}
