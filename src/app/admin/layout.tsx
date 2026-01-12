'use client';

import React from 'react';
import Sidebar from '@/components/Sidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#050b18] text-white overflow-x-hidden">
      <Sidebar activeService="Platform Command" />

      {/* Main Content Area */}
      <main className="flex-1 lg:max-h-screen lg:overflow-y-auto">
        <div className="container mx-auto px-6 py-6 max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  );
}
