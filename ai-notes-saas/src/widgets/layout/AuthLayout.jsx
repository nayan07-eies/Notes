import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Sparkles, BrainCircuit, ShieldCheck } from 'lucide-react';

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
    <div className="flex min-h-screen w-full bg-[#09090b] text-zinc-50 overflow-hidden">
      
      {/* LEFT SIDE: Visual Anchor (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-zinc-950 border-r border-white/5 flex-col justify-between p-12">
        {/* Animated Background Gradients */}
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-blue-600/20 blur-[120px] mix-blend-screen animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] rounded-full bg-purple-600/20 blur-[120px] mix-blend-screen" style={{ animation: 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />

        {/* Brand Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">NotelyAI Enterprise</span>
        </div>

        {/* Value Proposition */}
        <div className="relative z-10 space-y-6 max-w-md">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-bold tracking-tight text-white leading-tight"
          >
            Turn noise into <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              structured knowledge.
            </span>
          </motion.h1>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3 text-zinc-400">
              <BrainCircuit className="w-5 h-5 text-blue-400" />
              <span>Local AI models for maximum privacy.</span>
            </div>
            <div className="flex items-center gap-3 text-zinc-400">
              <ShieldCheck className="w-5 h-5 text-purple-400" />
              <span>Enterprise-grade security built-in.</span>
            </div>
          </motion.div>
        </div>

        {/* Social Proof */}
        <div className="relative z-10 text-sm text-zinc-600 font-medium">
          © 2026 NotelyAI. All rights reserved.
        </div>
      </div>

      {/* RIGHT SIDE: React Router Outlet */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 relative border-bs-orange-50">
        {/* Subtle noise texture overlay for the frosted look */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none mix-blend-overlay"></div>
        
        <div className="w-full max-w-md relative z-10">
          {/* This is where your Login/Signup pages will render */}
          <Outlet />
        </div>
      </div>
      
    </div>
  );
}