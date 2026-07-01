import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleDarkMode } from '@/app/store/uiSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Bell, Shield, Palette, Moon, Sun, Check, AlertTriangle, Camera, Save } from 'lucide-react';
import { LogoutButton } from '@/features/auth/LogoutButton';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// Framer Motion Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
};

export default function SettingsPage() {
  const dispatch = useDispatch();
  const isDarkMode = useSelector((state) => state.ui.isDarkMode);
  
  // Simulated Local State for the Profile Form
  // In a real app, you would initialize this with data from useSelector((state) => state.auth.user)
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleProfileSave = (e) => {
    e.preventDefault();
    setIsSaving(true);
    // Simulate API Call
    setTimeout(() => {
      setIsSaving(false);
    }, 1500);
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 max-w-5xl mx-auto pb-10 w-full"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">Manage your account preferences and application aesthetics.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-6">
        
        {/* Settings Navigation Sidebar */}
        <motion.div variants={itemVariants} className="space-y-1 md:col-span-1">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 text-muted-foreground hover:bg-muted/50 hover:text-foreground font-medium rounded-lg transition-colors group">
            <Palette className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" /> Appearance
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 bg-primary/10 text-primary font-medium rounded-lg transition-colors">
            <User className="h-4 w-4" /> Account
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 text-muted-foreground hover:bg-muted/50 hover:text-foreground font-medium rounded-lg transition-colors group">
            <Bell className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" /> Notifications
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 text-muted-foreground hover:bg-muted/50 hover:text-foreground font-medium rounded-lg transition-colors group">
            <Shield className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" /> Security
          </button>
        </motion.div>

        {/* Settings Content Area */}
        <div className="md:col-span-3 space-y-6">
          
          {/* Active Profile Card */}
          <motion.div variants={itemVariants} className="p-6 border border-border bg-card rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="mb-8 border-b border-border pb-6">
              <h3 className="text-lg font-semibold">Account Details</h3>
              <p className="text-sm text-muted-foreground">Update your personal workspace information and avatar.</p>
            </div>
            
            <form onSubmit={handleProfileSave} className="space-y-8">
              {/* Avatar Section */}
              <div className="flex items-center gap-6">
                <div className="relative group cursor-pointer">
                  <div className="h-24 w-24 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center overflow-hidden transition-all group-hover:border-primary/50">
                    <span className="text-3xl font-bold text-primary">
                      {profileData.firstName[0]}{profileData.lastName[0]}
                    </span>
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Camera className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-foreground">Profile Picture</h4>
                  <p className="text-sm text-muted-foreground mb-3">JPG, GIF or PNG. 1MB max.</p>
                  <Button variant="outline" size="sm">Upload new picture</Button>
                </div>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium placeholder:'Your name'">First name</label>
                  <Input 
                    value={profileData.firstName}
                    onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                    placeholder="Your name"
                    className="focus:ring-primary/20"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Last name</label>
                  <Input 
                    value={profileData.lastName}
                    onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                    placeholder="Your last name"
                    className="focus:ring-primary/20"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium">Email address</label>
                  <Input 
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    placeholder="Write your email"
                    className="focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-border">
                <Button type="submit" disabled={isSaving} className="gap-2">
                  {isSaving ? <span className="animate-pulse">Saving...</span> : <><Save className="w-4 h-4"/> Save Changes</>}
                </Button>
              </div>
            </form>
          </motion.div>

          {/* Appearance Card */}
          <motion.div variants={itemVariants} className="p-6 border border-border bg-card rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="mb-6">
              <h3 className="text-lg font-semibold">Appearance</h3>
              <p className="text-sm text-muted-foreground">Customize how NotelyAI looks on your device.</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Light Mode Button */}
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => isDarkMode && dispatch(toggleDarkMode())}
                className={`relative flex-1 flex flex-col items-center justify-center p-6 border-2 rounded-xl transition-all duration-300
                  ${!isDarkMode ? 'border-primary bg-primary/5 shadow-inner' : 'border-border hover:border-primary/50 hover:bg-muted/50'}
                `}
              >
                <div className="p-3 bg-background border border-border rounded-full mb-3 shadow-sm transition-transform duration-500 hover:rotate-180">
                  <Sun className="h-6 w-6 text-orange-500" />
                </div>
                <span className="font-semibold text-foreground">Light Mode</span>
                <AnimatePresence>
                  {!isDarkMode && (
                    <motion.span 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="absolute top-4 right-4 flex items-center gap-1 text-xs text-primary font-medium bg-primary/10 px-2 py-1 rounded-full"
                    >
                      <Check className="h-3 w-3" /> Active
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* Dark Mode Button */}
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => !isDarkMode && dispatch(toggleDarkMode())}
                className={`relative flex-1 flex flex-col items-center justify-center p-6 border-2 rounded-xl transition-all duration-300
                  ${isDarkMode ? 'border-primary bg-primary/5 shadow-inner' : 'border-border hover:border-primary/50 hover:bg-muted/50'}
                `}
              >
                <div className="p-3 bg-slate-900 border border-slate-700 rounded-full mb-3 shadow-sm transition-transform duration-500 hover:-rotate-12">
                  <Moon className="h-6 w-6 text-blue-400" />
                </div>
                <span className="font-semibold text-foreground">Dark Mode</span>
                <AnimatePresence>
                  {isDarkMode && (
                    <motion.span 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="absolute top-4 right-4 flex items-center gap-1 text-xs text-primary font-medium bg-primary/10 px-2 py-1 rounded-full"
                    >
                      <Check className="h-3 w-3" /> Active
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </motion.div>

          {/* Danger Zone Card */}
          <motion.div variants={itemVariants} className="p-6 border border-destructive/20 bg-destructive/5 rounded-xl shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              <h3 className="text-lg font-semibold text-destructive">Danger Zone</h3>
            </div>
            <p className="text-sm text-destructive/80 mb-6 font-medium">Log out of your active session on this device.</p>
            <div className="w-fit">
               <LogoutButton variant="destructive" />
            </div>
          </motion.div>
          
        </div>
      </div>
    </motion.div>
  );
}