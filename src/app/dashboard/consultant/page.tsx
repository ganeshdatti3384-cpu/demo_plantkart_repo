'use client';

import React, { useEffect, useState } from 'react';
import { 
  FaUserTie, FaCalendarAlt, FaStar, FaVideo, FaCheckCircle, 
  FaExclamationTriangle, FaArrowRight, FaIdCard, FaMapMarkerAlt, 
  FaFileAlt, FaLink, FaTimes, FaPlus, FaTrash, FaHistory, FaFilter
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import ThemeSwitcher from '@/components/ThemeSwitcher';

export default function DashboardConsultant() {
  const [activeTab, setActiveTab] = useState<'overview' | 'requests' | 'availability'>('overview');
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [showMeetModal, setShowMeetModal] = useState(false);
  const [meetLinkInput, setMeetLinkInput] = useState('');
  
  // Profile / Availability State
  const [profile, setProfile] = useState<any>(null);
  const [newSlot, setNewSlot] = useState('');
  const [manualEntry, setManualEntry] = useState({ date: '', time: '' });
  const [slotConfig, setSlotConfig] = useState({
    date: '',
    startTime: '09:00',
    interval: 60,
    count: 1
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [reqRes, profRes] = await Promise.all([
        fetch('/api/consultant/booking/requests'),
        fetch('/api/consultant/profile')
      ]);
      const reqData = await reqRes.json();
      const profData = await profRes.json();
      setRequests(Array.isArray(reqData) ? reqData : []);
      setProfile(profData);
    } catch (err) {
      toast.error('Failed to sync with server');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/auth/login';
    } catch (e) {
      toast.error('Logout failed');
    }
  };

  const handleAction = async (id: string, action: 'approve' | 'reject' | 'complete', data?: any) => {
    try {
      const body = action === 'approve' ? { meetLink: data } : {};
      const res = await fetch(`/api/consultant/booking/${id}/${action}`, { 
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (res.ok) {
        toast.success(`Booking ${action}ed`);
        fetchData(); // Refresh all state
        setSelectedRequest(null);
        setShowMeetModal(false);
      }
    } catch (e) {
      toast.error('Operation failed');
    }
  };

  const updateProfile = async (updates: any) => {
    try {
      const res = await fetch('/api/consultant/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        toast.success('Availability updated');
        fetchData();
      }
    } catch (e) {
      toast.error('Update failed');
    }
  };

  const addSlot = () => {
    let timeStrToAdd = '';
    
    if (manualEntry.date && manualEntry.time) {
      const dateObj = new Date(`${manualEntry.date}T${manualEntry.time}`);
      const dateStr = dateObj.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
      const timeStr = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      timeStrToAdd = `${dateStr} @ ${timeStr}`;
    } else if (newSlot) {
      timeStrToAdd = newSlot;
    }

    if (!timeStrToAdd) {
      toast.error('Please enter a date and time');
      return;
    }

    const newSlotObj = {
      id: Math.random().toString(36).substr(2, 9),
      time: timeStrToAdd,
      status: 'available',
      lockedAt: null,
      lockedBy: null
    };

    const updatedSlots = [...(profile?.slots || []), newSlotObj];
    updateProfile({ slots: updatedSlots });
    setNewSlot('');
    setManualEntry({ date: '', time: '' });
  };

  const generateBulkSlots = () => {
    if (!slotConfig.date || !slotConfig.startTime) {
      toast.error('Select date and start time');
      return;
    }

    const newSlots: any[] = [];
    let currentTime = new Date(`${slotConfig.date}T${slotConfig.startTime}`);

    for (let i = 0; i < slotConfig.count; i++) {
      const timeStr = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const dateStr = currentTime.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
      
      newSlots.push({
        id: Math.random().toString(36).substr(2, 9),
        time: `${dateStr} @ ${timeStr}`,
        status: 'available',
        lockedAt: null,
        lockedBy: null
      });
      
      currentTime = new Date(currentTime.getTime() + slotConfig.interval * 60000);
    }

    const updatedSlots = [...(profile?.slots || []), ...newSlots];
    updateProfile({ slots: updatedSlots });
    toast.success(`Generated ${slotConfig.count} slots`);
  };

  const removeSlot = (slotId: string) => {
    const updatedSlots = profile?.slots?.filter((s: any) => s.id !== slotId);
    updateProfile({ slots: updatedSlots });
  };

  const stats = [
    { label: 'Total Sessions', value: profile?.totalSessions || '0', icon: <FaCheckCircle className="text-blue-500" /> },
    { label: 'Avg Rating', value: profile?.rating || '5.0', icon: <FaStar className="text-amber-500" /> },
    { label: 'New Requests', value: requests.filter(r => r.status === 'REQUEST_SENT').length.toString(), icon: <FaExclamationTriangle className="text-rose-500" /> },
    { label: 'Scheduled', value: requests.filter(r => r.status === 'MEETING_SCHEDULED').length.toString(), icon: <FaVideo className="text-emerald-500" /> },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl font-sans min-h-screen">
      {/* Dynamic Header */}
      <header className="mb-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8 animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-blue-600 rounded-[1.5rem] flex items-center justify-center text-white text-3xl shadow-xl shadow-blue-500/20">
            <FaUserTie />
          </div>
          <div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Hello, {profile?.name || 'Expert'}</h1>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em]">{profile?.specialty || 'Professional Consultant'}</p>
              {profile?.status === 'PENDING' && (
                <span className="px-2 py-0.5 bg-amber-100 text-amber-600 text-[8px] font-black rounded-full uppercase tracking-widest">Pending Verification</span>
              )}
            </div>
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-3">
          <ThemeSwitcher />
          <button 
            onClick={handleLogout}
            className="px-6 py-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-900 dark:text-white rounded-2xl font-black transition-all hover:bg-slate-50 active:scale-95 shadow-sm"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Navigation Tabs */}
      {profile?.status === 'PENDING' && (
        <div className="mb-8 p-6 bg-amber-50 border border-amber-200 rounded-[2rem] flex items-center gap-4 text-amber-800 animate-pulse">
          <FaExclamationTriangle className="text-2xl flex-shrink-0" />
          <div>
            <p className="font-black text-sm uppercase tracking-wider">Account Pending Approval</p>
            <p className="text-xs font-medium opacity-80 mt-1">Your profile is currently hidden from users. Once an admin reviews and approves your registration, your availability will be public.</p>
          </div>
        </div>
      )}

      <div className="flex p-1.5 bg-slate-100 dark:bg-slate-800/50 rounded-3xl w-fit mb-10 border border-white dark:border-slate-800 shadow-inner">
        {[
          { id: 'overview', label: 'Overview', icon: <FaFilter /> },
          { id: 'requests', label: 'Appointments', icon: <FaCalendarAlt /> },
          { id: 'availability', label: 'Availability', icon: <FaHistory /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-8 py-3 rounded-2xl text-xs font-black transition-all ${
              activeTab === tab.id 
                ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-xl' 
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {stats.map((stat, i) => (
              <div key={i} className="p-8 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-all">
                <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-2xl mb-6">
                  {stat.icon}
                </div>
                <p className="text-[10px] font-black text-slate-400 mb-1 uppercase tracking-[0.2em]">{stat.label}</p>
                <p className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Upcoming Highlights */}
              <section className="card p-10 bg-slate-900 text-white relative overflow-hidden">
                <div className="relative z-10">
                  <h2 className="text-2xl font-black mb-6">Immediate Sessions</h2>
                  <div className="space-y-4">
                    {requests.filter(r => r.status === 'MEETING_SCHEDULED').length === 0 ? (
                      <p className="text-slate-500 font-bold italic">No sessions scheduled for today.</p>
                    ) : (
                      requests.filter(r => r.status === 'MEETING_SCHEDULED').slice(0, 2).map((req, i) => (
                        <div key={i} className="flex items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/10 hover:bg-white/10 transition-all">
                           <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center font-black">{req.userName?.[0]}</div>
                              <div>
                                <p className="font-bold">{req.userName}</p>
                                <p className="text-xs text-slate-400">{req.slot}</p>
                              </div>
                           </div>
                           <a href={req.meetLink} target="_blank" className="px-6 py-2 bg-white text-slate-900 text-xs font-black rounded-xl hover:scale-105 transition-transform">JOIN</a>
                        </div>
                      ))
                    )}
                  </div>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -mr-32 -mt-32" />
              </section>
            </div>
            
            <section className="card p-10 border-none ring-1 ring-slate-100 dark:ring-slate-800 h-fit">
              <h2 className="text-xl font-bold mb-6">Earning Activity</h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-500">Weekly Payout</span>
                  <span className="text-lg font-black text-emerald-600">AUD $1,420</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-3/4" />
                </div>
                <p className="text-xs text-slate-500 italic">Next payout estimated for Friday, Jan 14.</p>
              </div>
            </section>
          </div>
        </div>
      )}

      {activeTab === 'requests' && (
        <div className="animate-in fade-in slide-in-from-right-4 duration-500">
           {/* Section: Incoming */}
           <section className="mb-12">
              <h2 className="text-2xl font-black mb-8 flex items-center gap-3">
                Action Required
                <span className="px-3 py-1 bg-rose-100 text-rose-600 text-[10px] font-black rounded-full uppercase">NEW</span>
              </h2>
              <div className="grid grid-cols-1 gap-6">
                {requests.filter(r => r.status === 'REQUEST_SENT').length === 0 ? (
                  <div className="p-20 text-center rounded-[3rem] border-2 border-dashed border-slate-100 dark:border-slate-800">
                     <p className="text-slate-400 font-bold italic">No new requests in the queue.</p>
                  </div>
                ) : (
                  requests.filter(r => r.status === 'REQUEST_SENT').map(req => (
                    <div key={req._id} className="p-8 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-2xl transition-all group">
                       <div className="flex items-center gap-6">
                          <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-3xl flex items-center justify-center font-black text-2xl shadow-lg ring-4 ring-blue-50 dark:ring-blue-900/10">
                            {req.userName?.[0]}
                          </div>
                          <div>
                            <h4 className="text-xl font-black text-slate-900 dark:text-white">{req.userName}</h4>
                            <p className="text-sm font-bold text-blue-600 mb-2 flex items-center gap-2">
                               <FaFileAlt className="text-xs" /> {req.visaPurpose} Selection
                            </p>
                            <div className="flex gap-4">
                               <span className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-1">
                                 <FaCalendarAlt /> {req.slot}
                               </span>
                               <span className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-1">
                                 <FaMapMarkerAlt /> {req.locationStatus}
                               </span>
                            </div>
                          </div>
                       </div>
                       <div className="flex gap-3 w-full md:w-auto">
                         <button onClick={() => setSelectedRequest(req)} className="flex-1 md:flex-none px-8 py-4 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-black text-xs rounded-2xl hover:bg-slate-200 transition-all uppercase tracking-widest">Review</button>
                         <button onClick={() => { setSelectedRequest(req); setShowMeetModal(true); }} className="flex-1 md:flex-none px-8 py-4 bg-blue-600 text-white font-black text-xs rounded-2xl hover:bg-blue-700 transition-all uppercase tracking-widest shadow-xl shadow-blue-500/10">Approve</button>
                       </div>
                    </div>
                  ))
                )}
              </div>
           </section>

           {/* Section: Active / Scheduled */}
           <section className="mb-12">
              <h2 className="text-2xl font-black mb-8 flex items-center gap-3">
                Scheduled Sessions
                <span className="px-3 py-1 bg-blue-100 text-blue-600 text-[10px] font-black rounded-full uppercase tracking-widest">LIVE</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {requests.filter(r => r.status === 'MEETING_SCHEDULED').length === 0 ? (
                   <p className="p-10 text-slate-400 font-bold">No sessions currently scheduled.</p>
                 ) : (
                   requests.filter(r => r.status === 'MEETING_SCHEDULED').map(req => (
                     <div key={req._id} className="p-8 rounded-[2.5rem] bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent hover:border-emerald-500/20 transition-all group overflow-hidden relative">
                        <div className="flex justify-between items-start mb-6">
                           <div className="flex gap-4">
                              <div className="w-10 h-10 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center text-blue-600 shadow-sm">{req.userName?.[0]}</div>
                              <div>
                                 <p className="font-black text-slate-900 dark:text-white capitalize">{req.userName}</p>
                                 <p className="text-[10px] uppercase font-black text-slate-400 tracking-tighter">{req.slot}</p>
                              </div>
                           </div>
                           <button onClick={() => handleAction(req._id, 'complete')} className="text-[10px] font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-lg active:scale-95 transition-all">
                              MARK COMPLETED
                           </button>
                        </div>
                        <div className="flex gap-3">
                           <a href={req.meetLink} target="_blank" className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 text-white text-[10px] font-black rounded-xl hover:bg-slate-900 transition-all uppercase tracking-widest">
                             <FaVideo /> Join Session
                           </a>
                           <button onClick={() => setSelectedRequest(req)} className="p-3 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl hover:bg-slate-50 text-slate-500"><FaIdCard /></button>
                        </div>
                        {/* Decorative background element */}
                        <FaVideo className="absolute -right-4 -bottom-4 text-8xl text-emerald-500/5 rotate-12" />
                     </div>
                   ))
                 )}
              </div>
           </section>

           {/* Section: History */}
           <section>
              <h2 className="text-2xl font-black mb-8 flex items-center gap-3 text-slate-400">
                Completed Logs
                <FaHistory className="text-lg opacity-30" />
              </h2>
              <div className="overflow-hidden rounded-[2rem] border border-slate-100 dark:border-slate-800">
                 <table className="w-full text-left bg-white dark:bg-slate-900">
                   <thead className="bg-slate-50 dark:bg-slate-800/50">
                     <tr>
                       <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Applicant</th>
                       <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Closed At</th>
                       <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Type</th>
                       <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] text-right">Result</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                     {requests.filter(r => ['COMPLETED', 'REJECTED'].includes(r.status)).map(req => (
                        <tr key={req._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                           <td className="p-6 text-sm font-bold text-slate-900 dark:text-white">{req.userName}</td>
                           <td className="p-6 text-xs text-slate-500">{new Date(req.updatedAt).toLocaleDateString()}</td>
                           <td className="p-6 text-xs font-black text-blue-600 uppercase tracking-tighter">{req.visaPurpose}</td>
                           <td className="p-6 text-right">
                              <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                                req.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
                              }`}>
                                {req.status}
                              </span>
                           </td>
                        </tr>
                     ))}
                   </tbody>
                 </table>
              </div>
           </section>
        </div>
      )}

      {activeTab === 'availability' && (
        <div className="animate-in fade-in slide-in-from-left-4 duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <section className="p-10 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm">
                 <h2 className="text-2xl font-black mb-8 flex items-center gap-3">
                   <FaCalendarAlt className="text-blue-600" /> Managed Slots
                 </h2>
                 <div className="space-y-4 mb-10 max-h-[400px] overflow-y-auto pr-2">
                    {profile?.slots?.length === 0 ? (
                      <p className="text-slate-400 font-bold italic py-8 text-center bg-slate-50 dark:bg-slate-800/30 rounded-3xl">No availability added yet.</p>
                    ) : (
                      profile?.slots?.map((slot: any, i: number) => (
                        <div key={slot.id || i} className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border-2 border-transparent hover:border-blue-600/20 transition-all group">
                           <div className="flex flex-col">
                              <span className="font-bold text-slate-700 dark:text-slate-300">
                                {typeof slot === 'string' ? slot : slot.time}
                              </span>
                              {slot.status === 'booked' && <span className="text-[10px] text-rose-500 font-black uppercase tracking-widest mt-1">Booked</span>}
                           </div>
                           <button onClick={() => removeSlot(slot.id || slot)} className="p-3 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-all">
                              <FaTrash />
                           </button>
                        </div>
                      ))
                    )}
                 </div>

                 <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="label text-[10px]">Select Date</label>
                            <input 
                                type="date" 
                                className="input-field py-3 text-sm"
                                value={manualEntry.date}
                                onChange={(e) => setManualEntry({...manualEntry, date: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="label text-[10px]">Select Time</label>
                            <input 
                                type="time" 
                                className="input-field py-3 text-sm"
                                value={manualEntry.time}
                                onChange={(e) => setManualEntry({...manualEntry, time: e.target.value})}
                            />
                        </div>
                    </div>
                    
                    <div className="flex gap-3">
                        <div className="relative flex-1 group">
                          <input 
                            type="text" 
                            placeholder="Or text entry: Mon 10AM" 
                            className="input-field pl-12"
                            value={newSlot}
                            onChange={(e) => setNewSlot(e.target.value)}
                          />
                          <FaPlus className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-all" />
                        </div>
                        <button onClick={addSlot} className="px-8 py-3 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all active:scale-95 uppercase text-xs tracking-widest shadow-xl shadow-blue-500/10">Add Slot</button>
                    </div>
                 </div>
              </section>

              <section className="p-10 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm">
                 <h2 className="text-2xl font-black mb-8 flex items-center gap-3">
                   <FaHistory className="text-indigo-600" /> Bulk Slot Generator
                 </h2>
                 <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className="label">Start Date</label>
                        <input 
                          type="date" 
                          className="input-field"
                          value={slotConfig.date}
                          onChange={(e) => setSlotConfig({...slotConfig, date: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="label">Start Time</label>
                        <input 
                          type="time" 
                          className="input-field"
                          value={slotConfig.startTime}
                          onChange={(e) => setSlotConfig({...slotConfig, startTime: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="label">Duration (Min)</label>
                        <select 
                          className="input-field text-sm"
                          value={slotConfig.interval}
                          onChange={(e) => setSlotConfig({...slotConfig, interval: parseInt(e.target.value)})}
                        >
                           <option value="30">30 Minutes</option>
                           <option value="45">45 Minutes</option>
                           <option value="60">60 Minutes</option>
                           <option value="90">90 Minutes</option>
                        </select>
                    </div>
                    <div>
                        <label className="label">Slot Count</label>
                        <input 
                          type="number" 
                          min="1" 
                          max="10"
                          className="input-field"
                          value={slotConfig.count}
                          onChange={(e) => setSlotConfig({...slotConfig, count: parseInt(e.target.value)})}
                        />
                    </div>
                 </div>
                 <button 
                  onClick={generateBulkSlots}
                  className="w-full py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all uppercase text-xs tracking-[0.2em]"
                >
                    Generate & Save Timings
                 </button>
              </section>
            </div>

            <section className="p-10 rounded-[2.5rem] bg-gradient-to-br from-indigo-700 to-blue-900 text-white shadow-2xl shadow-blue-500/20 h-fit">
               <h3 className="text-2xl font-black mb-6">Expert Profile</h3>
               <div className="space-y-6">
                  <div className="p-6 bg-white/10 rounded-3xl border border-white/10">
                     <label className="label text-white/50">Current Role</label>
                     <p className="text-xl font-bold">{profile?.specialty || 'General Consultant'}</p>
                  </div>
                  <div className="p-6 bg-white/10 rounded-3xl border border-white/10">
                     <label className="label text-white/50">Session Rate (Standard)</label>
                     <p className="text-xl font-bold">{profile?.price || 'AUD $150'}</p>
                  </div>
                  <p className="text-xs text-indigo-200 leading-relaxed font-bold italic">
                    Note: Your profile details are verified by the admin panel. Any changes to rates or specialties must be approved via the Support Desk.
                  </p>
               </div>
            </section>
          </div>
        </div>
      )}

      {/* Detail Review Modal */}
      {selectedRequest && !showMeetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl">
            <div className="p-8 border-b dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
               <div>
                  <h2 className="text-2xl font-black flex items-center gap-3"><FaIdCard className="text-blue-600"/> Application Review</h2>
                  <p className="text-xs font-black uppercase text-slate-400 tracking-widest mt-1">Case ID: {selectedRequest._id.substr(-8)}</p>
               </div>
               <button onClick={() => setSelectedRequest(null)} className="p-3 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors">
                  <FaTimes />
               </button>
            </div>
            
            <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
               <div className="space-y-8">
                  <div>
                     <label className="label">Consultation Focus</label>
                     <p className="text-sm font-bold p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-800 italic leading-relaxed">
                       "{selectedRequest.reason}"
                     </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="label">Visa Goal</label>
                        <p className="font-black text-slate-900 dark:text-white uppercase tracking-tighter">{selectedRequest.visaPurpose}</p>
                     </div>
                     <div>
                        <label className="label">Visa ID/Subclass</label>
                        <p className="font-black text-slate-900 dark:text-white uppercase tracking-tighter">{selectedRequest.visaType}</p>
                     </div>
                  </div>
               </div>

               <div className="space-y-8">
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="label">Current Stage</label>
                        <p className="font-black text-blue-600 uppercase tracking-tighter">{selectedRequest.visaStatus}</p>
                     </div>
                     <div>
                        <label className="label">Origin Status</label>
                        <p className="font-black text-slate-900 dark:text-white uppercase tracking-tighter">{selectedRequest.locationStatus}</p>
                     </div>
                  </div>
                  <div>
                     <label className="label">Visa Validity</label>
                     <p className="p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl text-sm font-black tracking-tighter">{selectedRequest.visaTenure || 'Indefinite'}</p>
                  </div>
               </div>
            </div>

            <div className="p-10 bg-slate-50 dark:bg-slate-800/50 flex gap-4 border-t dark:border-slate-800">
               <button 
                onClick={() => handleAction(selectedRequest._id, 'reject')}
                className="flex-1 py-5 bg-white dark:bg-slate-800 text-rose-600 rounded-2xl font-black hover:bg-rose-50 transition-all border border-slate-200 dark:border-slate-700 uppercase text-xs tracking-widest"
               >
                 Reject Request
               </button>
               {selectedRequest.status === 'REQUEST_SENT' && (
                  <button 
                    onClick={() => setShowMeetModal(true)}
                    className="flex-[2] py-5 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 uppercase text-xs tracking-widest"
                  >
                    Approve & Schedule
                  </button>
               )}
            </div>
          </div>
        </div>
      )}

      {/* Meet Schedule Modal */}
      {showMeetModal && selectedRequest && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md animate-in zoom-in-95 duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-[3rem] w-full max-w-md p-12 shadow-2xl text-center">
             <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-10 text-3xl shadow-lg ring-4 ring-blue-50 dark:ring-blue-900/10">
                <FaVideo />
             </div>
             <h2 className="text-3xl font-black mb-2 tracking-tight">Finalize Schedule</h2>
             <p className="text-slate-500 text-sm mb-10 italic">Selected Slot: {selectedRequest.slot}</p>
             
             <div className="text-left mb-10">
                <label className="label">Platform Meeting Link</label>
                <div className="relative group">
                  <input 
                    className="input-field pl-12 pr-4 bg-slate-50 focus:bg-white transition-all text-sm font-bold" 
                    placeholder="e.g. https://zoom.us/j/..." 
                    value={meetLinkInput}
                    onChange={(e) => setMeetLinkInput(e.target.value)}
                  />
                  <FaLink className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                </div>
                <p className="text-[10px] text-slate-400 mt-4 font-black uppercase tracking-[0.15em] px-1 leading-relaxed">System will auto-generate Google Meet if empty</p>
             </div>

             <div className="space-y-4">
                <button 
                  onClick={() => handleAction(selectedRequest._id, 'approve', meetLinkInput)}
                  className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black shadow-2xl transition-all active:scale-[0.98] uppercase text-xs tracking-[0.2em]"
                >
                   Send Confirmation
                </button>
                <button 
                  onClick={() => setShowMeetModal(false)}
                  className="w-full py-4 text-slate-400 font-bold hover:text-slate-900 transition-colors uppercase text-[10px] tracking-widest"
                >
                  Go Back
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}

