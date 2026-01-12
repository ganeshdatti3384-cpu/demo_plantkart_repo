'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  FaPlaneArrival, FaHome, FaCar, FaUserTie, FaMoneyBillWave, 
  FaHandshake, FaPlus, FaArrowLeft, FaHistory, FaCheckCircle, FaTimes
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import Sidebar from '@/components/Sidebar';

const serviceConfig: any = {
  'airport-pickup': {
    title: 'Airport Pickup History',
    icon: FaPlaneArrival,
    color: 'text-blue-500',
    api: '/api/airport-pickup/my-requests',
    newLink: '/airport-pickup',
    cols: ['Flight', 'Arrival', 'Status', 'Payment']
  },
  'accommodation': {
    title: 'Accommodation History',
    icon: FaHome,
    color: 'text-emerald-500',
    api: '/api/accommodation/my-requests',
    newLink: '/accommodation',
    cols: ['Property', 'Date', 'Status', 'Payment']
  },
  'car-rental': {
    title: 'Car Rental History',
    icon: FaCar,
    color: 'text-indigo-500',
    api: '/api/car/my-requests',
    newLink: '/car',
    cols: ['Vehicle', 'Date', 'Status', 'Payment']
  },
  'consultancy': {
    title: 'Consultation History',
    icon: FaUserTie,
    color: 'text-purple-500',
    api: '/api/consultant-booking/my-bookings',
    newLink: '/consultant',
    cols: ['Expert', 'Slot', 'Status', 'Meeting']
  },
  'loan-services': {
    title: 'Loan Request History',
    icon: FaMoneyBillWave,
    color: 'text-amber-500',
    api: '/api/loan/my-requests',
    newLink: '/loan',
    cols: ['Amount/Purpose', 'Date', 'Status', 'Payment']
  },
  'meetings': {
    title: 'Scheduled Meetings',
    icon: FaHandshake,
    color: 'text-blue-600',
    api: '/api/meetings/my',
    newLink: '/meetings',
    cols: ['Title', 'Time', 'Status', 'Link']
  },
  'community-events': {
    title: 'Community Events',
    icon: FaHistory,
    color: 'text-pink-500',
    api: '/api/events/my-registrations',
    newLink: '/events',
    cols: ['Event', 'Date', 'Status', 'Tickets']
  }
};

