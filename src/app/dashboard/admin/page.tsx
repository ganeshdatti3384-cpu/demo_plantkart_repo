'use client';

import React, { useEffect, useState } from 'react';
import { FaShieldAlt, FaUsers, FaChartPie, FaCogs, FaExclamationTriangle, FaHome, FaPlaneArrival, FaUserTie } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import Sidebar from '@/components/Sidebar';
import ThemeSwitcher from '@/components/ThemeSwitcher';

export default function DashboardAdmin() {
  const [statsData, setStatsData] = useState({
    userCount: 0,
    bookings: 0,
    revenue: 0,
    pendingApprovals: 0,
    systemHealth: 'Checking...'
  });
  const [pendingItems, setPendingItems] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAdminData() {
      try {
        const [profileRes, statsRes, accRes, pickupRes, consultantRes] = await Promise.all([
          fetch('/api/auth/profile').then(res => res.ok ? res.json() : null),
          fetch('/api/admin/dashboard/stats').then(res => res.ok ? res.json() : null),
          fetch('/api/admin/accommodation/pending').then(res => res.ok ? res.json() : []),
          fetch('/api/admin/airport-pickup/requests').then(res => res.ok ? res.json() : []),
          fetch('/api/admin/consultants/pending').then(res => res.ok ? res.json() : []),
        ]);

        if (profileRes) {
          setProfile(profileRes);
        }

        if (statsRes) {
          setStatsData(statsRes);
        }
        
        const combined = [
          ...(Array.isArray(accRes) ? accRes.map(i => ({ ...i, type: 'accommodation' })) : []),
          ...(Array.isArray(pickupRes) ? pickupRes.filter(p => p.status === 'PENDING').map(i => ({ ...i, type: 'pickup' })) : []),
          ...(Array.isArray(consultantRes) ? consultantRes.map(i => ({ ...i, type: 'consultant', title: i.name || i.email })) : []),
        ];
        setPendingItems(combined);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchAdminData();
  }, []);

  const handleApprove = async (id, type) => {
    let endpoint = '';
    if (type === 'accommodation') endpoint = `/api/admin/accommodation/${id}/approve`;
    else if (type === 'pickup') endpoint = `/api/admin/airport-pickup/${id}/accept`;
    else if (type === 'consultant') endpoint = `/api/admin/consultants/${id}/approve`;
    
    try {
      const res = await fetch(endpoint, { method: 'PUT' });
      const data = await res.json();
      if (data.success) {
        toast.success('Approved successfully');
        setPendingItems(prev => prev.filter(item => item._id !== id));
      }
    } catch (err) {
      toast.error('Approval failed');
    }
  };

  const runCleanup = async () => {
    try {
      const res = await fetch('/api/admin/data-cleanup/execute', { method: 'DELETE' });
      const data = await res.json();
      toast.success(`Cleanup complete. Deleted: ${JSON.stringify(data)}`);
    } catch (e) {
      toast.error('Cleanup failed');
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      window.location.href = '/auth/login';
    } catch (e) {
      toast.error('Logout failed');
    }
  };

  const adminStats = [
    { label: 'Total Users', value: (statsData?.userCount ?? 0).toString(), icon: <FaUsers className="text-blue-500" /> },
    { label: 'System Health', value: statsData?.systemHealth || 'Good', icon: <FaChartPie className="text-emerald-500" /> },
    { label: 'Pending Queue', value: (pendingItems?.length ?? 0).toString(), icon: <FaExclamationTriangle className="text-amber-500" /> },
    { label: 'Total Bookings', value: (statsData?.bookings ?? 0).toString(), icon: <FaCogs className="text-purple-500" /> },
  ];

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar activeService="Admin Dashboard" />

      {/* Main Content Area */}
      <main className="flex-1 lg:max-h-screen lg:overflow-y-auto pb-24 lg:pb-0">
        <div className="container mx-auto px-3 sm:px-6 lg:px-12 py-6 sm:py-8 max-w-7xl">
          <header className="mb-8 sm:mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6 px-2 sm:px-0">
            <div>
              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white mb-1.5 flex items-center gap-3 tracking-tighter">
                <FaShieldAlt className="text-blue-600" />
                Hello, {profile?.name || 'Administrator'}
              </h1>
              <p className="text-[11px] sm:text-base text-slate-500 dark:text-slate-400 font-bold italic leading-tight">Platform-wide overview and approval management.</p>
            </div>
            <div className="hidden md:flex items-center gap-3">
              <ThemeSwitcher />
              <button 
                onClick={runCleanup}
                className="px-6 py-2.5 bg-amber-50 dark:bg-amber-900/20 text-amber-600 border border-amber-200 dark:border-amber-800 rounded-xl font-black text-xs uppercase tracking-widest shadow-sm transition-all hover:bg-amber-100"
              >
                Clear Logs
              </button>
            </div>
          </header>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-10 px-2 sm:px-0">
            {loading ? (
              <div className="col-span-full py-16 text-center text-slate-400 font-bold animate-pulse">Initializing System...</div>
            ) : adminStats.map((stat, i) => (
              <div key={i} className="p-5 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-xl group">
                <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-lg sm:text-2xl mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                  {stat.icon}
                </div>
                <p className="text-[9px] sm:text-sm font-black text-slate-400 dark:text-slate-500 mb-0.5 sm:mb-1 uppercase tracking-widest">{stat.label}</p>
                <p className="text-xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10 px-2 sm:px-0">
            <section className="p-6 sm:p-10 rounded-[1.5rem] sm:rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <h2 className="text-xl sm:text-3xl font-black mb-6 sm:mb-10 tracking-tighter">Approval Queue</h2>
              <div className="space-y-3 sm:space-y-4">
                {pendingItems.length === 0 ? (
                  <div className="text-center py-20 text-slate-400 italic font-bold">Queue is empty.</div>
                ) : pendingItems.map((item) => (
                  <div key={item._id} className="flex flex-col sm:flex-row items-center justify-between p-5 sm:p-8 rounded-[1.5rem] sm:rounded-3xl bg-slate-50 dark:bg-slate-800/50 group border border-transparent hover:border-blue-100 dark:hover:border-blue-900 transition-all">
                    <div className="flex items-center gap-4 mb-4 sm:mb-0 w-full sm:w-auto">
                      <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-white dark:bg-slate-900 flex items-center justify-center text-lg sm:text-2xl shadow-sm text-blue-600">
                        {item.type === 'accommodation' ? <FaHome /> : 
                         item.type === 'pickup' ? <FaPlaneArrival /> :
                         <FaUserTie />}
                      </div>
                      <div className="min-w-0">
                         <p className="font-black text-slate-900 dark:text-white text-sm sm:text-lg truncate leading-tight">{item.propertyTitle || item.flightNumber || item.title || 'Request'}</p>
                         <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.type}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleApprove(item._id, item.type)}
                      className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-xl sm:rounded-2xl font-black text-xs sm:text-sm uppercase tracking-widest transition-all hover:bg-blue-700 active:scale-95 shadow-lg shadow-blue-500/20"
                    >
                      Approve
                    </button>
                  </div>
                ))}
              </div>
            </section>
            
            <section className="p-6 sm:p-10 rounded-[1.5rem] sm:rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <h2 className="text-xl sm:text-3xl font-black mb-6 sm:mb-10 tracking-tighter">System Control</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div onClick={runCleanup} className="p-6 rounded-3xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 cursor-pointer hover:scale-[1.02] transition-transform">
                   <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-900/40 text-amber-600 flex items-center justify-center text-xl mb-4">
                     <FaCogs />
                   </div>
                   <h3 className="font-black text-slate-900 dark:text-white mb-2 uppercase text-xs tracking-widest">Cleanup Engine</h3>
                   <p className="text-[10px] text-slate-500 font-bold leading-relaxed">Remove archived data older than 14 days and clear cache.</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

