import React from 'react';
import { cookies } from 'next/headers';
import { Toaster } from 'react-hot-toast';
import '../../styles/globals.css';
import ThemeSwitcher from '../components/ThemeSwitcher';

export const metadata = {
  title: 'Overseas Support Platform',
  description: 'Logistics, Accommodation, and Consultancy for your journey overseas.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = cookies();
  const isLoggedIn = cookieStore.has('token');

  return (
    <html lang="en" className="dark">
      <body className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen font-sans selection:bg-blue-500 selection:text-white">
        <Toaster position="top-right" />
        {!isLoggedIn && (
          <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">O</span>
                </div>
                <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Overseas
                </span>
              </div>
              <nav className="hidden md:flex items-center gap-8">
                <a href="/" className="text-sm font-medium hover:text-blue-600 transition-colors">Home</a>
                <a href="/accommodation" className="text-sm font-medium hover:text-blue-600 transition-colors">Accommodation</a>
                <a href="/car" className="text-sm font-medium hover:text-blue-600 transition-colors">Car Rental</a>
                <a href="/consultant" className="text-sm font-medium hover:text-blue-600 transition-colors">Consultancy</a>
              </nav>
              <div className="flex items-center gap-4">
                <ThemeSwitcher />
                <a 
                  href="/auth/login" 
                  className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-all shadow-lg shadow-blue-500/20 active:scale-95"
                >
                  Login
                </a>
              </div>
            </div>
          </header>
        )}
        <main>{children}</main>
        {!isLoggedIn && (
          <footer className="py-12 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
            <div className="container mx-auto px-4 text-center">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                © {new Date().getFullYear()} Overseas Support Platform. All rights reserved.
              </p>
            </div>
          </footer>
        )}
      </body>
    </html>
  )
}

