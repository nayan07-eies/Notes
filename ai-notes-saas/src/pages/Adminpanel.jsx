import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import { 
  Users, Cpu, Database, TrendingUp, Search, ShieldAlert, 
  CheckCircle2, RefreshCw, Sliders, Terminal, Megaphone, 
  PanelLeftClose, PanelLeft, ChevronDown, Command, 
  Sparkles, SlidersHorizontal, Activity, Layers, 
  ShieldCheck, Settings, ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// ==========================================
// 1. SYSTEM STRUCTURAL CONFIGURATIONS
// ==========================================
const SIDEBAR_MANIFEST = [
  { id: 'dashboard', label: 'Dashboard Hub', badge: null },
  { id: 'users', label: 'User Directories', badge: '1.2K' },
  { id: 'uploads', label: 'Upload Center', badge: 'New' },
  { id: 'models', label: 'Model Router', badge: 'Live' },
  { id: 'analytics', label: 'Neural Analytics', badge: null },
  { id: 'billing', label: 'Ledger & Billing', badge: null },
  { id: 'logs', label: 'Dev Console Logs', badge: '42' },
  { id: 'settings', label: 'System Properties', badge: null }
];

const INITIAL_USERS = [
  { id: 'USR-091', name: 'Aniket Sharma', email: 'aniket@ppsu.edu', status: 'Active', tier: 'Pro', tokens: 84200, country: 'IN', currentStorage: '4.8 GB' },
  { id: 'USR-092', name: 'Priya Patel', email: 'priya.p@gmail.com', status: 'Active', tier: 'Free', tokens: 28000, country: 'IN', currentStorage: '0.6 GB' },
  { id: 'USR-093', name: 'Raj Malhotra', email: 'raj.m@workspace.io', status: 'Throttled', tier: 'Pro', tokens: 9120, country: 'US', currentStorage: '24.1 GB' },
  { id: 'USR-094', name: 'Elena Rostova', email: 'elena.r@tech.de', status: 'Active', tier: 'Enterprise', tokens: 48900, country: 'DE', currentStorage: '142.0 GB' }
];

const COMPUTE_LAYER_MOCK = [
  { id: 'ollama-llama3', name: 'Ollama Instance Cluster (LLaMA-3)', rate: '84.2 t/s', memory: '24GB/48GB VRAM', status: 'Optimal' },
  { id: 'whisper-stt-core', name: 'Whisper Context Node (Audio Transcribe)', rate: '12.4x Real', memory: '8GB/16GB VRAM', status: 'Optimal' },
  { id: 'claude-35-fallback', name: 'Anthropic Routing Edge (Claude 3.5)', rate: '32ms Ping', memory: 'Cloud Failover', status: 'Standby' }
];

const RAW_DEV_LOG_POOL = [
  "INFO  [INGEST] Initiating text chunk segmentation loop for block #9142...",
  "SUCCESS [EMBEDDINGS] Computed 768-dimension coordinate vector mapping...",
  "INFO  [WHISPER] Decoding dual-channel raw linear audio buffer array.",
  "DEBU  [MONGO] Index compilation matched structural parameters in 12ms.",
  "WARN  [OLLAMA] Thermal barrier boundary thresholds approaching target.",
  "SUCCESS [PIPELINE] Dispatched localized quiz array payload variables.",
  "CRIT  [GATEWAY] External webhook socket client retrying sync frame array."
];

const ICON_MAP = {
  dashboard: Activity,
  users: Users,
  uploads: Layers,
  models: Cpu,
  analytics: TrendingUp,
  billing: ShieldCheck,
  logs: Terminal,
  settings: Settings
};

// ==========================================
// 2. PREMIUM LIGHT-THEME METRIC CONTAINER
// ==========================================
const PremiumSubstrate = React.memo(({ children, className = "" }) => {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isFocused, setIsFocused] = useState(false);

  const handleMouseMove = useCallback((e) => {
    const boundBox = e.currentTarget.getBoundingClientRect();
    setCoords({ x: e.clientX - boundBox.left, y: e.clientY - boundBox.top });
  }, []);

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsFocused(true)}
      onMouseLeave={() => setIsFocused(false)}
      className={`relative overflow-hidden rounded-xl border border-zinc-200 bg-white/70 backdrop-blur-md p-5 shadow-xs transition-all duration-300 hover:border-zinc-300 hover:shadow-sm ${className}`}
    >
      <div 
        className="absolute inset-0 pointer-events-none transition-opacity duration-500 rounded-xl"
        style={{
          opacity: isFocused ? 1 : 0,
          background: `radial-gradient(300px circle at ${coords.x}px ${coords.y}px, rgba(59,130,246,0.05), transparent 80%)`
        }}
      />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-zinc-200 to-transparent pointer-events-none" />
      <div className="relative z-10 w-full h-full">{children}</div>
    </div>
  );
});

