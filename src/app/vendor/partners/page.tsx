"use client";
import React, { useState, useEffect } from 'react';
import { FaHandshake, FaTag, FaMapMarkerAlt, FaImage, FaCheckCircle, FaStore, FaPlus, FaSearch } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import Sidebar from '@/components/Sidebar';

export default function VendorPartnersPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [myOffers, setMyOffers] = useState([]);
  const [loadingOffers, setLoadingOffers] = useState(true);
  const [searchLocation, setSearchLocation] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [formData, setFormData] = useState({
    name: '',
    category: 'Retail',
    discount: '',
    location: '',
    address: '',
    image: '',
    description: '',
    terms: '',
    contactInfo: ''
  });

  useEffect(() => {
    fetchMyOffers();
  }, []);

  const fetchMyOffers = async () => {
    try {
      const res = await fetch('/api/vendor/partners/my');
      const data = await res.json();
      setMyOffers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch offers:', err);
    } finally {
      setLoadingOffers(false);
    }
  };

  const filteredOffers = myOffers.filter(offer => {
    const matchesLocation = !searchLocation || 
      offer.location?.toLowerCase().includes(searchLocation.toLowerCase());
    const matchesStatus = statusFilter === 'all' || offer.status === statusFilter;
    return matchesLocation && matchesStatus;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/vendor/partners/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setSuccess(true);
        toast.success('Partner offer submitted for approval!');
        setTimeout(() => {
          setSuccess(false);
          setShowForm(false);
          fetchMyOffers();
          setFormData({
            name: '',
            category: 'Retail',
            discount: '',
            location: '',
            address: '',
            image: '',
            description: '',
            terms: '',
            contactInfo: ''
          });
        }, 2000);
      } else {
        toast.error('Failed to create offer');
      }
    } catch (err) {
      toast.error('Error creating partner offer');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: any) => setFormData({ ...formData, [e.target.name]: e.target.value });

  if (success) {
    return (
      <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50 dark:bg-slate-950">
        <Sidebar activeService="Partner Perks" />
        <main className="flex-1 lg:max-h-screen lg:overflow-y-auto p-4 lg:p-12 pb-24 lg:pb-12">
          <div className="container mx-auto px-4 py-20 text-center">
            <div className="max-w-md mx-auto bg-white dark:bg-slate-900 rounded-[2rem] p-10 shadow-2xl border border-slate-200 dark:border-slate-800">
              <FaCheckCircle className="text-6xl text-emerald-500 mx-auto mb-6" />
              <h2 className="text-2xl font-black mb-2">Partner Offer Submitted!</h2>
              <p className="text-slate-500 mb-8">Your partnership offer is pending admin approval and will be visible to users once approved.</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar activeService="Partner Perks" />
      
      <main className="flex-1 lg:max-h-screen lg:overflow-y-auto p-4 lg:p-12 pb-24 lg:pb-12">
        <div className="max-w-7xl mx-auto px-2 md:px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 md:mb-12">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center bg-teal-500/10 backdrop-blur-md shadow-sm">
                <FaHandshake className="w-7 h-7 md:w-8 md:h-8 text-teal-500" />
              </div>
              <div>
                <h1 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-none mb-1">
                  My Partner Offers
                </h1>
                <p className="text-xs md:text-sm font-bold text-slate-400 uppercase tracking-widest leading-none">
                  Manage your partnership deals
                </p>
              </div>
            </div>
            
            <button 
              onClick={() => setShowForm(!showForm)}
              className="flex items-center justify-center gap-2 px-6 py-4 bg-teal-600 text-white rounded-2xl shadow-sm font-black text-sm uppercase tracking-widest hover:bg-teal-700 transition-all active:scale-95"
            >
              <FaPlus className="w-4 h-4" />
              {showForm ? 'View My Offers' : 'Create Offer'}
            </button>
          </div>

          {showForm ? (
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-slate-200 dark:border-slate-800">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Business Name</label>
                    <input name="name" required onChange={handleChange} value={formData.name} placeholder="e.g. Adelaide Fitness Center" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Category</label>
                      <select name="category" required onChange={handleChange} value={formData.category} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500">
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
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Discount Offer</label>
                      <div className="relative">
                        <input name="discount" required onChange={handleChange} value={formData.discount} placeholder="e.g. 20% OFF" className="w-full px-4 py-3 pl-10 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500" />
                        <FaTag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Location (City/Suburb)</label>
                      <div className="relative">
                        <input name="location" required onChange={handleChange} value={formData.location} placeholder="Adelaide CBD" className="w-full px-4 py-3 pl-10 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500" />
                        <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Full Address</label>
                      <input name="address" required onChange={handleChange} value={formData.address} placeholder="123 Example St, Adelaide" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Contact Information</label>
                    <input name="contactInfo" required onChange={handleChange} value={formData.contactInfo} placeholder="Email or Phone" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500" />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Business Logo/Image URL</label>
                    <div className="relative">
                      <input name="image" required onChange={handleChange} value={formData.image} placeholder="https://unsplash.com/..." className="w-full px-4 py-3 pl-10 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500" />
                      <FaImage className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Offer Description</label>
                    <textarea name="description" rows={3} onChange={handleChange} value={formData.description} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none" placeholder="Describe your business and what makes this offer special..."></textarea>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Terms & Conditions</label>
                    <textarea name="terms" rows={3} onChange={handleChange} value={formData.terms} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none" placeholder="Valid until, exclusions, redemption process, etc."></textarea>
                  </div>
                </div>

                <button disabled={loading} className="w-full py-5 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl font-black shadow-xl shadow-teal-500/20 active:scale-95 transition-all">
                  {loading ? 'Submitting...' : 'Submit Partner Offer for Approval'}
                </button>
                
                <p className="text-center text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                  Partner offers require admin approval before going live
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
                    className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500/50 text-[13px] sm:text-base font-medium"
                  />
                </div>
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-6 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500/50 text-[13px] sm:text-base font-medium"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              {loadingOffers ? (
                <div className="py-20 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
                </div>
              ) : filteredOffers.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 p-20 text-center">
                  <FaHandshake className="text-5xl text-slate-200 dark:text-slate-800 mx-auto mb-4" />
                  <p className="text-slate-500 font-bold mb-4">No partner offers found</p>
                  <button 
                    onClick={() => { setSearchLocation(''); setStatusFilter('all'); }}
                    className="px-6 py-3 bg-teal-600 text-white rounded-xl font-bold"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredOffers.map((offer: any) => (
                    <div key={offer._id} className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-xl transition-all">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                            <img src={offer.image} alt={offer.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <h3 className="text-lg font-black text-slate-900 dark:text-white">{offer.name}</h3>
                            <p className="text-xs text-slate-500 font-bold uppercase">{offer.category}</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                          offer.status === 'approved' ? 'bg-emerald-100 text-emerald-600' : 
                          offer.status === 'rejected' ? 'bg-rose-100 text-rose-600' : 
                          'bg-amber-100 text-amber-600'
                        }`}>
                          {offer.status}
                        </span>
                      </div>
                      <div className="bg-teal-50 dark:bg-teal-900/20 rounded-xl p-4 mb-4">
                        <p className="text-xl font-black text-teal-600 dark:text-teal-400">{offer.discount}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-slate-500 text-sm flex items-center gap-2">
                          <FaMapMarkerAlt className="text-teal-500" /> {offer.location}
                        </p>
                        <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2">{offer.description}</p>
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
