"use client";
import React, { useState } from 'react';
import { FaHandHoldingUsd, FaCalculator, FaFileInvoiceDollar, FaRegCheckCircle, FaCheckCircle, FaUniversity, FaArrowLeft, FaHistory } from 'react-icons/fa';
import Sidebar from '@/components/Sidebar';

export default function LoanServicePage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    loanType: 'Education Loan',
    amount: '',
    purpose: '',
    phone: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/loan/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) setSuccess(true);
    } catch (err) {
      alert('Error submitting application');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: any) => setFormData({ ...formData, [e.target.name]: e.target.value });

  if (success) {
    return (
      <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50 dark:bg-slate-950">
        <Sidebar activeService="Loan Services" />
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-3xl sm:text-4xl mx-auto mb-6">
              <FaCheckCircle />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-2">Application Sent!</h2>
            <p className="text-sm sm:text-base text-slate-500 mb-8">Your loan request has been submitted to our financing partners. Expect a call shortly.</p>
            <button onClick={() => window.location.href='/dashboard/user'} className="w-full py-4 bg-blue-600 text-white rounded-xl sm:rounded-2xl font-black text-sm sm:text-base">
              Back to Dashboard
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar activeService="Loan Services" />
      
      <main className="flex-1 lg:max-h-screen lg:overflow-y-auto p-4 lg:p-12 pb-24 lg:pb-12">
        <div className="max-w-6xl mx-auto px-2 md:px-0">
          {/* iOS-Style Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 md:mb-12 pt-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center bg-amber-500/10 backdrop-blur-md shadow-sm">
                <FaHandHoldingUsd className="w-7 h-7 md:w-8 md:h-8 text-amber-500" />
              </div>
              <div>
                <h1 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-none mb-1">
                  Financials
                </h1>
                <p className="text-xs md:text-sm font-bold text-slate-400 uppercase tracking-widest leading-none">
                  Fuel your dreams with our process
                </p>
              </div>
            </div>
            
            <button 
              onClick={() => window.location.href = '/dashboard/user/history/loan-services'}
              className="flex items-center justify-center gap-2 px-6 py-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 font-black text-sm uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-700 transition-all active:scale-95"
            >
              <FaHistory className="w-4 h-4 text-blue-500" />
              View History
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] sm:rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-sm p-5 sm:p-8 lg:p-12">
              <h2 className="text-lg sm:text-2xl font-black mb-6 text-slate-900 dark:text-white tracking-tight">Quick Application</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-slate-400 px-1 mb-2 block">Loan Type</label>
                  <select 
                    name="loanType" 
                    onChange={handleChange} 
                    className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all font-bold dark:text-white text-[13px] sm:text-base"
                  >
                    <option>Education Loan</option>
                    <option>Personal Loan</option>
                    <option>Business Loan</option>
                  </select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-slate-400 px-1 mb-2 block">Amount (AUD)</label>
                    <input 
                      name="amount" 
                      type="number" 
                      required 
                      onChange={handleChange} 
                      placeholder="e.g. 50000" 
                      className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all font-bold dark:text-white text-[13px] sm:text-base" 
                    />
                  </div>
                  <div>
                    <label className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-slate-400 px-1 mb-2 block">Phone Number</label>
                    <input 
                      name="phone" 
                      required 
                      onChange={handleChange} 
                      placeholder="+61 XXXXXXXX" 
                      className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all font-bold dark:text-white text-[13px] sm:text-base" 
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-slate-400 px-1 mb-2 block">Purpose of Loan</label>
                  <textarea 
                    name="purpose" 
                    rows={3} 
                    onChange={handleChange} 
                    placeholder="Briefly describe why you need this loan..." 
                    className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all font-bold dark:text-white text-[13px] sm:text-base resize-none"
                  ></textarea>
                </div>
                <button 
                  disabled={loading} 
                  className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-[13px] sm:text-lg shadow-xl shadow-blue-500/20 transition-all uppercase tracking-widest"
                >
                  {loading ? 'Submitting...' : 'Apply Support'}
                </button>
              </form>
            </div>

            <div className="space-y-6 sm:space-y-8">
              <div className="grid grid-cols-2 gap-3 sm:gap-6">
                {[
                  { icon: <FaUniversity />, title: 'Bank Ties', desc: 'Top global banks' },
                  { icon: <FaCalculator />, title: 'EMI Calc', desc: 'Instant result' },
                  { icon: <FaFileInvoiceDollar />, title: 'Tax Save', desc: '80E deductions' },
                  { icon: <FaRegCheckCircle />, title: 'Wait time', desc: '48-72 hours' },
                ].map((item, i) => (
                  <div key={i} className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/10 flex items-center justify-center text-blue-600 mb-3 text-lg">
                      {item.icon}
                    </div>
                    <h5 className="font-black text-slate-900 dark:text-white text-[11px] sm:text-sm uppercase tracking-tight leading-none mb-1">{item.title}</h5>
                    <p className="text-[10px] sm:text-xs text-slate-500 font-bold">{item.desc}</p>
                  </div>
                ))}
              </div>
              
              <div className="p-8 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] bg-slate-900 text-white overflow-hidden relative shadow-2xl group">
                 <div className="relative z-10">
                  <h3 className="text-xl sm:text-2xl font-black mb-2 tracking-tighter">Need advice?</h3>
                  <p className="text-slate-400 text-xs sm:text-sm mb-8 font-bold leading-relaxed italic">Talk to our financial advisor for high-value loan support.</p>
                  <button className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 rounded-xl sm:rounded-2xl text-sm font-bold transition-all shadow-lg active:scale-95">
                    Book Call Now
                  </button>
                </div>
                <FaHandHoldingUsd className="absolute -right-12 -bottom-12 text-[10rem] sm:text-[14rem] text-white/5 rotate-12 group-hover:scale-110 transition-transform duration-700" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

