import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Mail, Lock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/dashboard/study');
    }, 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="space-y-6 w-full"
    >
      {/* 1. Explicitly set text-zinc-50 for headers and text-zinc-400 for subtext */}
      <div className="space-y-2 text-center lg:text-left">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-50">Welcome back</h1>
        <p className="text-sm text-zinc-400">
          Enter your credentials to access your workspace.
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        {/* Email Field */}
        <div className="space-y-2">
          {/* Explicit label color */}
          <label htmlFor="email" className="text-sm font-medium text-zinc-50">Email Address</label>
          <div className="relative group">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 transition-colors group-focus-within:text-blue-400" />
            {/* Forced input background, border, and text colors to override shadcn defaults */}
            <Input 
              id="email" 
              type="email" 
              placeholder="name@company.com" 
              className="pl-9 bg-[#09090b] border-white/10 text-zinc-50 placeholder:text-zinc-600 transition-all duration-300 focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50" 
              required 
              disabled={isLoading} 
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            {/* Explicit label color */}
            <label htmlFor="password" className="text-sm font-medium text-zinc-50">Password</label>
            <Link to="/forgot-password" className="text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors">
              Forgot password?
            </Link>
          </div>
          
          <div className="relative group">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 transition-colors group-focus-within:text-blue-400" />
            {/* Forced input background, border, and text colors */}
            <Input 
              id="password" 
              type="password" 
              placeholder="••••••••"
              className="pl-9 bg-[#09090b] border-white/10 text-zinc-50 placeholder:text-zinc-600 transition-all duration-300 focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50" 
              required 
              disabled={isLoading} 
            />
          </div>
        </div>

        {/* High Contrast Submit Button */}
        <Button 
          type="submit" 
          className="w-full transition-all duration-300 bg-zinc-50 text-[#09090b] hover:bg-zinc-200 mt-2 font-semibold" 
          disabled={isLoading}
        >
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center"
              >
                <Loader2 className="mr-2 h-4 w-4 animate-spin text-zinc-500" />
                Authenticating...
              </motion.div>
            ) : (
              <motion.span
                key="label"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                Sign In
              </motion.span>
            )}
          </AnimatePresence>
        </Button>
      </form>

      {/* Footer Text */}
      <div className="text-center text-sm text-zinc-400 mt-6">
        Don't have an account?{' '}
        <Link to="/signup" className="text-zinc-50 hover:underline font-medium">
          Create an account
        </Link>
      </div>
    </motion.div>
  );
}