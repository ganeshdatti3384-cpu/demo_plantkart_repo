"use client";
import React from 'react';
import { FaBell, FaCheck, FaExclamationTriangle, FaInfoCircle, FaCalendarAlt, FaTrash, FaTimes } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';

export default function NotificationsPage() {
  const router = useRouter();
  const notifications = [
    {
      id: 1,
      type: 'info',
      title: 'Consultancy Booked',
      message: 'Your meeting with Dr. Rahul Sharma is confirmed for Tomorrow at 10:00 AM.',
      time: '2 hours ago',
      isRead: false
    },
    {
      id: 2,
      type: 'success',
      title: 'Payment Successful',
      message: 'We have received your payment of $543.50 for the booking #OV-9284.',
      time: '5 hours ago',
      isRead: true
    },
    {
      id: 3,
      type: 'warning',
      title: 'Action Required',
      message: 'Please upload your ID proof to complete the Loan Application process.',
      time: '1 day ago',
      isRead: true
    }
  ];

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50 dark:bg-slate-900 overflow-hidden font-geist">
      <Sidebar activeService="Notifications" />
      <main className="flex-1 min-h-screen pb-24 md:pb-8 flex flex-col pt-4 px-4 md:p-8">
        <div className="max-w-4xl mx-auto w-full flex-grow flex flex-col">
          <header className="flex items-center justify-between mb-12 relative pt-4">
            <div>
              <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2">Notifications</h1>
              <p className="text-slate-500 font-medium text-sm md:text-base">Stay updated with your latest activities and alerts.</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="hidden md:block text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-xl border border-blue-100 dark:border-blue-800">
                Mark all read
              </button>
              <button 
                onClick={() => router.back()}
                className="p-3 bg-white dark:bg-slate-800 text-slate-500 hover:text-rose-500 rounded-2xl transition-all shadow-sm border border-slate-100 dark:border-slate-800 group"
                title="Close"
              >
                <FaTimes className="group-hover:rotate-90 transition-transform duration-200" />
              </button>
            </div>
          </header>

          <div className="space-y-4">
            {notifications.map((notif) => (
              <div key={notif.id} className={`p-6 flex gap-6 transition-all rounded-[2rem] border-2 bg-white dark:bg-slate-800/50 ${!notif.isRead ? 'border-blue-500/20 bg-blue-50/10 dark:bg-blue-900/5 ring-1 ring-blue-500/10' : 'border-transparent shadow-sm'}`}>
                <div className={`p-4 rounded-2xl shrink-0 h-fit ${
                  notif.type === 'success' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500' :
                  notif.type === 'warning' ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-500' :
                  'bg-blue-50 dark:bg-blue-900/20 text-blue-500'
                }`}>
                  {notif.type === 'success' ? <FaCheck /> : notif.type === 'warning' ? <FaExclamationTriangle /> : <FaInfoCircle />}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white truncate pr-4">{notif.title}</h3>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">{notif.time}</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">
                    {notif.message}
                  </p>
                  <div className="flex items-center gap-4">
                    <button className="text-xs font-bold text-blue-600 hover:underline">View Details</button>
                    <button className="text-xs font-bold text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1">
                      <FaTrash size={10} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {notifications.length === 0 && (
            <div className="py-20 text-center bg-white dark:bg-slate-800/30 rounded-[3rem] border-dashed border-2 border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="w-20 h-20 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-300 mx-auto mb-6 transition-transform hover:scale-110">
                <FaBell size={40} />
              </div>
              <h3 className="text-xl font-bold text-slate-400 mb-2">No new notifications</h3>
              <p className="text-slate-500 text-sm">We'll let you know when something important happens.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

