"use client";
import React, { useState, useEffect } from 'react';
import { FaVideo, FaClock, FaDollarSign, FaMapMarkerAlt, FaCheckCircle, FaUserTie, FaPlus, FaSearch } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import Sidebar from '@/components/Sidebar';

export default function VendorMeetingsPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [myServices, setMyServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [searchLocation, setSearchLocation] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [formData, setFormData] = useState({
    title: '',
    specialization: '',
    duration: '30',
    price: '',
    location: '',
    availability: '',
    description: '',
    contactInfo: ''
  });

  useEffect(() => {
    fetchMyServices();
  }, []);

  const fetchMyServices = async () => {
    try {
      const res = await fetch('/api/vendor/meetings/my');
      const data = await res.json();
      setMyServices(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch services:', err);
    } finally {
      setLoadingServices(false);
    }
  };

  const filteredServices = myServices.filter(service => {
    const matchesLocation = !searchLocation || 
      service.location?.toLowerCase().includes(searchLocation.toLowerCase());
    const matchesStatus = statusFilter === 'all' || service.status === statusFilter;
    return matchesLocation && matchesStatus;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/vendor/meetings/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setSuccess(true);
        toast.success('Service submitted for approval!');
        setTimeout(() => {
          setSuccess(false);
          setShowForm(false);
          fetchMyServices();
          setFormData({
            title: '',
            specialization: '',
            duration: '30',
            price: '',
            location: '',
            availability: '',
            description: '',
            contactInfo: ''
          });
        }, 2000);
      } else {
        toast.error('Failed to create service');
      }
    } catch (err) {
      toast.error('Error creating meeting service');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: any) => setFormData({ ...formData, [e.target.name]: e.target.value });

  if (success) {
    return (
      <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50 dark:bg-slate-950">
        <Sidebar activeService="Meetings" />
        <main className="flex-1 lg:max-h-screen lg:overflow-y-auto p-4 lg:p-12 pb-24 lg:pb-12">
          <div className="container mx-auto px-4 py-20 text-center">
            <div className="max-w-md mx-auto bg-white dark:bg-slate-900 rounded-[2rem] p-10 shadow-2xl border border-slate-200 dark:border-slate-800">
              <FaCheckCircle className="text-6xl text-emerald-500 mx-auto mb-6" />
              <h2 className="text-2xl font-black mb-2">Service Submitted!</h2>
              <p className="text-slate-500 mb-8">Your meeting service is pending admin approval and will be bookable once approved.</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar activeService="Meetings" />
      
      <main className="flex-1 lg:max-h-screen lg:overflow-y-auto p-4 lg:p-12 pb-24 lg:pb-12">
        <div className="max-w-7xl mx-auto px-2 md:px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 md:mb-12">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center bg-blue-600/10 backdrop-blur-md shadow-sm">
                <FaVideo className="w-7 h-7 md:w-8 md:h-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-none mb-1">
                  My Services
                </h1>
                <p className="text-xs md:text-sm font-bold text-slate-400 uppercase tracking-widest leading-none">
                  Manage your meeting services
                </p>
              </div>
            </div>
            
            <button 
              onClick={() => setShowForm(!showForm)}
              className="flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white rounded-2xl shadow-sm font-black text-sm uppercase tracking-widest hover:bg-blue-700 transition-all active:scale-95"
            >
              <FaPlus className="w-4 h-4" />
              {showForm ? 'View My Services' : 'Create Service'}
            </button>
          </div>

          {showForm ? (
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-slate-200 dark:border-slate-800">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Service Title</label>
                    <input name="title" required onChange={handleChange} value={formData.title} placeholder="e.g. Career Coaching Session" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Specialization</label>
                      <select name="specialization" required onChange={handleChange} value={formData.specialization} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">Select...</option>
                        <option value="Career">Career Guidance</option>
                        <option value="Immigration">Immigration Advice</option>
                        <option value="Education">Education Planning</option>
                        <option value="Business">Business Consulting</option>
                        <option value="Legal">Legal Advisory</option>
                        <option value="Financial">Financial Planning</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Duration (minutes)</label>
                      <div className="relative">
                        <input name="duration" type="number" required onChange={handleChange} value={formData.duration} className="w-full px-4 py-3 pl-10 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        <FaClock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Price per Session (AUD)</label>
                      <div className="relative">
                        <input name="price" type="number" required onChange={handleChange} value={formData.price} placeholder="50" className="w-full px-4 py-3 pl-10 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        <FaDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Location</label>
                      <div className="relative">
                        <input name="location" required onChange={handleChange} value={formData.location} placeholder="Adelaide, SA" className="w-full px-4 py-3 pl-10 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Availability</label>
                    <input name="availability" required onChange={handleChange} value={formData.availability} placeholder="e.g. Mon-Fri 9AM-5PM" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Contact Information</label>
                    <input name="contactInfo" required onChange={handleChange} value={formData.contactInfo} placeholder="Email or Phone" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Service Description</label>
                    <textarea name="description" rows={4} onChange={handleChange} value={formData.description} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" placeholder="Describe your expertise, what clients can expect, and how you can help..."></textarea>
                  </div>
                </div>

                <button disabled={loading} className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black shadow-xl shadow-blue-500/20 active:scale-95 transition-all">
                  {loading ? 'Submitting...' : 'Submit Service for Approval'}
                </button>
                
                <p className="text-center text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                  Services require admin approval before going live
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
                    className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-[13px] sm:text-base font-medium"
                  />
                </div>
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-6 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-[13px] sm:text-base font-medium"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              {loadingServices ? (
                <div className="py-20 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                </div>
              ) : filteredServices.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 p-20 text-center">
                  <FaVideo className="text-5xl text-slate-200 dark:text-slate-800 mx-auto mb-4" />
                  <p className="text-slate-500 font-bold mb-4">No services found</p>
                  <button 
                    onClick={() => { setSearchLocation(''); setStatusFilter('all'); }}
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredServices.map((service: any) => (
                    <div key={service._id} className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-xl transition-all">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20">
                            <FaUserTie className="text-blue-600 text-xl" />
                          </div>
                          <div>
                            <h3 className="text-lg font-black text-slate-900 dark:text-white">{service.title}</h3>
                            <p className="text-xs text-slate-500 font-bold uppercase">{service.specialization}</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                          service.status === 'approved' ? 'bg-emerald-100 text-emerald-600' : 
                          service.status === 'rejected' ? 'bg-rose-100 text-rose-600' : 
                          'bg-amber-100 text-amber-600'
                        }`}>
                          {service.status}
                        </span>
                      </div>
                      <div className="space-y-2 mb-4">
                        <p className="text-slate-500 text-sm flex items-center gap-2">
                          <FaMapMarkerAlt className="text-blue-500" /> {service.location}
                        </p>
                        <p className="text-slate-400 text-xs">
                          {service.duration} min • AUD ${service.price}
                        </p>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2">{service.description}</p>
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
