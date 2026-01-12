"use client";
import React, { useEffect, useState } from 'react';
import { FaMoneyBillWave, FaChartLine, FaCheckCircle, FaClock, FaTimesCircle, FaSearch, FaFilter, FaArrowRight, FaCreditCard, FaEdit, FaTimes } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [editingItem, setEditingItem] = useState<any>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/payments?status=${statusFilter}`);
      const data = await res.json();
      setPayments(Array.isArray(data) ? data : []);
    } catch (e) {
      toast.error('Failed to load payments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [statusFilter]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/admin/payments/${editingItem._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingItem)
      });
      if (res.ok) {
        toast.success('Payment updated successfully');
        setShowEditModal(false);
        fetchPayments();
      }
    } catch (e) { toast.error('Update failed'); }
  };

  const filteredPayments = payments.filter((p: any) => 
    p.transactionId?.toLowerCase().includes(search.toLowerCase()) || 
    p.paymentId?.toLowerCase().includes(search.toLowerCase())
  );

  const totalRevenue = payments
    .filter((p: any) => p.status === 'COMPLETED')
    .reduce((acc, curr: any) => acc + (curr.amount || 0), 0);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to purge this transaction record? This cannot be undone.')) return;
    try {
      const res = await fetch(`/api/admin/payments/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Payment record purged');
        fetchPayments();
      }
    } catch (e) { toast.error('Purge failed'); }
  };

  return (
    <>
      <header className="mb-8 lg:flex items-center justify-between gap-8 bg-slate-900/40 border border-white/5 p-8 rounded-[2.5rem] text-white">
        <div>
          <h1 className="text-2xl font-black text-white mb-1 flex items-center gap-3 tracking-tight">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-lg shadow-lg shadow-indigo-500/20">
              <FaCreditCard />
            </div>
            Financial Ledger
          </h1>
          <p className="text-slate-400 text-sm font-bold italic">Monitor transaction flows, reconcile revenue, and verify settlements.</p>
        </div>
        
        <div className="flex bg-slate-800/50 p-6 rounded-3xl border border-white/5 items-center gap-6">
           <div className="text-center border-r border-white/10 pr-6">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Gross Revenue</p>
              <p className="text-xl font-black text-white tracking-tighter">${totalRevenue.toLocaleString()}</p>
           </div>
           <div className="text-center">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Settled Trans.</p>
              <p className="text-xl font-black text-emerald-500 tracking-tighter">{payments.filter((p:any)=>p.status==='SETTLED').length}</p>
           </div>
        </div>
      </header>

      <div className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] overflow-hidden">
        {loading ? (
          <div className="p-20 text-center">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-500 font-black uppercase tracking-widest text-xs">Auditing Transaction Vault...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 bg-white/5">
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Transaction ID</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Service Category</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Value (USD)</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Clearance</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredPayments.map((p: any) => (
                  <tr key={p._id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <p className="text-white font-black text-xs font-mono">{p.paymentId || 'P-8231...'}</p>
                      <p className="text-[9px] font-bold text-slate-500 uppercase">{new Date(p.createdAt).toLocaleDateString()}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/10">
                        {p.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                       <p className="text-sm font-black text-white">${p.amount?.toLocaleString()}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${
                        p.status === 'SETTLED' || p.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-500' :
                        p.status === 'VOIDED' || p.status === 'FAILED' ? 'bg-rose-500/20 text-rose-500' :
                        'bg-amber-500/20 text-amber-500'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <div className="flex items-center justify-end gap-3">
                         <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Req: {p.requestId?.substring(0, 8)}</p>
                         <button 
                          onClick={() => { setEditingItem(p); setShowEditModal(true); }}
                          className="p-2 bg-amber-600/10 hover:bg-amber-600/20 text-amber-500 rounded-lg transition-all"
                          title="Edit Payment"
                         >
                           <FaEdit className="size-3.5" />
                         </button>
                         <button 
                          onClick={() => handleDelete(p._id)}
                          className="p-2 hover:bg-rose-600/20 text-slate-500 hover:text-rose-500 rounded-lg transition-all"
                          title="Purge Record"
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
                  <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Refine Financial Entry</h2>
                  <p className="text-slate-500 text-xs font-bold">Transaction ID: {editingItem.transactionId || editingItem.paymentId}</p>
                </div>
                <button type="button" onClick={() => setShowEditModal(false)} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-slate-400 hover:text-rose-500 transition-all">
                  <FaTimes size={18} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Service Type</label>
                  <input 
                    type="text"
                    value={editingItem.type || ''}
                    onChange={(e) => setEditingItem({...editingItem, type: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 text-sm font-bold text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Currency Value (USD)</label>
                  <input 
                    type="number"
                    value={editingItem.amount || ''}
                    onChange={(e) => setEditingItem({...editingItem, amount: Number(e.target.value)})}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 text-sm font-bold text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Clearance Status</label>
                  <select 
                    value={editingItem.status || ''}
                    onChange={(e) => setEditingItem({...editingItem, status: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 text-sm font-bold text-slate-900 dark:text-white appearance-none"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="COMPLETED">COMPLETED</option>
                    <option value="SETTLED">SETTLED</option>
                    <option value="FAILED">FAILED</option>
                    <option value="VOIDED">VOIDED</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Internal Remarks</label>
                  <textarea 
                    value={editingItem.notes || ''}
                    onChange={(e) => setEditingItem({...editingItem, notes: e.target.value})}
                    rows={3}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 text-sm font-bold text-slate-900 dark:text-white"
                    placeholder="Reference logs, settlement notes..."
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-widest py-4 rounded-3xl transition-all shadow-lg shadow-indigo-500/20 text-xs">
                  Update Ledger
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
