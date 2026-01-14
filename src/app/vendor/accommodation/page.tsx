"use client";
import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { FaHome, FaPlus, FaImage, FaMapMarkerAlt, FaDollarSign, FaCheckCircle } from 'react-icons/fa';

export default function VendorAccommodation() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/vendor/accommodation/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) setSuccess(true);
    } catch (err) {
      alert('Error creating listing');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: any) => setFormData({ ...formData, [e.target.name]: e.target.value });

  if (success) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-md mx-auto card shadow-2xl">
          <FaCheckCircle className="text-6xl text-emerald-500 mx-auto mb-6" />
          <h2 className="text-2xl font-black mb-2">Listing Submitted!</h2>
          <p className="text-slate-500 mb-8">Your property is now pending admin approval. It will be live for 14 days once approved.</p>
          <button onClick={() => window.location.href='/dashboard/vendor'} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar activeService="Property Listings" />
      <main className="flex-1 lg:max-h-screen lg:overflow-y-auto p-4 lg:p-12 pb-24 lg:pb-12">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto">
            <header className="mb-10">
              <h1 className="text-3xl font-black mb-2 flex items-center gap-3">
                <FaHome className="text-blue-600" />
                List Accommodation
              </h1>
              <p className="text-slate-600">Reach thousands of international students and arrivals.</p>
            </header>
            <form onSubmit={handleSubmit} className="card p-8 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="label">Property Title</label>
                  <input name="title" required onChange={handleChange} placeholder="e.g. Modern Studio near University" className="input-field" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Price per Week</label>
                    <div className="relative">
                      <input name="price" required onChange={handleChange} placeholder="350" className="input-field pl-10" />
                      <FaDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    </div>
                  </div>
                  <div>
                    <label className="label">Location (City/Suburb)</label>
                    <div className="relative">
                      <input name="location" required onChange={handleChange} placeholder="Urban City, NSW" className="input-field pl-10" />
                      <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="label">Full Address</label>
                  <input name="address" required onChange={handleChange} placeholder="123 Example Street, Suburb, NSW 2000" className="input-field" />
                </div>
                <div>
                  <label className="label">Amenities (Comma separated)</label>
                  <input name="amenities" onChange={handleChange} placeholder="WiFi, Laundry, Parking, Gym" className="input-field" />
                </div>
                <div>
                  <label className="label">Contact Details</label>
                  <input name="contactInfo" required onChange={handleChange} placeholder="Phone or Email for inquiries" className="input-field" />
                </div>
                <div>
                  <label className="label">Image URL</label>
                  <div className="relative">
                    <input name="image" required onChange={handleChange} placeholder="https://unsplash.com/..." className="input-field pl-10" />
                    <FaImage className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>
                <div>
                  <label className="label">Description</label>
                  <textarea name="description" rows={4} onChange={handleChange} className="input-field resize-none" placeholder="Describe facilities, distance to transport, etc."></textarea>
                </div>
              </div>
              <button disabled={loading} className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black shadow-xl shadow-blue-500/20 active:scale-95 transition-all">
                {loading ? 'Posting...' : 'Submit Listing for Approval'}
              </button>
              <p className="text-center text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                Listings expire automatically after 14 days
              </p>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
