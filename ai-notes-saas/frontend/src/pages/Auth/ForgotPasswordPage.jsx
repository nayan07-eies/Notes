import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '/Project/ai-notes-saas/frontend/src/components/ui/button';
import { Input } from '/Project/ai-notes-saas/frontend/src/components/ui/input';
import { Mail, ArrowLeft, CheckCircle2, Loader2, Sparkles } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Mock API call for sending reset link
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full bg-background text-foreground flex flex-col relative overflow-hidden font-sans selection:bg-primary/20 transition-colors duration-300">
      
      {/* Whole-Page Adaptive Radial Glow Effects */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[50rem] h-[50rem] rounded-full bg-primary/10 dark:bg-primary/5 blur-[128px] pointer-events-none transition-all duration-300" />
      <div className="absolute bottom-[10%] right-[-10%] w-[45rem] h-[45rem] rounded-full bg-purple-500/10 dark:bg-purple-500/5 blur-[128px] pointer-events-none transition-all duration-300" />

      {/* Centered Main Layout Wrapper */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center py-12 lg:py-20 z-10">
        
        {/* Animated Wrapper Container */}
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
              {/* Header Title & Subtext */}
              <div className="space-y-1.5 text-center">
                <h2 className="text-2xl font-bold tracking-tight text-foreground">Reset Password</h2>
                <p className="text-sm text-muted-foreground">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
              </div>

              {/* AnimatePresence for smooth conditional transition toggles */}
              <AnimatePresence mode="wait">
                {isSubmitted ? (
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="bg-primary/5 dark:bg-primary/10 text-primary p-6 rounded-xl border border-primary/20 text-center space-y-4 flex flex-col items-center shadow-inner"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                    >
                      <CheckCircle2 className="w-12 h-12 text-emerald-500 dark:text-emerald-400 drop-shadow-sm" />
                    </motion.div>
                    
                    <p className="text-sm font-medium text-muted-foreground">
                      Check your inbox! We've sent a recovery link to <strong className="text-foreground font-semibold">{email}</strong>.
                    </p>
                    
                    <Button 
                      variant="outline" 
                      className="w-full mt-2 bg-background/50 border-input text-foreground hover:bg-muted transition-colors rounded-xl h-11 font-medium" 
                      onClick={() => setIsSubmitted(false)}
                    >
                      Try another email
                    </Button>
                  </motion.div>
                ) : (
                  <motion.form 
                    key="form"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    onSubmit={handleSubmit} 
                    className="space-y-4"
                  >
                    {/* Email Field Layout Component */}
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
                          placeholder="name@example.com"
                          className="pl-9 h-11 bg-background/50 dark:bg-background/40 border-input text-foreground transition-all duration-300 focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary rounded-xl"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          disabled={isLoading}
                        />
                      </div>
                    </div>

                    {/* Submit Reset Action Button */}
                    <Button 
                      type="submit" 
                      className="w-full h-11 relative overflow-hidden font-semibold mt-2 shadow-lg shadow-primary/20 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 active:scale-[0.98] rounded-xl" 
                      disabled={isLoading}
                    >
                      <AnimatePresence mode="wait">
                        {isLoading ? (
                          <motion.div
                            key="loading"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex items-center justify-center gap-2"
                          >
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Sending Link...
                          </motion.div>
                        ) : (
                          <motion.span
                            key="default"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                          >
                            Send Reset Link
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </Button>
                  </motion.form>
                )}
              </AnimatePresence>

              {/* Navigation Return Directives */}
              <div className="text-center border-t border-border pt-4 mt-2">
                <Link 
                  to="/login" 
                  className="group text-sm font-medium text-muted-foreground hover:text-primary flex items-center justify-center gap-1.5 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                  Back to Login
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}