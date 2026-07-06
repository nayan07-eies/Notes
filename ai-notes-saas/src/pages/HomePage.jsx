import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Mic, Video, BrainCircuit, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Footer from '../shared/ui/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#09090b] text-zinc-900 dark:text-zinc-50 flex flex-col justify-between overflow-x-hidden relative transition-colors duration-300">
      
      {/* Background glowing effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 dark:bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 dark:bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-6xl w-full mx-auto px-6 py-20 z-10 grid lg:grid-cols-2 gap-12 items-center flex-1">
        
        {/* Left Column: Copy & Call to Action */}
        <div className="space-y-8 text-center lg:text-left">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm font-medium border border-blue-500/20"
          >
            <Sparkles className="w-4 h-4" />
            <span>The future of knowledge management</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl lg:text-7xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50"
          >
            Turn noise into <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-400 dark:to-purple-400">
              knowledge.
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto lg:mx-0 leading-relaxed"
          >
            Upload meetings, PDFs, or YouTube links. Our enterprise AI instantly synthesizes messy data into structured, actionable insights.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
          >
            <Button size="lg" className="h-14 px-8 text-lg bg-zinc-900 dark:bg-zinc-50 text-white dark:text-[#09090b] hover:bg-zinc-800 dark:hover:bg-zinc-200 font-semibold rounded-xl shadow-lg shadow-black/10 dark:shadow-none" asChild>
              <Link to="/signup">
                Get Started Free <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-8 text-lg bg-white/50 dark:bg-white/[0.02] border-zinc-200 dark:border-white/10 text-zinc-800 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/5 backdrop-blur-sm rounded-xl" asChild>
              <Link to="/login">Sign In</Link>
            </Button>
          </motion.div>
          {/* FIX: Removed the buggy lowercase duplicate footer tag from here */}
        </div>

        {/* Right Column: Animation Engine */}
        <div className="relative w-full flex items-center justify-center min-h-[300px]">
          
          {/* AI Core (Center) */}
          <motion.div 
            animate={{ 
              boxShadow: [
                "0px 0px 0px 0px rgba(59, 130, 246, 0.2)", 
                "0px 0px 60px 20px rgba(59, 130, 246, 0.4)", 
                "0px 0px 0px 0px rgba(59, 130, 246, 0.2)"
              ]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute z-20 w-32 h-32 bg-white dark:bg-[#0a0a0c] border-4 border-blue-500 dark:border-blue-400 rounded-3xl flex items-center justify-center shadow-2xl"
          >
            <BrainCircuit className="w-16 h-16 text-blue-500 dark:text-blue-400" />
          </motion.div>

          {/* Raw Data Orbiting In (Left side) */}
          <motion.div 
            animate={{ x: [ -150, 0 ], opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "moveIn" }}
            className="absolute left-0 z-10 p-4 bg-red-500/10 text-red-500 rounded-2xl border border-red-500/20 backdrop-blur-md"
          >
            <Video className="w-8 h-8" />
          </motion.div>
          
          <motion.div 
            animate={{ x: [ -120, 0 ], y: [-100, 0], opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "moveIn", delay: 0.8 }}
            className="absolute left-10 top-20 z-10 p-4 bg-emerald-500/10 text-emerald-500 rounded-2xl border border-emerald-500/20 backdrop-blur-md"
          >
            <FileText className="w-8 h-8" />
          </motion.div>

          <motion.div 
            animate={{ x: [ -120, 0 ], y: [100, 0], opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "moveIn", delay: 1.6 }}
            className="absolute left-10 bottom-20 z-10 p-4 bg-blue-500/10 text-blue-500 rounded-2xl border border-blue-500/20 backdrop-blur-md"
          >
            <Mic className="w-8 h-8" />
          </motion.div>

          {/* Structured Data Flowing Out (Right side) */}
          <motion.div 
            animate={{ x: [ 0, 150 ], opacity: [0, 1, 0], scale: [0.5, 1, 1.2] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut", delay: 0.4 }}
            className="absolute right-0 z-10 p-4 bg-blue-500/10 dark:bg-white/[0.02] text-blue-500 dark:text-blue-400 rounded-xl border border-blue-500/20 dark:border-white/5 backdrop-blur-md flex flex-col gap-2 w-40"
          >
            <div className="h-2 w-3/4 bg-blue-500/40 dark:bg-blue-400/40 rounded-full" />
            <div className="h-2 w-full bg-blue-500/20 dark:bg-blue-400/20 rounded-full" />
            <div className="h-2 w-5/6 bg-blue-500/20 dark:bg-blue-400/20 rounded-full" />
          </motion.div>

          <motion.div 
            animate={{ x: [ 0, 150 ], y: [0, -80], opacity: [0, 1, 0], scale: [0.5, 1, 1.2] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut", delay: 1.2 }}
            className="absolute right-0 top-24 z-10 p-4 bg-purple-500/10 dark:bg-white/[0.02] text-purple-500 dark:text-purple-400 rounded-xl border border-purple-500/20 dark:border-white/5 backdrop-blur-md flex flex-col gap-2 w-32"
          >
            <div className="h-2 w-full bg-purple-500/40 dark:bg-purple-400/40 rounded-full" />
            <div className="h-2 w-4/5 bg-purple-500/20 dark:bg-purple-400/20 rounded-full" />
          </motion.div>
          
          <motion.div 
            animate={{ x: [ 0, 150 ], y: [0, 80], opacity: [0, 1, 0], scale: [0.5, 1, 1.2] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut", delay: 2.0 }}
            className="absolute right-0 bottom-24 z-10 p-4 bg-blue-500/10 dark:bg-white/[0.02] text-blue-500 dark:text-blue-400 rounded-xl border border-blue-500/20 dark:border-white/5 backdrop-blur-md flex flex-col gap-2 w-48"
          >
            <div className="h-2 w-1/2 bg-blue-500/40 dark:bg-blue-400/40 rounded-full" />
            <div className="h-2 w-full bg-blue-500/20 dark:bg-blue-400/20 rounded-full" />
            <div className="h-2 w-3/4 bg-blue-500/20 dark:bg-blue-400/20 rounded-full" />
          </motion.div>

        </div>       
      </div>    

      {/* The correctly mounted Adaptive Public Marketing Footer */}
      <Footer /> 
    </div>
  );
}