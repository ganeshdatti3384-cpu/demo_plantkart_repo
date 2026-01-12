"use client";
import React, { useEffect, useState } from 'react';
import { 
  FaPlaneArrival, FaCheck, FaTimes, FaMapMarkerAlt, 
  FaCalendarDay, FaUserGraduate, FaIdCard, FaPhone, 
  FaCarSide, FaUserAlt, FaEnvelope, FaGlobe, FaSuitcase,
  FaInfoCircle, FaTag, FaCheckCircle, FaCar, FaClock, FaHistory,
  FaFileAlt
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';

export default function AdminPickupRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'accept' | 'details' | 'driver'>('accept');
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  
  const [driverData, setDriverData] = useState({
    driverName: '',
    driverPhone: '',
    vehicleNumber: '',
    vehicleType: '',
    pickupPoint: '',
    adminNotes: ''
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/airport-pickup/requests');
    const data = await res.json();
    setRequests(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  const updateStatus = async (id: string, action: string, body = {}) => {
    const res = await fetch(`/api/admin/airport-pickup/${id}/${action.toLowerCase()}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (res.ok) {
      toast.success(`Request ${action.toLowerCase()}ed successfully!`);
      setShowModal(false);
      fetchRequests();
    } else {
      const err = await res.json();
      toast.error(err.message || 'Failed to update request');
    }
  };

  const handleAction = (req: any, type: 'accept' | 'details' | 'driver') => {
    setSelectedRequest(req);
    setModalType(type);
    if (type === 'accept' || type === 'driver') {
      setDriverData({
        driverName: req.driverName || '',
        driverPhone: req.driverPhone || '',
        vehicleNumber: req.vehicleNumber || '',
        vehicleType: req.vehicleType || '',
        pickupPoint: req.pickupPoint || '',
        adminNotes: req.adminNotes || ''
      });
    }
    setShowModal(true);
  };

  function setSelected(req: any) {
    setSelectedRequest(req);
    setModalType('details');
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this request?')) return;
    try {
      const res = await fetch(`/api/admin/airport-pickup/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Request deleted');
        fetchRequests();
      }
    } catch (e) { toast.error('Delete failed'); }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/admin/airport-pickup/${editingItem._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingItem)
      });
      if (res.ok) {
        toast.success('Request updated');
        setShowEditModal(false);
        fetchRequests();
      }
    } catch (e) { toast.error('Update failed'); }
  };

  const filteredRequests = requests.filter((req: any) => 
    req.userId?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    req.flightNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    req.userId?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    req.pickupLocation?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <header className="mb-8 lg:flex items-center justify-between gap-8 bg-slate-900/40 border border-white/5 p-8 rounded-[2.5rem] text-white">
        <div>
          <h1 className="text-2xl font-black text-white mb-1 flex items-center gap-3 tracking-tight">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white text-lg shadow-lg shadow-emerald-500/20">
              <FaPlaneArrival />
            </div>
            Logistic Operations
          </h1>
          <p className="text-slate-400 text-sm font-bold italic">Monitor flight arrivals, coordinate drivers, and verify completion.</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search by flight, name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-800/50 border border-white/10 rounded-2xl px-6 py-2 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 w-64"
            />
          </div>
          <div className="flex bg-slate-800/50 p-1 rounded-2xl border border-white/5">
           <div className="flex items-center gap-2 px-6 py-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest leading-none">Global Dispatch Active</span>
           </div>
          </div>
        </div>
      </header>

      <div className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] overflow-hidden mb-10">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 bg-white/5">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Subject</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Flight Details</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Logistics</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Status</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredRequests.map((req: any) => (
                <tr key={req._id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center font-black text-blue-500 border border-white/10 text-[10px]">
                        {req.userId?.name?.charAt(0) || 'P'}
                      </div>
                      <div>
                        <p className="font-black text-white text-xs">{req.userId?.name || 'Unknown'}</p>
                        <p className="text-[9px] font-bold text-slate-500">{req.userId?.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-white">
                      <FaHistory className="text-slate-500 size-3" />
                      <span className="text-[10px] font-black">{req.flightNumber}</span>
                    </div>
                    <p className="text-[9px] font-bold text-slate-500">{new Date(req.arrivalDate).toLocaleDateString()} @ {req.arrivalTime}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-white uppercase tracking-tighter"> {req.pickupLocation} </p>
                      <p className="text-[9px] font-bold text-slate-500 italic">To: {req.destination?.substring(0, 20)}...</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${
                      req.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-500' :
                      req.status === 'ACCEPTED' ? 'bg-blue-500/20 text-blue-500' :
                      'bg-amber-500/20 text-amber-500'
                    }`}>
                      {req.status === 'COMPLETED' && <FaCheckCircle className="size-2.5" />}
                      {req.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <button 
                        onClick={() => { setSelected(req); setModalType('details'); setShowModal(true); }}
                        className="p-2 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 rounded-lg transition-colors"
                        title="Manage Logistics"
                      >
                        <FaCar className="size-3.5" />
                      </button>
                      <button 
                        onClick={() => { setEditingItem(req); setShowEditModal(true); }}
                        className="p-2 bg-amber-600/10 hover:bg-amber-600/20 text-amber-500 rounded-lg transition-colors"
                        title="Edit Request"
                      >
                        <FaFileAlt className="size-3.5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(req._id)}
                        className="p-2 bg-rose-600/10 hover:bg-rose-600/20 text-rose-500 rounded-lg transition-colors"
                        title="Delete Request"
                      >
                        <FaTimes className="size-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Admin Modals */}
      {showModal && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[3rem] p-8 md:p-12 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto custom-scrollbar">
            
            {modalType === 'details' ? (
              <div className="space-y-10">
                <div className="flex items-center justify-between">
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white">Request Context</h3>
                  <button onClick={() => setShowModal(false)} className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white">
                    <FaTimes />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] flex items-center gap-2">
                       <FaUserAlt /> User Snapshot
                    </h4>
                    <div className="space-y-4 bg-slate-50/50 dark:bg-slate-800/30 p-6 rounded-3xl border border-slate-100 dark:border-slate-800">
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Name</p>
                        <p className="font-bold text-slate-900 dark:text-white">{selectedRequest.userFullName}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</p>
                        <p className="font-bold text-slate-900 dark:text-white">{selectedRequest.userEmail}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone</p>
                        <p className="font-bold text-slate-900 dark:text-white">{selectedRequest.userPhone}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nationality</p>
                          <p className="font-bold text-slate-900 dark:text-white">{selectedRequest.nationality}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">From</p>
                          <p className="font-bold text-slate-900 dark:text-white">{selectedRequest.currentCountry}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] flex items-center gap-2">
                       <FaPlaneArrival /> Flight Details
                    </h4>
                    <div className="space-y-4 bg-slate-50/50 dark:bg-slate-800/30 p-6 rounded-3xl border border-slate-100 dark:border-slate-800">
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Destination</p>
                        <p className="font-bold text-slate-900 dark:text-white">{selectedRequest.arrivalAirport}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</p>
                          <p className="font-bold text-slate-900 dark:text-white">{selectedRequest.arrivalDate}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Time</p>
                          <p className="font-bold text-slate-900 dark:text-white">{selectedRequest.arrivalTime}</p>
                        </div>
                      </div>
                      {selectedRequest.purposeOfVisit === 'Study' && (
                        <div className="p-4 bg-blue-100/30 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-900/30">
                          <p className="text-[9px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">Institution</p>
                          <p className="text-xs font-bold text-slate-900 dark:text-white">{selectedRequest.collegeName}</p>
                          <p className="text-[10px] text-slate-500">{selectedRequest.collegeCity}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">User Special Instructions</h4>
                  <div className="p-6 bg-amber-50 dark:bg-amber-900/10 rounded-3xl border border-amber-100 dark:border-amber-900/30">
                    <p className="text-sm italic text-slate-700 dark:text-slate-300">
                      {selectedRequest.specialInstructions || "No special instructions provided."}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                <div>
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-2">
                    {modalType === 'accept' ? 'Assign Driver' : 'Update Driver'}
                  </h3>
                  <p className="text-sm text-slate-500 font-medium">Entering driver details will mark this as Accepted and notify the user.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Driver Name</label>
                    <div className="relative">
                      <FaIdCard className="absolute left-5 top-1/2 -translate-y-1/2 text-blue-500" />
                      <input type="text" placeholder="John Doe" className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-bold dark:text-white" value={driverData.driverName} onChange={e => setDriverData({...driverData, driverName: e.target.value})} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Driver Phone</label>
                    <div className="relative">
                      <FaPhone className="absolute left-5 top-1/2 -translate-y-1/2 text-blue-500" />
                      <input type="text" placeholder="+61 4XX XXX XXX" className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-bold dark:text-white" value={driverData.driverPhone} onChange={e => setDriverData({...driverData, driverPhone: e.target.value})} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Vehicle License Plate</label>
                    <div className="relative">
                      <FaCarSide className="absolute left-5 top-1/2 -translate-y-1/2 text-blue-500" />
                      <input type="text" placeholder="ABC-123" className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-bold dark:text-white" value={driverData.vehicleNumber} onChange={e => setDriverData({...driverData, vehicleNumber: e.target.value})} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Vehicle Type</label>
                    <div className="relative">
                      <FaCar className="absolute left-5 top-1/2 -translate-y-1/2 text-blue-500" />
                      <input type="text" placeholder="Toyota Camry (White)" className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-bold dark:text-white" value={driverData.vehicleType} onChange={e => setDriverData({...driverData, vehicleType: e.target.value})} />
                    </div>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Meeting / Pickup Point</label>
                    <div className="relative">
                      <FaMapMarkerAlt className="absolute left-5 top-1/2 -translate-y-1/2 text-blue-500" />
                      <input type="text" placeholder="Arrival Hall B, Exit 4" className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-bold dark:text-white" value={driverData.pickupPoint} onChange={e => setDriverData({...driverData, pickupPoint: e.target.value})} />
                    </div>
                  </div>
                   <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Admin Notes (Internal)</label>
                    <textarea placeholder="Any additional notes for the driver or user..." className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-bold dark:text-white resize-none" rows={2} value={driverData.adminNotes} onChange={e => setDriverData({...driverData, adminNotes: e.target.value})}></textarea>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button onClick={() => setShowModal(false)} className="flex-1 py-5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all">
                    Cancel
                  </button>
                  <button 
                    onClick={() => updateStatus(selectedRequest._id, modalType === 'accept' ? 'ACCEPT' : 'DRIVER', driverData)}
                    className="flex-1 py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-3xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/20 transition-all"
                  >
                    Save & Notify User
                  </button>
                </div>
              </div>
            )}
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
                   <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Edit Flight Request</h2>
                   <p className="text-slate-500 text-xs font-bold">Modify schedule or location details for {editingItem.userId?.name}</p>
                </div>
                <button type="button" onClick={() => setShowEditModal(false)} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-slate-400 hover:text-rose-500 transition-all">
                  <FaTimes size={18} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Flight Number</label>
                  <input 
                    type="text"
                    value={editingItem.flightNumber || ''}
                    onChange={(e) => setEditingItem({...editingItem, flightNumber: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 text-sm font-bold text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Pickup Location</label>
                  <input 
                    type="text"
                    value={editingItem.pickupLocation || ''}
                    onChange={(e) => setEditingItem({...editingItem, pickupLocation: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 text-sm font-bold text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Arrival Date</label>
                  <input 
                    type="date"
                    value={editingItem.arrivalDate ? new Date(editingItem.arrivalDate).toISOString().split('T')[0] : ''}
                    onChange={(e) => setEditingItem({...editingItem, arrivalDate: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 text-sm font-bold text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Arrival Time</label>
                  <input 
                    type="time"
                    value={editingItem.arrivalTime || ''}
                    onChange={(e) => setEditingItem({...editingItem, arrivalTime: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 text-sm font-bold text-slate-900 dark:text-white"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Drop-off Destination</label>
                  <input 
                    type="text"
                    value={editingItem.destination || ''}
                    onChange={(e) => setEditingItem({...editingItem, destination: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 text-sm font-bold text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  type="submit"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-widest py-4 rounded-3xl transition-all shadow-lg shadow-emerald-500/20 text-xs"
                >
                  Update Request
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
