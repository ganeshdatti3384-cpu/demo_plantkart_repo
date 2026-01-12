'use client';

import React, { useEffect, useState } from 'react';
import { FaHome, FaPlus, FaSearch, FaFilter, FaTimes, FaMapMarkerAlt, FaWifi, FaCoffee, FaBed, FaUserFriends, FaClipboardList, FaCheckCircle, FaHistory } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import Sidebar from '@/components/Sidebar';

export default function AccommodationPage() {
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isBooking, setIsBooking] = useState(false);
  const [searchLocation, setSearchLocation] = useState('');
  const [priceFilter, setPriceFilter] = useState('all');

  useEffect(() => {
    fetch('/api/accommodation/list')
      .then(res => res.json())
      .then(data => {
        setListings(data);
        setFilteredListings(data);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let filtered = [...listings];
    
    // Location filter
    if (searchLocation) {
      filtered = filtered.filter(item => 
        item.location?.toLowerCase().includes(searchLocation.toLowerCase()) ||
        item.address?.toLowerCase().includes(searchLocation.toLowerCase())
      );
    }
    
    // Price filter
    if (priceFilter !== 'all') {
      filtered = filtered.filter(item => {
        const price = parseFloat(item.price.replace(/[^0-9.]/g, ''));
        if (priceFilter === 'low') return price < 300;
        if (priceFilter === 'medium') return price >= 300 && price <= 500;
        if (priceFilter === 'high') return price > 500;
        return true;
      });
    }
    
    setFilteredListings(filtered);
  }, [searchLocation, priceFilter, listings]);

  const handleBookNow = async (item: any) => {
    setIsBooking(true);
    try {
      // Create a temporary booking request
      const res = await fetch('/api/accommodation/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accommodationId: item._id,
          title: item.title,
          price: item.price,
        })
      });

      const data = await res.json();
      if (data.success) {
        toast.success('Initiating secure payment...');
        
        // Initiate Stripe Checkout
        const paymentRes = await fetch('/api/payments/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: item.price.replace(/[^0-9.]/g, ''),
            name: item.title,
            requestId: data.id,
            type: 'ACCOMMODATION'
          })
        });

        const paymentData = await paymentRes.json();
        if (paymentData.url) {
          window.location.href = paymentData.url;
        } else {
          toast.error('Failed to initiate payment');
        }
      } else {
        toast.error(data.message || 'Booking failed');
      }
    } catch (err) {
      toast.error('Something went wrong');
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar activeService="Accommodation" />

      <main className="flex-1 lg:max-h-screen lg:overflow-y-auto p-4 lg:p-12 pb-24 lg:pb-12">
        <div className="max-w-7xl mx-auto px-2 md:px-4 py-8">
          {/* iOS-Style Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 md:mb-12">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center bg-emerald-500/10 backdrop-blur-md shadow-sm">
                <FaHome className="w-7 h-7 md:w-8 md:h-8 text-emerald-500" />
              </div>
              <div>
                <h1 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-none mb-1">
                  Living Spaces
                </h1>
                <p className="text-xs md:text-sm font-bold text-slate-400 uppercase tracking-widest leading-none">
                  Find your home away from home
                </p>
              </div>
            </div>
            
            <button 
              onClick={() => window.location.href = '/dashboard/user/history/accommodation'}
              className="flex items-center justify-center gap-2 px-6 py-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 font-black text-sm uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-700 transition-all active:scale-95"
            >
              <FaHistory className="w-4 h-4 text-blue-500" />
              View History
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-10">
            <div className="relative flex-1">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search Adelaide, Glenelg, North Adelaide..." 
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-[13px] sm:text-base font-medium"
              />
            </div>
            <select 
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
              className="px-6 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-[13px] sm:text-base font-medium"
            >
              <option value="all">All Prices</option>
              <option value="low">Under $300/wk</option>
              <option value="medium">$300-$500/wk</option>
              <option value="high">Over $500/wk</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full py-20 text-center text-slate-500">Loading listings...</div>
            ) : filteredListings.length === 0 ? (
              <div className="col-span-full py-20 text-center">
                <p className="text-slate-500 font-bold">No accommodations found matching your criteria.</p>
                <button 
                  onClick={() => { setSearchLocation(''); setPriceFilter('all'); }}
                  className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              filteredListings.map((item: any) => (
                <div key={item._id} className="group bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm transition-all hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1">
                  <div className="relative h-56 sm:h-64 overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur text-blue-600 dark:text-blue-400 font-black rounded-full text-[10px] sm:text-sm uppercase tracking-tighter shadow-sm">
                      AUD {item.price} / wk
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mb-1 leading-tight tracking-tight">{item.title}</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px] sm:text-sm mb-5 flex items-center gap-2 font-bold uppercase tracking-tight">
                      <FaMapMarkerAlt className="text-blue-500" /> {item.location}
                    </p>
                    
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {item.amenities && item.amenities.split(',').slice(0, 3).map((amenity: string, i: number) => (
                        <span key={i} className="text-[9px] font-black uppercase tracking-tight px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-lg">
                          {amenity.trim()}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-50 dark:border-slate-800/50">
                      <button 
                        onClick={() => setSelectedItem(item)}
                        className="text-[11px] sm:text-sm font-black text-blue-600 dark:text-blue-400 hover:underline uppercase tracking-widest"
                      >
                        Details
                      </button>
                      <button 
                        onClick={() => handleBookNow(item)}
                        disabled={isBooking}
                        className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-[11px] sm:text-sm font-black hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20 uppercase tracking-widest"
                      >
                        {isBooking ? '...' : 'Book'}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Details Modal */}
          {selectedItem && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 bg-slate-900/80 backdrop-blur-sm">
              <div className="bg-white dark:bg-slate-900 rounded-[2rem] sm:rounded-[2.5rem] w-full max-w-4xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
                <div className="flex flex-col md:flex-row h-full max-h-[95vh] md:max-h-[90vh]">
                  {/* Image Section */}
                  <div className="md:w-1/2 relative h-48 sm:h-64 md:h-auto">
                    <img src={selectedItem.image} alt={selectedItem.title} className="w-full h-full object-cover" />
                    <button 
                      onClick={() => setSelectedItem(null)}
                      className="absolute top-4 left-4 sm:top-6 sm:left-6 p-2.5 sm:p-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur rounded-xl sm:rounded-2xl text-slate-900 dark:text-white shadow-xl hover:scale-110 transition-transform"
                    >
                      <FaTimes />
                    </button>
                  </div>

                  {/* Content Section */}
                  <div className="md:w-1/2 p-4 sm:p-10 overflow-y-auto">
                    <div className="mb-4 sm:mb-8">
                      <p className="text-[9px] sm:text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-1 sm:mb-3">Premium Accommodation</p>
                      <h2 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white mb-1 leading-tight">{selectedItem.title}</h2>
                      <p className="flex items-center gap-1.5 text-slate-500 font-medium text-[11px] sm:text-base">
                        <FaMapMarkerAlt className="text-blue-500" /> {selectedItem.address || selectedItem.location}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-5 sm:mb-8">
                      <div className="p-2 sm:p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl sm:rounded-2xl">
                        <p className="text-[8px] sm:text-[10px] uppercase font-black text-slate-400 tracking-widest mb-0.5 text-center">Weekly Rent</p>
                        <p className="text-base sm:text-xl font-black text-slate-900 dark:text-white text-center">AUD {selectedItem.price}</p>
                      </div>
                      <div className="p-2 sm:p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl sm:rounded-2xl flex items-center justify-center">
                         <span className="px-2 sm:px-3 py-1 bg-emerald-100 text-emerald-600 rounded-full text-[8.5px] sm:text-[10px] font-black uppercase">Available Now</span>
                      </div>
                    </div>

                    <div className="mb-5 sm:mb-8">
                      <h4 className="font-bold text-[13px] sm:text-lg text-slate-900 dark:text-white mb-2 sm:mb-4 flex items-center gap-2">
                        <FaClipboardList className="text-blue-500" /> Description
                      </h4>
                      <p className="text-[12px] sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                        {selectedItem.description || "No description provided for this listing."}
                      </p>
                    </div>

                    <div className="mb-6 sm:mb-10">
                      <h4 className="font-bold text-[13px] sm:text-lg text-slate-900 dark:text-white mb-2 sm:mb-4">Amenities</h4>
                      <div className="grid grid-cols-2 gap-1.5 sm:gap-3">
                        {selectedItem.amenities ? selectedItem.amenities.split(',').map((amenity: string, i: number) => (
                          <div key={i} className="flex items-center gap-1.5 text-[11px] sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
                            <FaCheckCircle className="text-emerald-500 text-[9px]" /> {amenity.trim()}
                          </div>
                        )) : <p className="text-slate-400 text-[11px]">Basic essentials included.</p>}
                      </div>
                    </div>

                    <div className="border-t border-slate-100 dark:border-slate-800 pt-4 sm:pt-8 mt-auto">
                      <button 
                        onClick={() => handleBookNow(selectedItem)}
                        disabled={isBooking}
                        className="w-full py-3.5 sm:py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl sm:rounded-2xl font-black text-sm sm:text-lg transition-all active:scale-[0.98] shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3"
                      >
                        {isBooking ? 'Processing...' : 'Secure This Property'}
                      </button>
                      <p className="text-center text-[8.5px] sm:text-[10px] text-slate-400 mt-3 uppercase tracking-widest">Secure payment via Stripe Checkout</p>
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

