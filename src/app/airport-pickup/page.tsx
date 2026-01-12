"use client";

import React, { useState, useEffect } from 'react';
import { 
  FaPlaneArrival, 
  FaCalendarAlt, 
  FaClock, 
  FaCheckCircle, 
  FaHistory, 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaGlobe, 
  FaMapMarkerAlt, 
  FaSuitcase, 
  FaInfoCircle, 
  FaSchool, 
  FaCar, 
  FaUserAlt, 
  FaGraduationCap 
} from 'react-icons/fa';
import Sidebar from '@/components/Sidebar';
import { toast } from 'react-hot-toast';

export default function AirportPickupRequest() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [myRequests, setMyRequests] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'form' | 'status'>('form');

  const [formData, setFormData] = useState({
    arrivalAirport: '',
    airlineName: '',
    flightNumber: '',
    arrivalDate: '',
    arrivalTime: '',
    terminalNumber: '',
    purposeOfVisit: 'Study',
    luggageCount: '',
    specialInstructions: '',
    collegeName: '',
    collegeCity: ''
  });

  useEffect(() => {
    fetchProfile();
    fetchMyRequests();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/auth/profile');
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
      }
    } catch (err) {
      console.error('Failed to fetch profile');
    }
  };

  const fetchMyRequests = async () => {
    try {
      const res = await fetch('/api/airport-pickup/my-requests');
      if (res.ok) {
        const data = await res.json();
        setMyRequests(data);
        if (data.length > 0) setActiveTab('status');
      }
    } catch (err) {
      console.error('Failed to fetch requests');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/airport-pickup/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setSuccess(true);
        fetchMyRequests();
      } else {
        const error = await res.json();
        toast.error(error.error || 'Submission failed');
      }
    } catch (err) {
      toast.error('Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (success) {
    return (
      <div className="flex flex-col lg:flex-row min-h-[100dvh] bg-slate-50 dark:bg-slate-950 overflow-hidden font-geist">
        <Sidebar activeService="Airport Pickup" />
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-[2.5rem] shadow-2xl text-center border border-slate-100 dark:border-slate-800">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-3xl sm:text-4xl mx-auto mb-6">
              <FaCheckCircle />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-2">Request Received!</h2>
            <p className="text-sm sm:text-base text-slate-500 mb-8">Your airport pickup request is being processed. An admin will assign a driver shortly.</p>
            <button 
              onClick={() => {
                setSuccess(false);
                setActiveTab('status');
              }} 
              className="w-full py-4 bg-blue-600 text-white rounded-xl sm:rounded-2xl font-black text-sm sm:text-base"
            >
              View My Requests
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-[100dvh] bg-slate-50 dark:bg-slate-950 overflow-hidden font-geist">
      <Sidebar activeService="Airport Pickup" />
      
      <main className="flex-1 lg:max-h-screen lg:overflow-y-auto p-4 lg:p-12 pb-safe lg:pb-12 pt-4">
        <div className="max-w-4xl mx-auto px-2 md:px-0 w-full">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 md:mb-12 pt-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center bg-blue-600/10 backdrop-blur-md shadow-sm">
                <FaPlaneArrival className="w-7 h-7 md:w-8 md:h-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-none mb-1">
                  Airport Pickup
                </h1>
                <p className="text-xs md:text-sm font-bold text-slate-400 uppercase tracking-widest leading-none">
                  Arrival coordination simplified
                </p>
              </div>
            </div>

            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
              <button 
                onClick={() => setActiveTab('form')}
                className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'form' ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm' : 'text-slate-500'}`}
              >
                Request
              </button>
              <button 
                onClick={() => setActiveTab('status')}
                className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'status' ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm' : 'text-slate-500'}`}
              >
                My Bookings {myRequests.length > 0 && `(${myRequests.length})`}
              </button>
            </div>
          </div>

          {activeTab === 'form' ? (
            <div className="space-y-8">
              {/* Profile Card (Read Only) */}
              <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                  <FaUser className="text-blue-600" /> Personal Profile Info
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Full Name</p>
                    <p className="font-bold text-slate-900 dark:text-white">{profile?.name || profile?.fullName || 'Loading...'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Email Address</p>
                    <p className="font-bold text-slate-900 dark:text-white">{profile?.email || 'Loading...'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Mobile (AU)</p>
                    <p className="font-bold text-slate-900 dark:text-white">{profile?.mobileAustralia || profile?.phone || 'Loading...'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Citizenship</p>
                    <p className="font-bold text-slate-900 dark:text-white">{profile?.citizenship || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Country</p>
                    <p className="font-bold text-slate-900 dark:text-white">{profile?.countryDetails || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Input Form */}
              <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden p-6 sm:p-10">
                <form onSubmit={handleSubmit} className="space-y-10">
                  {/* Arrival Info Section */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800"></div>
                      <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Arrival Information</span>
                      <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800"></div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Arrival Airport</label>
                        <div className="relative">
                          <FaMapMarkerAlt className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input type="text" name="arrivalAirport" required placeholder="e.g. Sydney Airport" value={formData.arrivalAirport} onChange={handleChange} className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-bold dark:text-white" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Airline Name</label>
                        <div className="relative">
                          <FaPlaneArrival className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 shadow-sm" />
                          <input type="text" name="airlineName" required placeholder="e.g. Emirates" value={formData.airlineName} onChange={handleChange} className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-bold dark:text-white" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Flight Number</label>
                        <div className="relative">
                          <FaInfoCircle className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input type="text" name="flightNumber" required placeholder="e.g. EK502" value={formData.flightNumber} onChange={handleChange} className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-bold dark:text-white" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Terminal Number</label>
                        <div className="relative">
                          <FaSuitcase className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input type="text" name="terminalNumber" required placeholder="e.g. T1" value={formData.terminalNumber} onChange={handleChange} className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-bold dark:text-white" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Arrival Date</label>
                        <div className="relative">
                          <FaCalendarAlt className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input type="date" name="arrivalDate" required value={formData.arrivalDate} onChange={handleChange} className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-bold dark:text-white" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Arrival Time</label>
                        <div className="relative">
                          <FaClock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input type="time" name="arrivalTime" required value={formData.arrivalTime} onChange={handleChange} className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-bold dark:text-white" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Visit Info Section */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800"></div>
                      <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Purpose & Extras</span>
                      <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Purpose of Visit</label>
                        <select name="purposeOfVisit" value={formData.purposeOfVisit} onChange={handleChange} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-bold dark:text-white">
                          <option value="Study">Study</option>
                          <option value="Work">Work</option>
                          <option value="Visit">Visit</option>
                          <option value="Migration">Migration</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Luggage Count</label>
                        <input type="number" name="luggageCount" placeholder="0" value={formData.luggageCount} onChange={handleChange} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-bold dark:text-white" />
                      </div>
                    </div>

                    {formData.purposeOfVisit === 'Study' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Institution Name</label>
                          <div className="relative">
                            <FaGraduationCap className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input type="text" name="collegeName" required placeholder="e.g. Sydney College" value={formData.collegeName} onChange={handleChange} className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-bold dark:text-white" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">College City</label>
                          <div className="relative">
                            <FaMapMarkerAlt className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input type="text" name="collegeCity" required placeholder="e.g. Sydney" value={formData.collegeCity} onChange={handleChange} className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-bold dark:text-white" />
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Special Instructions (Optional)</label>
                      <textarea name="specialInstructions" rows={3} placeholder="Any specific requirements or meeting point preferences..." value={formData.specialInstructions} onChange={handleChange} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-bold dark:text-white resize-none"></textarea>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full py-5 bg-blue-600 text-white rounded-[2rem] font-black text-sm sm:text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 uppercase tracking-[0.2em]"
                  >
                    {loading ? 'Processing Request...' : 'Submit Pickup Request'}
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {myRequests.length === 0 ? (
                <div className="py-20 text-center bg-white dark:bg-slate-900 rounded-[3rem] border border-dashed border-slate-300 dark:border-slate-800">
                  <FaPlaneArrival className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500 font-bold">No pickup requests found.</p>
                  <button onClick={() => setActiveTab('form')} className="mt-4 text-blue-600 font-black uppercase text-xs tracking-widest">Book Now</button>
                </div>
              ) : (
                myRequests.map((req) => (
                  <div key={req._id} className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden overflow-x-auto">
                    <div className="p-6 sm:p-8 flex flex-col md:flex-row gap-8">
                      {/* Left: Status & Main Info */}
                      <div className="flex-1 space-y-6">
                        <div className="flex items-center justify-between">
                          <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                            req.status === 'PENDING' ? 'bg-amber-100 text-amber-600' : 
                            req.status === 'ACCEPTED' ? 'bg-blue-100 text-blue-600' : 
                            req.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
                          }`}>
                            {req.status}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 capitalize">Requested {new Date(req.createdAt).toLocaleDateString()}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Flight</p>
                            <p className="font-black text-slate-900 dark:text-white">{req.flightNumber}</p>
                            <p className="text-[10px] font-bold text-slate-500">{req.airlineName}</p>
                          </div>
                          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Arrival</p>
                            <p className="font-black text-slate-900 dark:text-white">{req.arrivalDate}</p>
                            <p className="text-[10px] font-bold text-slate-500">{req.arrivalTime} @ {req.arrivalAirport}</p>
                          </div>
                        </div>
                      </div>

                      {/* Right: Driver Details */}
                      <div className="flex-1 bg-blue-50/30 dark:bg-blue-900/10 p-6 rounded-[2rem] border border-blue-100/50 dark:border-blue-900/30">
                        <h4 className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                          <FaCar /> Driver Information
                        </h4>
                        
                        {req.status === 'ACCEPTED' || req.status === 'COMPLETED' ? (
                          <div className="space-y-4">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-black shadow-lg shadow-blue-500/20">
                                {req.driverName?.charAt(0)}
                              </div>
                              <div>
                                <p className="font-black text-slate-900 dark:text-white leading-none">{req.driverName}</p>
                                <a href={`tel:${req.driverPhone}`} className="text-xs font-bold text-blue-600 flex items-center gap-1 mt-1">
                                  <FaPhone className="w-3 h-3" /> {req.driverPhone}
                                </a>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3 pt-2">
                              <div>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Vehicle</p>
                                <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300">{req.vehicleNumber}</p>
                                <p className="text-[9px] font-bold text-slate-500 uppercase">{req.vehicleType}</p>
                              </div>
                              <div>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Pickup Point</p>
                                <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300">{req.pickupPoint}</p>
                              </div>
                            </div>
                            {req.adminNotes && (
                              <div className="mt-4 p-3 bg-white/50 dark:bg-slate-800/50 rounded-xl border border-blue-100 dark:border-blue-800">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Notes</p>
                                <p className="text-[10px] italic text-slate-600 dark:text-slate-400">"{req.adminNotes}"</p>
                              </div>
                            )}
                          </div>
                        ) : req.status === 'REJECTED' ? (
                          <div className="flex flex-col items-center justify-center h-full text-center p-4">
                            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mb-3">
                              <FaInfoCircle className="w-6 h-6" />
                            </div>
                            <p className="text-xs font-bold text-rose-600 uppercase tracking-widest">Request Rejected</p>
                            <p className="text-[10px] text-slate-500 mt-2 italic">{req.rejectReason}</p>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center h-full text-center space-y-3 py-6">
                            <div className="w-10 h-10 rounded-full border-2 border-dashed border-blue-200 dark:border-blue-900 animate-pulse flex items-center justify-center">
                              <FaCar className="text-blue-200 dark:text-blue-900" />
                            </div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Waiting for driver assignment...</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

