'use client';

import React, { useEffect, useState } from 'react';
import { FaUserTie, FaAward, FaCalendarCheck, FaStar, FaGlobe, FaTimes, FaClock, FaArrowRight, FaHistory } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import Sidebar from '@/components/Sidebar';

export default function ConsultantListingPage() {
  const [consultants, setConsultants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedConsultant, setSelectedConsultant] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState<any>(null); // Updated to object
  const [lockingSlot, setLockingSlot] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    reason: '',
    locationStatus: 'Offshore',
    visaPurpose: '',
    visaType: '',
    visaStatus: '',
    visaTenure: ''
  });

  useEffect(() => {
    fetch('/api/consultants')
      .then(res => res.json())
      .then(data => {
        setConsultants(data);
        setLoading(false);
      });
  }, []);

  const selectConsultant = async (expert: any) => {
    setSelectedConsultant(expert);
    setSelectedSlot(null);
    // Fetch fresh slots with current lock/book statuses
    try {
      const res = await fetch(`/api/consultants/${expert._id}/slots`);
      const freshSlots = await res.json();
      setSelectedConsultant(prev => prev ? { ...prev, slots: freshSlots } : null);
    } catch (e) {
      console.error('Failed to fetch slots', e);
    }
  };

  const handleSlotSelect = async (slot: any) => {
    if (slot.status === 'booked') {
      toast.error('This slot is already booked');
      return;
    }
    
    setLockingSlot(true);
    try {
      const res = await fetch(`/api/consultants/${selectedConsultant._id}/slots/lock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slotId: slot.id })
      });
      
      const data = await res.json();
      if (data.success) {
        setSelectedSlot(slot);
        toast.success(data.message);
      } else {
        toast.error(data.message || 'Could not lock slot');
        // Refresh slots since status might have changed
        const refreshRes = await fetch(`/api/consultants/${selectedConsultant._id}/slots`);
        const freshSlots = await refreshRes.json();
        setSelectedConsultant(prev => prev ? { ...prev, slots: freshSlots } : null);
      }
    } catch (err) {
      toast.error('Failed to lock slot');
    } finally {
      setLockingSlot(false);
    }
  };

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingLoading(true);
    try {
      const res = await fetch('/api/consultant-booking/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          consultantId: selectedConsultant._id,
          consultantName: selectedConsultant.name,
          slot: selectedSlot.time,
          slotId: selectedSlot.id,
          ...bookingForm
        })
      });

      const data = await res.json();
      if (data.success) {
        toast.success('Booking recorded! Redirecting to payment...');
        
        // Initiate Stripe Checkout
        const paymentRes = await fetch('/api/payments/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: selectedConsultant.price.replace(/[^0-9.]/g, ''),
            name: `Consultation with ${selectedConsultant.name}`,
            requestId: data.id,
            type: 'CONSULTANCY'
          })
        });

        const paymentData = await paymentRes.json();
        if (paymentData.url) {
          window.location.href = paymentData.url;
        } else {
          toast.error('Failed to initiate payment');
          setBookingLoading(false);
        }
      } else {
        toast.error(data.message || 'Booking failed');
        setBookingLoading(false);
      }
    } catch (err) {
      toast.error('Something went wrong');
      setBookingLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar activeService="Consultancy" />

      <main className="flex-1 lg:max-h-screen lg:overflow-y-auto p-4 lg:p-12 pb-24 lg:pb-12">
        <div className="max-w-7xl mx-auto px-2 md:px-4 py-8">
          {/* iOS-Style Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 md:mb-12">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center bg-purple-500/10 backdrop-blur-md shadow-sm">
                <FaUserTie className="w-7 h-7 md:w-8 md:h-8 text-purple-500" />
              </div>
              <div>
                <h1 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-none mb-1">
                  Consultants
                </h1>
                <p className="text-xs md:text-sm font-bold text-slate-400 uppercase tracking-widest leading-none">
                  Book a session with verified experts
                </p>
              </div>
            </div>
            
            <button 
              onClick={() => window.location.href = '/dashboard/user/history/consultancy'}
              className="flex items-center justify-center gap-2 px-6 py-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 font-black text-sm uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-700 transition-all active:scale-95"
            >
              <FaHistory className="w-4 h-4 text-blue-500" />
              View History
            </button>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 space-y-4">
              <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Finding available experts...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {consultants.map((expert: any) => (
                <div 
                  key={expert._id} 
                  className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[1.25rem] sm:rounded-[2.5rem] p-4 sm:p-8 transition-all hover:shadow-2xl hover:shadow-blue-500/10"
                >
                  <div className="flex items-start justify-between mb-4 sm:mb-8">
                    <div className="relative">
                      <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-xl sm:text-3xl overflow-hidden border-2 border-white dark:border-slate-800 shadow-lg sm:shadow-xl">
                        {expert.image ? (
                          <img src={expert.image} alt={expert.name} className="w-full h-full object-cover" />
                        ) : (
                          <FaUserTie className="text-blue-600 dark:text-blue-400" />
                        )}
                      </div>
                      <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-5 h-5 sm:w-8 sm:h-8 bg-green-500 border-2 sm:border-4 border-white dark:border-slate-900 rounded-full"></div>
                    </div>
                    <div className="bg-slate-100 dark:bg-slate-800 px-3 py-1 sm:px-4 sm:py-2 rounded-xl sm:rounded-2xl">
                      <div className="flex items-center gap-1 text-amber-500 font-black text-xs sm:text-base">
                        <FaStar /> <span>{expert.rating || '4.9'}</span>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white mb-1 sm:mb-2 leading-tight tracking-tight">{expert.name}</h3>
                  <p className="text-blue-600 dark:text-blue-400 font-bold text-[10px] sm:text-sm mb-4 sm:mb-6 uppercase tracking-wider">{expert.specialization}</p>
                  
                  <div className="space-y-2 sm:space-y-4 mb-5 sm:mb-8">
                    <div className="flex items-center gap-2 sm:gap-3 text-slate-500 dark:text-slate-400">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] sm:text-sm">
                        <FaAward />
                      </div>
                      <span className="text-[11px] sm:text-sm font-semibold">{expert.experience || '10+'} yrs experience</span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 text-slate-500 dark:text-slate-400">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] sm:text-sm">
                        <FaGlobe />
                      </div>
                      <span className="text-[11px] sm:text-sm font-semibold">{expert.languages || 'English, Hindi'}</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => selectConsultant(expert)}
                    className="w-full py-3 sm:py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-base flex items-center justify-center gap-2 hover:bg-blue-600 hover:text-white transition-all shadow-lg shadow-slate-200 dark:shadow-none"
                  >
                    View Schedule <FaArrowRight className="text-[10px] sm:text-xs" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Booking Modal */}
        {selectedConsultant && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 bg-slate-900/80 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] sm:rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
              <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight">Book a Session</h2>
                  <p className="text-slate-500 text-xs sm:text-sm">With {selectedConsultant.name}</p>
                </div>
                <button onClick={() => setSelectedConsultant(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
                  <FaTimes />
                </button>
              </div>

              <div className="p-5 sm:p-6 max-h-[70vh] overflow-y-auto">
                {!selectedSlot ? (
                  <>
                    <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2 text-sm sm:text-base">
                      <FaClock className="text-blue-500" /> Available Slots
                    </h3>
                    <div className="grid grid-cols-1 gap-3 max-h-[350px] overflow-y-auto pr-2">
                       {selectedConsultant.slots && selectedConsultant.slots.length > 0 ? (
                        selectedConsultant.slots.map((slot: any, idx: number) => (
                          <button
                            key={idx}
                            onClick={() => handleSlotSelect(slot)}
                            className={`flex items-center justify-between p-4 rounded-2xl transition-all group font-medium text-sm ${
                              slot.status === 'booked' ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed' :
                              slot.status === 'locked' ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 border border-amber-200' :
                              'bg-slate-50 dark:bg-slate-800/50 hover:bg-blue-600 hover:text-white'
                            }`}
                          >
                            <span>{slot.time}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-[9px] font-black uppercase tracking-tighter opacity-60">{slot.status}</span>
                              <FaArrowRight className="opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          </button>
                        ))
                      ) : (
                        <p className="text-slate-500 py-8 text-center bg-slate-50 dark:bg-slate-800/20 rounded-2xl text-sm">
                          No available slots for this consultant.
                        </p>
                      )}
                    </div>
                  </>
                ) : (
                  <form onSubmit={handleBook} className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                    <div className="flex items-center gap-2 mb-4">
                      <button type="button" onClick={() => setSelectedSlot(null)} className="text-blue-600 font-bold text-[10px] sm:text-xs uppercase tracking-widest">
                        ← Back to Slots
                      </button>
                      <span className="text-slate-300">|</span>
                      <span className="text-[10px] sm:text-xs font-black uppercase text-slate-400">Slot: {selectedSlot.time}</span>
                    </div>

                    <div>
                      <label className="text-[11px] font-black tracking-widest text-slate-400 uppercase px-1 mb-2 block">Consultation Reason</label>
                      <textarea 
                        required 
                        className="w-full px-4 py-3 sm:py-4 bg-slate-50 dark:bg-slate-800/50 border-none rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-bold dark:text-white h-20 sm:h-24 resize-none text-sm" 
                        placeholder="Briefly describe your situation..."
                        value={bookingForm.reason}
                        onChange={(e) => setBookingForm({...bookingForm, reason: e.target.value})}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[11px] font-black tracking-widest text-slate-400 uppercase px-1 mb-2 block">Location Status</label>
                        <select 
                          className="w-full px-4 py-3 sm:py-4 bg-slate-50 dark:bg-slate-800/50 border-none rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-bold dark:text-white text-sm"
                          value={bookingForm.locationStatus}
                          onChange={(e) => setBookingForm({...bookingForm, locationStatus: e.target.value})}
                        >
                          <option value="Offshore">Offshore</option>
                          <option value="Onshore">Onshore</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[11px] font-black tracking-widest text-slate-400 uppercase px-1 mb-2 block">Visa Purpose</label>
                        <input 
                          type="text" 
                          required 
                          className="w-full px-4 py-3 sm:py-4 bg-slate-50 dark:bg-slate-800/50 border-none rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-bold dark:text-white text-sm" 
                          placeholder="Study, Work, PR..."
                          value={bookingForm.visaPurpose}
                          onChange={(e) => setBookingForm({...bookingForm, visaPurpose: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[11px] font-black tracking-widest text-slate-400 uppercase px-1 mb-2 block">Visa Type/Subclass</label>
                        <input 
                          type="text" 
                          required 
                          className="w-full px-4 py-3 sm:py-4 bg-slate-50 dark:bg-slate-800/50 border-none rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-bold dark:text-white text-sm" 
                          placeholder="500, 485, etc."
                          value={bookingForm.visaType}
                          onChange={(e) => setBookingForm({...bookingForm, visaType: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-black tracking-widest text-slate-400 uppercase px-1 mb-2 block">Current Status</label>
                        <input 
                          type="text" 
                          required 
                          className="w-full px-4 py-3 sm:py-4 bg-slate-50 dark:bg-slate-800/50 border-none rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-bold dark:text-white text-sm" 
                          placeholder="Applied, Granted..."
                          value={bookingForm.visaStatus}
                          onChange={(e) => setBookingForm({...bookingForm, visaStatus: e.target.value})}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-black tracking-widest text-slate-400 uppercase px-1 mb-2 block">Visa Tenure (if applicable)</label>
                      <input 
                        type="text" 
                        className="w-full px-4 py-3 sm:py-4 bg-slate-50 dark:bg-slate-800/50 border-none rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-bold dark:text-white text-sm" 
                        placeholder="Expiry date or duration..."
                        value={bookingForm.visaTenure}
                        onChange={(e) => setBookingForm({...bookingForm, visaTenure: e.target.value})}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={bookingLoading}
                      className="w-full py-4 sm:py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl sm:rounded-2xl font-black text-sm sm:text-base transition-all active:scale-[0.98] shadow-xl shadow-blue-600/20 disabled:opacity-50"
                    >
                      {bookingLoading ? "Recording..." : "Proceed to Booking"}
                    </button>
                  </form>
                )}
              </div>

              <div className="p-6 bg-slate-50 dark:bg-slate-800/30 text-center">
                <p className="text-xs text-slate-500">
                  You will receive a meeting link via email once the payment is verified.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

