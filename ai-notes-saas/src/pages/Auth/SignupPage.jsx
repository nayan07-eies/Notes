import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Loader2, 
  Mail, 
  Lock, 
  User 
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function SignupPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSignup = (e) => {
    e.preventDefault();
    setIsLoading(true);

    console.log("Submitting registration matrix:", formData);

    setTimeout(() => {
      setIsLoading(false);
      navigate('/dashboard/study'); 
    }, 2000);
  };

  return (
    <div className="min-h-screen w-full bg-background text-foreground flex flex-col relative overflow-hidden font-sans selection:bg-primary/20 transition-colors duration-300">
      
      {/* Whole-Page Adaptive Radial Glow Effects */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[50rem] h-[50rem] rounded-full bg-primary/10 dark:bg-primary/5 blur-[128px] pointer-events-none transition-all duration-300" />
      <div className="absolute bottom-[10%] right-[-10%] w-[45rem] h-[45rem] rounded-full bg-purple-500/10 dark:bg-purple-500/5 blur-[128px] pointer-events-none transition-all duration-300" />

      {/* Main Responsive Layout Wrapper */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center py-12 lg:py-20 z-10">
        
        {/* Animated Signup Form Box */}
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
                  Create your account
                </h2>
                <p className="text-sm text-muted-foreground">
                  Initialize your decentralized AI workspace parameters.
                </p>
              </div>

              {/* Form Matrix */}
              <form onSubmit={handleSignup} className="space-y-4">
                
                {/* Responsive Name Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="firstName" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      First name
                    </label>
                    <div className="relative group/field">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/80 group-focus-within/field:text-primary transition-colors duration-200" />
                      <Input 
                        id="firstName" 
                        type="text"
                        autoComplete="given-name"
                        aria-label="First Name"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="Nayan" 
                        className="pl-9 bg-background/50 dark:bg-background/40 border-input text-foreground transition-all duration-300 focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary" 
                        required 
                        disabled={isLoading} 
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="lastName" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Last name
                    </label>
                    <div className="relative group/field">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/80 group-focus-within/field:text-primary transition-colors duration-200" />
                      <Input 
                        id="lastName" 
                        type="text"
                        autoComplete="family-name"
                        aria-label="Last Name"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="Tarpara" 
                        className="pl-9 bg-background/50 dark:bg-background/40 border-input text-foreground transition-all duration-300 focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary" 
                        required 
                        disabled={isLoading} 
                      />
                    </div>
                  </div>
                </div>

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
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="name@example.com" 
                      className="pl-9 bg-background/50 dark:bg-background/40 border-input text-foreground transition-all duration-300 focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary" 
                      required 
                      disabled={isLoading} 
                    />
                  </div>
                </div>
                
                {/* Password Input Field */}
                <div className="space-y-1.5">
                  <label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Password
                  </label>
                  <div className="relative group/field">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/80 group-focus-within/field:text-primary transition-colors duration-200" />
                    <Input 
                      id="password" 
                      type="password" 
                      autoComplete="new-password"
                      aria-label="Password"
                      value={formData.password}
                      onChange={handleInputChange}
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
                        Initializing Workspace...
                      </motion.div>
                    ) : (
                      <motion.span
                        key="label"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        Initialize Workspace
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Button>
              </form>

              {/* Login Redirection Layout Boundary */}
              <div className="text-center text-sm text-muted-foreground border-t border-border pt-4 mt-2">
                Already have an account?{' '}
                <Link to="/login" className="text-primary hover:text-primary/80 hover:underline font-semibold transition-colors ml-0.5">
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}