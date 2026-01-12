'use client';

import React, { useEffect, useState } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaUniversity, FaQuoteLeft, FaSave, FaCamera, FaArrowLeft } from 'react-icons/fa';
import Sidebar from '@/components/Sidebar';
import { toast } from 'react-hot-toast';

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [user, setUser] = useState({
    name: '',
    email: '',
    phone: '',
    university: '',
    bio: '',
    role: ''
  });

  useEffect(() => {
    fetch('/api/auth/profile')
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setUser({
            name: data.name || '',
            email: data.email || '',
            phone: data.phone || '',
            university: data.university || '',
            bio: data.bio || '',
            role: data.role || ''
          });
        }
        setLoading(false);
      });
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: user.name,
          phone: user.phone,
          university: user.university,
          bio: user.bio
        })
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Profile updated successfully!');
      } else {
        toast.error(data.error || 'Failed to update profile');
      }
    } catch (err) {
      toast.error('Something went wrong');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50 dark:bg-slate-950">
        <Sidebar activeService="Profile" />
        <main className="flex-1 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-[100dvh] bg-slate-50 dark:bg-slate-950 overflow-hidden font-geist">
      <Sidebar activeService="Profile" />

      <main className="flex-1 lg:max-h-screen lg:overflow-y-auto p-4 sm:p-6 lg:p-12 pb-safe lg:pb-12 pt-4">
        <div className="max-w-4xl mx-auto w-full">
          <header className="flex items-center gap-4 mb-8 pt-4">
            <button 
              onClick={() => window.history.back()}
              className="p-2.5 sm:p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-500 shadow-sm"
            >
              <FaArrowLeft size={14} />
            </button>
            <div>
              <h1 className="text-xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tighter">My Profile</h1>
              <p className="text-[9px] sm:text-sm font-bold text-slate-500 uppercase tracking-widest mt-0.5 sm:mt-1">Manage your identity & preferences</p>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
            {/* Left Column: Avatar & Quick Stats */}
            <div className="lg:col-span-1 space-y-4 sm:space-y-6">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[1.5rem] sm:rounded-[2.5rem] p-5 sm:p-8 shadow-sm">
                <div className="flex items-center gap-4 sm:gap-6 mb-6">
                  <div className="relative shrink-0">
                    <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[1rem] sm:rounded-[1.5rem] flex items-center justify-center text-white text-2xl sm:text-4xl font-black shadow-xl shadow-blue-500/20">
                      {user.name?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                    </div>
                    <button className="absolute -bottom-1 -right-1 p-1.5 sm:p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg sm:rounded-xl text-blue-600 shadow-lg transition-transform hover:scale-110">
                      <FaCamera className="text-[8px] sm:text-xs" />
                    </button>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-base sm:text-xl font-black text-slate-900 dark:text-white leading-tight truncate">{user.name || 'Set your name'}</h2>
                    <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{user.role || 'Explorer'}</p>
                  </div>
                </div>
                
                <div className="pt-5 border-t border-slate-50 dark:border-slate-800">
                  <div className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl font-bold text-[10px] sm:text-xs uppercase tracking-tight break-all">
                    <FaEnvelope className="shrink-0" /> {user.email}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Profile Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleUpdate} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[1.5rem] sm:rounded-[2.5rem] p-5 sm:p-10 shadow-sm space-y-5 sm:space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-1.5 sm:space-y-2">
                    <label className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Full Name</label>
                    <div className="relative">
                      <FaUser className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-slate-400 text-xs sm:text-base" />
                      <input 
                        type="text" 
                        value={user.name}
                        onChange={(e) => setUser({...user, name: e.target.value})}
                        className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-4 bg-slate-50 dark:bg-slate-800/50 border-none rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-bold dark:text-white text-xs sm:text-sm" 
                        placeholder="John Doe"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5 sm:space-y-2">
                    <label className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Phone Number</label>
                    <div className="relative">
                      <FaPhone className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] sm:text-xs" />
                      <input 
                        type="text" 
                        value={user.phone}
                        onChange={(e) => setUser({...user, phone: e.target.value})}
                        className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-4 bg-slate-50 dark:bg-slate-800/50 border-none rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-bold dark:text-white text-xs sm:text-sm" 
                        placeholder="+61 XXXXXXXX"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  <label className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">University/Institution</label>
                  <div className="relative">
                    <FaUniversity className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-slate-400 text-xs sm:text-base" />
                    <input 
                      type="text" 
                      value={user.university}
                      onChange={(e) => setUser({...user, university: e.target.value})}
                      className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-4 bg-slate-50 dark:bg-slate-800/50 border-none rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-bold dark:text-white text-xs sm:text-sm" 
                      placeholder="Macquarie University"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  <label className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Professional Bio / About</label>
                  <div className="relative">
                    <FaQuoteLeft className="absolute left-4 sm:left-5 top-4 sm:top-5 text-slate-400 text-[9px] sm:text-[10px]" />
                    <textarea 
                      value={user.bio}
                      onChange={(e) => setUser({...user, bio: e.target.value})}
                      rows={3}
                      className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 bg-slate-50 dark:bg-slate-800/50 border-none rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-bold dark:text-white text-xs sm:text-sm resize-none" 
                      placeholder="Briefly describe your goals or journey..."
                    />
                  </div>
                </div>

                <div className="pt-2 sm:pt-4">
                  <button 
                    type="submit" 
                    disabled={updating}
                    className="w-full sm:w-auto px-8 sm:px-10 py-3.5 sm:py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl sm:rounded-2xl font-black text-xs sm:text-sm uppercase tracking-widest shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
                  >
                    {updating ? (
                      <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <><FaSave size={14} /> Save Changes</>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
