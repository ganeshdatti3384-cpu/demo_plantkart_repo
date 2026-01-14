"use client";
import React, { useEffect, useState } from 'react';
import { FaCar, FaGasPump, FaCogs, FaSearch, FaFilter, FaTimes, FaMapMarkerAlt, FaCalendarAlt, FaCheckCircle, FaTag, FaClipboardList, FaHistory } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import Sidebar from '@/components/Sidebar';

export default function CarRentalPage() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCar, setSelectedCar] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetch('/api/car/list')
      .then(res => res.json())
      .then(data => {
        setCars(data);
        setLoading(false);
      });
  }, []);

  const handleAction = async (car: any) => {
    setIsProcessing(true);
    try {
      // Directly submit car booking request (no payment)
      const res = await fetch('/api/car/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          carId: car._id,
          title: car.title,
          price: car.price,
          type: car.type || 'RENT'
        })
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`${car.type === 'SELL' ? 'Purchase' : 'Rental'} request submitted!`);
      } else {
        toast.error(data.message || 'Request failed');
      }
    } catch (err) {
      toast.error('Something went wrong');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar activeService="Car Rental" />

      <main className="flex-1 lg:max-h-screen lg:overflow-y-auto p-4 lg:p-12 pb-24 lg:pb-12">
        <div className="max-w-7xl mx-auto px-2 md:px-4 py-8">
          {/* iOS-Style Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 md:mb-12">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center bg-indigo-500/10 backdrop-blur-md shadow-sm">
                <FaCar className="w-7 h-7 md:w-8 md:h-8 text-indigo-500" />
              </div>
              <div>
                <h1 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-none mb-1">
                  Car Fleet
                </h1>
                <p className="text-xs md:text-sm font-bold text-slate-400 uppercase tracking-widest leading-none">
                  Premium vehicles for your local travel
                </p>
              </div>
            </div>
            
            <button 
              onClick={() => window.location.href = '/dashboard/user/history/car-rental'}
              className="flex items-center justify-center gap-2 px-6 py-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 font-black text-sm uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-700 transition-all active:scale-95"
            >
              <FaHistory className="w-4 h-4 text-blue-500" />
              View History
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cars.map((car: any) => (
                <div key={car._id} className="group bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm transition-all hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1" onClick={() => setSelectedCar(car)}>
                  <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden cursor-pointer">
                    <img src={car.image} alt={car.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-full text-[9px] sm:text-xs font-black text-blue-600 shadow-sm uppercase tracking-tighter">
                      AUD {car.price} {car.type === 'RENT' ? '/ day' : ''}
                    </div>
                    <div className="absolute top-4 left-4 px-3 py-1 bg-blue-600 text-white rounded-full text-[8px] sm:text-[10px] font-black uppercase tracking-widest shadow-lg">
                      {car.type || 'RENT'}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-base sm:text-xl font-black text-slate-900 dark:text-white mb-1.5 leading-tight tracking-tight">{car.title}</h3>
                    <p className="text-slate-500 text-[10px] sm:text-sm mb-4 flex items-center gap-1.5 font-bold uppercase tracking-tight">
                      <FaMapMarkerAlt className="text-blue-500" /> {car.location}
                    </p>
                    <div className="flex items-center gap-4 text-[9px] sm:text-xs text-slate-400 mb-6 font-bold uppercase tracking-tighter">
                      <span className="flex items-center gap-1"><FaCogs /> {car.specs}</span>
                      {car.condition && <span className="flex items-center gap-1">• {car.condition}</span>}
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleAction(car); }}
                      disabled={isProcessing}
                      className="w-full py-3 bg-slate-50 dark:bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-900 dark:text-white rounded-xl font-black transition-all duration-300 text-[11px] sm:text-sm uppercase tracking-widest"
                    >
                      {car.type === 'SELL' ? 'Buy Now' : 'Rent Now'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Car Detail Modal */}
          {selectedCar && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 bg-slate-900/80 backdrop-blur-sm">
              <div className="bg-white dark:bg-slate-900 rounded-[2rem] sm:rounded-[2.5rem] w-full max-w-4xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
                <div className="flex flex-col md:flex-row h-full max-h-[95vh] md:max-h-[90vh]">
                  {/* Image Section */}
                  <div className="md:w-1/2 relative h-48 sm:h-64 md:h-auto">
                    <img src={selectedCar.image} alt={selectedCar.title} className="w-full h-full object-cover" />
                    <button 
                      onClick={() => setSelectedCar(null)}
                      className="absolute top-4 left-4 sm:top-6 sm:left-6 p-2.5 sm:p-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur rounded-xl sm:rounded-2xl text-slate-900 dark:text-white shadow-xl hover:scale-110 transition-transform"
                    >
                      <FaTimes />
                    </button>
                  </div>

                  {/* Content Section */}
                  <div className="md:w-1/2 p-4 sm:p-10 overflow-y-auto">
                    <div className="mb-4 sm:mb-8">
                      <div className="flex items-center gap-2 mb-2 sm:mb-3">
                        <span className="px-2 py-0.5 bg-blue-600 text-white rounded-full text-[8.5px] sm:text-[10px] font-black uppercase tracking-widest">
                          {selectedCar.type || 'RENT'}
                        </span>
                        <span className="text-[9px] sm:text-xs font-black text-slate-400 uppercase tracking-widest">{selectedCar.condition || 'Used'} Condition</span>
                      </div>
                      <h2 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white mb-1 leading-tight">{selectedCar.title}</h2>
                      <p className="flex items-center gap-1.5 text-slate-500 font-medium text-[11px] sm:text-base">
                        <FaMapMarkerAlt className="text-blue-500" /> {selectedCar.location}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-5 sm:mb-8">
                      <div className="p-2 sm:p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl sm:rounded-2xl">
                        <p className="text-[8px] sm:text-[10px] uppercase font-black text-slate-400 tracking-widest mb-0.5 text-center">
                          {selectedCar.type === 'SELL' ? 'Selling Price' : 'Daily Rent'}
                        </p>
                        <p className="text-base sm:text-xl font-black text-slate-900 dark:text-white text-center">AUD {selectedCar.price}</p>
                      </div>
                      <div className="p-2 sm:p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl sm:rounded-2xl flex flex-col items-center justify-center">
                        <p className="text-[8px] sm:text-[10px] uppercase font-black text-slate-400 tracking-widest mb-0.5 text-center">Engine/Specs</p>
                        <p className="text-[10px] sm:text-sm font-bold text-slate-900 dark:text-white text-center">{selectedCar.specs}</p>
                      </div>
                    </div>

                    <div className="mb-5 sm:mb-8">
                      <h4 className="font-bold text-[13px] sm:text-lg text-slate-900 dark:text-white mb-2 sm:mb-4 flex items-center gap-2">
                        <FaClipboardList className="text-blue-500" /> Vehicle Details
                      </h4>
                      <p className="text-[12px] sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                        {selectedCar.description || `This ${selectedCar.title} is available for ${selectedCar.type === 'SELL' ? 'purchase' : 'rental'} in ${selectedCar.location}. Experience smooth driving with premium features.`}
                      </p>
                    </div>

                    <div className="mb-6 sm:mb-10">
                      <h4 className="font-bold text-[13px] sm:text-lg text-slate-900 dark:text-white mb-2 sm:mb-4">Features</h4>
                      <div className="grid grid-cols-2 gap-1.5 sm:gap-3">
                        {['Comprehensive Insurance', 'Verified Vehicle', 'Roadside Assistance', 'Clean & Sanitized'].map((feat, i) => (
                          <div key={i} className="flex items-center gap-1.5 text-[11px] sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
                            <FaCheckCircle className="text-emerald-500 text-[9px]" /> {feat}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-slate-100 dark:border-slate-800 pt-4 sm:pt-8 mt-auto">
                      <button 
                        onClick={() => handleAction(selectedCar)}
                        disabled={isProcessing}
                        className="w-full py-3.5 sm:py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl sm:rounded-2xl font-black text-sm sm:text-lg transition-all active:scale-[0.98] shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3"
                      >
                        {isProcessing ? 'Processing...' : selectedCar.type === 'SELL' ? 'Request Purchase' : 'Request Rental'}
                      </button>
                      <p className="text-center text-[8.5px] sm:text-[10px] text-slate-400 mt-3 uppercase tracking-widest">No payment required. Direct request submission.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

