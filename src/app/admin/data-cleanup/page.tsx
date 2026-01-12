"use client";
import React, { useState } from 'react';
import { FaTrashAlt, FaExclamationTriangle, FaCheckCircle, FaHistory, FaSearch } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

export default function AdminDataCleanup() {
  const [module, setModule] = useState('airport_pickup');
  const [preview, setPreview] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handlePreview = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/data-cleanup/preview?module=${module}`);
      const data = await res.json();
      setPreview(data);
    } catch (err) {
      toast.error('Failed to fetch preview');
    } finally {
      setLoading(false);
    }
  };

  const handleExecute = async () => {
    if (!confirm('Are you sure you want to delete these terminal records permanently?')) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/data-cleanup/execute?module=${module}`, { method: 'DELETE' });
      const data = await res.json();
      toast.success(`Successfully removed ${data[module]} records.`);
      setPreview(null);
    } catch (err) {
      toast.error('Cleanup execution failed');
    } finally {
      setLoading(false);
    }
  };

  async function handleCleanup(moduleName: string): Promise<void> {
    setModule(moduleName);
    setPreview(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/data-cleanup/preview?module=${moduleName}`);
      const data = await res.json();
      setPreview(data);
      setLoading(false);
      if (Object.keys(data).length === 0) {
        toast('No records found for cleanup.', { icon: 'ℹ️' });
        return;
      }
      if (confirm('Preview complete. Do you want to proceed with deletion?')) {
        setLoading(true);
        const execRes = await fetch(`/api/admin/data-cleanup/execute?module=${moduleName}`, { method: 'DELETE' });
        const execData = await execRes.json();
        toast.success(`Successfully removed ${execData[moduleName] ?? 0} records.`);
        setPreview(null);
      }
    } catch (err) {
      toast.error('Cleanup operation failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <header className="mb-8 lg:flex items-center justify-between gap-8 bg-slate-900/40 border border-white/5 p-8 rounded-[2.5rem] text-white">
        <div>
          <h1 className="text-2xl font-black text-white mb-1 flex items-center gap-3 tracking-tight">
            <div className="w-10 h-10 bg-rose-600 rounded-xl flex items-center justify-center text-white text-lg shadow-lg shadow-rose-500/20">
              <FaTrashAlt />
            </div>
            Platform Hygiene Manager
          </h1>
          <p className="text-slate-400 text-sm font-bold italic">Manual lifecycle management for terminal records and sensitive identifiers.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="bg-slate-900/40 border border-white/5 p-10 rounded-[2.5rem] relative overflow-hidden group hover:border-rose-500/30 transition-all">
          <div className="relative z-10 text-center">
            <div className="w-16 h-16 bg-rose-600/20 rounded-3xl flex items-center justify-center text-3xl text-rose-500 mx-auto mb-6">
              <FaTrashAlt />
            </div>
            <h2 className="text-xl font-black text-white mb-2 uppercase tracking-tight">Purge Logistic Logs</h2>
            <p className="text-xs font-bold text-slate-500 mb-8 px-6 leading-relaxed">
              Deletes all Airport Pickup requests marked as COMPLETED or CANCELLED that are older than 14 days. 
              <br/><span className="text-rose-500">This action is irreversible.</span>
            </p>
            <button 
              onClick={() => handleCleanup('logs')}
              disabled={loading}
              className="w-full py-4 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-rose-500/20 transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Execute Purge'}
            </button>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-600/5 rounded-full blur-2xl -mr-16 -mt-16" />
        </section>

        <section className="bg-slate-900/40 border border-white/5 p-10 rounded-[2.5rem] relative overflow-hidden group hover:border-blue-500/30 transition-all">
          <div className="relative z-10 text-center">
            <div className="w-16 h-16 bg-blue-600/20 rounded-3xl flex items-center justify-center text-3xl text-blue-500 mx-auto mb-6">
              <FaHistory />
            </div>
            <h2 className="text-xl font-black text-white mb-2 uppercase tracking-tight">Clean Audit History</h2>
            <p className="text-xs font-bold text-slate-500 mb-8 px-6 leading-relaxed">
              Archives and deletes system audit logs older than 30 days to optimize platform performance.
              <br/><span className="text-blue-500">Security event history will be truncated.</span>
            </p>
            <button 
              onClick={() => handleCleanup('audit')}
              disabled={loading}
              className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Trimming Records'}
            </button>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full blur-2xl -mr-16 -mt-16" />
        </section>
      </div>

      <div className="mt-8 p-8 bg-slate-900/60 border border-emerald-500/20 rounded-[2rem] flex items-center gap-6">
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 text-xl border border-emerald-500/20">
          <FaCheckCircle />
        </div>
        <div>
          <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] mb-1">System Health Recommendation</p>
          <p className="text-xs font-bold text-slate-400">Platform hygiene is currently within optimal parameters. No immediate action required.</p>
        </div>
      </div>
    </>
  );
}
