import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toggleSidebar } from '../../app/store/uiSlice';
import { 
  LayoutDashboard, 
  FileText, 
  Settings, 
  Menu, 
  ChevronLeft, 
  Sparkles 
} from 'lucide-react';

const NAVIGATION_ITEMS = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'My Notes', path: '/notes', icon: FileText },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export function AppLayout() {
  const location = useLocation();
  const dispatch = useDispatch();
  const isSidebarOpen = useSelector((state) => state.ui.isSidebarOpen);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground">
      {/* Sidebar Navigation */}
      <aside 
        className={`fixed inset-y-0 left-0 z-20 flex flex-col border-r border-border bg-card transition-all duration-300 md:static
          ${isSidebarOpen ? 'w-64' : 'w-16 md:w-20'}
        `}
      >
        {/* Sidebar Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-border">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Sparkles className="h-5 w-5" />
            </div>
            {isSidebarOpen && (
              <span className="font-bold text-lg tracking-tight whitespace-nowrap">NotelyAI</span>
            )}
          </div>
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
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors relative group
                  ${isActive 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }
                `}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {isSidebarOpen ? (
                  <span className="transition-opacity duration-200">{item.name}</span>
                ) : (
                  /* Floating Tooltip when sidebar is collapsed */
                  <span className="absolute left-16 hidden group-hover:block z-30 rounded-md bg-popover border border-border px-2 py-1 text-xs text-popover-foreground shadow-md whitespace-nowrap">
                    {item.name}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Workspace */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Navbar Header */}
        <header className="flex h-16 items-center border-b border-border bg-card px-6">
          <button
            onClick={() => dispatch(toggleSidebar())}
            className="mr-4 rounded-md p-2 hover:bg-muted text-muted-foreground md:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          {!isSidebarOpen && (
            <button
              onClick={() => dispatch(toggleSidebar())}
              className="hidden md:flex mr-4 h-8 w-8 items-center justify-center rounded-md hover:bg-muted text-muted-foreground"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}
          <div className="flex-1">
            <h1 className="text-sm font-medium text-muted-foreground">Workspace / Enterprise</h1>
          </div>
        </header>

        {/* Dynamic Route View Mountpoint */}
        <main className="flex-1 overflow-y-auto bg-background p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}