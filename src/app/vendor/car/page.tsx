"use client";
import React, { useState, useEffect } from 'react';
import { FaCar, FaPlus, FaImage, FaMapMarkerAlt, FaDollarSign, FaCheckCircle, FaCogs, FaSearch } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import Sidebar from '@/components/Sidebar';

export default function VendorCarListing() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [myVehicles, setMyVehicles] = useState([]);
  const [loadingVehicles, setLoadingVehicles] = useState(true);
  const [searchLocation, setSearchLocation] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    location: '',
    image: '',
    specs: 'Automatic • Petrol',
    type: 'RENT',
    description: '',
    condition: 'Excellent'
  });

  useEffect(() => {
    fetchMyVehicles();
  }, []);

  const fetchMyVehicles = async () => {
    try {
      const res = await fetch('/api/vendor/car/my');
      const data = await res.json();
      setMyVehicles(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch vehicles:', err);
    } finally {
      setLoadingVehicles(false);
    }
  };

  const filteredVehicles = myVehicles.filter(vehicle => {
    const matchesLocation = !searchLocation || 
      vehicle.location?.toLowerCase().includes(searchLocation.toLowerCase());
    const matchesStatus = statusFilter === 'all' || vehicle.status === statusFilter;
    return matchesLocation && matchesStatus;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/vendor/car/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setSuccess(true);
        toast.success('Vehicle submitted for approval!');
        setTimeout(() => {
          setSuccess(false);
          setShowForm(false);
          fetchMyVehicles();
          setFormData({
            title: '',
            price: '',
            location: '',
            image: '',
            specs: 'Automatic • Petrol',
            type: 'RENT',
            description: '',
            condition: 'Excellent'
          });
        }, 2000);
      } else {
        toast.error('Failed to create listing');
      }
    } catch (err) {
      toast.error('Error creating listing');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: any) => setFormData({ ...formData, [e.target.name]: e.target.value });

  if (success) {
    return (
      <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50 dark:bg-slate-950">
        <Sidebar activeService="Car Rental" />
        <main className="flex-1 lg:max-h-screen lg:overflow-y-auto p-4 lg:p-12 pb-24 lg:pb-12">
          <div className="container mx-auto px-4 py-20 text-center">
            <div className="max-w-md mx-auto bg-white dark:bg-slate-900 rounded-[2rem] p-10 shadow-2xl border border-slate-200 dark:border-slate-800">
              <FaCheckCircle className="text-6xl text-emerald-500 mx-auto mb-6" />
              <h2 className="text-2xl font-black mb-2">Vehicle Submitted!</h2>
              <p className="text-slate-500 mb-8">Your vehicle is now pending admin approval. It will be live for 14 days once approved.</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar activeService="Car Rental" />
      
      <main className="flex-1 lg:max-h-screen lg:overflow-y-auto p-4 lg:p-12 pb-24 lg:pb-12">
        <div className="max-w-7xl mx-auto px-2 md:px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 md:mb-12">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center bg-indigo-500/10 backdrop-blur-md shadow-sm">
                <FaCar className="w-7 h-7 md:w-8 md:h-8 text-indigo-500" />
              </div>
              <div>
                <h1 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-none mb-1">
                  My Vehicles
                </h1>
                <p className="text-xs md:text-sm font-bold text-slate-400 uppercase tracking-widest leading-none">
                  Manage your car listings
                </p>
              </div>
            </div>
            
            <button 
              onClick={() => setShowForm(!showForm)}
              className="flex items-center justify-center gap-2 px-6 py-4 bg-indigo-600 text-white rounded-2xl shadow-sm font-black text-sm uppercase tracking-widest hover:bg-indigo-700 transition-all active:scale-95"
            >
              <FaPlus className="w-4 h-4" />
              {showForm ? 'View My Vehicles' : 'List Vehicle'}
            </button>
          </div>

          {showForm ? (
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-slate-200 dark:border-slate-800">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Vehicle Title</label>
                    <input name="title" required onChange={handleChange} value={formData.title} placeholder="e.g. Toyota Camry 2020" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Type</label>
                      <select name="type" required onChange={handleChange} value={formData.type} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        <option value="RENT">For Rent</option>
                        <option value="SELL">For Sale</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Price (AUD)</label>
                      <div className="relative">
                        <input name="price" required onChange={handleChange} value={formData.price} placeholder="50/day or 15000" className="w-full px-4 py-3 pl-10 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        <FaDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Location</label>
                      <div className="relative">
                        <input name="location" required onChange={handleChange} value={formData.location} placeholder="Adelaide CBD" className="w-full px-4 py-3 pl-10 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Condition</label>
                      <select name="condition" required onChange={handleChange} value={formData.condition} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        <option value="Excellent">Excellent</option>
                        <option value="Good">Good</option>
                        <option value="Fair">Fair</option>
                        <option value="New">New</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Specifications</label>
                    <div className="relative">
                      <input name="specs" required onChange={handleChange} value={formData.specs} placeholder="Automatic • Petrol • 4 Seats" className="w-full px-4 py-3 pl-10 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                      <FaCogs className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Image URL</label>
                    <div className="relative">
                      <input name="image" required onChange={handleChange} value={formData.image} placeholder="https://unsplash.com/..." className="w-full px-4 py-3 pl-10 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                      <FaImage className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Description</label>
                    <textarea name="description" rows={4} onChange={handleChange} value={formData.description} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" placeholder="Describe the vehicle condition, features, etc."></textarea>
                  </div>
                </div>

                <button disabled={loading} className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black shadow-xl shadow-indigo-500/20 active:scale-95 transition-all">
                  {loading ? 'Posting...' : 'Submit Vehicle for Approval'}
                </button>
                
                <p className="text-center text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                  Listings expire automatically after 14 days
                </p>
              </form>
            </div>
          ) : (
            <>
              <div className="flex flex-col md:flex-row gap-4 mb-10">
                <div className="relative flex-1">
                  <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search Adelaide, Glenelg, North Adelaide..." 
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-[13px] sm:text-base font-medium"
                  />
                </div>
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-6 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-[13px] sm:text-base font-medium"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              {loadingVehicles ? (
                <div className="py-20 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                </div>
              ) : filteredVehicles.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 p-20 text-center">
                  <FaCar className="text-5xl text-slate-200 dark:text-slate-800 mx-auto mb-4" />
                  <p className="text-slate-500 font-bold mb-4">No vehicles found</p>
                  <button 
                    onClick={() => { setSearchLocation(''); setStatusFilter('all'); }}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredVehicles.map((vehicle: any) => (
                    <div key={vehicle._id} className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl transition-all">
                      <div className="relative h-48">
                        <img src={vehicle.image} alt={vehicle.title} className="w-full h-full object-cover" />
                        <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur rounded-full text-xs font-black uppercase">
                          <span className={`${
                            vehicle.status === 'approved' ? 'text-emerald-600' : 
                            vehicle.status === 'rejected' ? 'text-rose-600' : 
                            'text-amber-600'
                          }`}>
                            {vehicle.status}
                          </span>
                        </div>
                        <div className="absolute top-4 left-4 px-3 py-1 bg-indigo-600 text-white rounded-full text-xs font-black">
                          {vehicle.type}
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">{vehicle.title}</h3>
                        <p className="text-slate-500 text-sm mb-2 flex items-center gap-2">
                          <FaMapMarkerAlt className="text-indigo-500" /> {vehicle.location}
                        </p>
                        <p className="text-slate-400 text-xs mb-4">{vehicle.specs} • {vehicle.condition}</p>
                        <p className="text-indigo-600 font-black text-lg">AUD {vehicle.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