// ==========================================
// 3. MASTER LIGHT ADMIN DASHBOARD CONSOLE
// ==========================================
export default function AdminDashboard() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [activeWorkspace] = useState('Production Core Cluster');

  const [users, setUsers] = useState(INITIAL_USERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeEngine, setActiveEngine] = useState('ollama-llama3');
  const [isSyncing, setIsSyncing] = useState(false);
  const [announcementInput, setAnnouncementInput] = useState('');
  const [activeAnnouncement, setActiveAnnouncement] = useState(() => localStorage.getItem('global_system_announcement') || '');
  const [isTerminalPaused, setIsTerminalPaused] = useState(false);
  const [commandQuery, setCommandQuery] = useState('');
  const [logs, setLogs] = useState([
    "SYS   [KERNEL] Core neural infrastructure matrix safely bound.",
    "INFO  [MONGO] Shard topology allocations confirmed at Atlas Node-0."
  ]);

  const terminalEndRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsCommandOpen(prev => !prev);
      }
      if (e.key === 'Escape') setIsCommandOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isTerminalPaused) return;
    const interval = setInterval(() => {
      const selectedLine = RAW_DEV_LOG_POOL[Math.floor(Math.random() * RAW_DEV_LOG_POOL.length)];
      const currentTimestamp = new Date().toLocaleTimeString().toLowerCase();
      setLogs(prev => [...prev.slice(-39), `${currentTimestamp} ${selectedLine}`]);
    }, 2400);
    return () => clearInterval(interval);
  }, [isTerminalPaused]);

  useEffect(() => {
    if (!isTerminalPaused) terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs, isTerminalPaused]);

  const handleSyncNodes = useCallback(() => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      const logTimestamp = new Date().toLocaleTimeString().toLowerCase();
      setLogs(prev => [...prev, `${logTimestamp} SUCCESS [DIAG] Full cluster pipeline verification pass complete.`]);
    }, 1200);
  }, []);

  const handleToggleClearanceTier = useCallback((id) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, tier: u.tier === 'Pro' ? 'Free' : 'Pro' } : u));
  }, []);

  const handleAdjustTokenWeight = useCallback((id, amount) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, tokens: Math.max(0, u.tokens + amount) } : u));
  }, []);

  const handleBroadcastDispatch = useCallback((e) => {
    e.preventDefault();
    if (!announcementInput.trim()) return;
    setActiveAnnouncement(announcementInput);
    localStorage.setItem('global_system_announcement', announcementInput);
    setAnnouncementInput('');
  }, [announcementInput]);

  const filteredUsers = useMemo(() => {
    const rawQuery = searchTerm.toLowerCase().trim();
    if (!rawQuery) return users;
    return users.filter(u => u.name.toLowerCase().includes(rawQuery) || u.email.toLowerCase().includes(rawQuery));
  }, [users, searchTerm]);

  const quickSystemRoutes = useMemo(() => {
    return [
      { label: "Switch Routing To Local Inference Engine Cluster", target: 'models' },
      { label: "Audit Directory Clearance Access Matrix", target: 'users' },
      { label: "Flush Asynchronous Multi-Modal Upload Buffers", target: 'uploads' },
      { label: "Query Core Process Log Trace Sequences", target: 'logs' }
    ].filter(route => route.label.toLowerCase().includes(commandQuery.toLowerCase()));
  }, [commandQuery]);

  return (
    <div className="flex h-screen w-full bg-zinc-50/50 text-zinc-900 overflow-hidden relative font-sans antialiased select-none">
      
      {/* BACKGROUND MESH GRADIENT LAYER */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40" aria-hidden="true">
        <div className="absolute top-[-30%] left-1/2 -translate-x-1/2 w-[75rem] h-[50rem] rounded-full bg-gradient-to-b from-blue-100 via-indigo-50/40 to-transparent blur-[130px]" />
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#a1a1aa 1px, transparent 1px)', backgroundSize: '24px 24px', opacity: 0.12 }} />
      </div>

      {/* --- COLLAPSIBLE WORKSPACE SIDEBAR --- */}
      <motion.aside 
        animate={{ width: isSidebarOpen ? 260 : 0 }}
        className="hidden lg:flex flex-col border-r border-zinc-200 bg-white/80 backdrop-blur-3xl relative z-30 overflow-hidden shrink-0"
      >
        <div className="p-4 border-b border-zinc-200 flex items-center justify-between w-[260px]">
          <div className="flex items-center gap-2 font-black text-xs uppercase tracking-widest text-zinc-800">
            <Sparkles className="w-4 h-4 text-blue-600" /> Turbo Core
          </div>
          <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(false)} className="text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100">
            <PanelLeftClose className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-3 w-[260px] border-b border-zinc-200">
          <div className="bg-zinc-100/70 border border-zinc-200 rounded-xl p-2 flex items-center justify-between cursor-pointer hover:bg-zinc-100 transition-colors">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-5 h-5 rounded-md bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-[9px] font-black text-white shadow-md">T</div>
              <span className="text-xs font-bold truncate text-zinc-700">{activeWorkspace}</span>
            </div>
            <ChevronDown className="w-3 h-3 text-zinc-400 shrink-0" />
          </div>
        </div>

        <nav className="flex-1 py-3 px-2 space-y-0.5 w-[260px]" aria-label="Main navigation link grid">
          {SIDEBAR_MANIFEST.map((item) => {
            const IconComponent = ICON_MAP[item.id] || Settings;
            const isSelected = currentView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left text-xs font-bold transition-all border ${isSelected ? 'bg-white border-zinc-200 text-zinc-900 shadow-xs' : 'text-zinc-500 hover:text-zinc-900 border-transparent hover:bg-zinc-100/80'}`}
              >
                {/* 🌟 CRITICAL FIX: CHANGED FROM item.icon TO IconComponent REFERENCES */}
                <IconComponent className={`w-4 h-4 ${isSelected ? 'text-blue-600' : 'text-zinc-400'}`} />
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className={`px-1.5 py-0.5 rounded font-mono text-[9px] font-bold ${isSelected ? 'bg-blue-50 text-blue-600' : 'bg-zinc-100 text-zinc-400'}`}>{item.badge}</span>
                )}
              </button>
            );
          })}
        </nav>
      </motion.aside>

      {/* --- CONTENT CONTAINER VIEWPORT --- */}
      <div className="flex-1 flex flex-col relative min-w-0 h-full w-full z-10">
        
        {/* PREMIUM UNIFIED STICKY HEADER */}
        <header className="h-16 border-b border-zinc-200 bg-white/60 backdrop-blur-md flex items-center justify-between px-6 shrink-0 z-20">
          <div className="flex items-center gap-3">
            {!isSidebarOpen && (
              <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(true)} className="hidden lg:flex text-zinc-400 h-8 w-8 hover:bg-zinc-100">
                <PanelLeft className="w-4 h-4" />
              </Button>
            )}
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-500">
              <span>Cluster Core</span>
              <ChevronRight className="w-3 h-3 text-zinc-300" />
              <span className="text-zinc-800 font-black">{currentView}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              type="button"
              onClick={() => setIsCommandOpen(true)}
              className="hidden md:flex items-center gap-2 px-3 h-8 w-52 border border-zinc-200 bg-white/60 rounded-lg text-left text-zinc-400 hover:bg-zinc-100 transition-all focus:outline-none"
            >
              <Command className="w-3 h-3 text-zinc-400" />
              <span className="text-[11px] flex-1 font-medium text-zinc-400">Search matrices...</span>
              <span className="text-[9px] font-mono bg-zinc-50 border border-zinc-200 text-zinc-500 px-1 py-0.5 rounded">⌘K</span>
            </button>
            <Button onClick={handleSyncNodes} variant="outline" className="h-8 gap-1.5 text-xs font-bold bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50 shadow-xs">
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-blue-600' : ''}`} />
              <span>Sync Architecture</span>
            </Button>
            <div className="w-px h-4 bg-zinc-200" />
            <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-200/60 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Nodes Protected
            </div>
          </div>
        </header>

        {/* MAIN DATA GRID ELEMENT CANVAS */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 max-w-7xl mx-auto w-full pb-24 scrollbar-thin">
          
          {/* DISPATCH BROADCAST SYSTEM BANNER */}
          <AnimatePresence>
            {activeAnnouncement && (
              <motion.div 
                initial={{ height: 0, opacity: 0, y: -8 }} animate={{ height: 'auto', opacity: 1, y: 0 }} exit={{ height: 0, opacity: 0, y: -8 }}
                className="bg-blue-600 text-white px-4 py-3 rounded-xl text-xs font-bold flex items-center justify-between shadow-xs"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Megaphone className="w-4 h-4 shrink-0" />
                  <span className="truncate">Active Core Policy Broadcast: "{activeAnnouncement}"</span>
                </div>
                <button 
                  type="button"
                  onClick={() => { setActiveAnnouncement(''); localStorage.removeItem('global_system_announcement'); }}
                  className="text-[10px] font-black uppercase tracking-widest text-blue-100 hover:text-white transition-colors ml-4 shrink-0 focus:outline-none"
                >
                  Dismiss
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {currentView === 'dashboard' ? (
            <>
              {/* TELEMETRY HARDWARE OVERVIEW ROW */}
              <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="System Performance Real-time Stats">
                {[
                  { title: "Core Dispatched Seats", value: "1,248", desc: "+12% node scaling trends", icon: Users, color: "text-blue-600", barFill: "74%" },
                  { title: "AI Inference Weight Load", value: "68.4%", desc: "Ollama pipeline throughput", icon: Cpu, color: "text-emerald-600", barFill: "68.4%" },
                  { title: "Aggregated Log Footprint", value: "4.82M", desc: "Cluster buffer footprint allocation", icon: TrendingUp, color: "text-purple-600", barFill: "82%" },
                  { title: "Database Mapped Indexes", value: "98.2%", desc: "MongoDB index vectors matched", icon: Database, color: "text-amber-600", barFill: "98.2%" }
                ].map((stat, i) => (
                  <PremiumSubstrate key={i}>
                    <div className="flex items-center justify-between pb-1.5">
                      <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{stat.title}</span>
                      <stat.icon className={`h-4 w-4 ${stat.color}`} />
                    </div>
                    <div className="text-2xl font-black font-mono tracking-tight text-zinc-900 mt-1">{stat.value}</div>
                    <div className="w-full h-1 bg-zinc-100 rounded-full mt-2.5 overflow-hidden" role="progressbar" aria-valuenow={75} aria-valuemin="0" aria-valuemax="100">
                      <motion.div initial={{ width: 0 }} animate={{ width: stat.barFill }} className="h-full bg-blue-600" />
                    </div>
                    <p className="text-[10px] text-zinc-500 mt-2 font-medium">{stat.desc}</p>
                  </PremiumSubstrate>
                ))}
              </section>

              {/* CORE DATA DIRECTORIES HUB SPLIT BLOCK */}
              <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 flex flex-col border border-zinc-200 bg-white/80 backdrop-blur-xl rounded-2xl p-5 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                      <h3 className="text-sm font-black uppercase tracking-wider text-zinc-800">User Identity Matrix</h3>
                      <p className="text-xs text-zinc-500">Configure token weights and adjust client runtime tier clearances.</p>
                    </div>
                    <div className="relative w-full sm:w-56 group">
                      <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-zinc-400" />
                      <input 
                        type="text" placeholder="Filter profiles..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-1.5 pl-8 pr-4 text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-zinc-300 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="overflow-x-auto w-full">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-zinc-200 text-zinc-400 uppercase font-black text-[9px] tracking-widest">
                          <th className="py-2.5 px-3">Identity Mapping Profiles</th>
                          <th className="py-2.5 px-3">System State</th>
                          <th className="py-2.5 px-3">Authorization Allocation</th>
                          <th className="py-2.5 px-3 text-right">Quota Weights</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100">
                        {filteredUsers.map((user) => (
                          <tr key={user.id} className="transition-colors hover:bg-zinc-50/50">
                            <td className="py-3 px-3">
                              <div className="font-bold text-zinc-800">{user.name}</div>
                              <div className="text-[10px] text-zinc-400 font-medium">{user.email}</div>
                            </td>
                            <td className="py-3 px-3">
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-black text-[9px] uppercase tracking-wide ${user.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'}`}>
                                <span className={`w-1 h-1 rounded-full ${user.status === 'Active' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                {user.status}
                              </span>
                            </td>
                            <td className="py-3 px-3">
                              <button 
                                type="button"
                                onClick={() => handleToggleClearanceTier(user.id)} 
                                className={`px-2 py-0.5 rounded-md font-black text-[9px] uppercase tracking-wider transition-all border ${user.tier === 'Pro' ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-zinc-100 text-zinc-500 border-zinc-200 hover:bg-zinc-100'}`}
                              >
                                {user.tier}
                              </button>
                            </td>
                            <td className="py-3 px-3 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button type="button" onClick={() => handleAdjustTokenWeight(user.id, -10000)} className="w-5 h-5 bg-white border border-zinc-200 rounded flex items-center justify-center font-bold text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 transition-colors focus:outline-none">-</button>
                                <span className="font-mono font-bold text-zinc-700 w-12 text-center">{(user.tokens / 1000).toFixed(0)}K</span>
                                <button type="button" onClick={() => handleAdjustTokenWeight(user.id, 10000)} className="w-5 h-5 bg-white border border-zinc-200 rounded flex items-center justify-center font-bold text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 transition-colors focus:outline-none">+</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* HARDWARE PIPELINE AND DISPATCH CONTROL BLOCKS */}
                <div className="space-y-4 flex flex-col">
                  <div className="border border-zinc-200 bg-white/80 backdrop-blur-xl rounded-2xl p-5 shadow-sm">
                    <h3 className="text-sm font-black uppercase tracking-wider text-zinc-700 flex items-center gap-2 mb-4">
                      <SlidersHorizontal className="w-4 h-4 text-blue-600" /> Model Pipeline Routing
                    </h3>
                    <div className="space-y-2">
                      {COMPUTE_LAYER_MOCK.map((engine) => {
                        const isSelected = activeEngine === engine.id;
                        return (
                          <div 
                            key={engine.id} 
                            onClick={() => setActiveEngine(engine.id)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => e.key === ' ' || e.key === 'Enter' ? setActiveEngine(engine.id) : null}
                            className={`p-3 rounded-xl border text-xs cursor-pointer transition-all relative overflow-hidden focus:outline-none ${isSelected ? 'border-blue-600 bg-blue-50/50 shadow-xs' : 'border-zinc-200 bg-white hover:bg-zinc-50'}`}
                          >
                            <div className="font-bold text-zinc-800">{engine.name}</div>
                            <div className="text-[10px] text-zinc-400 mt-0.5 font-medium">{engine.memory} | {engine.rate}</div>
                            <div className="text-[9px] font-black uppercase tracking-wider text-emerald-600 mt-2.5 flex items-center gap-1">
                              <span className={`w-1 h-1 rounded-full ${engine.status === 'Optimal' ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-300'}`} />
                              {engine.status}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="border border-zinc-200 bg-white/80 backdrop-blur-xl rounded-2xl p-5 shadow-sm flex-1">
                    <h3 className="text-sm font-black uppercase tracking-wider text-zinc-700 flex items-center gap-2 mb-3">
                      <Megaphone className="w-4 h-4 text-purple-600" /> Broadcast System
                    </h3>
                    <form onSubmit={handleBroadcastDispatch} className="space-y-3">
                      <textarea 
                        value={announcementInput} onChange={(e) => setAnnouncementInput(e.target.value)}
                        placeholder="Type policy alert logs to broadcast down to active workspaces..."
                        className="w-full h-24 text-xs p-3 rounded-xl border border-zinc-800 bg-zinc-50 outline-none text-zinc-800 placeholder-zinc-400 font-medium resize-none focus:border-zinc-300 transition-colors"
                        required
                      />
                      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-9 border-transparent shadow-xs">
                        Dispatch Broadcast
                      </Button>
                    </form>
                  </div>
                </div>
              </div>

              {/* REAL-TIME HARDWARE DEVOPS STREAM TERMINAL CONSOLE */}
              <section className="border border-zinc-200 bg-zinc-900 text-zinc-100 rounded-2xl p-5 shadow-md flex flex-col font-mono text-xs h-64 relative" aria-label="DevOps Infrastructure Log Output Console">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-800 text-[10px] font-black uppercase tracking-wider text-zinc-500 select-none">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-blue-400" /> Real-Time Inference Node Output Trace
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      type="button"
                      onClick={() => setIsTerminalPaused(p => !p)} 
                      className={`px-2.5 py-0.5 rounded-md font-black border border-zinc-800 transition-all text-[10px] uppercase tracking-wide focus:outline-none ${isTerminalPaused ? 'bg-amber-500/20 text-amber-400 border-transparent' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`}
                    >
                      {isTerminalPaused ? 'Resume Stream' : 'Pause Node'}
                    </button>
                    <button type="button" onClick={() => setLogs(["SYS   [KERNEL] Active stream block records flushed manually."])} className="text-zinc-500 hover:text-zinc-300 font-black focus:outline-none">Clear Logs</button>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto pt-3 space-y-1.5 pr-2 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                  {logs.map((log, idx) => {
                    let logColorClass = "text-zinc-400";
                    if (log.includes("SUCCESS")) logColorClass = "text-emerald-400 font-bold";
                    if (log.includes("WARN")) logColorClass = "text-amber-400 font-bold";
                    if (log.includes("CRIT")) logColorClass = "text-rose-400 font-black";
                    return (
                      <div key={idx} className={`${logColorClass} leading-relaxed tracking-wide select-text selection:bg-white/10`}>
                        {log}
                      </div>
                    );
                  })}
                  <div ref={terminalEndRef} />
                </div>
              </section>
            </>
          ) : (
            <div className="h-[60vh] flex flex-col items-center justify-center text-center">
              <Sparkles className="w-8 h-8 text-zinc-300 animate-pulse mb-2" />
              <h4 className="text-sm font-black uppercase tracking-wider text-zinc-400">Context Allocation Block</h4>
              <p className="text-xs text-zinc-500 mt-1">Underlay system parameters mapping onto the master frame loop shortly.</p>
            </div>
          )}

        </main>
      </div>

      {/* --- INTEGRATED ADAPTIVE COMMAND PALETTE MODAL PANEL (⌘K) --- */}
      <AnimatePresence>
        {isCommandOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4 font-mono">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-zinc-950/40 backdrop-blur-xs" onClick={() => setIsCommandOpen(false)} />
            <motion.div 
              initial={{ opacity: 0, scale: 0.98, y: -10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98, y: -10 }}
              className="relative w-full max-w-lg bg-white border border-zinc-200 rounded-2xl shadow-xl overflow-hidden z-10 p-2"
            >
              <div className="flex items-center px-3 border-b border-zinc-100 h-11 gap-3">
                <Search className="w-3.5 h-3.5 text-zinc-400" />
                <input 
                  type="text" value={commandQuery} onChange={(e) => setCommandQuery(e.target.value)}
                  placeholder="Type command coordinates..." className="w-full bg-transparent text-xs text-zinc-800 placeholder-zinc-300 outline-none" 
                />
                <span className="text-[10px] bg-zinc-50 border border-zinc-200 text-zinc-400 px-1.5 py-0.5 rounded select-none">ESC</span>
              </div>
              <div className="p-1 text-[10px] text-zinc-400 uppercase tracking-widest font-black px-3 pt-3">System Actions Registry</div>
              <div className="p-1 text-xs text-zinc-600 space-y-0.5 max-h-64 overflow-y-auto">
                {quickSystemRoutes.map((act, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => { setCurrentView(act.target); setIsCommandOpen(false); }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === ' ' || e.key === 'Enter' ? (setCurrentView(act.target), setIsCommandOpen(false)) : null}
                    className="p-2 hover:bg-zinc-50 rounded-lg cursor-pointer flex items-center justify-between text-zinc-600 hover:text-blue-600 transition-colors group focus:outline-none focus:bg-zinc-50"
                  >
                    <span>{act.label}</span>
                    <span className="text-[10px] bg-zinc-50 border border-zinc-200 text-zinc-400 px-1.5 py-0.5 rounded group-hover:bg-blue-50 group-hover:text-blue-600">⏎</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}