import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toggleSidebar } from '../../app/store/uiSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Settings, 
  Menu, 
  Sparkles,
  X,
  GraduationCap,
  User,
  LogOut,
  Check,
  Zap
} from 'lucide-react';

const NAVIGATION_ITEMS = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Study Assistant', path: '/dashboard/study', icon: GraduationCap },
  { name: 'Settings', path: '/dashboard/settings', icon: Settings },
];

export function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const isSidebarOpen = useSelector((state) => state.ui.isSidebarOpen);
  const isDarkMode = useSelector((state) => state.ui.isDarkMode);
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false); 
  const [isLoggingOut, setIsLoggingOut] = useState(false); 
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false); // Controls Premium Pricing Modal
  
  const profileMenuRef = useRef(null);

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const executeFinalLogoutSequence = () => {
    setIsLoggingOut(false);
    navigate('/');
  };

  return (
    <div className={`flex h-[100dvh] w-full overflow-hidden transition-colors duration-300 ${
      isDarkMode ? 'bg-[#09090b]' : 'bg-zinc-50'
    }`}>
      
      {/* MOBILE OVERLAY */}
      {isMobileMenuOpen && (
        <div 
          className={`fixed inset-0 z-40 backdrop-blur-sm md:hidden transition-opacity ${
            isDarkMode ? 'bg-black/60' : 'bg-black/20'
          }`}
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* SIDEBAR NAVIGATION */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r transition-all duration-300 md:static md:translate-x-0 ${
          isMobileMenuOpen ? 'translate-x-0 w-64 shadow-2xl' : '-translate-x-full w-64'
        } ${
          isSidebarOpen ? 'md:w-64' : 'md:w-20'
        } ${
          isDarkMode ? 'bg-[#0a0a0c] border-white/5' : 'bg-white border-zinc-200'
        }`}
      >
        {/* Sidebar Header */}
        <div className={`flex h-16 items-center border-b shrink-0 relative ${
          isSidebarOpen ? 'justify-between px-4' : 'justify-center'
        } ${
          isDarkMode ? 'border-white/5' : 'border-zinc-200'
        }`}>
          
          {isSidebarOpen ? (
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white border border-zinc-200 dark:border-zinc-700 shadow-sm">
                <img
                  src="/ulight_logo-removebg-preview.png"
                  alt="Note AI"
                  className="h-10 w-10 object-contain"
                />
              </div>
              <span className="font-bold text-lg tracking-tight">Note AI</span>
            </div>
          ) : null}
          
          <button className={`md:hidden p-1.5 rounded-md transition-colors ${
            isDarkMode ? 'text-zinc-400 hover:text-zinc-50 hover:bg-white/5' : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100'
          }`} onClick={() => setIsMobileMenuOpen(false)}>
            <X className="h-5 w-5" />
          </button>

          <button 
            onClick={() => dispatch(toggleSidebar())} 
            className={`flex h-8 w-8 items-center justify-center rounded-md transition-colors shrink-0 ${
              isDarkMode ? 'text-zinc-400 hover:text-zinc-50 hover:bg-white/5' : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100'
            }`}
          >
            <Menu className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1.5 p-3 overflow-y-auto scrollbar-hide">
          {NAVIGATION_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = item.path === '/dashboard' 
              ? location.pathname === '/dashboard' 
              : location.pathname.startsWith(item.path);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)} 
                className={`flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-all relative group ${
                  isSidebarOpen ? 'gap-3' : 'justify-center px-0'
                } ${
                  isActive 
                    ? (isDarkMode ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600') 
                    : (isDarkMode ? 'text-zinc-400 hover:bg-white/5 hover:text-zinc-100' : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900')
                }`}
              >
                <Icon className={`h-4 w-4 shrink-0 transition-transform ${!isActive && 'group-hover:scale-110'}`} />
                <span className={`whitespace-nowrap transition-all duration-200 ${!isSidebarOpen ? 'hidden' : 'opacity-100'}`}>
                  {item.name}
                </span>
              </Link>
            );
          })}

          {/* SIDEBAR UPGRADE CTA ACCENT BOX */}
          {isSidebarOpen && (
            <div className={`mt-6 p-4 rounded-xl border relative overflow-hidden ${
              isDarkMode ? 'bg-zinc-900/40 border-zinc-800' : 'bg-zinc-100/70 border-zinc-200'
            }`}>
              <div className="flex items-center gap-2 text-xs font-black text-blue-500 uppercase tracking-widest">
                <Zap className="w-3.5 h-3.5 fill-current" /> Premium Access
              </div>
              <p className={`text-xs mt-1.5 leading-relaxed ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                Unlock infinite audio parses, mind map generations, and AI workspace templates.
              </p>
              <button
                type="button"
                onClick={() => setIsUpgradeOpen(true)}
                className="w-full mt-3 h-8 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-transform active:scale-[0.98]"
              >
                Upgrade Plan
              </button>
            </div>
          )}
        </nav>

        {/* Profile Footer Panel */}
        <div ref={profileMenuRef} className={`p-3 border-t shrink-0 relative ${
          isSidebarOpen ? '' : 'flex justify-center px-0'
        } ${
          isDarkMode ? 'border-white/5 bg-[#0a0a0c]' : 'border-zinc-200 bg-zinc-50'
        }`}>
          
          <AnimatePresence>
            {isProfileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className={`absolute z-50 left-3 right-3 bottom-[calc(100%-4px)] mb-2 p-1.5 rounded-xl border shadow-xl backdrop-blur-xl flex flex-col gap-0.5 ${
                  !isSidebarOpen && 'left-auto right-auto w-40'
                } ${
                  isDarkMode 
                    ? 'bg-[#121215]/95 border-zinc-800/80 text-zinc-200' 
                    : 'bg-white/95 border-zinc-200 text-zinc-700'
                }`}
              >
                <Link
                  to="/dashboard/settings?tab=account"
                  onClick={() => setIsProfileMenuOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isDarkMode ? 'hover:bg-white/5 hover:text-zinc-50' : 'hover:bg-zinc-100 hover:text-zinc-900'
                  }`}
                >
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>Account</span>
                </Link>

                <div className={`h-px my-1 ${isDarkMode ? 'bg-zinc-800/60' : 'bg-zinc-200/60'}`} />

                <button
                  type="button"
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    setIsLoggingOut(true);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-lg text-red-600 dark:text-red-400 transition-colors text-left ${
                    isDarkMode ? 'hover:bg-red-500/10' : 'hover:bg-red-50'
                  }`}
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <div 
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className={`flex items-center rounded-xl transition-colors select-none ${
              isSidebarOpen ? 'gap-3 p-2 hover:bg-zinc-200/50 dark:hover:bg-white/5 cursor-pointer' : 'cursor-pointer hover:opacity-80'
            }`}
          >
            <div className={`h-8 w-8 rounded-full border flex items-center justify-center shrink-0 ${
              isDarkMode ? 'bg-purple-500/20 border-purple-500/30 text-purple-400' : 'bg-purple-100 border-purple-200 text-purple-600'
            }`}>
              <span className="text-xs font-bold">N</span>
            </div>
            <div className={`flex flex-col overflow-hidden transition-all duration-200 ${!isSidebarOpen ? 'hidden' : 'opacity-100'}`}>
              <span className={`text-sm font-medium truncate ${isDarkMode ? 'text-zinc-200' : 'text-zinc-900'}`}>Nayan</span>
              <span className="text-[10px] text-zinc-500 truncate">Pro Plan</span>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT WORKSPACE */}
      <div className="flex flex-1 flex-col overflow-hidden w-full relative">
        <header className="flex h-14 items-center gap-4 px-4 shrink-0 md:hidden border-b bg-white dark:bg-[#09090b] border-zinc-200 dark:border-white/5">
          <button onClick={() => setIsMobileMenuOpen(true)} className={`p-2 -ml-2 rounded-lg transition-colors ${
            isDarkMode ? 'text-zinc-400 hover:text-zinc-50 hover:bg-white/5' : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100'
          }`}>
            <Menu className="h-5 w-5" />
          </button>
        </header>

        <main className="flex-1 overflow-y-auto scrollbar-hide">
          <div className="h-full w-full">
            <Outlet />
          </div>
        </main>
      </div>

      {/* --- PREMIUM UPGRADE MATRIX OVERLAY OVERRIDE DIALOG MODAL --- */}
      <AnimatePresence>
        {isUpgradeOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsUpgradeOpen(false)}
              className="absolute inset-0 bg-zinc-950/40 dark:bg-black/60 backdrop-blur-md"
            />

            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ type: "spring", stiffness: 360, damping: 26 }}
              className={`relative w-full max-w-3xl border rounded-3xl p-6 sm:p-8 shadow-2xl z-10 grid md:grid-cols-2 gap-6 ${
                isDarkMode ? 'border-zinc-800 bg-[#0d0d11] text-zinc-100' : 'border-zinc-200 bg-white text-zinc-900'
              }`}
            >
              <button 
                onClick={() => setIsUpgradeOpen(false)}
                className={`absolute top-4 right-4 p-1.5 rounded-lg transition-colors focus:outline-none z-20 ${
                  isDarkMode ? 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800' : 'text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100'
                }`}
              >
                <X className="w-4 h-4" />
              </button>

              {/* TIER 1: CURRENT STANDBY BASE INTERFACE */}
              <div className={`p-5 rounded-2xl border flex flex-col justify-between ${
                isDarkMode ? 'border-zinc-800/60 bg-zinc-900/20' : 'border-zinc-100 bg-zinc-50/50'
              }`}>
                <div>
                  <div className="text-zinc-400 font-bold text-xs uppercase tracking-wider">Current Tier</div>
                  <h4 className="text-2xl font-black tracking-tight mt-1">Free Base</h4>
                  <p className="text-zinc-500 text-xs mt-1">Essential operational context limits.</p>
                  
                  <div className="text-3xl font-black tracking-tight mt-4">$0 <span className="text-xs font-bold text-zinc-500">/ mo</span></div>
                  
                  <div className={`h-px my-4 ${isDarkMode ? 'bg-zinc-800' : 'bg-zinc-200'}`} />
                  <ul className="space-y-2.5 text-xs text-zinc-500 font-medium">
                    {["3 Multi-Modal uploads / mo", "Standard OCR processing speeds", "Basic chat generation pipelines", "10 summary templates"].map((f, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-zinc-400 shrink-0" /> {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <button disabled className="w-full mt-6 h-10 rounded-xl bg-zinc-200 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 font-bold text-xs cursor-not-allowed">Active Plan</button>
              </div>

              {/* TIER 2: ADVANCED PREMIUM MATRIX (MATCHES PLATFORM MESH THEME) */}
              <div className="p-5 rounded-2xl border border-blue-500/30 bg-blue-500/[0.02] flex flex-col justify-between relative overflow-hidden shadow-lg shadow-blue-500/[0.02]">
                <div className="absolute top-0 right-0 bg-blue-600 text-white font-black text-[9px] px-3 py-1 uppercase rounded-bl-xl tracking-wider select-none">Popular</div>
                <div>
                  <div className="text-blue-500 font-black text-xs uppercase tracking-widest flex items-center gap-1">
                    <Zap className="w-3 h-3 fill-current" /> Pro Engine
                  </div>
                  <h4 className="text-2xl font-black tracking-tight mt-1">Unlimited Pro</h4>
                  <p className="text-zinc-500 text-xs mt-1">Uncapped parameters workspace routing.</p>
                  
                  <div className="text-3xl font-black tracking-tight mt-4">$12 <span className="text-xs font-bold text-zinc-500">/ mo</span></div>
                  
                  <div className="h-px my-4 bg-blue-500/10" />
                  <ul className="space-y-2.5 text-xs text-zinc-600 dark:text-zinc-400 font-bold">
                    {["Infinite PDF & media uploads", "Hyper-speed local OCR clusters", "Advanced dynamic Mind Maps", "Priority local model compute queue", "Dedicated local secure database memory"].map((f, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-blue-500 shrink-0" /> {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <button 
                  type="button"
                  onClick={() => setIsUpgradeOpen(false)}
                  className="w-full mt-6 h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs tracking-wider uppercase shadow-md shadow-blue-600/10 active:scale-[0.98] transition-transform"
                >
                  Activate Pro Access
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* LOGOUT CONFIRMATION OVERLAY */}
      <AnimatePresence>
        {isLoggingOut && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsLoggingOut(false)}
              className="absolute inset-0 bg-zinc-950/40 dark:bg-black/60 backdrop-blur-md"
            />

            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ type: "spring", stiffness: 380, damping: 28 }}
              className={`relative w-full max-w-md border rounded-2xl p-6 shadow-2xl z-10 flex flex-col space-y-6 ${
                isDarkMode ? 'border-zinc-800 bg-zinc-900 text-zinc-100' : 'border-zinc-200 bg-white text-zinc-900'
              }`}
            >
              <button 
                onClick={() => setIsLoggingOut(false)}
                className={`absolute top-4 right-4 p-1.5 rounded-lg transition-colors focus:outline-none ${
                  isDarkMode ? 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800' : 'text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100'
                }`}
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex gap-4 items-start">
                <div className="p-3 bg-red-100 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl text-red-600 dark:text-red-400 shrink-0">
                  <LogOut className="w-6 h-6" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-xl font-bold tracking-tight">Signing Out?</h3>
                  <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                    You are about to terminate your secure session matrix. Unsaved inputs might turn invalid.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 justify-end w-full pt-2">
                <button 
                  type="button"
                  onClick={() => setIsLoggingOut(false)}
                  className={`h-10 px-4 rounded-xl text-sm font-medium border transition-colors ${
                    isDarkMode 
                      ? 'border-zinc-800 text-zinc-300 bg-zinc-900 hover:bg-zinc-800' 
                      : 'border-zinc-200 text-zinc-700 bg-white hover:bg-zinc-50'
                  }`}
                >
                  Cancel
                </button>
                <button 
                  type="button"
                  onClick={executeFinalLogoutSequence}
                  className="h-10 bg-red-600 hover:bg-red-700 dark:bg-red-500 text-white font-semibold px-4 rounded-xl text-sm shadow-md transition-transform active:scale-[0.98]"
                >
                  Sign Out
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}