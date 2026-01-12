"use client";
import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { FaShieldAlt, FaCcVisa, FaCcMastercard, FaCreditCard, FaLock, FaCheckCircle, FaExchangeAlt, FaSpinner, FaArrowLeft } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import Sidebar from '@/components/Sidebar';

export default function PaymentsPage() {
  const [method, setMethod] = useState('card');
  const [verifying, setVerifying] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const status = searchParams.get('status');
    const sessionId = searchParams.get('session_id');
    const requestId = searchParams.get('requestId');
    const type = searchParams.get('type');
    const amount = searchParams.get('amount');

    if (status === 'success' && sessionId && requestId) {
      handleVerifyPayment(requestId, type, sessionId, amount);
    } else if (status === 'cancel') {
      toast.error('Payment was cancelled');
    }
  }, [searchParams]);

  const handleVerifyPayment = async (requestId: string, type: string | null, paymentId: string, amount: string | null) => {
    setVerifying(true);
    try {
      const res = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requestId,
          type,
          paymentId,
          amount: parseFloat(amount || '0')
        })
      });

      const data = await res.json();
      if (data.success) {
        toast.success('Payment verified successfully!');
        setTimeout(() => {
          router.push('/dashboard/user');
        }, 2000);
      } else {
        toast.error(data.error || 'Verification failed');
      }
    } catch (err) {
      toast.error('Something went wrong during verification');
    } finally {
      setVerifying(false);
    }
  };

  if (verifying) {
    return (
      <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50 dark:bg-slate-950">
        <Sidebar activeService="Payments" />
        <main className="flex-1 flex flex-col items-center justify-center p-4 gap-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-center">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-2">Verifying Payment...</h2>
            <p className="text-slate-500 font-bold text-sm sm:text-base">Please do not refresh the page or go back.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar activeService="Payments" />
      
      <main className="flex-1 lg:max-h-screen lg:overflow-y-auto p-4 lg:p-12 pb-24 lg:pb-12">
        <div className="max-w-5xl mx-auto px-2 md:px-0">
          <header className="flex items-center gap-4 sm:gap-6 mb-8 sm:mb-12">
            <button onClick={() => window.history.back()} className="p-3 sm:p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl sm:rounded-2xl text-slate-500 shadow-sm flex-shrink-0">
              <FaArrowLeft />
            </button>
            <div>
              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white flex items-center gap-3 sm:gap-4 tracking-tighter">
                <FaShieldAlt className="text-emerald-500" />
                Secure Checkout
              </h1>
              <p className="text-slate-500 font-bold mt-1 text-xs sm:text-base">Complete your payment securely using our encrypted gateway.</p>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 space-y-6 sm:space-y-8">
              <div className="bg-white dark:bg-slate-900 rounded-[2rem] sm:rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-10">
                <h2 className="text-lg sm:text-xl font-black mb-6 sm:mb-8 flex items-center gap-3 text-slate-900 dark:text-white">
                  <FaCreditCard className="text-blue-600" /> Payment Method
                </h2>
                
                <div className="grid grid-cols-2 gap-4 mb-10">
                  <button 
                    onClick={() => setMethod('card')}
                    className={`p-5 sm:p-6 rounded-2xl sm:rounded-3xl border-2 transition-all flex flex-col items-center gap-3 ${method === 'card' ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                  >
                    <div className="flex gap-2 text-slate-400">
                      <FaCcVisa size={28} /> <FaCcMastercard size={28} />
                    </div>
                    <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-300">Card Payment</span>
                  </button>
                  <button 
                    onClick={() => setMethod('upi')}
                    className={`p-5 sm:p-6 rounded-2xl sm:rounded-3xl border-2 transition-all flex flex-col items-center gap-3 ${method === 'upi' ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                  >
                    <FaExchangeAlt size={28} className="text-blue-600" />
                    <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-300">Net Banking / UPI</span>
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-slate-400 px-1 mb-2 block">Card Holder Name</label>
                    <input type="text" className="w-full px-4 sm:px-6 py-3.5 sm:py-4 bg-slate-50 dark:bg-slate-800/50 border-none rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-bold dark:text-white text-sm sm:text-base" placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-slate-400 px-1 mb-2 block">Card Number</label>
                    <div className="relative">
                      <input type="text" className="w-full px-12 sm:px-14 py-3.5 sm:py-4 bg-slate-50 dark:bg-slate-800/50 border-none rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-bold dark:text-white text-sm sm:text-base" placeholder="•••• •••• •••• ••••" />
                      <FaLock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-slate-400 px-1 mb-2 block">Expiry Date</label>
                      <input type="text" className="w-full px-4 sm:px-6 py-3.5 sm:py-4 bg-slate-50 dark:bg-slate-800/50 border-none rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-bold dark:text-white text-sm sm:text-base" placeholder="MM / YY" />
                    </div>
                    <div>
                      <label className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-slate-400 px-1 mb-2 block">CVV</label>
                      <input type="password" className="w-full px-4 sm:px-6 py-3.5 sm:py-4 bg-slate-50 dark:bg-slate-800/50 border-none rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-bold dark:text-white text-sm sm:text-base" placeholder="•••" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-5 p-5 sm:p-6 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30 rounded-2xl sm:rounded-3xl">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-600 text-2xl">
                  <FaShieldAlt />
                </div>
                <div>
                  <p className="text-sm font-black text-emerald-800 dark:text-emerald-300 uppercase tracking-tight">Bank-Level Security</p>
                  <p className="text-xs text-emerald-600/80 dark:text-emerald-400 font-bold leading-relaxed">Your connection is encrypted with 256-bit SSL technology.</p>
                </div>
              </div>
            </div>

            <div className="space-y-6 sm:space-y-8">
              <div className="bg-white dark:bg-slate-900 rounded-[2rem] sm:rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8">
                <h2 className="text-lg sm:text-xl font-black mb-6 text-slate-900 dark:text-white">Order Summary</h2>
                <div className="space-y-4 text-xs sm:text-sm mb-8">
                  <div className="flex justify-between items-center text-slate-500 font-bold">
                    <span>Service Booking</span>
                    <span className="text-slate-900 dark:text-white">$450.00</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-500 font-bold">
                    <span>Processing Fee</span>
                    <span className="text-slate-900 dark:text-white">$12.50</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-500 font-bold pb-4 border-b border-slate-100 dark:border-slate-800/50">
                    <span>Taxes (18%)</span>
                    <span className="text-slate-900 dark:text-white">$81.00</span>
                  </div>
                  <div className="pt-2 flex justify-between items-center">
                    <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white">Total Pay</span>
                    <span className="text-2xl sm:text-3xl font-black text-blue-600 tracking-tighter">$543.50</span>
                  </div>
                </div>
                <button className="w-full py-4 sm:py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl sm:rounded-2xl font-black text-sm sm:text-base shadow-xl shadow-blue-500/20 transition-all active:scale-95">
                  Secure Pay Now
                </button>
              </div>

              <div className="p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] bg-slate-50 dark:bg-slate-800/50 space-y-4 sm:space-y-6 border border-slate-100 dark:border-slate-800">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Why pay via our gateway?</h3>
                <div className="space-y-4">
                  {[
                    'Instant Confirmation',
                    'Refund Policy Applicable',
                    'Secure Tokenization',
                    '24/7 Support Access'
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300">
                      <FaCheckCircle className="text-emerald-500 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
