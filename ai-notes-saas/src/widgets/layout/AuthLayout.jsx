import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Sparkles } from 'lucide-react';

export function AuthLayout() {
  const isDarkMode = useSelector((state) => state.ui.isDarkMode);

  // Keep dark mode synced even on auth pages
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      {/* Left Side - Brand/Hero (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 bg-muted items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5" />
        <div className="relative z-10 max-w-md text-center space-y-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg mb-8">
            <Sparkles className="h-8 w-8" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">NotelyAI Enterprise</h1>
          <p className="text-lg text-muted-foreground">
            The intelligent workspace for high-velocity teams. Synthesize, store, and scale your knowledge base.
          </p>
        </div>
      </div>

      {/* Right Side - Form Container */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
}