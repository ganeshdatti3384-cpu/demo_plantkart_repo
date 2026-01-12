"use client";
import React from 'react';
import { FaBell, FaCheck, FaExclamationTriangle, FaInfoCircle, FaCalendarAlt, FaTrash } from 'react-icons/fa';

export default function NotificationsPage() {
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
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <header className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2">Notifications</h1>
            <p className="text-slate-500 font-medium">Stay updated with your latest activities and alerts.</p>
          </div>
          <button className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-xl">
            Mark all read
          </button>
        </header>

        <div className="space-y-4">
          {notifications.map((notif) => (
            <div key={notif.id} className={`card p-6 flex gap-6 transition-all border-2 ${!notif.isRead ? 'border-blue-500/20 bg-blue-50/10 dark:bg-blue-900/5 ring-1 ring-blue-500/10' : 'border-transparent'}`}>
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
          <div className="py-20 text-center card bg-slate-50/50 dark:bg-slate-800/30 border-dashed border-2">
            <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-300 mx-auto mb-6">
              <FaBell size={40} />
            </div>
            <h3 className="text-xl font-bold text-slate-400 mb-2">No new notifications</h3>
            <p className="text-slate-500 text-sm">We'll let you know when something important happens.</p>
          </div>
        )}
      </div>
    </div>
  );
}

