'use client';

import React, { useEffect, useState } from 'react';
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaQuoteLeft, 
  FaSave, 
  FaCamera, 
  FaArrowLeft, 
  FaGlobe, 
  FaMapMarkerAlt, 
  FaPassport, 
  FaExclamationTriangle, 
  FaGraduationCap, 
  FaEdit 
} from 'react-icons/fa';
import Sidebar from '@/components/Sidebar';
import { toast } from 'react-hot-toast';

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState({
    name: '',
    email: '',
    bio: '',
    role: '',
    citizenship: 'Australian',
    countryDetails: '',
    mobileAustralia: '',
    mobilePresent: '',
    address: '',
    visaType: '',
    otherVisaType: '',
    visaTenure: '',
    visaDetails: '',
    visaGrantNumber: '',
    visaExpiryDate: '',
    passportNumber: '',
    isStudent: false,
    collegeDetails: '',
    collegeAddress: '',
    profileCompleted: false
  });

  useEffect(() => {
    fetch('/api/auth/profile')
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          const profileData = {
            name: data.name || '',
            email: data.email || '',
            bio: data.bio || '',
            role: data.role || '',
            citizenship: data.citizenship || 'Australian',
            countryDetails: data.countryDetails || '',
            mobileAustralia: data.mobileAustralia || '',
            mobilePresent: data.mobilePresent || '',
            address: data.address || '',
            visaType: data.visaType || '',
            otherVisaType: data.otherVisaType || '',
            visaTenure: data.visaTenure || '',
            visaDetails: data.visaDetails || '',
            visaGrantNumber: data.visaGrantNumber || '',
            visaExpiryDate: data.visaExpiryDate || '',
            passportNumber: data.passportNumber || '',
            isStudent: data.isStudent || false,
            collegeDetails: data.collegeDetails || '',
            collegeAddress: data.collegeAddress || '',
            profileCompleted: data.profileCompleted || false
          };
          setUser(profileData);
          
          // Automatically open editor for first-time users
          if (!data.profileCompleted) {
            setIsEditing(true);
          }
        }
        setLoading(false);
      });
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user.name.trim()) return toast.error('Full name is required');
    if (!user.address.trim()) return toast.error('Residential address is required');
    if (!user.mobileAustralia.trim()) return toast.error('Australian mobile number is required');

    // Validation for International Users
    if (user.citizenship === 'Other') {
      if (!user.countryDetails) return toast.error('Country details are required');
      if (!user.visaType) return toast.error('Visa type is required');
      if (user.visaType === 'Other' && !user.otherVisaType) return toast.error('Please specify your other visa type');
      if (!user.visaTenure) return toast.error('Visa tenure is required');
    }

    // Validation for Students
    if (user.isStudent) {
      if (!user.collegeDetails) return toast.error('College name is required');
      if (!user.collegeAddress) return toast.error('College address is required');
    }

    setUpdating(true);
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: user.name,
          bio: user.bio,
          citizenship: user.citizenship,
          countryDetails: user.countryDetails,
          mobileAustralia: user.mobileAustralia,
          mobilePresent: user.mobilePresent,
          address: user.address,
          visaType: user.visaType,
          otherVisaType: user.otherVisaType,
          visaTenure: user.visaTenure,
          visaDetails: user.visaDetails,
          visaGrantNumber: user.visaGrantNumber,
          visaExpiryDate: user.visaExpiryDate,
          passportNumber: user.passportNumber,
          isStudent: user.isStudent,
          collegeDetails: user.collegeDetails,
          collegeAddress: user.collegeAddress
        })
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Profile updated successfully!');
        setUser(prev => ({ ...prev, profileCompleted: true }));
      } else {
        toast.error(data.error || 'Failed to update profile');
      }
    } catch (err) {
      toast.error('Something went wrong');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50 dark:bg-slate-950">
        <Sidebar activeService="Profile" />
        <main className="flex-1 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-[100dvh] bg-slate-50 dark:bg-slate-950 overflow-hidden font-geist">
      <Sidebar activeService="Profile" />

      <main className="flex-1 lg:max-h-screen lg:overflow-y-auto p-4 sm:p-6 lg:p-12 pb-safe lg:pb-12 pt-4">
        <div className="max-w-4xl mx-auto w-full">
          <header className="flex items-center gap-4 mb-8 pt-4">
            <button 
              onClick={() => window.history.back()}
              className="p-2.5 sm:p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-500 shadow-sm transition-all hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <FaArrowLeft size={14} />
            </button>
            <div className="flex-1">
              <h1 className="text-xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tighter">My Profile</h1>
              <p className="text-[9px] sm:text-sm font-bold text-slate-500 uppercase tracking-widest mt-0.5 sm:mt-1">Manage your identity & preferences</p>
            </div>
            {!user.profileCompleted && !isEditing && (
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 rounded-xl text-[10px] font-black uppercase tracking-widest animate-pulse">
                <FaExclamationTriangle /> Action Required: Complete Profile
              </div>
            )}
            {!isEditing && (
              <button 
                onClick={() => setIsEditing(true)}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/20 transition-all active:scale-95 flex items-center gap-2"
              >
                <FaEdit /> Edit Profile
              </button>
            )}
            {isEditing && user.profileCompleted && (
               <button 
               onClick={() => setIsEditing(false)}
               className="px-6 py-3 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-black text-xs uppercase tracking-widest transition-all active:scale-95"
             >
               Cancel
             </button>
            )}
          </header>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] sm:rounded-[3rem] shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden">
            {/* Profile Header Block */}
            <div className="p-6 sm:p-12 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-900/50 border-b border-slate-100 dark:border-slate-800">
              <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10">
                <div className="relative group">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-tr from-blue-600 to-indigo-700 rounded-[2rem] flex items-center justify-center text-white text-4xl sm:text-5xl font-black shadow-2xl shadow-blue-500/30 ring-4 ring-white dark:ring-slate-800">
                    {user.name?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                  </div>
                  {isEditing && (
                    <button className="absolute -bottom-2 -right-2 p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-blue-600 shadow-xl transition-transform hover:scale-110">
                      <FaCamera size={14} />
                    </button>
                  )}
                </div>
                <div className="text-center sm:text-left space-y-2">
                  <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">{user.name || 'Set your name'}</h2>
                  <div className="flex flex-wrap justify-center sm:justify-start gap-3">
                    <span className="px-4 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-200 dark:border-blue-800/50">
                      {user.role}
                    </span>
                    <span className="flex items-center gap-2 px-4 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-200 dark:border-slate-700">
                      <FaEnvelope className="text-[9px]" /> {user.email}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-12">
              {!isEditing ? (
                <div className="space-y-12">
                  {/* Read Only View */}
                  <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12">
                    <DetailItem label="Full Name" value={user.name} icon={<FaUser />} />
                    <DetailItem label="Citizenship" value={user.citizenship} icon={<FaGlobe />} />
                    {user.citizenship === 'Other' && (
                      <DetailItem label="Country of Origin" value={user.countryDetails} icon={<FaGlobe />} />
                    )}
                    <DetailItem label="Mobile (AU)" value={user.mobileAustralia} icon={<FaPhone />} />
                    {user.citizenship === 'Other' && (
                      <DetailItem label="Country Mobile" value={user.mobilePresent} icon={<FaPhone />} />
                    )}
                    <div className="md:col-span-2">
                      <DetailItem label="Physical Address" value={user.address} icon={<FaMapMarkerAlt />} />
                    </div>
                  </section>

                  {(user.isStudent || user.citizenship === 'Other') && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-slate-100 dark:border-slate-800">
                      {user.isStudent && (
                        <div className="space-y-6">
                           <h3 className="text-xs font-black text-blue-600 uppercase tracking-[0.2em] flex items-center gap-2">
                            <FaGraduationCap /> Academic Details
                          </h3>
                          <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl space-y-4">
                            <DetailItem label="Institution" value={user.collegeDetails} icon={<FaGraduationCap />} />
                            <DetailItem label="College Address" value={user.collegeAddress} icon={<FaMapMarkerAlt />} />
                          </div>
                        </div>
                      )}

                      {user.citizenship === 'Other' && (
                        <div className="space-y-6">
                           <h3 className="text-xs font-black text-indigo-600 uppercase tracking-[0.2em] flex items-center gap-2">
                            <FaPassport /> Visa Status
                          </h3>
                          <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl space-y-4">
                            <DetailItem label="Visa Type" value={user.visaType === 'Other' ? user.otherVisaType : user.visaType} icon={<FaPassport />} />
                            <DetailItem label="Tenure" value={user.visaTenure} icon={<FaPassport />} />
                            <DetailItem label="Grant #" value={user.visaGrantNumber} icon={<FaPassport />} />
                            <DetailItem label="Passport" value={user.passportNumber} icon={<FaPassport />} />
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <section className="pt-8 border-t border-slate-100 dark:border-slate-800">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                      <FaQuoteLeft className="size-3" /> About / Bio
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed italic italic-bg-slate-50 dark:bg-slate-800/30 p-6 rounded-3xl">
                      {user.bio || 'Your bio is currently empty. Tell the community about your journey.'}
                    </p>
                  </section>
                </div>
              ) : (
                <form onSubmit={(e) => { handleUpdate(e); setIsEditing(false); }} className="space-y-10">
                  {/* Edit Form Content - Reuse your existing logic but styled for the single card */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Full Name</label>
                      <input 
                        type="text" 
                        value={user.name}
                        onChange={(e) => setUser({...user, name: e.target.value})}
                        className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-blue-500 rounded-2xl transition-all font-bold dark:text-white text-sm outline-none" 
                        placeholder="John Doe"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Citizenship Status</label>
                      <select 
                        value={user.citizenship}
                        onChange={(e) => setUser({...user, citizenship: e.target.value})}
                        className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-blue-500 rounded-2xl transition-all font-bold dark:text-white text-sm outline-none appearance-none"
                      >
                        <option value="Australian">Australian Citizen</option>
                        <option value="Other">Other / International</option>
                      </select>
                    </div>

                    {user.citizenship === 'Other' && (
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Country of Origin</label>
                        <input 
                          type="text" 
                          value={user.countryDetails}
                          onChange={(e) => setUser({...user, countryDetails: e.target.value})}
                          className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-blue-500 rounded-2xl transition-all font-bold dark:text-white text-sm outline-none" 
                          placeholder="e.g. India"
                        />
                      </div>
                    )}

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Mobile (Australia)</label>
                      <input 
                        type="text" 
                        value={user.mobileAustralia}
                        onChange={(e) => setUser({...user, mobileAustralia: e.target.value})}
                        className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-blue-500 rounded-2xl transition-all font-bold dark:text-white text-sm outline-none" 
                        placeholder="+61 XXX XXX XXX"
                      />
                    </div>

                    {user.citizenship === 'Other' && (
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Country Mobile</label>
                        <input 
                          type="text" 
                          value={user.mobilePresent}
                          onChange={(e) => setUser({...user, mobilePresent: e.target.value})}
                          className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-blue-500 rounded-2xl transition-all font-bold dark:text-white text-sm outline-none" 
                          placeholder="Optional"
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Residential Address</label>
                    <input 
                      type="text" 
                      value={user.address}
                      onChange={(e) => setUser({...user, address: e.target.value})}
                      className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-blue-500 rounded-2xl transition-all font-bold dark:text-white text-sm outline-none" 
                      placeholder="Street, Suburb, Postcode"
                    />
                  </div>

                  <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-8">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Are you currently a student?</label>
                      <div className="flex gap-2 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl w-full sm:w-auto">
                        <button 
                          type="button"
                          onClick={() => setUser({...user, isStudent: true})}
                          className={`flex-1 sm:px-8 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${user.isStudent ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-500'}`}
                        >
                          Yes
                        </button>
                        <button 
                          type="button"
                          onClick={() => setUser({...user, isStudent: false})}
                          className={`flex-1 sm:px-8 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${!user.isStudent ? 'bg-slate-600 text-white shadow-lg shadow-slate-500/20' : 'text-slate-500'}`}
                        >
                          No
                        </button>
                      </div>
                    </div>

                    {user.isStudent && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 sm:p-8 bg-blue-50/50 dark:bg-blue-900/10 rounded-[2rem] border-2 border-blue-100 dark:border-blue-900/30">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest px-1">College/Institution</label>
                          <input 
                            type="text" 
                            value={user.collegeDetails}
                            onChange={(e) => setUser({...user, collegeDetails: e.target.value})}
                            className="w-full px-6 py-4 bg-white dark:bg-slate-900 border-2 border-transparent focus:border-blue-500 rounded-2xl transition-all font-bold dark:text-white text-sm outline-none" 
                            placeholder="Institution Name"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest px-1">College Address</label>
                          <input 
                            type="text" 
                            value={user.collegeAddress}
                            onChange={(e) => setUser({...user, collegeAddress: e.target.value})}
                            className="w-full px-6 py-4 bg-white dark:bg-slate-900 border-2 border-transparent focus:border-blue-500 rounded-2xl transition-all font-bold dark:text-white text-sm outline-none" 
                            placeholder="College Location"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {user.citizenship === 'Other' && (
                    <div className="p-6 sm:p-10 bg-slate-50 dark:bg-slate-800/30 rounded-[2.5rem] border-2 border-slate-100 dark:border-slate-800 space-y-8">
                       <h3 className="text-xs font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2">
                        <FaPassport /> Visa Verification details
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Visa Subclass</label>
                          <select 
                            value={user.visaType}
                            onChange={(e) => setUser({...user, visaType: e.target.value})}
                            className="w-full px-6 py-4 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-2xl transition-all font-bold text-sm outline-none appearance-none"
                          >
                            <option value="">Select Type</option>
                            <option value="Student (Subclass 500)">Student (500)</option>
                            <option value="Temporary Graduate (Subclass 485)">Graduate (485)</option>
                            <option value="Visitor (Subclass 600)">Visitor (600)</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                        {user.visaType === 'Other' && (
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Specify Visa</label>
                            <input 
                              type="text" 
                              value={user.otherVisaType}
                              onChange={(e) => setUser({...user, otherVisaType: e.target.value})}
                              className="w-full px-6 py-4 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-sm outline-none" 
                            />
                          </div>
                        )}
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Tenure</label>
                          <select 
                            value={user.visaTenure}
                            onChange={(e) => setUser({...user, visaTenure: e.target.value})}
                            className="w-full px-6 py-4 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-sm outline-none appearance-none"
                          >
                            <option value="1 - 2 years">1 - 2 years</option>
                            <option value="Permanent">Permanent</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Grant Number</label>
                          <input 
                            type="text" 
                            value={user.visaGrantNumber}
                            onChange={(e) => setUser({...user, visaGrantNumber: e.target.value})}
                            className="w-full px-6 py-4 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-sm outline-none" 
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Professional Bio</label>
                    <textarea 
                      value={user.bio}
                      onChange={(e) => setUser({...user, bio: e.target.value})}
                      rows={5}
                      className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-blue-500 rounded-[2rem] transition-all font-bold dark:text-white text-sm outline-none resize-none" 
                      placeholder="Share your story..."
                    />
                  </div>

                  <div className="pt-6 flex gap-4">
                    <button 
                      type="submit" 
                      disabled={updating}
                      className="flex-1 py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-blue-500/20 transition-all active:scale-95 flex items-center justify-center gap-3"
                    >
                      {updating ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <><FaSave size={14} /> Commit Changes</>
                      )}
                    </button>
                    <button 
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-10 py-5 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all"
                    >
                      Discard
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function DetailItem({ label, value, icon }: { label: string; value: any; icon: any }) {
  return (
    <div className="space-y-1.5 transition-all hover:translate-x-1">
      <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.15em]">{label}</p>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-blue-500 text-sm border border-slate-100 dark:border-slate-700">
          {icon}
        </div>
        <p className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
          {value || <span className="text-slate-300 dark:text-slate-700 font-medium">Not specified</span>}
        </p>
      </div>
    </div>
  );
}