export default function ServiceHistoryPage() {
  const params = useParams();
  const router = useRouter();
  const type = params.type as string; // pickup, accommodation, car, consultancy, loan, meeting

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const config = serviceConfig[type];

  useEffect(() => {
    if (!config) return;
    async function fetchData() {
      try {
        const res = await fetch(config.api);
        const json = await res.json();
        setData(Array.isArray(json) ? json : []);
      } catch (err) {
        toast.error('Failed to load history');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [type, config]);

  if (!config) return <div className="p-20 text-center font-black">Invalid Service Type</div>;

  const sidebarNameMap: any = {
    'airport-pickup': 'Airport Pickup',
    'accommodation': 'Accommodation',
    'car-rental': 'Car Rental',
    'consultancy': 'Consultancy',
    'loan-services': 'Loan Services',
    'meetings': 'Meetings',
    'community-events': 'Community Events'
  };

  const handleShowDetail = (item: any) => {
    setSelectedItem(item);
    setShowDetailModal(true);
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50 dark:bg-slate-900 overflow-hidden font-geist">
      <Sidebar activeService={sidebarNameMap[type]} />
      <main className="flex-1 min-h-screen pb-24 md:pb-8 flex flex-col pt-2 px-4 md:p-8">
        <div className="max-w-7xl mx-auto w-full flex-grow flex flex-col">
          {/* iOS-Style Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6 md:mb-8 pt-0 md:pt-4">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center ${config.color.replace('text-', 'bg-').replace('/10', '/20')} backdrop-blur-md shadow-sm`}>
                <config.icon className={`w-7 h-7 md:w-8 md:h-8 ${config.color}`} />
              </div>
              <div>
                <h1 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-none mb-1">
                  {config.title}
                </h1>
                <p className="text-xs md:text-sm font-bold text-slate-400 uppercase tracking-widest leading-none">
                  Activity History
                </p>
              </div>
            </div>
            
            <button 
              onClick={() => router.push(config.newLink)}
              className="flex items-center justify-center gap-2 px-6 py-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 font-black text-sm uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-700 transition-all active:scale-95"
            >
              <FaPlus className="w-4 h-4 text-blue-500" />
              New Request
            </button>
          </div>

          {loading ? (
            <div className="flex-grow flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : data.length === 0 ? (
            <div className="flex-grow flex flex-col items-center justify-center py-20 px-6 text-center bg-white dark:bg-slate-800/50 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
              <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-3xl flex items-center justify-center mb-6">
                <FaHistory className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No History Yet</h3>
              <p className="text-slate-400 max-w-xs mx-auto text-sm font-medium mb-8">You haven't made any {config.title.toLowerCase()} requests yet.</p>
              <button 
                onClick={() => router.push(config.newLink)}
                className="flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-blue-500/25 hover:bg-blue-700 transition-all active:scale-95"
              >
                <FaPlus className="w-4 h-4" />
                Make First Request
              </button>
            </div>
          ) : (
            <div className="flex-grow flex flex-col space-y-4">
              {/* Mobile Card List (md:hidden) */}
              <div className="md:hidden space-y-4">
                {data.map((item: any) => (
                  <div key={item._id} className="bg-white dark:bg-slate-800 p-5 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-xl ${config.color.replace('text-', 'bg-').replace('/10', '/20')}`}>
                          <config.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-black text-slate-900 dark:text-white text-sm">
                            {type === 'airport-pickup' && item.flightNumber}
                            {type === 'accommodation' && item.accommodationType}
                            {type === 'car-rental' && item.carType}
                            {type === 'consultancy' && 'Consultation'}
                            {type === 'loan-services' && `$${item.amount}`}
                            {type === 'meetings' && item.title}
                            {type === 'community-events' && item.eventTitle}
                          </p>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                            {type === 'airport-pickup' && `To ${item.arrivalAirport}`}
                            {type === 'accommodation' && item.city}
                            {type === 'car-rental' && (item.carName || 'Rental')}
                            {type === 'consultancy' && 'Expert Session'}
                            {type === 'loan-services' && item.purpose}
                            {type === 'meetings' && 'Virtual'}
                            {type === 'community-events' && item.eventLocation}
                          </p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                        (item.status === 'APPROVED' || item.status === 'BOOKED') ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                      }`}>
                        {item.status || 'PENDING'}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50 dark:border-slate-700/50">
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Date</p>
                        <p className="text-xs font-bold text-slate-600 dark:text-slate-400">
                          {new Date(item.startTime || item.arrivalDate || item.checkIn || item.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Payment</p>
                        <p className={`text-xs font-black uppercase ${item.paymentStatus === 'PAID' ? 'text-emerald-500' : 'text-rose-500'}`}>
                          {item.paymentStatus || 'UNPAID'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table View (hidden on mobile) */}
              <div className="hidden md:block bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left table-fixed">
                    <thead>
                      <tr className="border-b border-slate-50 dark:border-slate-700 font-black text-slate-400 uppercase tracking-tighter text-sm">
                        <th className="px-4 py-3 w-2/5">Info</th>
                        <th className="px-4 py-3">Date</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Action</th>
                        <th className="px-4 py-3 text-right pr-12">Detail</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-700 font-bold">
                      {data.map((item: any) => (
                        <tr key={item._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/50 transition-colors">
                          {type === 'airport-pickup' && (
                            <>
                              <td className="px-4 py-3 overflow-hidden">
                                  <p className="font-bold text-slate-900 dark:text-white text-base truncate mb-1">{item.flightNumber}</p>
                                  <p className="text-[10px] font-black text-slate-400 uppercase truncate tracking-tighter">To {item.arrivalAirport}</p>
                              </td>
                              <td className="px-4 py-3 text-base text-slate-600 dark:text-slate-400 font-bold truncate">{new Date(item.arrivalDate).toLocaleDateString()}</td>
                              <td className="px-4 py-3">
                                <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider ${
                                  item.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                                }`}>{item.status}</span>
                              </td>
                              <td className="px-4 py-3">
                                <span className={`text-[10px] font-black uppercase tracking-tighter ${item.paymentStatus === 'PAID' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                  {item.paymentStatus || 'UNPAID'}
                                </span>
                              </td>
                            </>
                          )}

                          {type === 'accommodation' && (
                            <>
                              <td className="px-4 py-3 overflow-hidden">
                                  <p className="font-bold text-slate-900 dark:text-white text-base truncate mb-1">{item.accommodationType}</p>
                                  <p className="text-[10px] font-black text-slate-400 uppercase truncate tracking-tighter">{item.city}</p>
                              </td>
                              <td className="px-4 py-3 text-base text-slate-600 dark:text-slate-400 font-bold truncate">{new Date(item.checkIn).toLocaleDateString()}</td>
                              <td className="px-4 py-3">
                                <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider ${
                                  item.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                                }`}>{item.status}</span>
                              </td>
                              <td className="px-4 py-3">
                                <span className={`text-[10px] font-black uppercase tracking-tighter ${item.paymentStatus === 'PAID' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                  {item.paymentStatus || 'UNPAID'}
                                </span>
                              </td>
                            </>
                          )}

                          {type === 'car-rental' && (
                            <>
                              <td className="px-4 py-3 overflow-hidden">
                                <div className="flex items-center gap-3">
                                  {item.image && (
                                    <img src={item.image} className="w-12 h-8 object-cover rounded-md" alt="" />
                                  )}
                                  <div className="min-w-0">
                                    <p className="font-bold text-slate-900 dark:text-white text-base truncate mb-0.5">{item.title || item.carTitle || 'Vehicle'}</p>
                                    <p className="text-[10px] font-black text-slate-400 uppercase truncate tracking-tighter">{item.type || 'RENT'}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-base text-slate-600 dark:text-slate-400 font-bold truncate">{new Date(item.createdAt).toLocaleDateString()}</td>
                              <td className="px-4 py-3">
                                <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider ${
                                  item.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                                }`}>{item.status || 'PENDING'}</span>
                              </td>
                              <td className="px-4 py-3">
                                <span className={`text-[10px] font-black uppercase tracking-tighter ${item.paymentStatus === 'PAID' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                  {item.paymentStatus || 'UNPAID'}
                                </span>
                              </td>
                            </>
                          )}

                          {type === 'consultancy' && (
                            <>
                              <td className="px-4 py-3 overflow-hidden">
                                  <p className="font-bold text-slate-900 dark:text-white text-base truncate mb-1">Consultation</p>
                                  <p className="text-[10px] font-black text-slate-400 uppercase truncate tracking-tighter">Expert session</p>
                              </td>
                              <td className="px-4 py-3 text-base text-slate-600 dark:text-slate-400 font-bold truncate">{item.slot}</td>
                            </>
                          )}

                          {type === 'loan-services' && (
                            <>
                              <td className="px-4 py-3 overflow-hidden">
                                  <p className="font-bold text-slate-900 dark:text-white text-base truncate mb-1">${item.amount}</p>
                                  <p className="text-[10px] font-black text-slate-400 uppercase truncate tracking-tighter">{item.purpose}</p>
                              </td>
                              <td className="px-4 py-3 text-base text-slate-600 dark:text-slate-400 font-bold truncate">{new Date(item.createdAt).toLocaleDateString()}</td>
                              <td className="px-4 py-3">
                                <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider ${
                                  item.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                                }`}>{item.status || 'PENDING'}</span>
                              </td>
                              <td className="px-4 py-3">
                                <span className={`text-[10px] font-black uppercase tracking-tighter ${item.paymentStatus === 'PAID' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                  {item.paymentStatus || 'UNPAID'}
                                </span>
                              </td>
                            </>
                          )}

                          {type === 'meetings' && (
                            <>
                              <td className="px-4 py-3 overflow-hidden">
                                  <p className="font-bold text-slate-900 dark:text-white text-base truncate mb-1">{item.title}</p>
                                  <p className="text-[10px] font-black text-slate-400 uppercase truncate tracking-tighter">Virtual Meeting</p>
                              </td>
                              <td className="px-4 py-3 text-base text-slate-600 dark:text-slate-400 font-bold truncate">{new Date(item.startTime).toLocaleString()}</td>
                              <td className="px-4 py-3">
                                <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider ${
                                  item.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                                }`}>{item.status || 'PENDING'}</span>
                              </td>
                              <td className="px-4 py-3">
                                <span className={`text-[10px] font-black uppercase tracking-tighter ${item.paymentStatus === 'PAID' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                  {item.paymentStatus || 'UNPAID'}
                                </span>
                              </td>
                            </>
                          )}

                          {type === 'community-events' && (
                            <>
                              <td className="px-4 py-3 overflow-hidden">
                                <div className="flex items-center gap-3">
                                  {item.eventImage && (
                                    <img src={item.eventImage} className="w-12 h-8 object-cover rounded-md" alt="" />
                                  )}
                                  <div className="min-w-0">
                                    <p className="font-bold text-slate-900 dark:text-white text-base truncate mb-0.5">{item.eventTitle}</p>
                                    <p className="text-[10px] font-black text-slate-400 uppercase truncate tracking-tighter">{item.eventLocation}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-base text-slate-600 dark:text-slate-400 font-bold truncate">
                                {new Date(item.eventDate).toLocaleDateString()}
                              </td>
                              <td className="px-4 py-3">
                                <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider ${
                                  item.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                                }`}>{item.status || 'PENDING'}</span>
                              </td>
                              <td className="px-4 py-3">
                                <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                                  {item.tickets || 1} Tickets
                                </span>
                              </td>
                            </>
                          )}

                          <td className="px-4 py-3 text-right pr-12">
                            <button 
                              onClick={() => handleShowDetail(item)}
                              className="text-blue-600 hover:text-blue-700 transition-colors text-[10px] font-black uppercase whitespace-nowrap tracking-widest"
                            >
                              Detail →
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Detail Modal */}
      {showDetailModal && selectedItem && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xl z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 sm:p-12">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Request Details</h2>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Ref: {selectedItem._id}</p>
                </div>
                <button onClick={() => setShowDetailModal(false)} className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl text-slate-400 hover:text-rose-500 transition-all">
                  <FaTimes />
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-4 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800">
                  <div className="w-16 h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center text-2xl text-blue-600">
                    {config.icon && <config.icon />}
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 dark:text-white text-lg">
                      {selectedItem.title || selectedItem.carTitle || selectedItem.accommodationType || config.title}
                    </h3>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{selectedItem.status || 'PENDING'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Date</p>
                    <p className="font-bold text-slate-900 dark:text-white">
                      {new Date(selectedItem.createdAt || selectedItem.arrivalDate || selectedItem.startTime).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Payment</p>
                    <p className={`font-black uppercase ${selectedItem.paymentStatus === 'PAID' ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {selectedItem.paymentStatus || 'UNPAID'}
                    </p>
                  </div>
                </div>

                {/* Service Specific Details */}
                <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  {type === 'car-rental' && (
                    <div className="grid grid-cols-1 gap-4">
                       <div className="flex justify-between items-center text-sm">
                          <span className="text-slate-500 font-bold">Price</span>
                          <span className="text-slate-900 dark:text-white font-black">${selectedItem.price}</span>
                       </div>
                       {selectedItem.specs && (
                         <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-500 font-bold">Specs</span>
                            <span className="text-slate-900 dark:text-white font-black">{selectedItem.specs}</span>
                         </div>
                       )}
                       {selectedItem.location && (
                         <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-500 font-bold">Pickup Zone</span>
                            <span className="text-slate-900 dark:text-white font-black">{selectedItem.location}</span>
                         </div>
                       )}
                    </div>
                  )}

                  {type === 'airport-pickup' && (
                    <div className="grid grid-cols-1 gap-4">
                       <div className="flex justify-between items-center text-sm">
                          <span className="text-slate-500 font-bold">Flight Number</span>
                          <span className="text-slate-900 dark:text-white font-black">{selectedItem.flightNumber}</span>
                       </div>
                       <div className="flex justify-between items-center text-sm">
                          <span className="text-slate-500 font-bold">Airport</span>
                          <span className="text-slate-900 dark:text-white font-black">{selectedItem.arrivalAirport}</span>
                       </div>
                    </div>
                  )}

                  {type === 'community-events' && (
                    <div className="grid grid-cols-1 gap-4">
                       <div className="flex justify-between items-center text-sm">
                          <span className="text-slate-500 font-bold">Event</span>
                          <span className="text-slate-900 dark:text-white font-black">{selectedItem.eventTitle}</span>
                       </div>
                       <div className="flex justify-between items-center text-sm">
                          <span className="text-slate-500 font-bold">Tickets</span>
                          <span className="text-slate-900 dark:text-white font-black">{selectedItem.tickets || 1}</span>
                       </div>
                       <div className="flex justify-between items-center text-sm">
                          <span className="text-slate-500 font-bold">Location</span>
                          <span className="text-slate-900 dark:text-white font-black">{selectedItem.eventLocation}</span>
                       </div>
                    </div>
                  )}
                  
                  {(selectedItem.adminNotes || selectedItem.vendorNotes) && (
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-2xl">
                       <p className="text-[9px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-1">
                         {selectedItem.vendorId ? 'Partner Message' : 'Admin Message'}
                       </p>
                       <p className="text-xs font-bold text-slate-600 dark:text-slate-300 italic">"{selectedItem.adminNotes || selectedItem.vendorNotes}"</p>
                    </div>
                  )}
                </div>
              </div>

              <button 
                onClick={() => setShowDetailModal(false)}
                className="w-full mt-10 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-xs uppercase tracking-[0.2em]"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}