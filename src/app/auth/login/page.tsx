"use client";
import React, { useState, useEffect } from 'react';
import { FaEnvelope, FaKey, FaShieldAlt, FaArrowRight, FaLock } from 'react-icons/fa';
import Script from 'next/script';

export default function LoginWithOTP() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoogleResponse = async (response: any) => {
    setLoading(true);
    setStatus('Authenticating with Google...');
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: response.credential }),
      });
      const data = await res.json();
      
      if (res.ok && data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role);
        
        if (data.role === 'super_admin' || data.role === 'admin') {
          window.location.href = '/admin';
        } else if (data.role === 'vendor') {
          window.location.href = '/dashboard/vendor';
        } else if (data.role === 'consultant') {
          window.location.href = '/dashboard/consultant';
        } else {
          window.location.href = '/dashboard/user';
        }
      } else {
        setStatus(data.error || 'Google authentication failed.');
      }
    } catch (err) {
      console.error('Google Auth Error:', err);
      setStatus('Failed to connect to authentication server.');
    } finally {
      setLoading(false);
    }
  };

  const initializeGoogle = () => {
    if (typeof window !== 'undefined' && (window as any).google?.accounts?.id) {
      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
      console.log('Initializing Google with Client ID:', clientId);
      if (!clientId || clientId.includes('PLACEHOLDER')) {
        console.error('Google Client ID is missing or incorrect. Please check your .env.local and restart the server.');
        setStatus('Configuration error: Google Client ID missing.');
        return;
      }

      (window as any).google.accounts.id.initialize({
        client_id: clientId,
        callback: handleGoogleResponse,
      });

      const buttonDiv = document.getElementById('google-button-div');
      if (buttonDiv) {
        (window as any).google.accounts.id.renderButton(
          buttonDiv,
          { theme: 'outline', size: 'large', width: '100%', shape: 'pill' }
        );
      }
    }
  };

  useEffect(() => {
    initializeGoogle();
  }, [step]); // Re-initialize if step changes to ensure button div is found

  const requestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus('');
    try {
      const res = await fetch('/api/auth/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setStep(2);
        setStatus('Access code sent to your registered email.');
      } else {
        setStatus(data.error || 'Identity verification failed.');
      }
    } catch (err) {
      setStatus('Network protocol error. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  async function login(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setStatus('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      
      if (res.ok && data.token) {
        setStatus('Authentication successful! Redirecting...');
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role);
        
        // Immediate redirect based on role
        if (data.role === 'super_admin' || data.role === 'admin') {
          window.location.href = '/admin';
        } else if (data.role === 'vendor') {
          window.location.href = '/dashboard/vendor';
        } else if (data.role === 'consultant') {
          window.location.href = '/dashboard/consultant';
        } else {
          window.location.href = '/dashboard/user';
        }
      } else {
        setStatus(data.error || 'Verification failed. Please check your code.');
      }
    } catch (error) {
      setStatus('Unable to reach the authentication server.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[100dvh] flex items-center justify-center p-4 sm:p-6 bg-slate-50 dark:bg-slate-900 transition-colors duration-500 relative overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute -top-24 -left-24 w-72 h-72 sm:w-96 sm:h-96 bg-blue-600/10 rounded-full blur-[80px] sm:blur-[100px]" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 sm:w-96 sm:h-96 bg-indigo-600/10 rounded-full blur-[80px] sm:blur-[100px]" />

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-6 sm:mb-10">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-xl">
             <FaLock className="text-white text-xl" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black mb-1.5 tracking-tight text-slate-900 dark:text-white">
             Welcome Back
          </h1>
          <p className="text-slate-500 font-black uppercase text-[9px] sm:text-[10px] tracking-[0.2em]">Secure Access to Platform</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 sm:p-10 rounded-[2.5rem] sm:rounded-[3rem] shadow-2xl transition-all border-t-4 border-t-blue-600">
          <Script 
            src="https://accounts.google.com/gsi/client" 
            strategy="afterInteractive"
            onLoad={initializeGoogle}
          />
          {status && (
            <div className={`mb-6 p-4 rounded-xl text-xs font-bold text-center ${status.includes('Error') || status.includes('failed') ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'}`}>
              {status}
            </div>
          )}
          {step === 1 ? (
            <form onSubmit={requestOtp} className="space-y-5 sm:space-y-6">
              <div>
                <label className="label">Email Address</label>
                <div className="relative group">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3.5 sm:p-4 bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-100 dark:border-slate-800 rounded-xl sm:rounded-2xl focus:outline-none focus:border-blue-600 focus:bg-white dark:focus:bg-slate-900 transition-all font-bold text-slate-900 dark:text-white placeholder:text-slate-400 pl-11 sm:pl-12"
                    placeholder="name@example.com"
                  />
                  <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors text-sm sm:text-base" />
                </div>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl sm:rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {loading ? 'Sending Request...' : 'Get Access Code'}
                <FaArrowRight className="text-xs" />
              </button>
            </form>
          ) : (
            <form onSubmit={login} className="space-y-5 sm:space-y-6">
              <div>
                <label className="label">Verification Code</label>
                <div className="relative group">
                  <input
                    type="text"
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full p-3.5 sm:p-4 bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-100 dark:border-slate-800 rounded-xl sm:rounded-2xl focus:outline-none focus:border-blue-600 focus:bg-white dark:focus:bg-slate-900 transition-all font-bold text-slate-900 dark:text-white placeholder:text-slate-400 pl-11 sm:pl-12 text-center tracking-[0.5em] text-lg"
                    placeholder="000000"
                    maxLength={6}
                  />
                  <FaKey className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors text-sm sm:text-base" />
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl sm:rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-50"
                >
                  {loading ? 'Verifying...' : 'Authenticate'}
                </button>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors"
                >
                  Request a new code
                </button>
              </div>
            </form>
          )}

          {step === 1 && (
            <>
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
                </div>
                <div className="relative flex justify-center text-[10px] uppercase font-bold">
                  <span className="bg-white dark:bg-slate-900 px-4 text-slate-500">Or continue with</span>
                </div>
              </div>

              <div id="google-button-div" className="w-full flex justify-center min-h-[44px]"></div>
            </>
          )}

          {status && (
            <div className={`mt-6 p-4 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest text-center ${
              status.includes('sent') ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' : 'bg-rose-50 dark:bg-rose-900/20 text-rose-600'
            }`}>
              {status}
            </div>
          )}
        </div>

        <p className="text-center mt-8 text-slate-500 text-[10px] sm:text-xs font-bold uppercase tracking-widest">
          Don't have an account? <a href="/auth/register" className="text-blue-600 hover:underline">Start Journey</a>
        </p>
      </div>
    </div>
  );
}
