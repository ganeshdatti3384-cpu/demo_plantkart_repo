"use client";
import React, { useEffect, useState } from 'react';
import { 
  FaCar, FaHome, FaUser, FaPhone, FaEnvelope, 
  FaCalendarAlt, FaCheckCircle, FaClock, FaHistory,
  FaSearch, FaClipboardList, FaMapMarkerAlt, FaDollarSign
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import Sidebar from '@/components/Sidebar';

export default function VendorRequestsPage() {
  const [data, setData] = useState<any>({ carRequests: [], accommodationRequests: [], eventRequests: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'car' | 'accommodation' | 'events'>('car');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/vendor/requests');
      const result = await res.json();
      if (result.success) {
        setData(result);
      }
    } catch (err) {
      toast.error('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/vendor/requests/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, type: activeTab === 'car' ? 'CAR' : activeTab === 'accommodation' ? 'ACCOMMODATION' : 'EVENT' })
      });
      if (res.ok) {
        toast.success(`Request ${status.toLowerCase()}ed`);
        fetchRequests();
      } else {
        toast.error('Failed to update status');
      }
    } catch (err) {
      toast.error('Something went wrong');
    }
  };

  const requests = activeTab === 'car' 
    ? data.carRequests 
    : activeTab === 'accommodation' 
      ? data.accommodationRequests 
      : data.eventRequests;

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar activeService="Customer Bookings" />

      <main className="flex-1 lg:max-h-screen lg:overflow-y-auto p-4 lg:p-12 pb-24 lg:pb-12">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-[2rem] bg-blue-600 flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
                <FaClipboardList className="text-2xl" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Customer Bookings</h1>
                <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em] mt-1">Manage requests for your listings</p>
              </div>
            </div>
          </header>

          <div className="flex gap-2 p-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 mb-8 max-w-xl shadow-sm overflow-x-auto">
            <button
              onClick={() => setActiveTab('car')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest min-w-max ${
                activeTab === 'car' 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <FaCar /> Cars
            </button>
            <button
              onClick={() => setActiveTab('accommodation')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest min-w-max ${
                activeTab === 'accommodation' 
                  ? 'bg-emerald-600 text-white shadow-lg' 
                  : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <FaHome /> Spaces
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest min-w-max ${
                activeTab === 'events' 
                  ? 'bg-rose-500 text-white shadow-lg' 
                  : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <FaCalendarAlt /> Events
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : requests.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-20 text-center border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-300">
                <FaHistory className="text-4xl" />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">No bookings yet</h3>
              <p className="text-slate-500 text-sm font-bold">When customers book your {activeTab === 'car' ? 'cars' : 'spaces'}, they will appear here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {requests.map((req: any) => (
                <div key={req._id} className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm transition-all hover:shadow-xl hover:shadow-blue-500/5">
                  <div className="flex flex-col lg:flex-row">
                    {/* Item Info */}
                    <div className="lg:w-1/3 p-8 border-b lg:border-b-0 lg:border-r border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                      <div className="flex items-center gap-3 mb-6">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${
                            activeTab === 'car' ? 'bg-indigo-600' : 
                            activeTab === 'accommodation' ? 'bg-emerald-600' : 'bg-rose-500'
                        }`}>
                          {activeTab === 'car' ? <FaCar /> : activeTab === 'accommodation' ? <FaHome /> : <FaCalendarAlt />}
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Listing Details</span>
                      </div>
                      <h3 className="text-xl font-black text-slate-900 dark:text-white mb-4 line-clamp-2">{req.title}</h3>
                      <div className="space-y-3">
                        {req.price && (
                          <p className="text-[13px] font-bold text-slate-600 dark:text-slate-400 flex items-center gap-2">
                            <FaDollarSign className="text-blue-500" /> AUD {req.price} {activeTab === 'car' ? '/ day' : '/ wk'}
                          </p>
                        )}
                        {req.date && (
                          <p className="text-[13px] font-bold text-slate-600 dark:text-slate-400 flex items-center gap-2">
                            <FaCalendarAlt className="text-rose-500" /> {req.date}
                          </p>
                        )}
                        {req.location && (
                          <p className="text-[13px] font-bold text-slate-600 dark:text-slate-400 flex items-center gap-2">
                            <FaMapMarkerAlt className="text-blue-500" /> {req.location}
                          </p>
                        )}
                        <div className={`mt-6 px-4 py-2 rounded-xl inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${
                          req.status === 'APPROVED' || req.status === 'REGISTERED' ? 'bg-emerald-500/10 text-emerald-500' : 
                          req.status === 'REJECTED' ? 'bg-rose-500/10 text-rose-500' : 
                          'bg-amber-500/10 text-amber-500'
                        }`}>
                          <FaClock className="text-xs" /> {req.status}
                        </div>
                      </div>
                    </div>

                    {/* Customer Info */}
                    <div className="lg:w-2/3 p-8 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                            <FaUser />
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Customer Identity</span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-4">
                            <div>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Full Name</p>
                              <p className="text-sm font-black text-slate-900 dark:text-white">{req.userDetails?.name || 'Incomplete Profile'}</p>
                            </div>
                            <div>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Email Address</p>
                              <p className="text-sm font-bold text-blue-600 hover:underline cursor-pointer">{req.userDetails?.email || 'N/A'}</p>
                            </div>
                          </div>
                          <div className="space-y-4">
                            <div>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Phone Contact</p>
                              <p className="text-sm font-black text-slate-900 dark:text-white">{req.userDetails?.phone || 'Not Provided'}</p>
                            </div>
                            <div>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Booking Date</p>
                              <p className="text-sm font-bold text-slate-600 dark:text-slate-400 flex items-center gap-2">
                                <FaCalendarAlt className="text-blue-500" />
                                {new Date(req.createdAt).toLocaleDateString()} at {new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-8 pt-8 border-t border-slate-50 dark:border-slate-800/50 flex flex-wrap gap-4">
                        <button 
                           onClick={() => window.location.href = `mailto:${req.userDetails?.email}`}
                           className="px-6 py-3 bg-slate-900 dark:bg-slate-800 text-white dark:text-slate-300 rounded-xl font-black text-[11px] uppercase tracking-[0.15em] flex items-center gap-2 hover:bg-slate-800 dark:hover:bg-slate-700 transition-all"
                        >
                          <FaEnvelope /> Email Customer
                        </button>
                        {req.userDetails?.phone && (
                          <button 
                            onClick={() => window.location.href = `tel:${req.userDetails?.phone}`}
                            className="px-6 py-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 rounded-xl font-black text-[11px] uppercase tracking-[0.15em] flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                          >
                            <FaPhone /> Call Customer
                          </button>
                        )}
                        <div className="flex-1" />
                        <div className="flex items-center gap-3">
                          {activeTab !== 'events' && (
                            <span className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl ${
                                req.paymentStatus === 'PAID' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                            }`}>
                                {req.paymentStatus === 'PAID' ? 'Payment Verified' : 'Awaiting Payment'}
                            </span>
                          )}
                          
                          {(req.status === 'PENDING_PAYMENT' || (activeTab === 'events' && req.status === 'REGISTERED')) && (
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleStatusUpdate(req._id, 'APPROVED')}
                                    className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-700 transition-all"
                                >
                                    Approve
                                </button>
                                <button
                                    onClick={() => handleStatusUpdate(req._id, 'REJECTED')}
                                    className="px-4 py-2 bg-rose-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-700 transition-all"
                                >
                                    Reject
                                </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
