'use client';

import React, { useEffect, useState } from 'react';
import { 
  FaUserCircle, FaHistory, FaBell, 
  FaPlaneArrival, FaMoneyBillWave, FaCheckCircle, 
  FaCalendarAlt, FaHome, FaCar, FaUserTie, FaHandshake, FaTags, 
  FaGripHorizontal, FaPlus, FaSignOutAlt, FaChartPie, FaCog, FaExternalLinkAlt, FaBars
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import Sidebar from '@/components/Sidebar';
import ThemeSwitcher from '@/components/ThemeSwitcher';

export default function DashboardUser() {
  const [data, setData] = useState({
    notifications: [],
    pickups: [],
    loans: [],
    bookings: [],
    accommodations: [],
    cars: [],
    meetings: [],
  });
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeService, setActiveService] = useState('Overview');

  const features = [
    { name: 'Airport Pickup', link: '/airport-pickup', history: '/dashboard/user/history/airport-pickup', icon: <FaPlaneArrival />, color: 'bg-blue-500', desc: 'Secure your ride from the airport.' },
    { name: 'Accommodation', link: '/accommodation', history: '/dashboard/user/history/accommodation', icon: <FaHome />, color: 'bg-emerald-500', desc: 'Find your perfect stay.' },
    { name: 'Car Rental', link: '/car', history: '/dashboard/user/history/car-rental', icon: <FaCar />, color: 'bg-indigo-500', desc: 'Rent vehicles for your travel.' },
    { name: 'Consultancy', link: '/consultant', history: '/dashboard/user/history/consultancy', icon: <FaUserTie />, color: 'bg-purple-500', desc: 'Expert advice for migration.' },
    { name: 'Loan Services', link: '/loan', history: '/dashboard/user/history/loan-services', icon: <FaMoneyBillWave />, color: 'bg-amber-500', desc: 'Financial help for students.' },
    { name: 'Meetings', link: '/meetings', history: '/dashboard/user/history/meetings', icon: <FaHandshake />, color: 'bg-blue-600', desc: 'View your scheduled sessions.' },
    { name: 'Community Events', link: '/events', history: '/events', icon: <FaCalendarAlt />, color: 'bg-rose-500', desc: 'Join global gatherings.' },
    { name: 'Partner Perks', link: '/partners', history: '/partners', icon: <FaTags />, color: 'bg-teal-500', desc: 'Exclusive deals and perks.' },
  ];

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const [profileRes, notifRes, pickupRes, loanRes, bookingRes, accRes, carRes, meetingRes] = await Promise.all([
          fetch('/api/auth/profile').then(res => res.json()),
          fetch('/api/notifications/my').then(res => res.json()),
          fetch('/api/airport-pickup/my-requests').then(res => res.json()),
          fetch('/api/loan/my-requests').then(res => res.json()),
          fetch('/api/consultant-booking/my-bookings').then(res => res.json()),
          fetch('/api/accommodation/my-requests').then(res => res.json()),
          fetch('/api/car/my-requests').then(res => res.json()),
          fetch('/api/meetings/my').then(res => res.json()),
        ]);

        setProfile(profileRes);
        setData({
          notifications: Array.isArray(notifRes) ? notifRes : [],
          pickups: Array.isArray(pickupRes) ? pickupRes : [],
          loans: Array.isArray(loanRes) ? loanRes : [],
          bookings: Array.isArray(bookingRes) ? bookingRes : [],
          accommodations: Array.isArray(accRes) ? accRes : [],
          cars: Array.isArray(carRes) ? carRes : [],
          meetings: Array.isArray(meetingRes) ? meetingRes : [],
        });
      } catch (err) {
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    }
    fetchDashboardData();
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      if (res.ok) {
        window.location.href = '/auth/login';
      }
    } catch (e) {
      toast.error('Logout failed');
    }
  };

  const totalPending = 
    data.pickups.filter(p => p.status === 'PENDING').length +
    data.loans.filter(l => l.status === 'PENDING').length;

  const stats = [
    { label: 'Active Pickups', value: data.pickups.filter((p: any) => p.status !== 'COMPLETED').length.toString(), icon: <FaPlaneArrival className="text-blue-600" /> },
    { label: 'Accommodation', value: data.accommodations.length.toString(), icon: <FaHome className="text-emerald-500" /> },
    { label: 'Car Rentals', value: data.cars.length.toString(), icon: <FaCar className="text-indigo-500" /> },
    { label: 'Total Services', value: (data.pickups.length + data.accommodations.length + data.cars.length + data.bookings.length + data.loans.length).toString(), icon: <FaGripHorizontal className="text-blue-600" /> },
  ];

  const handlePayment = async (id: string, type: string, amount: number) => {
    const loadingToast = toast.loading('Processing payment...');
    try {
      // Simulate external gateway call
      await new Promise(resolve => setTimeout(resolve, 1500));

      const res = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestId: id,
          type: type.toUpperCase(), // PICKUP, LOAN, etc
          paymentId: `PAY-${Math.random().toString(36).substr(2, 9)}`,
          amount: amount
        })
      });

      if (res.ok) {
        toast.success('Payment Successful!', { id: loadingToast });
        // Refresh local state or window
        window.location.reload();
      } else {
        throw new Error('Verification failed');
      }
    } catch (e) {
      toast.error('Payment failed. Try again.', { id: loadingToast });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'text-amber-500';
      case 'COMPLETED':
        return 'text-emerald-500';
      case 'CANCELLED':
        return 'text-rose-500';
      default:
        return 'text-slate-500';
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#050b18] text-white font-geist overflow-x-hidden">
      <Sidebar activeService="Overview" />

      {/* Main Content Area */}
      <main className="flex-1 lg:max-h-screen lg:overflow-y-auto">
        <div className="container mx-auto px-6 py-6 max-w-7xl">
          {/* Greeting Section */}
          <header className="mb-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-full bg-blue-600/20 flex items-center justify-center">
                <FaUserCircle className="text-3xl text-blue-500" />
              </div>
              <h1 className="text-3xl font-black tracking-tight leading-none">
                Hello, {profile?.name || 'Explorer'}!
              </h1>
            </div>
            <p className="text-sm font-bold text-slate-400 italic mb-6">
              Your global journey is active. Access your services below.
            </p>
          </header>

          {/* Stats Board - One Row */}
          <div className="grid grid-cols-4 gap-2 sm:gap-4 mb-10">
            {stats.map((stat, i) => (
              <div key={i} className="p-3 sm:p-6 rounded-[1.5rem] sm:rounded-[2.5rem] bg-slate-900/40 border border-white/5 relative overflow-hidden group transition-all hover:bg-slate-900/60">
                <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-slate-800/50 flex items-center justify-center text-sm sm:text-xl mb-2 sm:mb-4">
                  {stat.icon}
                </div>
                <p className="text-[7px] sm:text-[10px] font-black text-slate-500 mb-0.5 sm:mb-1 uppercase tracking-tighter sm:tracking-widest leading-none truncate">
                  {stat.label}
                </p>
                <p className="text-lg sm:text-4xl font-black tracking-tighter leading-none text-white">
                  {stat.value}
                </p>
                {/* Decoration circle */}
                <div className="absolute -right-2 -bottom-2 sm:-right-4 sm:-bottom-4 w-8 h-8 sm:w-16 sm:h-16 bg-white/5 rounded-full" />
              </div>
            ))}
          </div>

          {/* Explore Services - Tile Grid */}
          <section className="mb-12">
            <h2 className="text-2xl font-black mb-6 flex items-center gap-3 tracking-tight">
              <FaGripHorizontal className="text-blue-500" /> Explore Services
            </h2>
            <div className="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-8 gap-3">
              {features.map((feature, i) => (
                <div 
                  key={i} 
                  onClick={() => window.location.href = feature.link}
                  className="flex flex-col items-center gap-2 group cursor-pointer"
                >
                  <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-2xl ${feature.color} text-white shadow-lg shadow-${feature.color.split("-")[1]}-500/20 group-hover:scale-110 transition-transform`}>
                    {feature.icon}
                  </div>
                  <span className="text-[10px] font-black uppercase text-center leading-tight tracking-tighter text-slate-300">
                    {feature.name.split(' ')[0]}
                    {feature.name.split(' ')[1] && <br/>}
                    {feature.name.split(' ')[1]}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Recent Activity Section */}
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-8 pb-12">
            <section className="p-8 rounded-[2.5rem] bg-slate-900/40 border border-white/5">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-black flex items-center gap-3 tracking-tight">
                  <FaHistory className="text-blue-500" /> Recent Activity
                </h2>
                <button 
                  onClick={() => window.location.href = '/dashboard/user/history/all'}
                  className="text-[10px] font-black uppercase tracking-widest text-blue-500 px-4 py-2 bg-blue-500/10 rounded-xl"
                >
                  View All
                </button>
              </div>

              <div className="space-y-4">
                {[...data.pickups, ...data.accommodations, ...data.cars, ...data.loans, ...data.bookings]
                  .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
                  .slice(0, 5)
                  .map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-5 bg-slate-800/30 rounded-3xl border border-transparent hover:border-white/5 transition-all">
                      <div className="flex items-center gap-4 truncate">
                        <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center shadow-sm">
                           {item.flightNumber ? <FaPlaneArrival className="text-blue-500" /> : 
                            item.propertyTitle ? <FaHome className="text-emerald-500" /> : 
                            item.carTitle ? <FaCar className="text-indigo-500" /> :
                            item.amount ? <FaMoneyBillWave className="text-amber-500" /> : <FaUserTie className="text-purple-500" />}
                        </div>
                        <div className="min-w-0 text-left">
                          <p className="font-bold text-white text-base truncate leading-tight">
                            {item.flightNumber || item.propertyTitle || item.carTitle || (item.amount ? `Loan: $${item.amount}` : 'Consultation')}
                          </p>
                          <p className="text-[10px] font-black text-slate-500 uppercase">{new Date(item.createdAt || item.arrivalDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-wider ${
                        ['COMPLETED', 'APPROVED', 'BOOKED'].includes(item.status) ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                      }`}>{item.status || 'PENDING'}</span>
                    </div>
                  ))}
                
                {([...data.pickups, ...data.accommodations, ...data.cars, ...data.loans, ...data.bookings].length === 0) && (
                  <div className="py-12 text-center">
                    <FaHistory className="text-4xl text-slate-800 mx-auto mb-4" />
                    <p className="text-slate-500 font-bold">No recent activity to show.</p>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

