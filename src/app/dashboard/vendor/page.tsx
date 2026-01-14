
'use client';

import React, { useEffect, useState } from 'react';
import { FaStore, FaCar, FaHome, FaHistory, FaPlusCircle, FaClock } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import Sidebar from '@/components/Sidebar';

export default function DashboardVendor() {
  const [data, setData] = useState({ accommodations: [], cars: [] });
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/vendor/listings').then(res => res.json()),
      fetch('/api/auth/profile').then(res => res.json())
    ])
    .then(([listingsData, profileData]) => {
      setData(listingsData);
      setProfile(profileData);
      setLoading(false);
    })
    .catch(() => toast.error('Failed to load dashboard data'));
  }, []);

  const vendorStats = [
    { label: 'Active Listings', value: (data.accommodations.length + data.cars.length).toString(), icon: <FaHome className="text-blue-500" /> },
    { label: 'Total Car Fleet', value: data.cars.length.toString(), icon: <FaCar className="text-indigo-500" /> },
    { label: 'Pending Reviews', value: [...data.accommodations, ...data.cars].filter(i => i.status === 'PENDING').length.toString(), icon: <FaHistory className="text-amber-500" /> },
    { label: 'Live Properties', value: data.accommodations.filter(a => a.status === 'APPROVED').length.toString(), icon: <FaStore className="text-emerald-500" /> },
  ];
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/auth/login';
    } catch (e) {
      toast.error('Logout failed');
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar activeService="Vendor Dashboard" />
      <main className="flex-1 lg:max-h-screen lg:overflow-y-auto p-4 lg:p-12 pb-24 lg:pb-12">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2 flex items-center gap-3">
                <FaStore className="text-blue-600" />
                Hello, {profile?.name || 'Partner'}
              </h1>
              <p className="text-slate-600 dark:text-slate-400">Manage your business assets and track listing approvals.</p>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <ThemeSwitcher />
              <a href="/vendor/accommodation" className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-95">
                <FaPlusCircle /> New Property
              </a>
              <a href="/vendor/car" className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold shadow-lg shadow-indigo-500/20 transition-all active:scale-95">
                <FaPlusCircle /> New Car
              </a>
              <button 
                onClick={handleLogout}
                className="px-6 py-3 bg-rose-50 dark:bg-rose-900/20 text-rose-600 rounded-2xl font-black hover:bg-rose-100"
              >
                Logout
              </button>
            </div>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {vendorStats.map((stat, i) => (
              <div key={i} className="p-8 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-2xl mb-6">
                  {stat.icon}
                </div>
                <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">{stat.label}</p>
                <p className="text-4xl font-black text-slate-900 dark:text-white">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <section className="p-8 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <h2 className="text-2xl font-black mb-8 flex items-center gap-3">Your Active Inventory</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left border-b border-slate-100 dark:border-slate-800">
                        <th className="pb-4 font-black text-slate-400 text-xs uppercase tracking-widest">Listing</th>
                        <th className="pb-4 font-black text-slate-400 text-xs uppercase tracking-widest">Type</th>
                        <th className="pb-4 font-black text-slate-400 text-xs uppercase tracking-widest">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {loading ? (
                        <tr><td colSpan={3} className="py-10 text-center text-slate-500">Loading your listings...</td></tr>
                      ) : [...data.accommodations, ...data.cars].length === 0 ? (
                        <tr><td colSpan={3} className="py-10 text-center text-slate-500">No listings found. Start by adding one!</td></tr>
                      ) : [...data.accommodations, ...data.cars].map((item, i) => (
                        <tr key={i} className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="py-6">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-blue-600">
                                 {item.vendorId ? <FaHome /> : <FaCar />}
                              </div>
                              <div>
                                <p className="font-bold text-slate-900 dark:text-white">{item.title || item.model}</p>
                                <p className="text-xs text-slate-500">{item.location}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-6 text-sm font-bold text-slate-500">{item.vendorId ? 'Property' : 'Vehicle'}</td>
                          <td className="py-6">
                            <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${
                              item.status === 'APPROVED' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600' :
                              item.status === 'REJECTED' ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-600' :
                              'bg-amber-100 dark:bg-amber-900/30 text-amber-600'
                            }`}>
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
            <div>
              <section className="p-10 rounded-[2.5rem] bg-gradient-to-br from-indigo-600 via-blue-700 to-indigo-800 text-white shadow-xl shadow-blue-500/20">
                <div className="w-14 h-14 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center text-2xl mb-8">
                  <FaClock />
                </div>
                <h3 className="text-2xl font-black mb-4">Auto-Cleanup Policy</h3>
                <p className="text-indigo-100 mb-8 leading-relaxed font-medium">
                  Reminder: Listings marked as REJECTED or inactive for more than 14 days are automatically purged from the system for security.
                </p>
                <button className="w-full py-4 bg-white text-indigo-700 rounded-2xl font-black hover:bg-indigo-50 transition-all active:scale-95 shadow-lg">
                  Manage Retention
                </button>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

