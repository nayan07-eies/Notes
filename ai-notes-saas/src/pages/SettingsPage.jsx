import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleDarkMode } from '@/app/store/uiSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Bell, Shield, Palette, Moon, Sun, Check, AlertTriangle, Camera, Save, Loader2 } from 'lucide-react';
import { LogoutButton } from '@/features/auth/LogoutButton';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const TABS = [
  { id: 'account', label: 'Account', icon: User },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
];

export default function SettingsPage() {
  const dispatch = useDispatch();
  const isDarkMode = useSelector((state) => state.ui.isDarkMode);
  
  const [activeTab, setActiveTab] = useState('account');
  const [isSaving, setIsSaving] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: 'Alex',
    lastName: 'Chen',
    email: 'alex.chen@example.com'
  });

  const handleProfileSave = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1500);
  };

  return (
    // FIX: Removed hardcoded background, let the layout container handle it
    <div className="w-full max-w-6xl mx-auto p-4 md:p-8 space-y-8">
      
      {/* HEADER */}
      <div className="border-b border-zinc-200 dark:border-white/5 pb-6">
        <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Settings</h2>
        <p className="text-zinc-500 dark:text-zinc-400 mt-1">Manage your workspace preferences and account settings.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
        
        {/* --- LEFT SIDEBAR (Navigation) --- */}
        <nav className="w-full md:w-64 shrink-0 space-y-1">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive 
                    ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold' 
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-zinc-50 font-medium'
                }`}
              >
                <Icon className={`h-4 w-4 transition-transform duration-300 ${!isActive && 'group-hover:scale-110'}`} />
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* --- RIGHT CONTENT AREA --- */}
        <div className="flex-1 min-w-0 pb-16">
          <AnimatePresence mode="wait">
            
            {/* ACCOUNT TAB */}
            {activeTab === 'account' && (
              <motion.div 
                key="account"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* Profile Details Card */}
                <div className="p-6 md:p-8 border border-zinc-200 dark:border-white/5 bg-white dark:bg-white/[0.02] backdrop-blur-xl rounded-2xl shadow-xl">
                  <div className="mb-8 border-b border-zinc-200 dark:border-white/5 pb-6">
                    <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">Profile Details</h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Update your personal workspace information.</p>
                  </div>
                  
                  <form onSubmit={handleProfileSave} className="space-y-8">
                    {/* Avatar Section */}
                    <div className="flex items-center gap-6">
                      <div className="relative group cursor-pointer">
                        <div className="h-20 w-20 md:h-24 md:w-24 rounded-full bg-purple-100 dark:bg-purple-500/10 border-2 border-purple-200 dark:border-purple-500/20 flex items-center justify-center overflow-hidden transition-all group-hover:border-purple-400 dark:group-hover:border-purple-500/50">
                          <span className="text-2xl md:text-3xl font-bold text-purple-600 dark:text-purple-400">
                            {profileData.firstName[0]}{profileData.lastName[0]}
                          </span>
                          <div className="absolute inset-0 bg-black/40 dark:bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                            <Camera className="w-5 h-5 md:w-6 md:h-6 text-white" />
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-zinc-900 dark:text-zinc-50">Profile Picture</h4>
                        <p className="text-xs md:text-sm text-zinc-500 mb-3">JPG, GIF or PNG. 1MB max.</p>
                        <Button type="button" variant="outline" size="sm" className="bg-zinc-50 dark:bg-white/5 border-zinc-200 dark:border-white/10 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/10 dark:hover:text-white h-8">
                          Upload new
                        </Button>
                      </div>
                    </div>

                    {/* Form Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">First name</label>
                        <Input 
                          value={profileData.firstName}
                          onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                          className="bg-zinc-50 dark:bg-black/50 border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 h-11"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Last name</label>
                        <Input 
                          value={profileData.lastName}
                          onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                          className="bg-zinc-50 dark:bg-black/50 border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 h-11"
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Email address</label>
                        <Input 
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                          className="bg-zinc-50 dark:bg-black/50 border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 h-11"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-6 border-t border-zinc-200 dark:border-white/5">
                      <Button type="submit" disabled={isSaving} className="bg-zinc-900 dark:bg-zinc-50 text-white dark:text-[#09090b] hover:bg-zinc-800 dark:hover:bg-zinc-200 gap-2 font-semibold h-10 px-6 rounded-lg">
                        {isSaving ? <><Loader2 className="w-4 h-4 animate-spin"/> Saving...</> : <><Save className="w-4 h-4"/> Save Changes</>}
                      </Button>
                    </div>
                  </form>
                </div>

                {/* Danger Zone */}
                <div className="p-6 md:p-8 border border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/5 rounded-2xl shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                    <h3 className="text-lg font-semibold text-red-600 dark:text-red-400">Danger Zone</h3>
                  </div>
                  <p className="text-sm text-red-600/80 dark:text-red-400/80 mb-6">Log out of your active session on this device. You will need to sign back in.</p>
                  <div className="w-fit">
                     <LogoutButton />
                  </div>
                </div>
              </motion.div>
            )}

            {/* APPEARANCE TAB */}
            {activeTab === 'appearance' && (
              <motion.div 
                key="appearance"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              >
                <div className="p-6 md:p-8 border border-zinc-200 dark:border-white/5 bg-white dark:bg-white/[0.02] backdrop-blur-xl rounded-2xl shadow-xl">
                  <div className="mb-8 border-b border-zinc-200 dark:border-white/5 pb-6">
                    <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">Appearance</h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Customize how NotelyAI looks on your device.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Light Mode Button */}
                    <button 
                      onClick={() => isDarkMode && dispatch(toggleDarkMode())}
                      className={`relative flex flex-col items-center justify-center p-8 border-2 rounded-2xl transition-all duration-300 group ${
                        !isDarkMode ? 'border-blue-500 bg-blue-50' : 'border-zinc-200 dark:border-white/5 bg-zinc-50 dark:bg-black/20 hover:border-zinc-300 dark:hover:border-white/20'
                      }`}
                    >
                      <div className="p-4 bg-white border border-zinc-200 rounded-full mb-4 shadow-lg group-hover:scale-110 transition-transform">
                        <Sun className="h-8 w-8 text-orange-500" />
                      </div>
                      <span className="font-semibold text-zinc-900 dark:text-zinc-300">Light Mode</span>
                      {!isDarkMode && (
                        <div className="absolute top-4 right-4 flex items-center gap-1 text-[10px] uppercase tracking-wider text-blue-600 font-bold bg-blue-100 px-2.5 py-1 rounded-full border border-blue-200">
                          <Check className="h-3 w-3" /> Active
                        </div>
                      )}
                    </button>

                    {/* Dark Mode Button */}
                    <button 
                      onClick={() => !isDarkMode && dispatch(toggleDarkMode())}
                      className={`relative flex flex-col items-center justify-center p-8 border-2 rounded-2xl transition-all duration-300 group ${
                        isDarkMode ? 'border-blue-500 bg-blue-500/5' : 'border-zinc-200 dark:border-white/5 bg-zinc-50 dark:bg-black/20 hover:border-zinc-300 dark:hover:border-white/20'
                      }`}
                    >
                      <div className="p-4 bg-zinc-900 border border-zinc-700 rounded-full mb-4 shadow-lg group-hover:scale-110 transition-transform">
                        <Moon className="h-8 w-8 text-blue-400" />
                      </div>
                      <span className="font-semibold text-zinc-600 dark:text-zinc-50">Dark Mode</span>
                      {isDarkMode && (
                        <div className="absolute top-4 right-4 flex items-center gap-1 text-[10px] uppercase tracking-wider text-blue-400 font-bold bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20">
                          <Check className="h-3 w-3" /> Active
                        </div>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* PLACEHOLDER TABS */}
            {(activeTab === 'notifications' || activeTab === 'security') && (
              <motion.div 
                key="placeholder"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="p-8 border border-zinc-200 dark:border-white/5 bg-white dark:bg-white/[0.02] backdrop-blur-xl rounded-2xl shadow-xl flex flex-col items-center justify-center min-h-[400px]"
              >
                <div className="p-4 bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-full mb-4 shadow-inner">
                  {activeTab === 'notifications' ? <Bell className="w-8 h-8 text-zinc-400 dark:text-zinc-500" /> : <Shield className="w-8 h-8 text-zinc-400 dark:text-zinc-500" />}
                </div>
                <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 capitalize">{activeTab} Settings</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 text-center max-w-md leading-relaxed">
                  These settings are currently being integrated. Check back soon for advanced {activeTab} controls.
                </p>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}