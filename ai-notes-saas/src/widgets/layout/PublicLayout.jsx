import React from 'react';
import { Outlet } from 'react-router-dom';
import Footer from '@/shared/ui/Footer';

export function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-[#09090b]">
      {/* Dynamic public marketing page injection point */}
      <div className="flex-1">
        <Outlet />
      </div>
      
      {/* Global Public Marketing Footer */}
      <Footer />
    </div>
  );
}