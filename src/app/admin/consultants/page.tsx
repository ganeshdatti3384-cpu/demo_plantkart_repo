"use client";
import React, { useEffect, useState } from 'react';
import { FaUserTie, FaCheck, FaTimes, FaEye, FaAddressCard, FaInfoCircle, FaFileAlt, FaToggleOn, FaToggleOff, FaEdit } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

export default function AdminConsultantManager() {
  const [pending, setPending] = useState([]);
  const [active, setActive] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [activeTab, setActiveTab] = useState('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resPend, resAct] = await Promise.all([
        fetch('/api/admin/consultants/pending'),
        fetch('/api/api/consultants') // Reusing public listing or specialized admin route
      ]);
      const pendData = await resPend.json();
      const actData = await resAct.json();
      setPending(Array.isArray(pendData) ? pendData : []);
      setActive(Array.isArray(actData) ? actData : []);
    } catch (e) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/consultants/${id}/approve`, { method: 'PUT' });
      if (res.ok) {
        toast.success('Consultant approved!');
        fetchData();
        setShowModal(false);
      }
    } catch (e) { toast.error('Approval failed'); }
  };

  const handleReject = async (id: string) => {
    if (!rejectReason) return toast.error('Please provide a reason');
    try {
      const res = await fetch(`/api/admin/consultants/${id}/reject`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: rejectReason })
      });
      if (res.ok) {
        toast.success('Consultant rejected');
        fetchData();
        setShowModal(false);
        setRejectReason('');
      }
    } catch (e) { toast.error('Rejection failed'); }
  };

  const toggleConsultantLive = async (id: string, currentLive: boolean) => {
    try {
      const res = await fetch(`/api/admin/consultants/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isLive: !currentLive })
      });
      if (res.ok) {
        toast.success('Status updated');
        fetchData();
      }
    } catch (e) { toast.error('Toggle failed'); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this consultant?')) return;
    try {
      const res = await fetch(`/api/admin/consultants/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Consultant deleted');
        fetchData();
      }
    } catch (e) { toast.error('Delete failed'); }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/admin/consultants/${editingItem._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingItem)
      });
      if (res.ok) {
        toast.success('Consultant updated');
        setShowEditModal(false);
        fetchData();
      }
    } catch (e) { toast.error('Update failed'); }
  };

  const filteredData = (activeTab === 'pending' ? pending : active).filter((item: any) => 
    item.userId?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.specialization?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.userId?.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <header className="mb-8 lg:flex items-center justify-between gap-8 bg-slate-900/40 border border-white/5 p-8 rounded-[2.5rem] text-white">
        <div>
          <h1 className="text-2xl font-black text-white mb-1 flex items-center gap-3 tracking-tight">
            <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center text-white text-lg shadow-lg shadow-purple-500/20">
              <FaUserTie />
            </div>
            Consultant Command Center
          </h1>
          <p className="text-slate-400 text-sm font-bold italic">Review applications, moderate visibility, and verify credentials.</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search specialists..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-800/50 border border-white/10 rounded-2xl px-6 py-2 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 w-64"
            />
          </div>
          <div className="flex bg-slate-800/50 p-1 rounded-2xl border border-white/5">
            <button 
              onClick={() => setActiveTab('pending')}
              className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'pending' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-500 hover:text-white'}`}
            >
              Pending {pending.length > 0 && <span className="ml-2 bg-rose-500 text-white px-2 py-0.5 rounded-full text-[8px]">{pending.length}</span>}
            </button>
            <button 
              onClick={() => setActiveTab('active')}
              className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'active' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-500 hover:text-white'}`}
            >
              Verified {active.length > 0 && <span className="ml-2 bg-slate-700 text-white px-2 py-0.5 rounded-full text-[8px]">{active.length}</span>}
            </button>
          </div>
        </div>
      </header>

      <div className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] overflow-hidden">
        {loading ? (
          <div className="p-20 text-center">
            <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-500 font-black uppercase tracking-widest text-xs">Vetting Service Providers...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 bg-white/5">
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Identity</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Focus Area</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Experience</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredData.map((item: any) => (
                  <tr key={item._id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-black text-purple-500 border border-white/10 text-xs">
                          {item.userId?.name?.charAt(0) || 'C'}
                        </div>
                        <div>
                          <p className="font-black text-white text-sm">{item.userId?.name || 'Unknown'}</p>
                          <p className="text-[10px] font-bold text-slate-500 truncate max-w-[200px]">{item.description?.substring(0, 40)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-black text-white uppercase tracking-widest bg-slate-800 px-3 py-1 rounded-full border border-white/5">
                        {item.specialization || 'General'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.experienceYears || 0} Years Exp</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => { setSelected(item); setShowModal(true); }}
                          className="p-2 bg-blue-600/10 hover:bg-blue-600/20 text-blue-500 rounded-lg transition-colors"
                          title="View & Moderate"
                        >
                          <FaEye className="size-4" />
                        </button>
                        <button 
                          onClick={() => { setEditingItem(item); setShowEditModal(true); }}
                          className="p-2 bg-amber-600/10 hover:bg-amber-600/20 text-amber-500 rounded-lg transition-colors"
                          title="Edit Profile"
                        >
                          <FaEdit className="size-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(item._id)}
                          className="p-2 bg-rose-600/10 hover:bg-rose-600/20 text-rose-500 rounded-lg transition-colors"
                          title="Delete Profile"
                        >
                          <FaTimes className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredData.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-20 text-center">
                      <p className="text-slate-500 font-black uppercase tracking-[0.2em] text-[10px]">No consultants found in this category.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showModal && selected && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xl z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-10">
              <div className="flex justify-between items-start mb-8">
                <div>
                   <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Review Application</h2>
                   <div className="flex gap-2">
                     <span className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-[10px] font-black uppercase">Pending Review</span>
                     <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-black uppercase">{selected.userId?.email || selected.email}</span>
                   </div>
                </div>
                <button onClick={() => setShowModal(false)} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-slate-400 hover:text-rose-500 transition-all">
                  <FaTimes size={18} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-8 mb-10">
                 <div className="space-y-6">
                    <div>
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Expertise & Bio</label>
                       <p className="text-sm font-bold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl min-h-[100px]">
                         {selected.bio || "No biography provided by applicant."}
                       </p>
                    </div>
                    <div className="flex items-center gap-4">
                       <div className="flex-1 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl text-center">
                          <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Experience</p>
                          <p className="text-lg font-black text-slate-900 dark:text-white">{selected.experience} Yrs</p>
                       </div>
                       <div className="flex-1 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl text-center">
                          <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Pricing</p>
                          <p className="text-lg font-black text-slate-900 dark:text-white">${selected.price}</p>
                       </div>
                    </div>
                 </div>

                 <div className="space-y-6">
                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Supporting Documents</label>
                        <div className="p-4 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-center">
                           <FaFileAlt className="mx-auto text-slate-300 mb-2 size-8" />
                           <p className="text-[10px] font-black text-slate-400 uppercase mb-3">No docs uploaded</p>
                           <button className="text-[10px] font-black text-blue-600 hover:underline">VERIFY LINKEDIN</button>
                        </div>
                    </div>
                    <div>
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Rejection Reason (Internal)</label>
                       <textarea 
                         className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 text-xs font-bold focus:ring-2 ring-rose-500/20 h-24"
                         placeholder="Explain why this application is being rejected..."
                         value={rejectReason}
                         onChange={e => setRejectReason(e.target.value)}
                       />
                    </div>
                 </div>
              </div>

              <div className="flex gap-4">
                 <button 
                   onClick={() => handleReject(selected._id)}
                   className="flex-1 py-4 bg-white dark:bg-slate-800 border-2 border-rose-500 text-rose-500 rounded-2xl font-black text-xs hover:bg-rose-50 transition-all flex items-center justify-center gap-2"
                 >
                   <FaTimes /> REJECT APPLICATION
                 </button>
                 <button 
                    onClick={() => handleApprove(selected._id)}
                    className="flex-[2] py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs shadow-xl shadow-emerald-500/30 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
                 >
                   <FaCheck /> APPROVE & ENABLE DASHBOARD
                 </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingItem && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xl z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <form onSubmit={handleUpdate} className="p-10">
              <div className="flex justify-between items-start mb-8">
                <div>
                   <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Edit Professional Profile</h2>
                   <p className="text-slate-500 text-xs font-bold">Update credentials and service parameters for {editingItem.userId?.name}</p>
                </div>
                <button type="button" onClick={() => setShowEditModal(false)} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-slate-400 hover:text-rose-500 transition-all">
                  <FaTimes size={18} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Specialization</label>
                  <input 
                    type="text"
                    value={editingItem.specialization || ''}
                    onChange={(e) => setEditingItem({...editingItem, specialization: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 text-sm font-bold text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Experience (Years)</label>
                  <input 
                    type="number"
                    value={editingItem.experienceYears || ''}
                    onChange={(e) => setEditingItem({...editingItem, experienceYears: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 text-sm font-bold text-slate-900 dark:text-white"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Service Description</label>
                  <textarea 
                    value={editingItem.description || ''}
                    onChange={(e) => setEditingItem({...editingItem, description: e.target.value})}
                    rows={3}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 text-sm font-bold text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Consultation Fee</label>
                  <input 
                    type="number"
                    value={editingItem.consultationFee || ''}
                    onChange={(e) => setEditingItem({...editingItem, consultationFee: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 text-sm font-bold text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Contact Email</label>
                  <input 
                    type="email"
                    value={editingItem.email || ''}
                    onChange={(e) => setEditingItem({...editingItem, email: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 text-sm font-bold text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  type="submit"
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-black uppercase tracking-widest py-4 rounded-3xl transition-all shadow-lg shadow-purple-500/20 text-xs"
                >
                  Apply Changes
                </button>
                <button 
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-8 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-black uppercase tracking-widest py-4 rounded-3xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all text-xs"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
