import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Mail, Lock } from 'lucide-react';
import { Input } from '/Project/ai-notes-saas/frontend/src/components/ui/input';
import { Button } from '/Project/ai-notes-saas/frontend/src/components/ui/button';

export default function LoginPage() {
  const navigate = useNavigate();
  const isDarkMode = useSelector((state) => state.ui?.isDarkMode || false);
  const [isLoading, setIsLoading] = useState(false);
  const [isOAuthLoading, setIsOAuthLoading] = useState(null);

  // Controlled Input Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError('');

    setTimeout(() => {
      setIsLoading(false);

      // --- ADMINISTRATIVE GATE ROUTER CONTROLLER ---
      if (email === 'admin@gmail.com' && password === 'admin123') {
        console.log("Admin credentials verified. Launching system control panel matrix...");
        navigate('/admin');
      } else if (email.endsWith('@workspace.io') || email.includes('@')) {
        // Fallback simulated credential mapping for standard users
        console.log("Standard client credentials verified. Launching workspace environment...");
        navigate('/dashboard/study');
      } else {
        setAuthError('Invalid credentials. Please verify parameters.');
      }
    }, 1500);
  };

  const handleOAuthLogin = (provider) => {
    setIsOAuthLoading(provider);
    setAuthError('');
    console.log(`Initializing third-party OAuth provider gateway validation stream: ${provider}`);
    
    setTimeout(() => {
      setIsOAuthLoading(null);
      navigate('/dashboard/study');
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full bg-background text-foreground flex flex-col relative overflow-hidden font-sans selection:bg-primary/20 transition-colors duration-300">
      
      {/* Adaptive Background Radial Ambient Glows */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[50rem] h-[50rem] rounded-full bg-primary/10 dark:bg-primary/5 blur-[128px] pointer-events-none transition-all duration-300" />
      <div className="absolute bottom-[10%] right-[-10%] w-[45rem] h-[45rem] rounded-full bg-purple-500/10 dark:bg-purple-500/5 blur-[128px] pointer-events-none transition-all duration-300" />

      {/* Main Container Wrapper */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center py-12 lg:py-20 z-10">
        
        {/* Card Box Frame with Micro-Animations */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          <div className="relative group rounded-2xl border border-border bg-card/60 dark:bg-card/40 backdrop-blur-xl p-6 sm:p-8 shadow-2xl dark:shadow-black/40 transition-all duration-300 hover:border-primary/20">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent rounded-full" />

            <div className="space-y-5">
              <div className="space-y-1.5 text-center">
                <h2 className="text-2xl font-bold tracking-tight text-foreground">
                  Welcome back
                </h2>
                <p className="text-sm text-muted-foreground">
                  Enter your credentials to access your workspace.
                </p>
              </div>

              {/* Dynamic Authentication Feedback Alert */}
              <AnimatePresence mode="wait">
                {authError && (
                  <motion.div 
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="p-3 text-xs font-bold text-rose-500 bg-rose-500/10 rounded-xl border border-rose-500/20 text-center"
                  >
                    {authError}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Form Input Matrix */}
              <form onSubmit={handleLogin} className="space-y-4">
                
                {/* Email Address Node */}
                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">
                    Email Address
                  </label>
                  <div className="relative group/field">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 group-focus-within/field:text-primary transition-colors duration-200" />
                    <Input 
                      id="email" 
                      type="email" 
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@company.com" 
                      className="pl-9 bg-background/50 dark:bg-background/40 border-input text-foreground transition-all duration-300 focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary" 
                      required 
                      disabled={isLoading || !!isOAuthLoading} 
                    />
                  </div>
                </div>
                
                {/* Password Field Node */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">
                      Password
                    </label>
                    <Link to="/forgot-password" className="text-xs text-primary hover:text-primary/80 hover:underline font-bold transition-colors">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative group/field">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 group-focus-within/field:text-primary transition-colors duration-200" />
                    <Input 
                      id="password" 
                      type="password" 
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="pl-9 bg-background/50 dark:bg-background/40 border-input text-foreground transition-all duration-300 focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary" 
                      required 
                      disabled={isLoading || !!isOAuthLoading} 
                    />
                  </div>
                </div>

                {/* Validation Execution Button */}
                <Button 
                  type="submit" 
                  className="w-full h-11 relative overflow-hidden font-bold mt-2 shadow-lg shadow-primary/10 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 active:scale-[0.98]" 
                  disabled={isLoading || !!isOAuthLoading}
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
                        Validating Parameters...
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

              {/* Separator Divider */}
              <div className="relative flex items-center py-1">
                <div className="flex-grow border-t border-border" />
                <span className="flex-shrink-0 mx-4 text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                  Or continue with
                </span>
                <div className="flex-grow border-t border-border" />
              </div>

              {/* Third-Party Federated Identity Pane */}
              <div className="grid grid-cols-3 gap-2">
                {['google', 'github', 'apple'].map((provider) => (
                  <Button 
                    key={provider}
                    variant="outline" 
                    type="button"
                    className="h-11 rounded-xl bg-background/40 border-border hover:bg-muted/80 transition-all"
                    onClick={() => handleOAuthLogin(provider)}
                    disabled={isLoading || !!isOAuthLoading}
                  >
                    {isOAuthLoading === provider ? (
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    ) : provider === 'google' ? (
                      <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                        <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l3.227-3.11c-2.074-1.933-4.94-3.11-8.274-3.11C5.474 0 0 5.373 0 12s5.474 12 12.24 12c6.833 0 11.383-4.75 11.383-11.43 0-.775-.084-1.365-.188-1.715H12.24z"/>
                      </svg>
                    ) : provider === 'github' ? (
                      <svg className="h-4 w-4 fill-current text-foreground" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                      </svg>
                    ) : (
                      <svg className="h-4 w-4 fill-current text-foreground" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.07 2.47.3 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.21.67-2.93 1.49-.62.69-1.16 1.84-1.01 2.96 1.12.08 2.27-.57 2.95-1.39z"/>
                      </svg>
                    )}
                  </Button>
                ))}
              </div>

              {/* Redirection link */}
              <div className="text-center text-sm text-muted-foreground border-t border-border pt-4">
                Don't have an account?{' '}
                <Link to="/signup" className="text-primary hover:text-primary/80 hover:underline font-bold transition-colors ml-0.5">
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