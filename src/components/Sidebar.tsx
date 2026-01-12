'use client';

import React, { useState, useEffect } from 'react';
import { 
  FaPlaneArrival, FaHome, FaCar, FaUserTie, FaMoneyBillWave, 
  FaHandshake, FaCalendarAlt, FaTags, FaChartPie, FaSignOutAlt,
  FaGripHorizontal, FaBars, FaTimes, FaUserCircle,
  FaChevronLeft, FaChevronRight, FaBell, FaCog, FaUsers, FaHistory, FaTrashAlt
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { usePathname, useRouter } from 'next/navigation';
import ThemeSwitcher from './ThemeSwitcher';

export default function Sidebar({ activeService = '' }: { activeService?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('user');
  const [mounted, setMounted] = useState(false);
  const [viewMode, setViewMode] = useState<'user' | 'vendor'>('user');
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    const savedRole = typeof window !== 'undefined' ? localStorage.getItem('role') || 'user' : 'user';
    const savedViewMode = typeof window !== 'undefined' ? localStorage.getItem('viewMode') || 'user' : 'user';
    setUserRole(savedRole);
    setViewMode(savedViewMode as 'user' | 'vendor');

    async function fetchUserData() {
      try {
        const [notifRes, profileRes] = await Promise.all([
          fetch('/api/notifications/my').then(res => res.json()),
          fetch('/api/auth/profile').then(res => res.json())
        ]);

        if (Array.isArray(notifRes)) {
          setNotifications(notifRes);
        }
        if (profileRes && profileRes.name) {
          setUserName(profileRes.name);
          const role = profileRes.role || 'user';
          setUserRole(role);
          localStorage.setItem('role', role);
        }
      } catch (err) {
        console.error('Failed to fetch user data:', err);
      }
    }
    fetchUserData();
  }, []);

  const getDashboardLink = () => {
    if (!mounted) return '/dashboard/user';
    switch(userRole) {
      case 'admin': return '/admin';
      case 'super_admin': return '/admin';
      case 'vendor': return '/dashboard/vendor';
      case 'consultant': return '/dashboard/consultant';
      default: return '/dashboard/user';
    }
  };

  const userFeatures = [
    { name: 'Airport Pickup', link: '/airport-pickup', icon: <FaPlaneArrival />, color: 'bg-blue-500' },
    { name: 'Accommodation', link: '/accommodation', icon: <FaHome />, color: 'bg-emerald-500' },
    { name: 'Car Rental', link: '/car', icon: <FaCar />, color: 'bg-indigo-500' },
    { name: 'Consultancy', link: '/consultant', icon: <FaUserTie />, color: 'bg-purple-500' },
    { name: 'Loan Services', link: '/loan', icon: <FaMoneyBillWave />, color: 'bg-amber-500' },
    { name: 'Meetings', link: '/meetings', icon: <FaHandshake />, color: 'bg-blue-600' },
    { name: 'Community Events', link: '/events', icon: <FaCalendarAlt />, color: 'bg-rose-500' },
    { name: 'Partner Perks', link: '/partners', icon: <FaTags />, color: 'bg-teal-500' },
  ];

  const vendorFeatures = [
    { name: 'Accommodation', link: '/vendor/accommodation', icon: <FaHome />, color: 'bg-emerald-500' },
    { name: 'Car Rental', link: '/vendor/car', icon: <FaCar />, color: 'bg-indigo-500' },
    { name: 'Community Events', link: '/vendor/events', icon: <FaCalendarAlt />, color: 'bg-rose-500' },
    { name: 'Meetings', link: '/vendor/meetings', icon: <FaHandshake />, color: 'bg-blue-600' },
    { name: 'Partner Perks', link: '/vendor/partners', icon: <FaTags />, color: 'bg-teal-500' },
  ];

  const adminFeatures = [
    { name: 'Service Matrix', link: '/admin', icon: <FaGripHorizontal className="text-blue-500" /> },
    { name: 'Identity Vault', link: '/admin/users', icon: <FaUsers className="text-blue-500" /> },
    { name: 'Accommodation', link: '/admin/accommodation/pending', icon: <FaHome className="text-emerald-500" /> },
    { name: 'Car Rental', link: '/admin/car/pending', icon: <FaCar className="text-indigo-500" /> },
    { name: 'Logistics Hub', link: '/admin/airport-pickup/requests', icon: <FaPlaneArrival className="text-blue-400" /> },
    { name: 'Consultants', link: '/admin/consultants', icon: <FaUserTie className="text-purple-500" /> },
    { name: 'Global Bookings', link: '/admin/bookings', icon: <FaCalendarAlt className="text-blue-600" /> },
    { name: 'Financial Ledger', link: '/admin/payments', icon: <FaMoneyBillWave className="text-emerald-600" /> },
    { name: 'Security Audit', link: '/admin/audit-logs', icon: <FaHistory className="text-slate-500" /> },
    { name: 'Platform Hygiene', link: '/admin/data-cleanup', icon: <FaTrashAlt className="text-rose-500" /> },
  ];


  const features = !mounted ? [] : (userRole === 'admin' || userRole === 'super_admin') ? adminFeatures : (viewMode === 'vendor' ? vendorFeatures : userFeatures);

  const toggleViewMode = () => {
    const newMode = viewMode === 'user' ? 'vendor' : 'user';
    setViewMode(newMode);
    localStorage.setItem('viewMode', newMode);
    toast.success(`Switched to ${newMode === 'user' ? 'User' : 'Vendor'} view`);
  };

  const isLinkActive = (itemLink: string, itemName: string) => {
    if (activeService === itemName) return true;
    if (pathname === itemLink) return true;
    if (itemLink !== '/admin' && pathname?.split('?')[0] === itemLink) return true;
    if (itemLink !== '/admin' && pathname?.startsWith(itemLink + '/')) return true;
    return false;
  };

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      if (res.ok) {
        router.push('/auth/login');
      }
    } catch (e) {
      toast.error('Logout failed');
    }
  };

  const NavContent = ({ collapsed = false }: { collapsed?: boolean }) => {
    const isAdmin = userRole === 'admin' || userRole === 'super_admin';

    return (
      <>
        <div className={`${collapsed ? 'p-2' : 'p-4 sm:p-6'}`}>
          <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'} mb-4 sm:mb-6 px-2`}>
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push(getDashboardLink())}>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
                <span className="text-white font-black text-lg sm:text-xl">O</span>
              </div>
              {!collapsed && <span className="text-lg sm:text-xl font-black uppercase tracking-tighter truncate text-slate-900 dark:text-white">Overseas</span>}
            </div>
            {!collapsed && (
              <div className="flex items-center gap-2">
                <button onClick={() => setIsOpen(false)} className={`lg:hidden p-2 ${isAdmin ? 'text-slate-400' : 'text-slate-500'}`}>
                  <FaTimes size={20} />
                </button>
              </div>
            )}
          </div>

          <nav className="space-y-0.5">
            {!isAdmin && (
              <button 
                onClick={() => {
                  router.push(getDashboardLink());
                  setIsOpen(false);
                }}
                className={`w-full flex items-center ${collapsed ? 'justify-center' : 'gap-3 px-4'} py-2.5 rounded-xl transition-all font-bold text-sm ${
                  isLinkActive(getDashboardLink(), 'Overview') 
                    ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20' 
                    : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
                title={collapsed ? 'Overview' : ''}
              >
                <FaChartPie className="text-base shrink-0" />
                {!collapsed && <span className="truncate">Overview</span>}
              </button>
            )}

            {!collapsed && (
              <div className={`pt-3 pb-1 px-4 text-[9px] font-black uppercase tracking-widest ${isAdmin ? 'text-slate-500' : 'text-slate-400 dark:text-slate-500'}`}>
                {isAdmin ? 'Operation Domains' : viewMode === 'vendor' ? 'Vendor Services' : 'My Services'}
              </div>
            )}
            {collapsed && <div className="h-4" />}

            {/* User/Vendor Toggle Switch - Only for non-admin users */}
            {!isAdmin && !collapsed && (
              <div className="px-4 mb-4">
                <div className="bg-slate-100 dark:bg-slate-800 rounded-xl p-1 flex items-center gap-1">
                  <button
                    onClick={toggleViewMode}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                      viewMode === 'user'
                        ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                    }`}
                  >
                    User
                  </button>
                  <button
                    onClick={toggleViewMode}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                      viewMode === 'vendor'
                        ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                    }`}
                  >
                    Vendor
                  </button>
                </div>
              </div>
            )}

            {features.map((feature, i) => (
              <button 
                key={i} 
                onClick={() => {
                  router.push(feature.link);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center ${collapsed ? 'justify-center' : 'gap-3 px-4'} py-2.5 sm:py-3 rounded-xl transition-all font-bold text-[13px] sm:text-sm ${
                  isLinkActive(feature.link, feature.name)
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                    : isAdmin ? 'text-slate-400 hover:bg-white/5' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
                title={collapsed ? feature.name : ''}
              >
                <span className={`text-base sm:text-lg shrink-0 ${isLinkActive(feature.link, feature.name) ? 'text-white' : isAdmin ? 'text-slate-500' : 'text-slate-400'}`}>{feature.icon}</span>
                {!collapsed && <span className="truncate">{feature.name}</span>}
              </button>
            ))}
          </nav>
        </div>

        <div className={`mt-auto ${collapsed ? 'p-2' : 'p-4 sm:p-4'} border-t ${isAdmin ? 'border-white/5' : 'border-slate-100 dark:border-slate-800'}`}>
          {!collapsed && userName && (
            <div className="px-4 py-3 mb-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-0.5">Account</p>
              <p className="text-xs font-bold truncate text-slate-900 dark:text-white">{userName}</p>
            </div>
          )}
          <div className={`flex ${collapsed ? 'flex-col' : 'items-center'} gap-2`}>
            <button 
              onClick={() => {
                router.push(isAdmin ? '/admin/users' : '/dashboard/user/profile');
                setIsOpen(false);
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all font-bold text-[13px] sm:text-sm ${
                activeService === 'Profile' || activeService === 'Identity'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-slate-50 dark:bg-slate-800/50 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title="Identity Control"
            >
              {isAdmin ? <FaUsers size={16} /> : <FaUserCircle className="text-base sm:text-lg shrink-0" />}
              {!collapsed && <span className="hidden sm:inline">{isAdmin ? 'Users' : 'Profile'}</span>}
            </button>
            <button 
              onClick={handleLogout}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all font-bold text-[13px] sm:text-sm bg-rose-50 dark:bg-rose-900/10 text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-900/20"
              title="Sign Out"
            >
              <FaSignOutAlt className="text-base sm:text-lg shrink-0" />
              {!collapsed && <span className="hidden sm:inline">Logout</span>}
            </button>
          </div>
        </div>
      </>
    );
  };

  const isAdmin = userRole === 'admin' || userRole === 'super_admin';

  return (
    <>
      {/* ...existing code... */}
      <aside className={`fixed top-0 left-0 bottom-0 w-[260px] bg-white dark:bg-slate-900 z-[70] transition-transform duration-300 transform lg:hidden flex flex-col ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <NavContent collapsed={false} />
      </aside>

      <aside className={`hidden lg:flex flex-col h-screen sticky top-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 z-40 ${isCollapsed ? 'w-20' : 'w-64'}`}>
        <div className="absolute -right-3 top-8 z-50">
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-6 h-6 border rounded-full flex items-center justify-center transition-colors bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 hover:text-blue-600 shadow-xl"
          >
            {isCollapsed ? <FaChevronRight size={10} /> : <FaChevronLeft size={10} />}
          </button>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <NavContent collapsed={isCollapsed} />
        </div>
      </aside>

      {/* Bottom Navigation Bar for Mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 h-16 backdrop-blur-lg border-t flex items-center justify-around px-6 z-50 pb-safe bg-white/80 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800">
        <button 
          onClick={() => router.push(getDashboardLink())}
          className={`flex flex-col items-center gap-1 ${activeService === 'Overview' || activeService === 'Platform Command' || activeService === 'Admin Dashboard' ? 'text-blue-600' : 'text-slate-400'}`}
        >
          {isAdmin ? <FaGripHorizontal size={20} /> : <FaHome size={20} />}
          <span className="text-[10px] font-bold">{isAdmin ? 'Dashboard' : 'Home'}</span>
        </button>
        <button 
          onClick={() => router.push(isAdmin ? '/admin/audit-logs' : '/meetings')}
          className={`flex flex-col items-center gap-1 ${activeService === 'Meetings' || activeService === 'Audit Logs' ? 'text-blue-600' : 'text-slate-400'}`}
        >
          {isAdmin ? <FaHistory size={20} /> : <FaHandshake size={20} />}
          <span className="text-[10px] font-bold">{isAdmin ? 'Audit' : 'Meetings'}</span>
        </button>
        <button 
          onClick={() => router.push(isAdmin ? '/admin/users' : '/dashboard/user/profile')}
          className={`flex flex-col items-center gap-1 ${activeService === 'Profile' || activeService === 'User Identity' ? 'text-blue-600' : 'text-slate-400'}`}
        >
          {isAdmin ? <FaUsers size={20} /> : <FaUserCircle size={20} />}
          <span className="text-[10px] font-bold">{isAdmin ? 'Users' : 'Profile'}</span>
        </button>
      </div>

      <div className="h-14 lg:hidden" />
    </>
  );
}

