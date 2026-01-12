"use client";

import React, { useEffect, useState } from 'react';
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaArrowRight, FaFilter, FaArrowLeft, FaHistory, FaSearch } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import Sidebar from '@/components/Sidebar';

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(null);
  const [searchLocation, setSearchLocation] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    fetch('/api/events')
      .then(res => res.json())
      .then(data => {
        setEvents(data);
        setFilteredEvents(data);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let filtered = [...events];
    
    // Location filter
    if (searchLocation) {
      filtered = filtered.filter(event => 
        event.location?.toLowerCase().includes(searchLocation.toLowerCase())
      );
    }
    
    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(event => event.category === categoryFilter);
    }
    
    setFilteredEvents(filtered);
  }, [searchLocation, categoryFilter, events]);

  const handleRegister = async (eventId: string) => {
    setRegistering(eventId);
    try {
      const res = await fetch(`/api/events/${eventId}/register`, {
        method: 'POST',
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Successfully registered for event!');
      } else {
        toast.error(data.message || 'Registration failed');
      }
    } catch (err) {
      toast.error('Something went wrong');
    } finally {
      setRegistering(null);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar activeService="Community Events" />
      
      <main className="flex-1 lg:max-h-screen lg:overflow-y-auto p-4 lg:p-12 pb-24 lg:pb-12">
        <div className="max-w-6xl mx-auto px-2 md:px-0">
          {/* iOS-Style Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 md:mb-12 pt-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center bg-rose-500/10 backdrop-blur-md shadow-sm">
                <FaCalendarAlt className="w-7 h-7 md:w-8 md:h-8 text-rose-500" />
              </div>
              <div>
                <h1 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-none mb-1">
                  Upcoming Events
                </h1>
                <p className="text-xs md:text-sm font-bold text-slate-400 uppercase tracking-widest leading-none">
                  Join orientation sessions and networking nights
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
                <option value="Networking">Networking</option>
                <option value="Workshop">Workshop</option>
                <option value="Cultural">Cultural</option>
                <option value="Orientation">Orientation</option>
                <option value="Social">Social</option>
              </select>
            </div>

            <button className="flex items-center justify-center gap-2 px-6 py-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 font-black text-sm uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-700 transition-all active:scale-95">
              <FaFilter className="w-4 h-4 text-blue-500" />
              Filter Categories
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10">
            {loading ? (
              <div className="col-span-full py-20 text-center">
                <div className="inline-block animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mb-4"></div>
                <p className="text-slate-500 font-bold">Discovering events...</p>
              </div>
            ) : filteredEvents.length === 0 ? (
              <div className="col-span-full py-20 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 text-center shadow-sm">
                <FaUsers className="text-5xl text-slate-200 dark:text-slate-800 mx-auto mb-4" />
                <p className="text-slate-500 font-bold mb-4">No events found matching your criteria.</p>
                <button 
                  onClick={() => { setSearchLocation(''); setCategoryFilter('all'); }}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              filteredEvents.map((event: any) => (
                <div key={event._id} className="group flex flex-col sm:flex-row bg-white dark:bg-slate-900 rounded-[2rem] sm:rounded-[2.5rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 transition-all hover:-translate-y-1">
                  <div className="sm:w-2/5 relative h-52 sm:h-auto">
                    <img src={event.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80'} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute top-4 left-4 sm:top-6 sm:left-6 px-3 py-1.5 sm:px-4 sm:py-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur rounded-xl sm:rounded-2xl shadow-xl text-center min-w-[60px] sm:min-w-[70px]">
                      <span className="block text-lg sm:text-xl font-black text-slate-900 dark:text-white leading-none">
                        {event.date?.split(' ')[1]?.replace(',', '') || '--'}
                      </span>
                      <span className="text-[9px] sm:text-[10px] uppercase font-black text-blue-600 tracking-tighter">
                        {event.date?.split(' ')[0] || '---'}
                      </span>
                    </div>
                  </div>
                  <div className="p-6 sm:p-8 sm:w-3/5 flex flex-col">
                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-3">{event.category}</span>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-4 group-hover:text-blue-600 transition-colors leading-tight line-clamp-2">{event.title}</h3>
                    <div className="space-y-3 mb-6 sm:mb-8 text-xs sm:text-sm">
                      <p className="flex items-center gap-3 text-slate-500 font-bold">
                        <FaCalendarAlt className="text-slate-400" /> {event.date}
                      </p>
                      <p className="flex items-center gap-3 text-slate-500 font-bold">
                        <FaMapMarkerAlt className="text-slate-400" /> {event.location}
                      </p>
                    </div>
                    <button 
                      disabled={registering === event._id}
                      onClick={() => handleRegister(event._id)}
                      className="mt-auto flex items-center justify-center gap-2 w-full py-3.5 sm:py-4 bg-slate-50 dark:bg-slate-800/50 hover:bg-blue-600 hover:text-white text-slate-900 dark:text-white rounded-xl sm:rounded-2xl font-black text-sm transition-all disabled:opacity-50"
                    >
                      {registering === event._id ? (
                        <span className="flex items-center gap-2">
                           <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                           Processing...
                        </span>
                      ) : (
                        <>Register Now <FaArrowRight /></>
                      )}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

