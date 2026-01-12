"use client";
import React, { useEffect, useState } from 'react';
import { FaHistory, FaUserShield, FaClock, FaTools, FaDatabase } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AdminAuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selected, setSelected] = useState<any | null>(null);
  const [showModal, setShowModal] = useState(false);

  const fetchLogs = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/audit-logs');
    const data = await res.json();
    setLogs(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this log entry?')) return;
    try {
      const res = await fetch(`/api/admin/audit-logs/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Log deleted');
        fetchLogs();
      } else {
        const err = await res.json();
        toast.error(err.message || 'Operation failed');
      }
    } catch (e) { toast.error('Delete failed'); }
  };

  const filteredLogs = logs.filter((log: any) => 
    log.action?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.adminId?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getIcon = (action: string) => {
    if (action.includes('CLEANUP')) return <FaTrashAlt className="text-rose-500" />;
    if (action.includes('PAYMENT')) return <FaCreditCard className="text-emerald-500" />;
    if (action.includes('ACCEPTED') || action.includes('REJECTED')) return <FaTools className="text-blue-500" />;
    return <FaDatabase className="text-slate-500" />;
  };

  return (
    <>
      <header className="mb-8 lg:flex items-center justify-between gap-8 bg-slate-900/40 border border-white/5 p-8 rounded-[2.5rem] text-white">
      <ToastContainer />
        <div>
          <h1 className="text-2xl font-black text-white mb-1 flex items-center gap-3 tracking-tight">
            <div className="w-10 h-10 bg-slate-700 rounded-xl flex items-center justify-center text-white text-lg shadow-lg shadow-slate-500/20">
              <FaHistory />
            </div>
            Protocol Audit Logs
          </h1>
          <p className="text-slate-400 text-sm font-bold italic">Immutable record of platform modifications, security events, and administrative actions.</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative">
             <input 
              type="text" 
              placeholder="Search by action or executor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-800/50 border border-white/10 rounded-2xl px-6 py-2 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-slate-500/50 w-64"
            />
          </div>
          <div className="flex bg-slate-800/50 p-6 rounded-3xl border border-white/5 items-center gap-6">
             <div className="text-center">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Logs Cached</p>
                <p className="text-xl font-black text-white tracking-tighter">{logs.length}</p>
             </div>
          </div>
        </div>
      </header>

      <div className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] overflow-hidden">
        {loading ? (
          <div className="p-20 text-center">
            <div className="w-12 h-12 border-4 border-slate-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-500 font-black uppercase tracking-widest text-xs">Reconstructing Event Timeline...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 bg-white/5">
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Operation</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Executor</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Timestamp</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredLogs.map((log: any) => (
                  <tr key={log._id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-black text-white uppercase tracking-widest bg-slate-800 px-3 py-1 rounded-full border border-white/5">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-white font-black text-xs">{log.adminId?.name || 'System'}</p>
                      <p className="text-[9px] font-bold text-slate-500 italic">ID: {log.adminId?._id?.substring(0, 8) || 'GLOBAL'}</p>
                    </td>
                    <td className="px-6 py-4">
                       <p className="text-white font-black text-xs">{new Date(log.createdAt).toLocaleDateString()}</p>
                       <p className="text-[9px] font-bold text-slate-500">{new Date(log.createdAt).toLocaleTimeString()}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <div className="flex items-center justify-end gap-3">
                         <button 
                          onClick={() => { setSelected(log); setShowModal(true); }}
                          className="text-[9px] font-black text-blue-500 uppercase tracking-widest hover:underline"
                         >
                           Payload
                         </button>
                         <button 
                          onClick={() => handleDelete(log._id)}
                          className="p-2 hover:bg-rose-600/20 text-slate-500 hover:text-rose-500 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                          title="Purge Entry"
                         >
                           <FaTrashAlt className="size-3" />
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
    </>
  );
}

import { FaTrashAlt, FaCreditCard } from 'react-icons/fa';
