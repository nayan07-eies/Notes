import React, { useState, useEffect } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toggleSidebar } from '../../app/store/uiSlice';
import { 
  LayoutDashboard, 
  Settings, 
  Menu, 
  Sparkles,
  X,
  GraduationCap
} from 'lucide-react';

const NAVIGATION_ITEMS = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Study Assistant', path: '/dashboard/study', icon: GraduationCap },
  { name: 'Settings', path: '/dashboard/settings', icon: Settings },
];

export function AppLayout() {
  const location = useLocation();
  const dispatch = useDispatch();
  
  const isSidebarOpen = useSelector((state) => state.ui.isSidebarOpen);
  const isDarkMode = useSelector((state) => state.ui.isDarkMode);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Sync dark mode class with html element
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDarkMode]);

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
          
          {/* FIX 1: Logo content wraps inside an Animate Presence check condition */}
          {isSidebarOpen ? (
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/20">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className={`font-bold text-lg tracking-tight text-zinc-900 dark:text-zinc-50`}>
                Note AI
              </span>
            </div>
          ) : null}
          
          {/* Mobile Close Button */}
          <button className={`md:hidden p-1.5 rounded-md transition-colors ${
            isDarkMode ? 'text-zinc-400 hover:text-zinc-50 hover:bg-white/5' : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100'
          }`} onClick={() => setIsMobileMenuOpen(false)}>
            <X className="h-5 w-5" />
          </button>

          {/* Persistent Sidebar Toggle Controller */}
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
                
                {/* FIX 2: Completely removed the absolute-positioned text box popup wrapper from here */}
              </Link>
            );
          })}
        </nav>

        {/* Mini User Profile Footer */}
        <div className={`p-3 border-t shrink-0 ${
          isSidebarOpen ? '' : 'flex justify-center px-0'
        } ${
          isDarkMode ? 'border-white/5 bg-[#0a0a0c]' : 'border-zinc-200 bg-zinc-50'
        }`}>
          <div className={`flex items-center rounded-xl transition-colors ${
            isSidebarOpen ? 'gap-3 p-2 hover:bg-white/5 cursor-pointer' : 'p-0'
          }`}>
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
        {/* Mobile Top Header */}
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
    </div>
  );
}