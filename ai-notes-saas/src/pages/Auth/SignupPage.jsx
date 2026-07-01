import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Mail, Lock, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function SignupPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Mock API call
    setTimeout(() => {
      setIsLoading(false);
      navigate('/dashboard/study'); // Redirect to dashboard on success
    }, 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="space-y-6 w-full"
    >
      <div className="space-y-2 text-center lg:text-left">
        <h1 className="text-3xl font-bold tracking-tight">Create an account</h1>
        <p className="text-sm text-muted-foreground">
          Enter your details below to initialize your AI workspace.
        </p>
      </div>

      <form onSubmit={handleSignup} className="space-y-4">
        {/* Name Grid with User Icons */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="firstName" className="text-sm font-medium">First name</label>
            <div className="relative group">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
              <Input 
                id="firstName" 
                placeholder="John" 
                className="pl-9 transition-all duration-300 focus:ring-2 focus:ring-primary/20" 
                required 
                disabled={isLoading} 
              />
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="lastName" className="text-sm font-medium">Last name</label>
            <div className="relative group">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
              <Input 
                id="lastName" 
                placeholder="Doe" 
                className="pl-9 transition-all duration-300 focus:ring-2 focus:ring-primary/20" 
                required 
                disabled={isLoading} 
              />
            </div>
          </div>
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">Email Address</label>
          <div className="relative group">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
            <Input 
              id="email" 
              type="email" 
              placeholder="name@company.com" 
              className="pl-9 transition-all duration-300 focus:ring-2 focus:ring-primary/20" 
              required 
              disabled={isLoading} 
            />
          </div>
        </div>
        
        {/* Password Field */}
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">Password</label>
          <div className="relative group">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
            <Input 
              id="password" 
              type="password" 
              className="pl-9 transition-all duration-300 focus:ring-2 focus:ring-primary/20" 
              required 
              disabled={isLoading} 
            />
          </div>
        </div>

        {/* Animated Submit Button */}
        <Button type="submit" className="w-full transition-all duration-300" disabled={isLoading}>
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center"
              >
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Initializing Workspace...
              </motion.div>
            ) : (
              <motion.span
                key="label"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                Initialize Workspace
              </motion.span>
            )}
          </AnimatePresence>
        </Button>
      </form>

      <div className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link to="/login" className="text-primary hover:underline font-medium transition-colors">
          Sign in
        </Link>
      </div>
    </motion.div>
  );
}