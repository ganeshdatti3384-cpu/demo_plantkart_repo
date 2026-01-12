"use client";
import React, { useState, useEffect } from 'react';
import { FaHome, FaPlus, FaImage, FaMapMarkerAlt, FaDollarSign, FaCheckCircle, FaSearch } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import Sidebar from '@/components/Sidebar';

export default function VendorAccommodation() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [myListings, setMyListings] = useState([]);
  const [loadingListings, setLoadingListings] = useState(true);
  const [searchLocation, setSearchLocation] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    location: '',
    address: '',
    image: '',
    description: '',
    amenities: '',
    contactInfo: ''
  });

  useEffect(() => {
    fetchMyListings();
  }, []);

  const fetchMyListings = async () => {
    try {
      const res = await fetch('/api/vendor/accommodation/my');
      const data = await res.json();
      setMyListings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch listings:', err);
    } finally {
      setLoadingListings(false);
    }
  };

  const filteredListings = myListings.filter(listing => {
    const matchesLocation = !searchLocation || 
      listing.location?.toLowerCase().includes(searchLocation.toLowerCase());
    const matchesStatus = statusFilter === 'all' || listing.status === statusFilter;
    return matchesLocation && matchesStatus;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/vendor/accommodation/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setSuccess(true);
        toast.success('Listing submitted for approval!');
        setTimeout(() => {
          setSuccess(false);
          setShowForm(false);
          fetchMyListings();
          setFormData({
            title: '',
            price: '',
            location: '',
            address: '',
            image: '',
            description: '',
            amenities: '',
            contactInfo: ''
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
        <Sidebar activeService="Accommodation" />
        <main className="flex-1 lg:max-h-screen lg:overflow-y-auto p-4 lg:p-12 pb-24 lg:pb-12">
          <div className="container mx-auto px-4 py-20 text-center">
            <div className="max-w-md mx-auto bg-white dark:bg-slate-900 rounded-[2rem] p-10 shadow-2xl border border-slate-200 dark:border-slate-800">
              <FaCheckCircle className="text-6xl text-emerald-500 mx-auto mb-6" />
              <h2 className="text-2xl font-black mb-2">Listing Submitted!</h2>
              <p className="text-slate-500 mb-8">Your property is now pending admin approval. It will be live for 14 days once approved.</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar activeService="Accommodation" />
      
      <main className="flex-1 lg:max-h-screen lg:overflow-y-auto p-4 lg:p-12 pb-24 lg:pb-12">
        <div className="max-w-7xl mx-auto px-2 md:px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 md:mb-12">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center bg-emerald-500/10 backdrop-blur-md shadow-sm">
                <FaHome className="w-7 h-7 md:w-8 md:h-8 text-emerald-500" />
              </div>
              <div>
                <h1 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-none mb-1">
                  My Properties
                </h1>
                <p className="text-xs md:text-sm font-bold text-slate-400 uppercase tracking-widest leading-none">
                  Manage your accommodation listings
                </p>
              </div>
            </div>
            
            <button 
              onClick={() => setShowForm(!showForm)}
              className="flex items-center justify-center gap-2 px-6 py-4 bg-emerald-600 text-white rounded-2xl shadow-sm font-black text-sm uppercase tracking-widest hover:bg-emerald-700 transition-all active:scale-95"
            >
              <FaPlus className="w-4 h-4" />
              {showForm ? 'View My Properties' : 'List Property'}
            </button>
          </div>

          {showForm ? (
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-slate-200 dark:border-slate-800">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Property Title</label>
                    <input name="title" required onChange={handleChange} value={formData.title} placeholder="e.g. Modern Studio near University" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Price per Week</label>
                      <div className="relative">
                        <input name="price" required onChange={handleChange} value={formData.price} placeholder="350" className="w-full px-4 py-3 pl-10 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                        <FaDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Location (City/Suburb)</label>
                      <div className="relative">
                        <input name="location" required onChange={handleChange} value={formData.location} placeholder="Adelaide CBD" className="w-full px-4 py-3 pl-10 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                        <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Full Address</label>
                    <input name="address" required onChange={handleChange} value={formData.address} placeholder="123 Example Street, Adelaide SA 5000" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Amenities (Comma separated)</label>
                    <input name="amenities" onChange={handleChange} value={formData.amenities} placeholder="WiFi, Laundry, Parking, Gym" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Contact Details</label>
                    <input name="contactInfo" required onChange={handleChange} value={formData.contactInfo} placeholder="Phone or Email for inquiries" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Image URL</label>
                    <div className="relative">
                      <input name="image" required onChange={handleChange} value={formData.image} placeholder="https://unsplash.com/..." className="w-full px-4 py-3 pl-10 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                      <FaImage className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Description</label>
                    <textarea name="description" rows={4} onChange={handleChange} value={formData.description} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none" placeholder="Describe facilities, distance to transport, etc."></textarea>
                  </div>
                </div>

                <button disabled={loading} className="w-full py-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black shadow-xl shadow-emerald-500/20 active:scale-95 transition-all">
                  {loading ? 'Posting...' : 'Submit Listing for Approval'}
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
                    className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-[13px] sm:text-base font-medium"
                  />
                </div>
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-6 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-[13px] sm:text-base font-medium"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              {loadingListings ? (
                <div className="py-20 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
                </div>
              ) : filteredListings.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 p-20 text-center">
                  <FaHome className="text-5xl text-slate-200 dark:text-slate-800 mx-auto mb-4" />
                  <p className="text-slate-500 font-bold mb-4">No properties found</p>
                  <button 
                    onClick={() => { setSearchLocation(''); setStatusFilter('all'); }}
                    className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredListings.map((listing: any) => (
                    <div key={listing._id} className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl transition-all">
                      <div className="relative h-48">
                        <img src={listing.image} alt={listing.title} className="w-full h-full object-cover" />
                        <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur rounded-full text-xs font-black uppercase">
                          <span className={`${
                            listing.status === 'approved' ? 'text-emerald-600' : 
                            listing.status === 'rejected' ? 'text-rose-600' : 
                            'text-amber-600'
                          }`}>
                            {listing.status}
                          </span>
                        </div>
                        <div className="absolute top-4 left-4 px-3 py-1 bg-emerald-600 text-white rounded-full text-xs font-black">
                          AUD {listing.price}/wk
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">{listing.title}</h3>
                        <p className="text-slate-500 text-sm mb-4 flex items-center gap-2">
                          <FaMapMarkerAlt className="text-emerald-500" /> {listing.location}
                        </p>
                        <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2">{listing.description}</p>
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
