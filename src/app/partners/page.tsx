"use client";
import React, { useEffect, useState } from 'react';
import { FaHandshake, FaTag, FaArrowRight, FaFilter, FaArrowLeft, FaHistory, FaTags, FaSearch } from 'react-icons/fa';
import Sidebar from '@/components/Sidebar';

export default function PartnerDiscountsPage() {
  const [partners, setPartners] = useState([]);
  const [filteredPartners, setFilteredPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLocation, setSearchLocation] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    fetch('/api/partners')
      .then(res => res.json())
      .then(data => {
        setPartners(data);
        setFilteredPartners(data);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let filtered = [...partners];
    
    // Location filter
    if (searchLocation) {
      filtered = filtered.filter(partner => 
        partner.location?.toLowerCase().includes(searchLocation.toLowerCase())
      );
    }
    
    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(partner => partner.category === categoryFilter);
    }
    
    setFilteredPartners(filtered);
  }, [searchLocation, categoryFilter, partners]);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar activeService="Partner Perks" />
      
      <main className="flex-1 lg:max-h-screen lg:overflow-y-auto p-4 lg:p-12 pb-24 lg:pb-12">
        <div className="max-w-6xl mx-auto px-2 md:px-0">
          {/* iOS-Style Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 md:mb-12 pt-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center bg-teal-500/10 backdrop-blur-md shadow-sm">
                <FaTags className="w-7 h-7 md:w-8 md:h-8 text-teal-500" />
              </div>
              <div>
                <h1 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-none mb-1">
                  Partner Perks
                </h1>
                <p className="text-xs md:text-sm font-bold text-slate-400 uppercase tracking-widest leading-none">
                  Exclusive benefits through our trusted global network
                </p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4 mb-8">
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
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-6 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-[13px] sm:text-base font-medium"
              >
                <option value="all">All Categories</option>
                <option value="Retail">Retail</option>
                <option value="Food & Dining">Food & Dining</option>
                <option value="Fitness">Fitness & Wellness</option>
                <option value="Education">Education</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Travel">Travel</option>
                <option value="Technology">Technology</option>
                <option value="Services">Services</option>
              </select>
            </div>

            <button className="flex items-center justify-center gap-2 px-6 py-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 font-black text-sm uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-700 transition-all active:scale-95">
              <FaFilter className="w-4 h-4 text-blue-500" />
              Filter Category
            </button>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent mb-4"></div>
              <p className="text-slate-500 font-bold">Curating your perks...</p>
            </div>
          ) : filteredPartners.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-slate-500 font-bold mb-4">No partner offers found matching your criteria.</p>
              <button 
                onClick={() => { setSearchLocation(''); setCategoryFilter('all'); }}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredPartners.map((partner: any) => (
                <div key={partner._id} className="group bg-white dark:bg-slate-900 rounded-[2rem] sm:rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 transition-all hover:-translate-y-1 p-6 sm:p-8">
                  <div className="flex items-center gap-4 sm:gap-6 mb-6 sm:mb-8">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-[1.5rem] overflow-hidden bg-slate-100 dark:bg-slate-800 p-1 flex-shrink-0">
                      <img src={partner.image || 'https://via.placeholder.com/150'} alt={partner.name} className="w-full h-full object-cover rounded-xl sm:rounded-2xl" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white truncate mb-1">{partner.name}</h3>
                      <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full whitespace-nowrap">
                        {partner.category}
                      </span>
                    </div>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl sm:rounded-3xl p-5 sm:p-6 mb-6 sm:mb-8 border border-dashed border-slate-200 dark:border-slate-700 relative overflow-hidden group/offer">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Offer</span>
                      <FaTag className="text-emerald-500 text-sm" />
                    </div>
                    <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">{partner.discount}</p>
                    <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-blue-600/5 rounded-full blur-2xl group-hover/offer:scale-150 transition-transform duration-500"></div>
                  </div>

                  <button className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl sm:rounded-2xl font-black text-sm transition-all shadow-xl shadow-blue-500/10 flex items-center justify-center gap-2 active:scale-95">
                    Claim Reward <FaArrowRight className="text-xs" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
