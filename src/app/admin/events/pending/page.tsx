"use client";
import React, { useEffect, useState } from 'react';
import { FaCalendarAlt, FaCheck, FaTimes, FaMapMarkerAlt, FaUsers } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

export default function AdminPendingEvents() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/events/pending');
    const data = await res.json();
    setItems(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  const handleAction = async (id: string, action: string) => {
    const reason = action === 'reject' ? prompt('Reason for rejection:') : null;
    const res = await fetch(`/api/admin/events/${id}/${action}`, { 
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason })
    });
    if (res.ok) {
      toast.success(`Event ${action}ed`);
      fetchItems();
    }
  };

  const filteredItems = items.filter((item: any) => 
    item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const styles = {
      PENDING: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
      APPROVED: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
      REJECTED: 'bg-rose-500/10 text-rose-500 border-rose-500/20'
    };
    return styles[status] || styles.PENDING;
  };

  return (
    <div className="min-h-screen">
      <header className="mb-8 lg:flex items-center justify-between gap-8 bg-slate-900/40 border border-white/5 p-8 rounded-[2.5rem] text-white">
        <div>
          <h1 className="text-2xl font-black text-white mb-1 flex items-center gap-3 tracking-tight">
            <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center text-white text-lg shadow-lg shadow-purple-500/20">
              <FaCalendarAlt />
            </div>
            Events Moderation
          </h1>
          <p className="text-slate-400 text-sm font-bold italic">Review and approve community events for students.</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-800/50 border border-white/10 rounded-2xl px-6 py-2 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 w-64"
            />
          </div>
        </div>
      </header>

      {loading ? (
        <div className="p-20 text-center">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500 font-black uppercase tracking-widest text-xs">Fetching Events...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-20 text-center">
          <p className="text-slate-500 font-black uppercase tracking-[0.2em] text-[10px]">No events matching your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredItems.map((item: any) => (
            <div key={item._id} className="bg-slate-900/40 border border-white/5 p-6 rounded-[2rem] flex flex-col md:flex-row gap-6 items-center hover:bg-white/5 transition-all group">
              {item.image && <img src={item.image} className="w-full md:w-48 h-32 object-cover rounded-2xl shadow-xl" alt="" />}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2 py-0.5 text-[8px] font-black uppercase tracking-widest rounded-full border ${getStatusBadge(item.status)}`}>
                    {item.status}
                  </span>
                  <h3 className="text-lg font-black text-white">{item.title}</h3>
                </div>
                <div className="flex flex-wrap gap-4 text-[10px] font-bold text-slate-500">
                  <span className="flex items-center gap-1.5"><FaMapMarkerAlt className="text-slate-400" /> {item.location}</span>
                  <span className="flex items-center gap-1.5"><FaUsers className="text-slate-400" /> Capacity: {item.capacity}</span>
                  <span className="flex items-center gap-1.5 text-slate-400 italic">By: {item.vendorEmail}</span>
                  <span className="flex items-center gap-1.5 text-slate-400">Date: {new Date(item.date).toLocaleDateString()}</span>
                </div>
              </div>
              {item.status === 'PENDING' && (
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleAction(item._id, 'approve')} 
                    className="px-6 py-3 bg-emerald-600 shadow-lg shadow-emerald-500/20 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 transition-all flex items-center gap-2"
                  >
                    <FaCheck /> Approve
                  </button>
                  <button 
                    onClick={() => handleAction(item._id, 'reject')} 
                    className="px-6 py-3 bg-slate-800 hover:bg-rose-600 text-slate-400 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/5"
                  >
                    <FaTimes /> Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
