"use client";
import React, { useEffect, useState } from 'react';
import { FaBroom, FaHistory, FaShieldAlt, FaTrashAlt, FaDatabase, FaPlay, FaExclamationCircle, FaCheckCircle } from 'react-icons/fa';

export default function DataCleanupPage() {
  const [loading, setLoading] = useState(true);
  const [cleaning, setCleaning] = useState(false);
  const [counts, setCounts] = useState<any>({});
  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    fetchPreview();
  }, []);

  const fetchPreview = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/data-cleanup/preview');
    const data = await res.json();
    setCounts(data);
    setLoading(false);
  };

  const executeCleanup = async () => {
    if (!confirm('Are you sure you want to permanently delete these records?')) return;
    setCleaning(true);
    try {
      const res = await fetch('/api/admin/data-cleanup/execute', { method: 'DELETE' });
      const data = await res.json();
      setSummary(data);
      fetchPreview();
    } catch (err) {
      alert('Cleanup failed');
    } finally {
      setCleaning(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-2xl border border-red-100 dark:border-red-800">
              <FaBroom size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-black text-slate-900 dark:text-white">System Maintenance</h1>
              <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Administrative Data Retention Tool</p>
            </div>
          </div>
        </header>

        {summary && (
          <div className="mb-12 card bg-emerald-50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-800 animate-in zoom-in-95 duration-500">
            <h3 className="text-lg font-bold text-emerald-600 mb-4 flex items-center gap-2">
              <FaCheckCircle /> Cleanup Execution Summary
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(summary).map(([key, value]) => (
                <div key={key} className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm">
                  <p className="text-xs font-bold text-slate-400 capitalize">{key.replace('_', ' ')}</p>
                  <p className="text-2xl font-black text-slate-900 dark:text-white">{value as number}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          <div className="md:col-span-2 space-y-6">
            <div className="card shadow-2xl shadow-red-500/5">
              <h2 className="text-xl font-bold mb-6">Stale Data Preview (Older than 14 Days)</h2>
              <div className="space-y-4">
                {loading ? (
                  <div className="py-10 text-center"><div className="animate-spin h-8 w-8 border-b-2 border-red-600 mx-auto"></div></div>
                ) : (
                  Object.entries(counts).map(([name, count]: any) => (
                    <div key={name} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                      <div className="flex items-center gap-3">
                        <FaDatabase className="text-slate-400" />
                        <span className="font-bold text-slate-700 dark:text-slate-200 capitalize">{name.replace('_', ' ')}</span>
                      </div>
                      <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs font-black">{count} Records</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="card bg-slate-900 text-white p-8">
              <FaShieldAlt className="text-amber-500 text-3xl mb-6" />
              <h3 className="text-xl font-bold mb-2">Policy Check</h3>
              <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                Only records in terminal states (COMPLETED, REJECTED, CANCELLED) older than 14 days are eligible for cleanup.
              </p>
              <button 
                onClick={executeCleanup}
                disabled={cleaning || loading}
                className="w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black shadow-xl shadow-red-500/30 transition-all flex items-center justify-center gap-2"
              >
                {cleaning ? 'Cleaning...' : (
                  <><FaTrashAlt /> Execute Purge</>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

