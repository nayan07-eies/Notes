import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom'; // Added useSearchParams hook
import { toggleDarkMode } from '@/app/store/uiSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Moon, 
  Sun, 
  Check, 
  AlertTriangle, 
  Camera, 
  Save, 
  Loader2, 
  LogOut, 
  X 
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

function CreativeLogoutButton({ onTriggerLogout }) {
  return (
    <Button 
      type="button" 
      onClick={onTriggerLogout}
      className="bg-red-600 hover:bg-red-700 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-white dark:text-red-400 gap-2 font-semibold h-10 px-5 rounded-xl text-sm transition-all shadow-sm border border-transparent dark:border-red-500/20 active:scale-[0.98]"
    >
      <LogOut className="w-4 h-4" />
      Sign Out
    </Button>
  );
}

const TABS = [
  { id: 'account', label: 'Account', icon: User },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
];

export default function SettingsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate(); 
  const [searchParams, setSearchParams] = useSearchParams(); // Initialized parameters manager
  
  const tabParam = searchParams.get('tab'); // Read target tab data from URL pipeline string
  const isDarkMode = useSelector((state) => state.ui.isDarkMode);
  
  // Set initial state fallback based strictly on URL values if available
  const [activeTab, setActiveTab] = useState(tabParam || 'account');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false); 
  const [imagePreview, setImagePreview] = useState(null); 
  const fileInputRef = useRef(null);
  
  const [profileData, setProfileData] = useState({
    firstName: 'Nayan',
    lastName: 'Tarpara',
    email: 'nayan.tarpra@example.com'
  });

  // Watch for parameter adjustments to swap active view layouts instantly
  useEffect(() => {
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  // Synchronizes internal visibility parameters cleanly with the global active URL structure
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
  };

  const handleTriggerUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1024 * 1024) {
      alert("File size exceeds 1MB limitation constraint.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleProfileSave = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert("Profile configurations saved successfully!");
    }, 1500);
  };

  const executeFinalLogoutSequence = () => {
    setIsLoggingOut(false);
    navigate('/');
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-8 space-y-8 relative">
      
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
                onClick={() => handleTabChange(tab.id)} // Pointed directly to parameterized handler
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group text-left ${
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
          <input 
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/png, image/jpeg, image/gif"
            className="hidden"
          />
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
                      <div 
                        onClick={handleTriggerUpload} 
                        className="relative group cursor-pointer shrink-0"
                      >
                        <div className="h-20 w-20 md:h-24 md:w-24 rounded-full bg-purple-100 dark:bg-purple-500/10 border-2 border-purple-200 dark:border-purple-500/20 flex items-center justify-center overflow-hidden transition-all group-hover:border-purple-400 dark:group-hover:border-purple-500/50 relative">
                          {imagePreview ? (
                            <img 
                              src={imagePreview} 
                              alt="Profile Avatar Preview" 
                              className="w-full h-full object-cover absolute inset-0 z-10"
                            />
                          ) : (
                            <span className="text-2xl md:text-3xl font-bold text-purple-600 dark:text-purple-400 relative z-0">
                              {profileData.firstName?.[0] || ''}{profileData.lastName?.[0] || ''}
                            </span>
                          )}
                          <div className="absolute inset-0 bg-black/40 dark:bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-xs z-20">
                            <Camera className="w-5 h-5 md:w-6 md:h-6 text-white" />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <h4 className="font-semibold text-sm sm:text-base text-zinc-900 dark:text-zinc-50">Profile Picture Image</h4>
                        <p className="text-xs text-zinc-500">JPG, GIF or PNG. 1MB max payload constraints.</p>
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={handleTriggerUpload}
                          size="sm" 
                          className="bg-zinc-50 dark:bg-white/5 border-zinc-200 dark:border-white/10 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/10 dark:hover:text-white h-8 text-xs rounded-xl"
                        >
                          Upload new picture
                        </Button>
                      </div>
                    </div>

                    {/* Form Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">First name</label>
                        <Input 
                          value={profileData.firstName}
                          onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                          className="bg-zinc-50 dark:bg-black/50 border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 h-11 rounded-xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Last name</label>
                        <Input 
                          value={profileData.lastName}
                          onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                          className="bg-zinc-50 dark:bg-black/50 border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 h-11 rounded-xl"
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Email address</label>
                        <Input 
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                          className="bg-zinc-50 dark:bg-black/50 border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 h-11 rounded-xl"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-6 border-t border-zinc-200 dark:border-white/5">
                      <Button type="submit" disabled={isSaving} className="bg-zinc-900 dark:bg-zinc-50 text-white dark:text-[#09090b] hover:bg-zinc-800 dark:hover:bg-zinc-200 gap-2 font-semibold h-10 px-6 rounded-xl text-sm transition-opacity disabled:opacity-50 shadow-sm">
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
                    <CreativeLogoutButton onTriggerLogout={() => setIsLoggingOut(true)} />
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
                    <button 
                      type="button"
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

                    <button 
                      type="button"
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

      {/* --- PREMIUM PORTAL INTERCEPT OVERLAY MODAL --- */}
      <AnimatePresence>
        {isLoggingOut && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            
            {/* Blurry Dimmer Backdrop Layer */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsLoggingOut(false)}
              className="absolute inset-0 bg-zinc-950/40 dark:bg-black/60 backdrop-blur-md"
            />

            {/* Premium Dialog Surface */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ type: "spring", stiffness: 380, damping: 28 }}
              className="relative w-full max-w-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-2xl z-10 flex flex-col space-y-6"
            >
              <button 
                onClick={() => setIsLoggingOut(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors focus:outline-none"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex gap-4 items-start">
                <div className="p-3 bg-red-100 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl text-red-600 dark:text-red-400 shrink-0">
                  <LogOut className="w-6 h-6" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                    Signing Out?
                  </h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    You are about to terminate your local secure session matrix. Unsaved pipeline inputs might turn invalid.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 justify-end w-full pt-2">
                <Button 
                  variant="outline" 
                  onClick={() => setIsLoggingOut(false)}
                  className="h-10 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 font-medium px-4 rounded-xl text-sm"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={executeFinalLogoutSequence}
                  className="h-10 bg-red-600 hover:bg-red-700 dark:bg-red-500 text-white font-semibold px-4 rounded-xl text-sm shadow-md shadow-red-500/10 active:scale-[0.98]"
                >
                  Sign Out
                </Button>
              </div>
            </motion.div>

          </div>
        )}
      </AnimatePresence>

    </div>
  );
}