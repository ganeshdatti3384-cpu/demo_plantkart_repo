"use client";
import React, { useEffect, useState } from 'react';
import { FaCalendarCheck, FaUser, FaUserTie, FaLink, FaClock, FaCheckCircle, FaExclamationTriangle, FaTimesCircle, FaEdit, FaTimes } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingItem, setEditingItem] = useState<any>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/consultants/bookings');
      const data = await res.json();
      setBookings(Array.isArray(data) ? data : []);
    } catch { toast.error('Failed to load bookings'); }
    setLoading(false);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/admin/consultants/bookings/${editingItem._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingItem)
      });
      if (res.ok) {
        toast.success('Booking adjusted successfully');
        setShowEditModal(false);
        fetchBookings();
      }
    } catch (e) { toast.error('Update failed'); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this booking?')) return;
    try {
      const res = await fetch(`/api/admin/consultants/bookings/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Booking removed');
        fetchBookings();
      }
    } catch (e) { toast.error('Operation failed'); }
  };

  const filteredBookings = bookings.filter((b: any) => 
    b.userId?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.consultantId?.userId?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.serviceType?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <header className="mb-8 lg:flex items-center justify-between gap-8 bg-slate-900/40 border border-white/5 p-8 rounded-[2.5rem] text-white">
        <div>
          <h1 className="text-2xl font-black text-white mb-1 flex items-center gap-3 tracking-tight">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white text-lg shadow-lg shadow-blue-500/20">
              <FaCalendarCheck />
            </div>
            Global Booking Registry
          </h1>
          <p className="text-slate-400 text-sm font-bold italic">Track consultant sessions, meeting progress, and service completion.</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative">
             <input 
              type="text" 
              placeholder="Search by participant or service..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-800/50 border border-white/10 rounded-2xl px-6 py-2 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 w-64"
            />
          </div>
          <div className="flex bg-slate-800/50 p-1 rounded-2xl border border-white/5">
             <div className="flex items-center gap-2 px-6 py-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest leading-none">Meetings Live</span>
             </div>
          </div>
        </div>
      </header>

      <div className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] overflow-hidden">
        {loading ? (
          <div className="p-20 text-center">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-500 font-black uppercase tracking-widest text-xs">Querying Global Calendar...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 bg-white/5">
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Participants</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Service Focus</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Scheduled Time</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Status</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Reference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredBookings.map((booking: any) => (
                  <tr key={booking._id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-[8px] font-black text-white">U</div>
                          <span className="text-white font-black text-xs">{booking.userId?.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center text-[8px] font-black text-white">C</div>
                          <span className="text-slate-400 font-bold text-[10px]">{booking.consultantId?.userId?.name || 'Assigned'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-black text-white uppercase tracking-widest bg-slate-800 px-3 py-1 rounded-full border border-white/5">
                        {booking.serviceType || 'General'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                       <p className="text-white font-black text-xs">{new Date(booking.date).toLocaleDateString()}</p>
                       <p className="text-[9px] font-bold text-slate-500">{booking.timeSlot}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${
                        booking.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-500' :
                        booking.status === 'CANCELLED' ? 'bg-rose-500/20 text-rose-500' :
                        'bg-blue-500/20 text-blue-500'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <div className="flex items-center justify-end gap-3">
                         <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">ID: {booking._id?.substring(0, 8)}</p>
                         <button 
                          onClick={() => { setEditingItem(booking); setShowEditModal(true); }}
                          className="p-2 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 rounded-lg transition-all"
                          title="Reschedule Booking"
                         >
                           <FaEdit className="size-3.5" />
                         </button>
                         <button 
                          onClick={() => handleDelete(booking._id)}
                          className="p-2 hover:bg-rose-600/20 text-slate-500 hover:text-rose-500 rounded-lg transition-all"
                          title="Cancel Booking"
                         >
                           <FaTimesCircle className="size-3.5" />
                         </button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showEditModal && editingItem && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xl z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <form onSubmit={handleUpdate} className="p-10">
              <div className="flex justify-between items-start mb-8">
                <div>
                   <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Adjust Session</h2>
                   <p className="text-slate-500 text-xs font-bold">Client: {editingItem.userId?.name} | {editingItem.serviceType}</p>
                </div>
                <button type="button" onClick={() => setShowEditModal(false)} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-slate-400 hover:text-rose-500 transition-all">
                  <FaTimes size={18} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Scheduled Date</label>
                  <input 
                    type="date"
                    value={editingItem.date ? new Date(editingItem.date).toISOString().split('T')[0] : ''}
                    onChange={(e) => setEditingItem({...editingItem, date: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 text-sm font-bold text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Time Slot</label>
                  <input 
                    type="text"
                    value={editingItem.timeSlot || ''}
                    onChange={(e) => setEditingItem({...editingItem, timeSlot: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 text-sm font-bold text-slate-900 dark:text-white"
                    placeholder="e.g. 10:00 AM - 11:00 AM"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Session Status</label>
                  <select 
                    value={editingItem.status || ''}
                    onChange={(e) => setEditingItem({...editingItem, status: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 text-sm font-bold text-slate-900 dark:text-white appearance-none"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="COMPLETED">COMPLETED</option>
                    <option value="CANCELLED">CANCELLED</option>
                    <option value="NO_SHOW">NO_SHOW</option>
                  </select>
                </div>
                <div>
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Meeting Link (Optional)</label>
                   <input 
                    type="text"
                    value={editingItem.meetingLink || ''}
                    onChange={(e) => setEditingItem({...editingItem, meetingLink: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 text-sm font-bold text-slate-900 dark:text-white"
                  />
                </div>
                <div className="col-span-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Administrative Notes</label>
                    <textarea 
                    value={editingItem.notes || ''}
                    onChange={(e) => setEditingItem({...editingItem, notes: e.target.value})}
                    rows={3}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 text-sm font-bold text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest py-4 rounded-3xl transition-all shadow-lg shadow-blue-500/20 text-xs">
                  Reschedule & Save
                </button>
                <button type="button" onClick={() => setShowEditModal(false)} className="px-8 bg-slate-50 dark:bg-slate-800 text-slate-500 font-black uppercase tracking-widest py-4 rounded-3xl transition-all text-xs">
                  Discard
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
