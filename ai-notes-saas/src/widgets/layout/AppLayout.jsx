import React, { useState, useEffect } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toggleSidebar } from '../../app/store/uiSlice';
import { 
  LayoutDashboard, 
  Settings, 
  Menu, 
  ChevronLeft, 
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

  // Synchronize Redux theme state with the HTML document element
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className="flex h-[100dvh] w-full overflow-hidden bg-zinc-50 dark:bg-[#09090b] text-zinc-900 dark:text-zinc-50 transition-colors duration-300">
      
      {/* MOBILE OVERLAY */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/20 dark:bg-black/60 backdrop-blur-sm md:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* SIDEBAR NAVIGATION */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-zinc-200 dark:border-white/5 bg-white dark:bg-[#0a0a0c] transition-all duration-300 md:static md:translate-x-0
          ${isMobileMenuOpen ? 'translate-x-0 w-64 shadow-2xl' : '-translate-x-full w-64'}
          ${isSidebarOpen ? 'md:w-64' : 'md:w-20'}
        `}
      >
        {/* Header Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-zinc-200 dark:border-white/5 shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/20">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className={`font-bold text-lg tracking-tight whitespace-nowrap text-zinc-900 dark:text-zinc-50 transition-all duration-200 ${!isSidebarOpen && 'md:opacity-0 md:w-0'}`}>
              NotelyAI
            </span>
          </div>
          
          <button className="md:hidden p-1.5 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-md transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
            <X className="h-5 w-5" />
          </button>

          {isSidebarOpen && (
            <button onClick={() => dispatch(toggleSidebar())} className="hidden md:flex h-7 w-7 items-center justify-center rounded-md hover:bg-zinc-100 dark:hover:bg-white/5 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1.5 p-3 overflow-y-auto">
          {NAVIGATION_ITEMS.map((item) => {
            const Icon = item.icon;
            
            // Fixes link highlight bug using precise route testing
            const isActive = item.path === '/dashboard' 
                ? location.pathname === '/dashboard' 
                : location.pathname.startsWith(item.path);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)} 
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all relative group
                  ${isActive 
                    ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' 
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-zinc-100'
                  }
                `}
              >
                <Icon className={`h-4 w-4 shrink-0 transition-transform ${!isActive && 'group-hover:scale-110'}`} />
                <span className={`whitespace-nowrap transition-all duration-200 ${!isSidebarOpen ? 'md:opacity-0 md:w-0 md:overflow-hidden' : 'opacity-100'}`}>
                  {item.name}
                </span>
                
                {!isSidebarOpen && (
                  <span className="absolute left-14 hidden group-hover:md:block z-50 rounded-md bg-zinc-800 border border-white/10 px-2 py-1.5 text-xs text-zinc-100 shadow-xl whitespace-nowrap">
                    {item.name}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Mini User Profile Footer */}
        <div className="p-3 border-t border-zinc-200 dark:border-white/5 bg-zinc-50 dark:bg-[#0a0a0c] shrink-0">
          <div className={`flex items-center gap-3 rounded-xl p-2 transition-colors ${isSidebarOpen ? 'hover:bg-zinc-200 dark:hover:bg-white/5 cursor-pointer' : ''}`}>
            <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-500/20 border border-purple-200 dark:border-purple-500/30 flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-purple-600 dark:text-purple-400">N</span>
            </div>
            <div className={`flex flex-col overflow-hidden transition-all duration-200 ${!isSidebarOpen ? 'md:opacity-0 md:w-0' : 'opacity-100'}`}>
              <span className="text-sm font-medium text-zinc-900 dark:text-zinc-200 truncate">Nayan</span>
              <span className="text-[10px] text-zinc-500 truncate">Pro Plan</span>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT WORKSPACE */}
      <div className="flex flex-1 flex-col overflow-hidden w-full relative">
        <header className="flex h-14 items-center gap-4 px-4 shrink-0 lg:absolute lg:top-0 lg:left-0 lg:z-10 lg:bg-transparent bg-white dark:bg-[#09090b] border-b lg:border-none border-zinc-200 dark:border-white/5">
          <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 -ml-2 rounded-lg text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors">
            <Menu className="h-5 w-5" />
          </button>
          {!isSidebarOpen && (
            <button onClick={() => dispatch(toggleSidebar())} className="hidden lg:flex p-2 -ml-2 rounded-lg text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors backdrop-blur-md">
              <Menu className="h-5 w-5" />
            </button>
          )}
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className={`h-full w-full ${!isSidebarOpen ? 'lg:pt-14' : ''}`}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}