'use client';

import React, { useState, useEffect } from 'react';
import { FaUserShield, FaServer, FaHistory, FaDatabase, FaTrashAlt, FaBell, FaSpinner } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import ThemeSwitcher from '@/components/ThemeSwitcher';

export default function DashboardSuperAdmin() {
  const [cleaning, setCleaning] = useState(false);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch('/api/auth/profile');
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/auth/login';
    } catch (e) {
      toast.error('Logout failed');
    }
  };

  const handleManualCleanup = async () => {
    setCleaning(true);
    try {
      const res = await fetch('/api/admin/data-cleanup/execute', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        toast.success(`Purged ${data.purgedCount} expired or rejected logs.`);
      } else {
        toast.error('Cleanup process failed');
      }
    } catch (e) {
      toast.error('Connection error');
    } finally {
      setCleaning(false);
    }
  };

  const systemStats = [
    { label: 'Platform Status', value: 'Live', icon: <FaServer className="text-emerald-500" /> },
    { label: 'Policy Age', value: '14 Days', icon: <FaDatabase className="text-blue-500" /> },
    { label: 'Audit Engine', value: 'Active', icon: <FaHistory className="text-indigo-500" /> },
    { label: 'Global Alerts', value: '0', icon: <FaBell className="text-rose-500" /> },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2 flex items-center gap-4">
            <FaUserShield className="text-blue-600" />
            Hello, {profile?.name || 'Super Admin'}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 font-medium">Low-level system controls and data retention management.</p>
        </div>
        <div className="hidden md:flex items-center gap-4">
          <ThemeSwitcher />
          <button 
            onClick={handleManualCleanup}
            disabled={cleaning}
            className="flex items-center gap-2 px-8 py-4 bg-rose-600 hover:bg-rose-700 disabled:bg-rose-400 text-white rounded-2xl font-black shadow-xl shadow-rose-500/20 transition-all active:scale-95"
          >
            {cleaning ? <FaSpinner className="animate-spin" /> : <FaTrashAlt />}
            {cleaning ? 'Purging...' : 'Manual DB Cleanup'}
          </button>
          <button 
            onClick={handleLogout}
            className="px-6 py-4 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl font-black transition-all hover:bg-slate-200"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {systemStats.map((stat, i) => (
          <div key={i} className="p-8 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm border-l-8 border-l-blue-600">
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-2xl">
                {stat.icon}
              </div>
              <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-3xl font-black text-slate-900 dark:text-white">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="p-10 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h2 className="text-2xl font-black mb-8 flex items-center gap-3">
            <FaDatabase className="text-blue-600" /> Infrastructure Logs
          </h2>
          <div className="p-6 rounded-3xl bg-slate-900 text-emerald-400 mb-8 font-mono text-sm shadow-inner">
            <p className="mb-2 font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              [CRON_SERVICE] Running
            </p>
            <p className="text-slate-400">Scan Frequency: 24h</p>
            <p className="text-slate-400">Retention Policy: 14 Days (Hard Delete)</p>
            <p className="text-slate-400 mt-4 border-t border-slate-800 pt-4">Last Run: Today, 03:00 AM</p>
            <p className="text-slate-400">Target Collections: airport_pickup, car, accommodation, loans, consultant_booking</p>
          </div>
          <div className="space-y-4">
            <p className="text-slate-500 font-bold px-4">Protected Tables</p>
            {['users', 'global_settings', 'audit_logs'].map((table) => (
              <div key={table} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800">
                <p className="font-black text-slate-700 dark:text-slate-300 uppercase tracking-tighter">{table}</p>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-600 text-[10px] font-black rounded-lg">IMMUTABLE</span>
              </div>
            ))}
          </div>
        </section>

        <section className="p-10 rounded-[2.5rem] bg-gradient-to-br from-slate-900 to-black text-white shadow-2xl">
          <h2 className="text-2xl font-black mb-8">Access Integrity Control</h2>
          <div className="space-y-6">
            {['ADMIN_ROOT', 'VENDOR_GATEWAY', 'CONSULTANT_CORE'].map((node) => (
              <div key={node} className="p-6 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-between group hover:bg-white/10 transition-all">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center font-black text-white group-hover:scale-110 transition-transform">
                    {node[0]}
                  </div>
                  <div>
                    <p className="font-black tracking-tight">{node}</p>
                    <p className="text-xs text-white/40 font-bold uppercase tracking-widest">Shield Active</p>
                  </div>
                </div>
                <div className="w-12 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center px-1">
                   <div className="w-4 h-4 rounded-full bg-emerald-500"></div>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-12 py-5 bg-white text-black rounded-3xl font-black hover:bg-slate-100 transition-all shadow-xl shadow-white/5 uppercase tracking-widest text-sm">
            Refresh API Tokens
          </button>
        </section>
      </div>
    </div>
  );
}

