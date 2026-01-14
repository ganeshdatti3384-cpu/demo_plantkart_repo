"use client";
import React, { useEffect, useState } from 'react';
import { FaVideo, FaCalendarAlt, FaClock, FaUserTie, FaLink, FaHistory } from 'react-icons/fa';

import Sidebar from '@/components/Sidebar';

export default function MyMeetingsPage() {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In dev, we fetch all to show something
    fetch('/api/meetings/my')
      .then(res => res.json())
      .then(data => {
        setMeetings(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar activeService="Meetings" />
      <main className="flex-1 lg:max-h-screen lg:overflow-y-auto p-4 lg:p-12 pb-24 lg:pb-12">
        <div className="max-w-6xl mx-auto px-2 py-8">
          {/* iOS-Style Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 md:mb-12 pt-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center bg-blue-600/10 backdrop-blur-md shadow-sm">
                <FaVideo className="w-7 h-7 md:w-8 md:h-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-none mb-1">
                  Meetings
                </h1>
                <p className="text-xs md:text-sm font-bold text-slate-400 uppercase tracking-widest leading-none">
                  Manage your expert advice sessions
                </p>
              </div>
            </div>
            
            <button 
              onClick={() => window.location.href = '/dashboard/user/history/meetings'}
              className="flex items-center justify-center gap-2 px-6 py-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 font-black text-sm uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-700 transition-all active:scale-95"
            >
              <FaHistory className="w-4 h-4 text-blue-500" />
              View History
            </button>
          </div>

          {loading ? (
            <div className="py-20 text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : meetings.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] sm:rounded-[3rem] shadow-sm py-20 text-center">
              <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6 text-slate-300">
                <FaCalendarAlt size={30} />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Meetings</h2>
              <p className="text-slate-500 mb-8 max-w-xs mx-auto text-[10px] sm:text-sm font-bold">You haven't booked any consultations yet. Browse our experts to get started.</p>
              <button onClick={() => window.location.href='/consultant'} className="px-6 py-3 bg-blue-600 text-white rounded-xl font-black shadow-lg shadow-blue-500/20 active:scale-95 transition-all text-sm uppercase tracking-widest">
                Find Expert
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {meetings.map((meeting: any) => (
                <div key={meeting._id} className="bg-white dark:bg-slate-900 rounded-[1.5rem] sm:rounded-[2rem] border border-slate-200 dark:border-slate-800 p-5 sm:p-8 hover:shadow-2xl hover:shadow-blue-500/10 transition-all">
                  <div className="flex items-start justify-between mb-4 sm:mb-6">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                        <FaUserTie size={20} />
                      </div>
                      <div>
                        <h3 className="font-black text-slate-900 dark:text-white text-sm sm:text-lg leading-tight tracking-tight">{meeting.title}</h3>
                        <p className="text-[9px] sm:text-xs text-slate-500 font-bold uppercase tracking-widest">{meeting.type || 'Video Call'}</p>
                      </div>
                    </div>
                    <div className="px-2 py-0.5 sm:px-3 sm:py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-lg text-[8px] sm:text-[10px] font-black uppercase tracking-widest">
                      Confirmed
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <div className="flex items-center gap-2 sm:gap-3 text-slate-600 dark:text-slate-400">
                      <FaCalendarAlt className="text-blue-500 text-xs sm:text-base" />
                      <span className="text-[11px] sm:text-sm font-bold">{new Date(meeting.startTime).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 text-slate-600 dark:text-slate-400">
                      <FaClock className="text-blue-500 text-xs sm:text-base" />
                      <span className="text-[11px] sm:text-sm font-bold">{new Date(meeting.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-auto">
                    <button 
                      onClick={() => window.location.href = meeting.meetLink}
                      className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-center font-black text-[11px] sm:text-sm shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 uppercase tracking-widest"
                    >
                      <FaVideo /> Join
                    </button>
                    <button className="px-4 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">
                      <FaLink />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
