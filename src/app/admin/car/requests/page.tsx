"use client";
import React, { useEffect, useState } from 'react';
import { 
  FaCar, FaCheck, FaTimes, FaMapMarkerAlt, 
  FaCalendarDay, FaUserAlt, FaEnvelope, FaPhone, 
  FaInfoCircle, FaCheckCircle, FaClock, FaHistory,
  FaFileAlt, FaSearch, FaTrash, FaDollarSign
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';

export default function AdminCarRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/car/requests');
      const data = await res.json();
      setRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, status: string, adminNotes: string = '') => {
    try {
      const res = await fetch(`/api/admin/car/requests/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, adminNotes })
      });
      if (res.ok) {
        toast.success(`Request ${status.toLowerCase()}ed`);
        setShowModal(false);
        fetchRequests();
      } else {
        toast.error('Failed to update status');
      }
    } catch (err) {
      toast.error('Something went wrong');
    }
  };

  const [adminNotes, setAdminNotes] = useState('');
  useEffect(() => {
    if (selectedRequest) setAdminNotes(selectedRequest.adminNotes || '');
  }, [selectedRequest]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this request?')) return;
    try {
      const res = await fetch(`/api/admin/car/requests/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Request deleted');
        fetchRequests();
      }
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  const filteredRequests = requests.filter((req: any) => 
    req.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    req.userDetails?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    req.userDetails?.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen p-4 md:p-8">
      <header className="mb-8 lg:flex items-center justify-between gap-8 bg-slate-900/40 border border-white/5 p-8 rounded-[2.5rem] text-white">
        <div>
          <h1 className="text-2xl font-black text-white mb-1 flex items-center gap-3 tracking-tight">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-lg shadow-lg shadow-indigo-500/20">
              <FaCar />
            </div>
            Car Rental Requests
          </h1>
          <p className="text-slate-400 text-sm font-bold italic">Manage user car rental and purchase applications.</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search by user or car..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-800/50 border border-white/10 rounded-2xl pl-12 pr-6 py-2.5 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 w-64"
            />
          </div>
        </div>
      </header>

      {loading ? (
        <div className="p-20 text-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500 font-black uppercase tracking-widest text-xs">Loading Applications...</p>
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-20 text-center text-white">
          <FaFileAlt className="text-4xl text-slate-700 mx-auto mb-4" />
          <p className="text-slate-500 font-black uppercase tracking-[0.2em] text-[10px]">No car rental requests found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredRequests.map((req: any) => (
            <div key={req._id} className="bg-slate-900/40 border border-white/5 p-6 rounded-[2rem] flex flex-col md:flex-row gap-6 items-center hover:bg-white/5 transition-all group">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                    req.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 
                    req.status === 'REJECTED' ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' : 
                    'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                  }`}>
                    {req.status || 'PENDING'}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                    req.paymentStatus === 'PAID' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-slate-500/10 text-slate-500 border border-white/5'
                  }`}>
                    {req.paymentStatus || 'UNPAID'}
                  </span>
                  <h3 className="text-lg font-black text-white">{req.title}</h3>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-slate-500 uppercase">Customer</p>
                    <p className="text-sm font-bold text-white flex items-center gap-2"><FaUserAlt className="text-indigo-400" /> {req.userDetails?.name || 'Unknown'}</p>
                    <p className="text-[10px] text-slate-400 truncate">{req.userDetails?.email}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-slate-500 uppercase">Amount</p>
                    <p className="text-sm font-black text-indigo-400 flex items-center gap-1"><FaDollarSign /> {req.price}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-slate-500 uppercase">Requested On</p>
                    <p className="text-sm font-bold text-white flex items-center gap-2"><FaCalendarDay className="text-slate-500" /> {new Date(req.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="space-y-1 text-right">
                     <button 
                        onClick={() => { setSelectedRequest(req); setShowModal(true); }}
                        className="text-[10px] font-black uppercase text-indigo-500 hover:text-white transition-colors"
                     >
                        View Full Details
                     </button>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                {req.status !== 'APPROVED' && (
                  <button 
                    onClick={() => handleStatusUpdate(req._id, 'APPROVED')} 
                    className="px-6 py-3 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500 transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/20"
                  >
                    <FaCheck /> Approve
                  </button>
                )}
                {req.status !== 'REJECTED' && (
                  <button 
                    onClick={() => handleStatusUpdate(req._id, 'REJECTED')} 
                    className="px-6 py-3 bg-slate-800 text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all border border-white/5"
                  >
                    Reject
                  </button>
                )}
                <button 
                  onClick={() => handleDelete(req._id)} 
                  className="p-3 bg-slate-800 hover:bg-rose-600 text-slate-500 hover:text-white rounded-xl border border-white/5 transition-all"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Details Modal */}
      {showModal && selectedRequest && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xl z-[100] flex items-center justify-center p-4">
          <div className="bg-slate-900 w-full max-w-2xl rounded-[3rem] border border-white/10 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 text-white">
            <div className="p-10">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-2xl font-black text-white mb-2">Request Details</h2>
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Order ID: {selectedRequest._id}</p>
                </div>
                <button onClick={() => setShowModal(false)} className="p-3 bg-slate-800 rounded-2xl text-slate-400 hover:text-rose-500 transition-all">
                  <FaTimes size={18} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-8 mb-10">
                <div className="space-y-4">
                  {selectedRequest.image && (
                    <div className="w-full h-32 rounded-2xl overflow-hidden mb-4 border border-white/5">
                      <img src={selectedRequest.image} alt="" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Vehicle</p>
                    <p className="text-lg font-black">{selectedRequest.title}</p>
                    <p className="text-xs text-slate-400">{selectedRequest.type || 'Rental'}</p>
                    {selectedRequest.specs && <p className="text-[10px] text-indigo-400 font-bold mt-1 uppercase tracking-tight">{selectedRequest.specs}</p>}
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">User Details</p>
                    <p className="font-bold">{selectedRequest.userDetails?.name}</p>
                    <p className="text-xs text-slate-400">{selectedRequest.userDetails?.email}</p>
                    <p className="text-xs text-slate-400">{selectedRequest.userDetails?.mobileAustralia}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Financials</p>
                    <p className="text-lg font-black text-indigo-400">${selectedRequest.price}</p>
                    <p className={`text-[10px] font-black uppercase ${selectedRequest.paymentStatus === 'PAID' ? 'text-emerald-500' : 'text-slate-500'}`}>
                      Payment: {selectedRequest.paymentStatus || 'UNPAID'}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Status</p>
                    <div className="flex items-center gap-2">
                       <div className={`w-2 h-2 rounded-full ${selectedRequest.status === 'APPROVED' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                       <p className="font-black uppercase text-xs">{selectedRequest.status || 'PENDING'}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Admin Internal Note / Message to User</label>
                 <textarea 
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Provide pickup location, driver details, or reason for rejection..."
                    className="w-full bg-slate-800 border border-white/5 rounded-2xl p-4 text-xs font-bold text-white focus:ring-2 focus:ring-indigo-500/50 outline-none resize-none"
                    rows={3}
                 />
              </div>

              <div className="flex gap-4">
                <button 
                   onClick={() => handleStatusUpdate(selectedRequest._id, 'APPROVED', adminNotes)}
                   className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-500/20"
                >
                  Approve Application
                </button>
                <button 
                  onClick={() => handleStatusUpdate(selectedRequest._id, 'REJECTED', adminNotes)}
                  className="flex-1 py-4 bg-slate-800 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-rose-600 transition-all"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
