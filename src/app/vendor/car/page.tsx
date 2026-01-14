"use client";
import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { FaCar, FaPlus, FaImage, FaMapMarkerAlt, FaDollarSign, FaCheckCircle, FaCogs } from 'react-icons/fa';

export default function VendorCarListing() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    location: '',
    image: '',
    specs: 'Automatic • Petrol',
    type: 'RENT', // RENT or SELL
    description: '',
    condition: 'Excellent'
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
          <h2 className="text-2xl font-black mb-2">Vehicle Submitted!</h2>
          <p className="text-slate-500 mb-8">Your vehicle is now pending admin approval. It will be live for 14 days once approved.</p>
          <button onClick={() => window.location.href='/dashboard/vendor'} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar activeService="Car Listings" />
      <main className="flex-1 lg:max-h-screen lg:overflow-y-auto p-4 lg:p-12 pb-24 lg:pb-12">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto">
            <header className="mb-10">
              <h1 className="text-3xl font-black mb-2 flex items-center gap-3">
                <FaCar className="text-blue-600" />
                Add Vehicle Listing
              </h1>
              <p className="text-slate-600">List your car for rent or for sale.</p>
            </header>

            <form onSubmit={handleSubmit} className="card p-8 space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Listing Type</label>
                    <select name="type" className="input-field" onChange={handleChange} value={formData.type}>
                      <option value="RENT">For Rent</option>
                      <option value="SELL">For Sale</option>
                    </select>
                  </div>
                  <div>
                    <label className="label">Vehicle Model & Year</label>
                    <input name="title" required onChange={handleChange} placeholder="e.g. 2023 Tesla Model 3" className="input-field" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">{formData.type === 'RENT' ? 'Rent per Day (AUD)' : 'Selling Price (AUD)'}</label>
                    <div className="relative">
                      <input name="price" required onChange={handleChange} placeholder="85" className="input-field pl-10" />
                      <FaDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    </div>
                  </div>
                  <div>
                    <label className="label">Location</label>
                    <div className="relative">
                      <input name="location" required onChange={handleChange} placeholder="Sydney Airport" className="input-field pl-10" />
                      <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Specifications</label>
                    <div className="relative">
                      <input name="specs" required onChange={handleChange} placeholder="e.g. Automatic • Electric" className="input-field pl-10" />
                      <FaCogs className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    </div>
                  </div>
                  <div>
                    <label className="label">Condition</label>
                    <input name="condition" onChange={handleChange} placeholder="e.g. Excellent, New, Used" className="input-field" />
                  </div>
                </div>

                <div>
                  <label className="label">Description</label>
                  <textarea name="description" rows={3} onChange={handleChange} className="input-field resize-none" placeholder="Provide more details about the car..."></textarea>
                </div>

                <div>
                  <label className="label">Vehicle Image URL</label>
                  <div className="relative">
                    <input name="image" required onChange={handleChange} placeholder="https://unsplash.com/..." className="input-field pl-10" />
                    <FaImage className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>
              </div>

              <button disabled={loading} className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black shadow-xl shadow-blue-500/20 active:scale-95 transition-all">
                {loading ? 'Posting...' : 'List Vehicle'}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
