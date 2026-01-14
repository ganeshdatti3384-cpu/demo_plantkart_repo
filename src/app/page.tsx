import React from 'react';
import { cookies } from 'next/headers';
import { 
  FaPlaneArrival, FaHome, FaCar, FaUserTie, FaHandshake, 
  FaCreditCard, FaMoneyBillWave, FaCalendarAlt, FaTags, 
  FaBell, FaTrashAlt, FaChartLine, FaCheckCircle, FaGlobe, FaUsers, FaShieldAlt,
  FaArrowRight, FaStar, FaQuoteLeft, FaRocket
} from 'react-icons/fa';

export default function HomePage() {
  const cookieStore = cookies();
  const isLoggedIn = cookieStore.has('token');

  const services = [
    { name: 'Airport Pickup', link: '/airport-pickup', description: 'Real-time flight tracking & door-to-door luxury transport.', icon: <FaPlaneArrival />, color: 'blue', tag: 'Fast' },
    { name: 'Living Spaces', link: '/accommodation', description: 'Verified premium listings & student-friendly housing.', icon: <FaHome />, color: 'emerald', tag: 'Secure' },
    { name: 'Smart Rentals', link: '/car', description: 'Flexible rates with comprehensive local insurance.', icon: <FaCar />, color: 'indigo', tag: 'Best Value' },
    { name: 'Expert Strategy', link: '/consultant', description: 'Visa assistance & career-focused job placements.', icon: <FaUserTie />, color: 'purple', tag: 'Pro' },
    { name: 'HD Meetings', link: '/meetings', description: 'Crystal clear video calls with global mentors.', icon: <FaHandshake />, color: 'blue', tag: 'New' },
    { name: 'Bridge Loans', link: '/loan', description: 'Financial support for your bond & setup costs.', icon: <FaMoneyBillWave />, color: 'amber', tag: 'Low Interest' },
    { name: 'Social Hub', link: '/events', description: 'Exclusive networking at high-impact expat events.', icon: <FaCalendarAlt />, color: 'pink', tag: 'Social' },
  ];

  const stats = [
    { label: 'Global Users', value: '15,000+', icon: <FaUsers /> },
    { label: 'Core Regions', value: '12+', icon: <FaGlobe /> },
    { label: 'Success Ratio', value: '99.8%', icon: <FaCheckCircle /> },
    { label: 'Security Grade', value: 'Military', icon: <FaShieldAlt /> },
  ];

  const testimonials = [
    { name: 'Sarah Jenkins', role: 'Graduate Student', text: 'Overseas made my move to Sydney absolutely effortless. Every service was on point.' },
    { name: 'Raj Malhotra', role: 'IT Professional', text: 'The consultancy team secured my visa and job in record time. Truly a lifeline!' }
  ];

  return (
    <div className="bg-[#FAFBFD] dark:bg-slate-950 min-h-screen font-sans selection:bg-blue-600 selection:text-white overflow-hidden">
      {/* Dynamic Background Noise/Texture */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05] z-0">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>
      </div>

      {/* Modern Hero Section */}
      <section className="relative pt-24 pb-20 sm:pt-40 sm:pb-56">
        <div className="absolute top-0 inset-x-0 h-[1000px] pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-blue-500/10 dark:bg-blue-600/10 rounded-full blur-[160px] animate-pulse-slow" />
          <div className="absolute bottom-0 left-[-5%] w-[600px] h-[600px] bg-indigo-500/10 dark:bg-indigo-600/10 rounded-full blur-[140px]" />
        </div>

        <div className="container relative mx-auto px-6 text-center z-10">
          <div className="inline-flex items-center gap-2.5 px-5 py-2.5 mb-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/50 rounded-full shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex -space-x-2">
              {[1,2,3,4].map(i => (
                <div key={i} className="w-6 h-6 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-blue-400 to-indigo-500" />
                </div>
              ))}
            </div>
            <span className="text-[11px] sm:text-[13px] font-black uppercase tracking-widest text-slate-800 dark:text-slate-200">
              Join <span className="text-blue-600">15K+</span> Settled Expats
            </span>
          </div>

          <h1 className="text-5xl sm:text-7xl md:text-9xl font-black tracking-tighter text-slate-900 dark:text-white mb-10 leading-[0.88] animate-in slide-in-from-bottom duration-700">
            Move Without <br />
            <span className="relative inline-block">
              <span className="absolute -inset-1 bg-blue-600/10 dark:bg-blue-600/20 blur-2xl rotate-3" />
              <span className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">Boundaries</span>
            </span>
          </h1>

          <p className="max-w-3xl mx-auto text-lg sm:text-2xl text-slate-500 dark:text-slate-400 mb-14 font-medium leading-[1.6] px-4 animate-in fade-in duration-1000 delay-200">
            The world is big. We make it feel small. Experience a revolutionary platform that handles everything from your landing to your new bedroom door.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 px-6 sm:px-0 animate-in zoom-in duration-500 delay-300">
            {isLoggedIn ? (
              <a href="/dashboard/user" className="w-full sm:w-auto px-12 py-6 bg-blue-600 hover:bg-blue-700 text-white rounded-[2.5rem] font-black text-lg transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-blue-500/40 flex items-center justify-center gap-3 group">
                Go to Dashboard <FaChartLine className="group-hover:translate-x-1" />
              </a>
            ) : (
              <>
                <a href="/auth/register" className="w-full sm:w-auto px-12 py-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[2.5rem] font-black text-lg transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-slate-900/20 dark:shadow-white/10 flex items-center justify-center gap-3 group">
                  Start Your Journey <FaRocket className="text-sm group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                </a>
                <a href="/auth/login" className="w-full sm:w-auto px-12 py-6 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-2 border-slate-100 dark:border-slate-800 rounded-[2.5rem] font-black text-lg transition-all hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-200 dark:hover:border-slate-700 active:scale-95">
                  Sign In
                </a>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Integrated Stats Bar */}
      <section className="relative z-10 px-6 mb-24">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <div key={i} className="group p-8 rounded-[3rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/50 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 text-center">
                <div className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white mb-3 tracking-tighter group-hover:scale-110 transition-transform">
                  {stat.value}
                </div>
                <div className="text-[11px] sm:text-xs font-black text-slate-400 uppercase tracking-[0.2em]">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reimagined Services Section */}
      <section className="py-32 relative">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12 mb-20 text-center md:text-left">
            <div className="max-w-2xl">
              <h2 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white mb-6">
                One OS for <br /> <span className="text-blue-600">Your New Life.</span>
              </h2>
              <p className="text-lg font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
                Why juggle 10 apps when you can have one beautiful workspace? Explore our hyper-targeted service suite.
              </p>
            </div>
            <div className="hidden lg:block w-40 h-[1px] bg-slate-200 dark:bg-slate-800" />
            <a href="/partners" className="group flex items-center gap-3 text-sm font-black uppercase tracking-widest text-blue-600 hover:text-blue-700 transition-colors">
              Explore All Perks <FaArrowRight />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <a
                key={index}
                href={service.link}
                className="group relative p-10 rounded-[3.5rem] bg-white dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 transition-all hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.4)] hover:-translate-y-3 overflow-hidden"
              >
                {/* Visual Accent */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-${service.color}-500/5 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700`} />
                
                <div className="flex justify-between items-start mb-10">
                  <div className={`w-16 h-16 flex items-center justify-center rounded-[1.75rem] bg-${service.color}-50 dark:bg-${service.color}-900/20 text-${service.color}-600 dark:text-${service.color}-400 text-2xl group-hover:bg-blue-600 group-hover:text-white transition-all shadow-lg shadow-blue-500/5`}>
                    {service.icon}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 rounded-full">
                    {service.tag}
                  </span>
                </div>
                
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4 group-hover:text-blue-600 transition-colors tracking-tight">
                  {service.name}
                </h3>
                <p className="text-[15px] font-medium text-slate-500 dark:text-slate-400 leading-relaxed mb-10">
                  {service.description}
                </p>

                <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-600 group-hover:text-blue-600 transition-all">
                  Get Details <div className="w-6 h-[2px] bg-slate-100 dark:bg-slate-800 group-hover:w-10 group-hover:bg-blue-600 transition-all" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Testimonials */}
      <section className="py-32 bg-slate-900 dark:bg-slate-900 text-white rounded-[4rem] sm:rounded-[7rem] mx-4 sm:mx-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-10">
          <FaQuoteLeft size={120} />
        </div>
        <div className="container mx-auto px-10 text-center">
          <h2 className="text-4xl sm:text-6xl font-black mb-16 tracking-tight leading-tight">
            Built by Travelers, <br /> Loved by the <span className="text-blue-500">World.</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {testimonials.map((t, i) => (
              <div key={i} className="p-10 bg-white/5 backdrop-blur-sm border border-white/10 rounded-[4rem] text-left hover:bg-white/10 transition-all cursor-default">
                <div className="flex items-center gap-1 mb-6">
                  {[1,2,3,4,5].map(star => <FaStar key={star} className="text-blue-500 text-sm" />)}
                </div>
                <p className="text-xl sm:text-2xl font-medium mb-10 text-slate-300 leading-relaxed italic">"{t.text}"</p>
                <div>
                  <div className="font-black text-xl mb-1">{t.name}</div>
                  <div className="text-blue-400 font-bold uppercase tracking-widest text-[11px]">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ultimate CTA */}
      <section className="py-40 relative">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto relative p-1 pb-1 rounded-[5rem] overflow-hidden">
             {/* Dynamic border animation placeholder */}
             <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 animate-spin-slow opacity-30" />
             
             <div className="relative p-12 sm:p-32 bg-white dark:bg-slate-950 rounded-[5rem] overflow-hidden">
                <h2 className="text-4xl sm:text-7xl font-black text-slate-900 dark:text-white mb-10 tracking-tight leading-[0.9]">
                  Start Your <br /> Global Story.
                </h2>
                <p className="text-lg sm:text-xl font-medium text-slate-500 dark:text-slate-400 mb-14 max-w-2xl mx-auto leading-relaxed">
                  Every big move starts with a single step. Join thousands of pioneers who chose the smart way to relocate.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  <a href="/auth/register" className="w-full sm:w-auto px-16 py-7 bg-blue-600 hover:bg-blue-700 text-white rounded-[2.5rem] font-black text-xl transition-all shadow-2xl shadow-blue-500/40 active:scale-95">
                    Launch Platform
                  </a>
                  <a href="/about" className="w-full sm:w-auto px-16 py-7 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white rounded-[2.5rem] font-black text-xl transition-all hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95">
                    Our Vision
                  </a>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Micro-Footer */}
      <footer className="py-20 border-t border-slate-100 dark:border-slate-900 bg-white dark:bg-slate-950">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
               <span className="text-white font-black text-xl">O</span>
             </div>
             <span className="text-xl font-black tracking-tighter text-slate-900 dark:text-white uppercase">Overseas</span>
          </div>
          <div className="flex gap-10 text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-all">
            <a href="/privacy" className="hover:text-blue-600">Privacy</a>
            <a href="/terms" className="hover:text-blue-600">Terms</a>
            <a href="/support" className="hover:text-blue-600">Support</a>
          </div>
          <div className="text-[11px] font-black uppercase tracking-widest text-slate-400">
            © 2026 Overseas Platform
          </div>
        </div>
      </footer>
    </div>
  );
}

