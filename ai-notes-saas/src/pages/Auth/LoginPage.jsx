import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Mail, Lock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  const navigate = useNavigate();
  const isDarkMode = useSelector((state) => state.ui?.isDarkMode || false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/dashboard/study');
    }, 1800);
  };

  return (
    <div className="min-h-screen w-full bg-background text-foreground flex flex-col relative overflow-hidden font-sans selection:bg-primary/20 transition-colors duration-300">
      
      {/* Whole-Page Adaptive Radial Glow Effects */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[50rem] h-[50rem] rounded-full bg-primary/10 dark:bg-primary/5 blur-[128px] pointer-events-none transition-all duration-300" />
      <div className="absolute bottom-[10%] right-[-10%] w-[45rem] h-[45rem] rounded-full bg-purple-500/10 dark:bg-purple-500/5 blur-[128px] pointer-events-none transition-all duration-300" />

      {/* Main Responsive Layout Wrapper */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center py-12 lg:py-20 z-10">
        
        {/* Animated Login Form Box */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          {/* Universal Theme-Adaptive Premium Glass Card */}
          <div className="relative group rounded-2xl border border-border bg-card/60 dark:bg-card/40 backdrop-blur-xl p-6 sm:p-8 shadow-2xl dark:shadow-black/40 transition-all duration-300 hover:border-primary/20">
            
            {/* Ambient Accent Header Border Highlight */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent rounded-full" />

            <div className="space-y-6">
              {/* Header Titles */}
              <div className="space-y-1.5 text-center">
                <h2 className="text-2xl font-bold tracking-tight text-foreground">
                  Welcome back
                </h2>
                <p className="text-sm text-muted-foreground">
                  Enter your credentials to access your local workspace.
                </p>
              </div>

              {/* Form Matrix */}
              <form onSubmit={handleLogin} className="space-y-4">
                
                {/* Email Input Field */}
                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Email Address
                  </label>
                  <div className="relative group/field">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/80 group-focus-within/field:text-primary transition-colors duration-200" />
                    <Input 
                      id="email" 
                      type="email" 
                      autoComplete="email"
                      aria-label="Email Address"
                      placeholder="name@company.com" 
                      className="pl-9 bg-background/50 dark:bg-background/40 border-input text-foreground transition-all duration-300 focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary" 
                      required 
                      disabled={isLoading} 
                    />
                  </div>
                </div>
                
                {/* Password Input Field */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Password
                    </label>
                    <Link to="/forgot-password" className="text-xs text-primary hover:text-primary/80 hover:underline font-semibold transition-colors">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative group/field">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/80 group-focus-within/field:text-primary transition-colors duration-200" />
                    <Input 
                      id="password" 
                      type="password" 
                      autoComplete="current-password"
                      aria-label="Password"
                      placeholder="••••••••"
                      className="pl-9 pr-10 bg-background/50 dark:bg-background/40 border-input text-foreground transition-all duration-300 focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary" 
                      required 
                      disabled={isLoading} 
                    />
                  </div>
                </div>

                {/* Submit Action Button */}
                <Button 
                  type="submit" 
                  className="w-full relative overflow-hidden font-semibold mt-2 shadow-lg shadow-primary/20 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 active:scale-[0.98]" 
                  disabled={isLoading}
                >
                  <AnimatePresence mode="wait">
                    {isLoading ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center justify-center gap-2"
                      >
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Authenticating Identity...
                      </motion.div>
                    ) : (
                      <motion.span
                        key="label"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        Sign In to Workspace
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Button>
              </form>

              {/* Account Redirection Link */}
              <div className="text-center text-sm text-muted-foreground border-t border-border pt-4 mt-2">
                Don't have an account?{' '}
                <Link to="/signup" className="text-primary hover:text-primary/80 hover:underline font-semibold transition-colors ml-0.5">
                  Create an account
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}