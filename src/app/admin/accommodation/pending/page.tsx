"use client";
import React, { useEffect, useState } from 'react';
import { FaHotel, FaCheck, FaTimes, FaMapMarkerAlt, FaDollarSign, FaSearch, FaEdit, FaTrash, FaCheckCircle } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

export default function AdminPendingAccommodation() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingItem, setEditingItem] = useState<any>(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/accommodation/pending');
    const data = await res.json();
    setItems(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  const handleAction = async (id: string, action: string) => {
    const res = await fetch(`/api/admin/accommodation/${id}/${action}`, { method: 'PUT' });
    if (res.ok) {
      toast.success(`Property ${action}ed`);
      fetchItems();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this listing?')) return;
    const res = await fetch(`/api/admin/accommodation/${id}`, { method: 'DELETE' });
    if (res.ok) {
      toast.success('Property deleted');
      fetchItems();
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`/api/admin/accommodation/${editingItem._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingItem)
    });
    if (res.ok) {
      toast.success('Property updated');
      setEditingItem(null);
      fetchItems();
    }
  };

  const filteredItems = items.filter((item: any) => 
    item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen">
      <header className="mb-8 lg:flex items-center justify-between gap-8 bg-slate-900/40 border border-white/5 p-8 rounded-[2.5rem] text-white">
        <div>
          <h1 className="text-2xl font-black text-white mb-1 flex items-center gap-3 tracking-tight">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white text-lg shadow-lg shadow-blue-500/20">
              <FaHotel />
            </div>
            Property Curation
          </h1>
          <p className="text-slate-400 text-sm font-bold italic">Review and moderate residential listings for incoming students.</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search properties..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-800/50 border border-white/10 rounded-2xl px-6 py-2 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 w-64"
            />
          </div>
        </div>
      </header>

      {loading ? (
        <div className="p-20 text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500 font-black uppercase tracking-widest text-xs">Fetching Listings...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-20 text-center">
          <p className="text-slate-500 font-black uppercase tracking-[0.2em] text-[10px]">No pending properties matching your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredItems.map((item: any) => (
            <div key={item._id} className="bg-slate-900/40 border border-white/5 p-6 rounded-[2rem] flex flex-col md:flex-row gap-6 items-center hover:bg-white/5 transition-all group">
              <img src={item.image} className="w-full md:w-48 h-32 object-cover rounded-2xl shadow-xl" alt="" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 bg-amber-500/10 text-amber-500 text-[8px] font-black uppercase tracking-widest rounded-full border border-amber-500/20">Pending</span>
                  <h3 className="text-lg font-black text-white">{item.title}</h3>
                </div>
                <div className="flex flex-wrap gap-4 text-[10px] font-bold text-slate-500">
                  <span className="flex items-center gap-1.5"><FaMapMarkerAlt className="text-slate-400" /> {item.location}</span>
                  <span className="flex items-center gap-1.5 font-black text-blue-400 uppercase tracking-tighter"><FaDollarSign /> {item.price} / week</span>
                  <span className="flex items-center gap-1.5 text-slate-400 italic">By: {item.vendorId?.name || item.ownerType}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleAction(item._id, 'approve')} 
                  className="px-6 py-3 bg-emerald-600 shadow-lg shadow-emerald-500/20 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 transition-all flex items-center gap-2"
                >
                  <FaCheck /> Approve
                </button>
                <button 
                  onClick={() => setEditingItem(item)} 
                  className="p-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl border border-white/5 transition-all"
                >
                  <FaEdit />
                </button>
                <button 
                  onClick={() => handleDelete(item._id)} 
                  className="p-3 bg-slate-800 hover:bg-rose-600 text-white rounded-xl border border-white/5 transition-all"
                >
                  <FaTrash />
                </button>
                <button 
                  onClick={() => handleAction(item._id, 'reject')} 
                  className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/5"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xl z-[100] flex items-center justify-center p-4">
          <div className="bg-slate-900 w-full max-w-2xl rounded-[3rem] border border-white/10 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <form onSubmit={handleUpdate} className="p-10">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-2xl font-black text-white mb-2">Refine Listing Details</h2>
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest italic">{editingItem.title}</p>
                </div>
                <button type="button" onClick={() => setEditingItem(null)} className="p-3 bg-slate-800 rounded-2xl text-slate-400 hover:text-rose-500 transition-all">
                  <FaTimes size={18} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Property Name</label>
                  <input 
                    type="text"
                    value={editingItem.title || ''}
                    onChange={(e) => setEditingItem({...editingItem, title: e.target.value})}
                    className="w-full bg-slate-800 border border-white/5 rounded-2xl p-4 text-xs font-bold text-white focus:ring-2 focus:ring-blue-500/50 outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Price (Weekly)</label>
                  <input 
                    type="number"
                    value={editingItem.price || ''}
                    onChange={(e) => setEditingItem({...editingItem, price: e.target.value})}
                    className="w-full bg-slate-800 border border-white/5 rounded-2xl p-4 text-xs font-bold text-white focus:ring-2 focus:ring-blue-500/50 outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Location</label>
                  <input 
                    type="text"
                    value={editingItem.location || ''}
                    onChange={(e) => setEditingItem({...editingItem, location: e.target.value})}
                    className="w-full bg-slate-800 border border-white/5 rounded-2xl p-4 text-xs font-bold text-white focus:ring-2 focus:ring-blue-500/50 outline-none"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Description</label>
                  <textarea 
                    value={editingItem.description || ''}
                    onChange={(e) => setEditingItem({...editingItem, description: e.target.value})}
                    rows={4}
                    className="w-full bg-slate-800 border border-white/5 rounded-2xl p-4 text-xs font-bold text-white focus:ring-2 focus:ring-blue-500/50 outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest py-4 rounded-3xl transition-all shadow-lg shadow-blue-500/20 text-[10px]">
                  Save Changes
                </button>
                <button type="button" onClick={() => setEditingItem(null)} className="px-10 bg-slate-800 text-slate-400 font-black uppercase tracking-widest py-4 rounded-3xl transition-all text-[10px] border border-white/5">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

