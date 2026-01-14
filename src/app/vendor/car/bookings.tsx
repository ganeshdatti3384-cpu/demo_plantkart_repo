"use client";

import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { FaClipboardList, FaCheckCircle } from 'react-icons/fa';

export default function VendorCarBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);


  const fetchBookings = () => {
    setLoading(true);
    fetch('/api/vendor/car/bookings')
      .then(res => res.json())
      .then(data => {
        setBookings(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatusChange = async (bookingId: string, status: string) => {
    await fetch('/api/vendor/car/bookings/status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookingId, status })
    });
    fetchBookings();
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar activeService="Car Bookings" />
      <main className="flex-1 lg:max-h-screen lg:overflow-y-auto p-4 lg:p-12 pb-24 lg:pb-12">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto">
            <header className="mb-10">
              <h1 className="text-3xl font-black mb-2 flex items-center gap-3">
                <FaClipboardList className="text-blue-600" />
                Vehicle Bookings
              </h1>
            </header>
            {loading ? (
              <div className="text-center py-10">Loading...</div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-10 text-slate-400">No bookings found.</div>
            ) : (
              <div className="space-y-6">
                {bookings.map((booking: any) => (
                  <div key={booking._id} className="p-4 rounded-xl shadow bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-bold text-lg text-blue-600">{booking.title}</div>
                      <span className="text-xs font-bold uppercase tracking-widest text-slate-400">{booking.status}</span>
                    </div>
                    <div className="text-slate-600 dark:text-slate-300 text-sm mb-1">{booking.userName || booking.userEmail}</div>
                    <div className="text-slate-400 text-xs">Booked on: {new Date(booking.createdAt).toLocaleString()}</div>
                    <div className="mt-2 flex gap-2">
                      <button
                        className="px-3 py-1 rounded bg-green-500 text-white text-xs font-bold disabled:opacity-50"
                        disabled={booking.status === 'APPROVED'}
                        onClick={() => handleStatusChange(booking._id, 'APPROVED')}
                      >
                        Approve
                      </button>
                      <button
                        className="px-3 py-1 rounded bg-red-500 text-white text-xs font-bold disabled:opacity-50"
                        disabled={booking.status === 'REJECTED'}
                        onClick={() => handleStatusChange(booking._id, 'REJECTED')}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
