import React, { useState, useEffect } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toggleSidebar } from '../../app/store/uiSlice';
import { LogoutButton } from '@/features/auth/LogoutButton';
import { 
  LayoutDashboard, 
  FileText, 
  Settings, 
  Menu, 
  ChevronLeft, 
  Sparkles,
  X,
  GraduationCap // <-- 1. Import the new icon here!
} from 'lucide-react';

// 2. Add the Study Assistant to your navigation array!
const NAVIGATION_ITEMS = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  // { name: 'My Notes', path: '/dashboard/notes', icon: FileText },
  { name: 'Study Assistant', path: '/dashboard/study', icon: GraduationCap }, // <-- Added this!
  { name: 'Settings', path: '/dashboard/settings', icon: Settings },
];

export function AppLayout() {
  const location = useLocation();
  const dispatch = useDispatch();
  
  // 1. Grab all Redux State first
  const isSidebarOpen = useSelector((state) => state.ui.isSidebarOpen);
  const isDarkMode = useSelector((state) => state.ui.isDarkMode);
  
  // 2. Synchronize Redux state with the HTML document class for Tailwind
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDarkMode]);
  
  // 3. Local state strictly for handling the mobile sliding drawer
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      
      {/* MOBILE OVERLAY */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* SIDEBAR NAVIGATION */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-border bg-card transition-all duration-300 md:static md:translate-x-0
          /* Mobile Drawer Positioning */
          ${isMobileMenuOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64'}
          /* Desktop Width Control */
          ${isSidebarOpen ? 'md:w-64' : 'md:w-20'}
        `}
      >
        {/* Sidebar Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-border">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Sparkles className="h-5 w-5" />
            </div>
            {/* Always show text on mobile, toggle on desktop */}
            <span className={`font-bold text-lg tracking-tight whitespace-nowrap ${!isSidebarOpen && 'md:hidden'}`}>
              NotelyAI
            </span>
          </div>
          
          {/* Close button for Mobile */}
          <button 
            className="md:hidden p-1 text-muted-foreground hover:bg-muted rounded-md" 
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>

          {/* Collapse button for Desktop */}
          {isSidebarOpen && (
            <button 
              onClick={() => dispatch(toggleSidebar())}
              className="hidden md:flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted text-muted-foreground"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1 p-3">
          {NAVIGATION_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)} // Auto-close on mobile when clicking a link
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors relative group
                  ${isActive 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }
                `}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span className={`transition-opacity duration-200 ${!isSidebarOpen && 'md:hidden'}`}>
                  {item.name}
                </span>
                
                {/* Floating Tooltip when sidebar is collapsed on desktop */}
                {!isSidebarOpen && (
                  <span className="absolute left-16 hidden group-hover:md:block z-30 rounded-md bg-popover border border-border px-2 py-1 text-xs text-popover-foreground shadow-md whitespace-nowrap">
                    {item.name}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-border mt-auto">
          <LogoutButton variant="ghost" className="text-destructive hover:bg-destructive/10 hover:text-destructive" />
        </div>
      </aside>

      {/* MAIN CONTENT WORKSPACE */}
      <div className="flex flex-1 flex-col overflow-hidden w-full">
        {/* Top Navbar Header */}
        {/* <header className="flex h-16 items-center border-b border-border bg-card px-4 md:px-6"> */}
          
          {/* Hamburger Menu (Mobile Only) */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="mr-4  bg-[#09090b] rounded-md p-2 hover:bg-muted text-muted-foreground md:hidden "
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Expand Sidebar Menu (Desktop Only) */}
          {!isSidebarOpen && (
            <button
              onClick={() => dispatch(toggleSidebar())}
              className="hidden md:flex mr-4 h-8 w-8 items-center justify-center rounded-md hover:bg-muted text-muted-foreground"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}
          
          {/* <div className="flex-1">
            <h1 className="text-sm font-medium text-muted-foreground">Workspace / Enterprise</h1>
          </div> */}
      

        {/* Dynamic Route View Mountpoint */}
        <main className="flex-1 overflow-y-auto bg-background p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}