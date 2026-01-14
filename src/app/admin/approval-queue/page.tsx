"use client";
import React, { useEffect, useState } from 'react';
import { FaCheckCircle, FaTimesCircle, FaList, FaSpinner } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function AdminApprovalQueue() {
  const [queue, setQueue] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchQueue();
  }, []);

  const fetchQueue = async () => {
    setLoading(true);
    try {
      const [accommodations, cars, pickups, consultants] = await Promise.all([
        fetch('/api/admin/accommodation/pending').then(r => r.json()),
        fetch('/api/admin/car/pending').then(r => r.json()),
        fetch('/api/admin/airport-pickup/requests').then(r => r.json()),
        fetch('/api/consultant/booking/requests').then(r => r.json()),
      ]);

      const unified = [
        ...(accommodations || []).map(a => ({ ...a, module: 'accommodation', type: 'Accommodation' })),
        ...(cars || []).map(c => ({ ...c, module: 'car', type: 'Car' })),
        ...(pickups || []).filter((p: any) => p.status === 'PENDING').map((p: any) => ({ ...p, module: 'pickup', type: 'Pickup' })),
        ...(consultants || []).filter((c: any) => c.status === 'REQUEST_SENT').map((c: any) => ({ ...c, module: 'consultant', type: 'Consultant Booking' }))
      ];

      setQueue(unified);
    } catch (err) {
      toast.error('Failed to load queue');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (item: any) => {
    const endpoints: Record<string, string> = {
      accommodation: `/api/admin/accommodation/${item._id}/approve`,
      car: `/api/admin/car/${item._id}/approve`,
      pickup: `/api/admin/airport-pickup/${item._id}`,
      consultant: `/api/consultant/booking/${item._id}/approve`
    };

    const endpoint = endpoints[item.module];
    if (!endpoint) return toast.error('Unknown module');

    const res = await fetch(endpoint, { method: 'PUT', body: JSON.stringify({}) });
    if (res.ok) {
      toast.success(`${item.type} approved`);
      fetchQueue();
    } else {
      toast.error('Failed to approve');
    }
  };

  const handleReject = async (item: any, reason?: string) => {
    const endpoints: Record<string, string> = {
      accommodation: `/api/admin/accommodation/${item._id}/reject`,
      car: `/api/admin/car/${item._id}/reject`,
      pickup: `/api/admin/airport-pickup/${item._id}`,
      consultant: `/api/consultant/booking/${item._id}/reject`
    };

    const endpoint = endpoints[item.module];
    if (!endpoint) return toast.error('Unknown module');

    const res = await fetch(endpoint, { method: 'PUT', body: JSON.stringify({ reason: reason || 'Admin rejection' }) });
    if (res.ok) {
      toast.success(`${item.type} rejected`);
      fetchQueue();
    } else {
      toast.error('Failed to reject');
    }
  };

  const filtered = queue.filter(q => filter === 'all' || q.module === filter);

  return (
    <div className="min-h-screen">
      <header className="mb-8 bg-slate-900/40 border border-white/5 p-8 rounded-[2.5rem] text-white">
        <h1 className="text-2xl font-black mb-2 flex items-center gap-3">
          <FaList /> Unified Approval Queue
        </h1>
        <p className="text-slate-400 text-sm font-bold italic">Manage pending approvals across all modules</p>
      </header>

      <div className="flex gap-4 mb-6">
        {['all','accommodation','car','pickup','consultant'].map(m => (
          <button
            key={m}
            onClick={() => setFilter(m)}
            className={`px-6 py-2 rounded-2xl font-bold text-xs uppercase ${
              filter === m ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 border border-white/5'
            }`}
          >
            {m === 'all' ? 'All' : m.charAt(0).toUpperCase() + m.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-96"><FaSpinner className="animate-spin text-4xl text-blue-600" /></div>
      ) : filtered.length === 0 ? (
        <div className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-20 text-center">
          <p className="text-slate-500 font-black uppercase tracking-widest text-xs">No pending items</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(item => (
            <div key={item._id} className="bg-slate-900/40 border border-white/5 p-6 rounded-[2rem] flex justify-between items-center hover:bg-white/5">
              <div>
                <p className="text-white font-black">{item.type}</p>
                <p className="text-slate-400 text-sm">{item.title || item.userName || item.makeModel || 'Item'}</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => handleApprove(item)}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-500 flex items-center gap-2"
                >
                  <FaCheckCircle /> Approve
                </button>
                <button
                  onClick={() => handleReject(item)}
                  className="px-4 py-2 bg-slate-800 text-slate-400 rounded-xl text-xs font-bold border border-white/5 hover:bg-slate-700"
                >
                  <FaTimesCircle className="inline mr-2" /> Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
