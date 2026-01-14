"use client";
import React, { useEffect, useState } from 'react';
import { FaUsers, FaEnvelope, FaIdBadge, FaUserTag, FaSearch, FaUserShield, FaHistory, FaCheckCircle, FaTimesCircle, FaBan, FaToggleOn, FaToggleOff, FaTrashAlt, FaEdit } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

export default function AdminUserManager() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', email: '', role: '' });
  const [userActivity, setUserActivity] = useState<any>(null);

  const fetchUsers = () => {
    setLoading(true);
    fetch(`/api/admin/users?search=${search}&role=${roleFilter}`)
      .then(res => res.json())
      .then(data => {
        setUsers(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const handleEdit = (user: any) => {
    setEditForm({ name: user.name, email: user.email, role: user.role });
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const updateUserInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/admin/users/${selectedUser._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      });
      if (res.ok) {
        toast.success('User updated');
        setShowEditModal(false);
        fetchUsers();
      }
    } catch (err) {
      toast.error('Update failed');
    }
  };

  const deleteUser = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this identity?')) return;
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Identity purged successfully');
        fetchUsers();
      } else {
        const data = await res.json();
        toast.error(data.error || 'Purge failed');
      }
    } catch (err) {
      toast.error('Network error during purge');
    }
  };

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isDisabled: !currentStatus })
      });
      if (res.ok) {
        toast.success(`User ${!currentStatus ? 'disabled' : 'enabled'} successfully`);
        fetchUsers();
        if (selectedUser?._id === userId) {
          setSelectedUser({ ...selectedUser, isDisabled: !currentStatus });
        }
      }
    } catch (err) {
      toast.error('Failed to update user status');
    }
  };

  const viewDetails = async (user: any) => {
    setSelectedUser(user);
    setShowDetailModal(true);
    setUserActivity(null);
    try {
      const res = await fetch(`/api/admin/users/${user._id}`);
      const data = await res.json();
      setUserActivity(data.activity);
    } catch (err) {
      console.error('Failed to fetch activity');
    }
  };

  const filteredUsers = users.filter((u: any) => 
    u.email?.toLowerCase().includes(search.toLowerCase()) || 
    u.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <header className="mb-8 lg:flex items-center justify-between gap-8 bg-slate-900/40 border border-white/5 p-8 rounded-[2.5rem] text-white">
        <div>
          <h1 className="text-2xl font-black text-white mb-1 flex items-center gap-3 tracking-tight">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white text-lg shadow-lg shadow-blue-500/20">
              <FaUsers />
            </div>
            User Identity Manager
          </h1>
          <p className="text-slate-400 text-sm font-bold italic">Review platform identities, roles, and security compliance.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3 mt-4 lg:mt-0">
          <div className="relative w-full sm:w-64">
            <input 
              type="text" 
              placeholder="Search people..." 
              className="w-full bg-slate-800/50 border border-white/5 py-3 pl-10 pr-4 rounded-xl text-sm focus:ring-1 ring-blue-500 transition-all font-bold text-white placeholder:text-slate-500"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 size-3.5" />
          </div>
          <select 
            className="bg-slate-800/50 border border-white/5 py-3 px-4 rounded-xl text-sm font-bold text-white focus:ring-1 ring-blue-500 transition-all"
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
          >
            <option value="all">All Roles</option>
            <option value="user" className="bg-slate-900">Normal Users</option>
            <option value="consultant" className="bg-slate-900">Consultants</option>
            <option value="admin" className="bg-slate-900">Administrators</option>
          </select>
        </div>
      </header>

      <div className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] overflow-hidden">
        {loading ? (
          <div className="p-20 text-center">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-500 font-black uppercase tracking-widest text-xs">Synchronizing Identity Vault...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 bg-white/5">
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Identity</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Role</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Stability</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredUsers.map((user: any) => (
                  <tr key={user._id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-black text-blue-500 border border-white/10">
                          {user.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="font-black text-white text-sm">{user.name}</p>
                          <p className="text-[10px] font-bold text-slate-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                        user.role === 'admin' ? 'bg-amber-500/20 text-amber-500' :
                        user.role === 'consultant' ? 'bg-purple-500/20 text-purple-500' :
                        'bg-blue-500/20 text-blue-500'
                      }`}>
                        <FaUserShield className="size-2.5" />
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {user.isDisabled ? (
                        <span className="flex items-center gap-2 text-rose-500 font-black text-[10px] uppercase tracking-widest">
                          <FaBan className="size-3" /> Suspended
                        </span>
                      ) : (
                        <span className="flex items-center gap-2 text-emerald-500 font-black text-[10px] uppercase tracking-widest">
                          <FaCheckCircle className="size-3" /> Secure
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => viewDetails(user)}
                          className="p-2 hover:bg-blue-600/20 text-slate-400 hover:text-blue-500 rounded-lg transition-colors"
                          title="View Intelligence"
                        >
                          <FaHistory className="size-4" />
                        </button>
                        <button 
                          onClick={() => handleEdit(user)}
                          className="p-2 hover:bg-emerald-600/20 text-slate-400 hover:text-emerald-500 rounded-lg transition-colors"
                          title="Update Identity"
                        >
                          <FaEdit className="size-4" />
                        </button>
                        <button 
                          onClick={() => toggleUserStatus(user._id, user.isDisabled)}
                          className={`p-2 rounded-lg transition-colors ${
                            user.isDisabled 
                            ? 'hover:bg-emerald-600/20 text-emerald-500' 
                            : 'hover:bg-rose-600/20 text-rose-500'
                          }`}
                        >
                          {user.isDisabled ? <FaToggleOff className="size-5" /> : <FaToggleOn className="size-5" />}
                        </button>
                        <button 
                          onClick={() => deleteUser(user._id)}
                          className="p-2 hover:bg-rose-600/20 text-slate-400 hover:text-rose-500 rounded-lg transition-colors"
                          title="Purge Identity"
                        >
                          <FaTrashAlt className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Profile Detail Modal */}
      {showDetailModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#0f172a] border border-white/10 w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl">
            <div className="p-8 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-3xl bg-blue-600/20 flex items-center justify-center text-3xl text-blue-500 font-black">
                  {selectedUser.name?.charAt(0)}
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white">{selectedUser.name}</h2>
                  <p className="text-slate-500 font-bold">{selectedUser.email}</p>
                </div>
              </div>
              <button 
                onClick={() => setShowDetailModal(false)}
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                <FaTimesCircle className="size-5 text-slate-500" />
              </button>
            </div>
            
            <div className="p-8">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-6 flex items-center gap-2">
                <div className="w-4 h-0.5 bg-blue-600"></div> Usage Intelligence
              </h3>
              
              {!userActivity ? (
                <div className="py-10 text-center text-slate-500 animate-pulse font-black uppercase tracking-widest text-[10px]">Accessing Activity Logs...</div>
              ) : (
                <div className="grid grid-cols-3 gap-4">
                  <ActivityCard label="Pickups" value={userActivity.pickups} icon={<FaPlaneArrival className="size-5" />} color="text-blue-500" />
                  <ActivityCard label="Bookings" value={userActivity.bookings} icon={<FaCalendarCheck className="size-5"/>} color="text-purple-500" />
                  <ActivityCard label="Payments" value={userActivity.payments} icon={<FaCreditCard className="size-5"/>} color="text-emerald-500" />
                </div>
              )}

              <div className="mt-8 p-6 bg-white/5 rounded-3xl border border-white/5">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-black uppercase text-slate-400">Account Standing</span>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${selectedUser.isDisabled ? 'bg-rose-500/20 text-rose-500' : 'bg-emerald-500/20 text-emerald-500'}`}>
                    {selectedUser.isDisabled ? 'Suspended' : 'In Good Standing'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-bold leading-relaxed">
                  Platform access for this identity can be modified instantly. Suspended accounts lose all access to private dashboards and active requests.
                </p>
              </div>
            </div>

            <div className="p-8 bg-black/20 flex gap-4">
               <button 
                onClick={() => toggleUserStatus(selectedUser._id, selectedUser.isDisabled)}
                className={`flex-1 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all ${
                  selectedUser.isDisabled 
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                  : 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-500/20'
                }`}
               >
                 {selectedUser.isDisabled ? 'Restore Access' : 'Suspend Account'}
               </button>
               <button 
                onClick={() => setShowDetailModal(false)}
                className="flex-1 py-4 rounded-2xl font-black uppercase tracking-widest text-xs bg-slate-800 hover:bg-slate-700 text-white transition-all shadow-lg"
               >
                 Dismiss
               </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#0f172a] border border-white/10 w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl">
            <div className="p-8 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-xl font-black text-white uppercase tracking-tight">Update Official Record</h2>
              <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-white">
                <FaTimesCircle size={24} />
              </button>
            </div>
            <form onSubmit={updateUserInfo} className="p-8 space-y-6">
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Name</label>
                <input 
                  type="text" 
                  className="w-full bg-slate-800/50 border border-white/5 rounded-xl p-4 text-white font-bold"
                  value={editForm.name}
                  onChange={e => setEditForm({...editForm, name: e.target.value})}
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Email Address</label>
                <input 
                  type="email" 
                  className="w-full bg-slate-800/50 border border-white/5 rounded-xl p-4 text-white font-bold"
                  value={editForm.email}
                  onChange={e => setEditForm({...editForm, email: e.target.value})}
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Auth Role</label>
                <select 
                  className="w-full bg-slate-800/50 border border-white/5 rounded-xl p-4 text-white font-bold"
                  value={editForm.role}
                  onChange={e => setEditForm({...editForm, role: e.target.value})}
                >
                  <option value="user">User</option>
                  <option value="consultant">Consultant</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <button type="submit" className="w-full py-4 bg-blue-600 text-white font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-blue-500/20 hover:scale-[1.02] active:scale-95 transition-all">
                Commit Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

function ActivityCard({ label, value, icon, color }: any) {
  return (
    <div className="bg-white/5 p-6 rounded-[2rem] border border-white/5 flex flex-col items-center gap-2">
      <div className={`${color} text-xl mb-1`}>{icon}</div>
      <p className="text-2xl font-black text-white">{value}</p>
      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{label}</p>
    </div>
  );
}

function FaCalendarCheck(props: any) {
  return <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" height="1em" width="1em" {...props}><path d="M436 160H12c-6.6 0-12-5.4-12-12v-36c0-26.5 21.5-48 48-48h48V12c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v52h128V12c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v52h48c26.5 0 48 21.5 48 48v36c0 6.6-5.4 12-12 12zM12 192h424c6.6 0 12 5.4 12 12v260c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V204c0-6.6 5.4-12 12-12zm333.5 85.9l-19.4-20.9c-4.5-4.8-12.1-5.2-17-.6L192 366l-63.1-64c-4.8-4.9-12.6-5-17.5-.1l-20 20.2c-4.8 4.9-4.8 12.8.1 17.7L183.3 432c4.8 4.8 12.5 4.9 17.3.1l144.7-141.2c4.9-4.7 5.1-12.3.7-17z"></path></svg>;
}

function FaCreditCard(props: any) {
  return <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 576 512" height="1em" width="1em" {...props}><path d="M0 432c0 26.5 21.5 48 48 48h480c26.5 0 48-21.5 48-48V256H0v176zm192-68c0-6.6 5.4-12 12-12h72c6.6 0 12 5.4 12 12v24c0 6.6-5.4 12-12 12h-72c-6.6 0-12-5.4-12-12v-24zm-128 0c0-6.6 5.4-12 12-12h72c6.6 0 12 5.4 12 12v24c0 6.6-5.4 12-12 12h-72c-6.6 0-12-5.4-12-12v-24zm336 52h72c6.6 0 12 5.4 12 12v24c0 6.6-5.4 12-12 12h-72c-6.6 0-12-5.4-12-12v-24c0-6.6 5.4-12 12-12zM576 80v48H0V80c0-26.5 21.5-48 48-48h480c26.5 0 48 21.5 48 48z"></path></svg>;
}

function FaPlaneArrival(props: any) {
  // FontAwesome's "plane-arrival" icon SVG
  return (
    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 640 512" height="1em" width="1em" {...props}>
      <path d="M624 448H48c-8.8 0-16 7.2-16 16v16c0 8.8 7.2 16 16 16h576c8.8 0 16-7.2 16-16v-16c0-8.8-7.2-16-16-16zm-16.7-120.6l-59.6-23.9-99.7-198.7c-11.7-23.4-39.9-33.1-63.3-21.4l-15.2 7.6c-15.9 8-24.2 25.7-19.5 42.7l36.2 130.7-102.7-41.2-36.6-99.2c-5.9-16-23.6-24.2-39.6-18.3l-15.1 5.6c-16 5.9-24.2 23.6-18.3 39.6l36.6 99.2-49.6-19.9c-12.3-4.9-26.2 1.3-31.1 13.6l-6 15c-4.9 12.3 1.3 26.2 13.6 31.1l426.2 171.1c12.3 4.9 26.2-1.3 31.1-13.6l6-15c4.9-12.3-1.3-26.2-13.6-31.1z"></path>
    </svg>
  );
}
