import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleDarkMode } from '@/app/store/uiSlice';
import { User, Bell, Shield, Palette, Moon, Sun, Check } from 'lucide-react';
import { LogoutButton } from '@/features/auth/LogoutButton';

export default function SettingsPage() {
  const dispatch = useDispatch();
  const isDarkMode = useSelector((state) => state.ui.isDarkMode);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">Manage your account preferences and application aesthetics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
        
        {/* Settings Navigation Sidebar (Visual only for now) */}
        <div className="space-y-1 md:col-span-1">
          <button className="w-full flex items-center gap-3 px-3 py-2 bg-muted text-foreground font-medium rounded-md transition-colors">
            <Palette className="h-4 w-4" /> Appearance
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 text-muted-foreground hover:bg-muted/50 hover:text-foreground font-medium rounded-md transition-colors">
            <User className="h-4 w-4" /> Account
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 text-muted-foreground hover:bg-muted/50 hover:text-foreground font-medium rounded-md transition-colors">
            <Bell className="h-4 w-4" /> Notifications
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 text-muted-foreground hover:bg-muted/50 hover:text-foreground font-medium rounded-md transition-colors">
            <Shield className="h-4 w-4" /> Security
          </button>
        </div>

        {/* Settings Content Area */}
        <div className="md:col-span-3 space-y-6">
          
          {/* Appearance Card */}
          <div className="p-6 border border-border bg-card rounded-xl shadow-sm">
            <div className="mb-5">
              <h3 className="text-lg font-semibold">Appearance</h3>
              <p className="text-sm text-muted-foreground">Customize how NotelyAI looks on your device.</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Light Mode Button */}
              <button 
                onClick={() => isDarkMode && dispatch(toggleDarkMode())}
                className={`flex-1 flex flex-col items-center justify-center p-6 border-2 rounded-xl transition-all
                  ${!isDarkMode ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-muted/50'}
                `}
              >
                <div className="p-3 bg-background border border-border rounded-full mb-3 shadow-sm">
                  <Sun className="h-6 w-6 text-orange-500" />
                </div>
                <span className="font-semibold text-foreground">Light Mode</span>
                {!isDarkMode && (
                  <span className="flex items-center gap-1 text-xs text-primary mt-2 font-medium">
                    <Check className="h-3 w-3" /> Active
                  </span>
                )}
              </button>

              {/* Dark Mode Button */}
              <button 
                onClick={() => !isDarkMode && dispatch(toggleDarkMode())}
                className={`flex-1 flex flex-col items-center justify-center p-6 border-2 rounded-xl transition-all
                  ${isDarkMode ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-muted/50'}
                `}
              >
                <div className="p-3 bg-slate-900 border border-slate-700 rounded-full mb-3 shadow-sm">
                  <Moon className="h-6 w-6 text-blue-400" />
                </div>
                <span className="font-semibold text-foreground">Dark Mode</span>
                {isDarkMode && (
                  <span className="flex items-center gap-1 text-xs text-primary mt-2 font-medium">
                    <Check className="h-3 w-3" /> Active
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* User Profile Card (Placeholder logic) */}
          <div className="p-6 border border-border bg-card rounded-xl shadow-sm opacity-60 pointer-events-none">
            <div className="mb-5">
              <h3 className="text-lg font-semibold">Account Details</h3>
              <p className="text-sm text-muted-foreground">Update your personal workspace information.</p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Workspace Name</label>
                <input disabled type="text" value="Enterprise Beta" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
              </div>
            </div>
          </div>

          <div className="p-6 border border-border bg-card rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold text-destructive">Danger Zone</h3>
            <p className="text-sm text-muted-foreground mb-4">Log out of your workspace.</p>
            <LogoutButton variant="destructive" />
          </div>
        </div>
      </div>
    </div>
  );
}