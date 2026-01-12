"use client";
import React, { useState, useEffect } from 'react';
import {
  FaChartBar, FaHotel, FaUsers, FaPlaneArrival, FaCheckCircle, 
  FaExclamationTriangle, FaTrashAlt, FaHistory, FaCreditCard, 
  FaUserTie, FaArrowUp, FaCalendarCheck, FaGlobe, FaUserShield, FaGripHorizontal, FaCar
} from 'react-icons/fa';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetch('/api/admin/dashboard/stats')
      .then(res => res.json())
      .then(setStats);
  }, []);

  const menuItems = [
    { label: 'Platform Users', count: stats?.userCount || 0, icon: <FaUsers className="text-blue-500" />, link: '/admin/users' },
    { label: 'Active Pickups', count: stats?.activePickups || 0, icon: <FaPlaneArrival className="text-emerald-500" />, link: '/admin/airport-pickup/requests' },
    { label: 'Bookings', count: stats?.bookings?.total || 0, icon: <FaCalendarCheck className="text-purple-500" />, link: '/admin/bookings' },
    { label: 'Total Revenue', count: `$${stats?.revenue?.toLocaleString() || 0}`, icon: <FaCreditCard className="text-indigo-500" />, link: '/admin/payments' },
  ];

  const serviceManagement = [
    { name: 'Accommodation', link: '/admin/accommodation/pending', icon: <FaHotel />, color: 'bg-emerald-500', desc: 'Manage listings & approvals.' },
    { name: 'Car Rental', link: '/admin/car/pending', icon: <FaCar />, color: 'bg-indigo-500', desc: 'Vehicle fleet & lease review.' },
    { name: 'Air Pickup', link: '/admin/airport-pickup/requests', icon: <FaPlaneArrival />, color: 'bg-blue-500', desc: 'Driver dispatch & coordination.' },
    { name: 'Consultancy', link: '/admin/consultants', icon: <FaUserTie />, color: 'bg-purple-500', desc: 'Vetting & expert onboarding.' },
    { name: 'Finances', link: '/admin/payments', icon: <FaCreditCard />, color: 'bg-emerald-600', desc: 'Ledger audits & settlements.' },
    { name: 'Identity', link: '/admin/users', icon: <FaUsers />, color: 'bg-blue-600', desc: 'User roles & security standing.' },
    { name: 'Integrity', link: '/admin/audit-logs', icon: <FaHistory />, color: 'bg-slate-700', desc: 'Protocol audit & event tracking.' },
    { name: 'Sanitation', link: '/admin/data-cleanup', icon: <FaTrashAlt />, color: 'bg-rose-500', desc: 'Manual data lifecycle purge.' },
  ];

  const quickActions = [
    { label: 'Security Logs', icon: <FaUserShield />, link: '/admin/audit-logs', color: 'bg-blue-600/10 hover:bg-blue-600/20 text-blue-500' },
    { label: 'Platform Hygiene', icon: <FaTrashAlt />, link: '/admin/data-cleanup', color: 'bg-rose-600/10 hover:bg-rose-600/20 text-rose-500' },
    { label: 'Financial Audit', icon: <FaCreditCard />, link: '/admin/payments', color: 'bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-500' },
  ];

  return (
    <>
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-full bg-blue-600/20 flex items-center justify-center">
            <FaUserShield className="text-3xl text-blue-500" />
          </div>
          <h1 className="text-3xl font-black tracking-tight leading-none text-white">
            Root Administrator
          </h1>
        </div>
        <p className="text-sm font-bold text-slate-400 italic mb-6">
          Global oversight across all service domains and user security protocols.
        </p>

        <div className="px-5 py-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl inline-flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest leading-none">Terminal Authenticated</span>
        </div>
      </header>

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {menuItems.map((item, i) => (
          <div 
            key={i} 
            onClick={() => window.location.href = item.link}
            className="p-6 rounded-[2.5rem] bg-slate-900/40 border border-white/5 relative overflow-hidden group transition-all hover:bg-slate-900/60 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-800/50 flex items-center justify-center text-lg mb-3">
              {item.icon}
            </div>
            <p className="text-[8px] font-black text-slate-500 mb-1 uppercase tracking-widest leading-none">
              {item.label}
            </p>
            <p className="text-2xl font-black tracking-tighter leading-none text-white">
              {item.count}
            </p>
          </div>
        ))}
      </div>

      {/* Service Management Matrix */}
      <section className="mb-12">
        <h2 className="text-xl font-black mb-6 flex items-center gap-3 tracking-tight text-white/90">
          <FaGripHorizontal className="text-blue-500" /> Service Domain Controls
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {serviceManagement.map((service, i) => (
            <div 
              key={i} 
              onClick={() => window.location.href = service.link}
              className="p-6 rounded-[2rem] bg-slate-900/40 border border-white/5 hover:border-blue-500/50 transition-all cursor-pointer group relative overflow-hidden"
            >
              <div className={`w-12 h-12 rounded-2xl ${service.color} flex items-center justify-center text-xl text-white mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                {service.icon}
              </div>
              <h3 className="text-sm font-black text-white uppercase tracking-tight mb-1">{service.name}</h3>
              <p className="text-[10px] font-bold text-slate-500 leading-tight">{service.desc}</p>
              
              <div className="absolute top-4 right-4 text-[8px] font-black text-slate-700 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                Manage Service →
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
           <section className="bg-gradient-to-br from-slate-900/80 to-[#050b18] border border-white/10 p-10 rounded-[40px] text-white relative overflow-hidden shadow-2xl">
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-10">
                   <h2 className="text-2xl font-black flex items-center gap-3 tracking-tight">
                      <FaGlobe className="text-blue-400" />
                      Platform Governance
                   </h2>
                   <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Security Engine Live</span>
                   </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {quickActions.map((action, i) => (
                    <button 
                      key={i} 
                      onClick={() => window.location.href = action.link}
                      className={`flex flex-col items-center text-center gap-3 p-8 ${action.color} rounded-[2.5rem] hover:translate-y-[-4px] transition-all`}
                    >
                      <span className="text-2xl">{action.icon}</span>
                      <span className="text-[9px] font-black uppercase tracking-widest">{action.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full blur-[120px] -mr-32 -mt-32 pointer-events-none" />
           </section>
        </div>


        <div className="space-y-6">
           <section className="bg-slate-900/40 border border-white/5 p-8 rounded-[32px]">
              <h2 className="text-xl font-black text-white mb-6 flex items-center gap-3 tracking-tight">
                 <FaExclamationTriangle className="text-amber-500" />
                 Platform Integrity
              </h2>
              <div className="space-y-4">
                 <HealthItem label="User Security" status="LOCKED" color="bg-emerald-500" />
                 <HealthItem label="Payment Gateway" status="LIVE" color="bg-emerald-500" />
                 <HealthItem label="Data Cleanup Job" status="ON_SCHEDULE" color="bg-blue-500" />
                 <HealthItem label="Audit Pipeline" status="ACTIVE" color="bg-emerald-500" />
                 <HealthItem label="Consultant Review" status={stats?.consultants?.pending > 0 ? "ACTION_REQUIRED" : "CLEAR"} color={stats?.consultants?.pending > 0 ? "bg-amber-500" : "bg-blue-500"} />
              </div>
           </section>

           <div onClick={() => window.location.href = '/admin/data-cleanup'} className="bg-gradient-to-br from-indigo-600 to-blue-700 p-8 rounded-[32px] text-white cursor-pointer hover:shadow-2xl transition-all group relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-lg font-black mb-2 flex items-center gap-2">
                   Hygiene Manager <FaArrowUp className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </h3>
                <p className="text-xs font-bold text-blue-100 opacity-80">Manual data purge available for terminal records (14+ days).</p>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
           </div>
        </div>
      </div>
    </>
  );
}

function HealthItem({ label, status, color }: { label: string, status: string, color: string }) {
  return (
    <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-2xl border border-white/5">
      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</span>
      <div className="flex items-center gap-2">
         <span className={`w-1.5 h-1.5 rounded-full ${color}`} />
         <span className="text-[10px] font-black text-white uppercase">{status}</span>
      </div>
    </div>
  );
}


