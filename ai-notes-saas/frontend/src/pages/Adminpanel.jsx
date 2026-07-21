import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import { 
  Users, Cpu, Database, TrendingUp, Search, ShieldAlert, 
  CheckCircle2, RefreshCw, Sliders, Terminal, Megaphone, 
  PanelLeftClose, PanelLeft, ChevronDown, Command, 
  Sparkles, SlidersHorizontal, Activity, Layers, 
  ShieldCheck, Settings, ChevronRight, FileText, 
  BrainCircuit, Music, Video, Eye, Download
} from 'lucide-react';
import { Button } from "@/components/ui/button";//@/components/ui/button

// ==========================================
// 1. IMMUTABLE CONSTANTS & DATA MANIFESTS
// ==========================================
const SIDEBAR_MANIFEST = [
  { id: 'dashboard', label: 'Dashboard Hub', badge: null },
  { id: 'users', label: 'User Directory', badge: '1.2K' },
  { id: 'content', label: 'Generated Content', badge: 'Live' },
  { id: 'uploads', label: 'Multi-Modal Uploads', badge: 'New' },
  { id: 'models', label: 'AI Model Management', badge: '5 Live' },
  { id: 'billing', label: 'Ledger & Billing', badge: null },
  { id: 'logs', label: 'Dev Console Logs', badge: '42' },
  { id: 'settings', label: 'System Properties', badge: null }
];

const INITIAL_USERS = [
  { id: 'USR-091', name: 'Aniket Sharma', email: 'aniket@ppsu.edu', status: 'Active', tier: 'Pro', tokens: 842000, country: 'IN', currentStorage: '4.8 GB', registration: '2026-03-12' },
  { id: 'USR-092', name: 'Priya Patel', email: 'priya.p@gmail.com', status: 'Active', tier: 'Free', tokens: 28000, country: 'IN', currentStorage: '0.6 GB', registration: '2026-05-19' },
  { id: 'USR-093', name: 'Raj Malhotra', email: 'raj.m@workspace.io', status: 'Throttled', tier: 'Pro', tokens: 912000, country: 'US', currentStorage: '24.1 GB', registration: '2026-01-05' },
  { id: 'USR-094', name: 'Elena Rostova', email: 'elena.r@tech.de', status: 'Active', tier: 'Enterprise', tokens: 4890000, country: 'DE', currentStorage: '142.0 GB', registration: '2026-06-22' }
];

const COMPUTE_LAYER_MOCK = [
  { id: 'openai-gpt4', name: 'OpenAI Edge Route (GPT-4o)', rate: '124 t/s', memory: 'Cloud API', status: 'Optimal', latency: '240ms', errors: '0.01%' },
  { id: 'claude-sonnet', name: 'Anthropic Core (Claude 3.5 Sonnet)', rate: '98 t/s', memory: 'Cloud API', status: 'Optimal', latency: '310ms', errors: '0.00%' },
  { id: 'gemini-flash', name: 'Google Flash Line (Gemini 1.5)', rate: '210 t/s', memory: 'Cloud API', status: 'Optimal', latency: '180ms', errors: '0.04%' },
  { id: 'ollama-llama3', name: 'Localized Dedicated Node (LLaMA-3)', rate: '44 t/s', memory: '48GB VRAM Assigned', status: 'Optimal', latency: '45ms', errors: '0.00%' },
  { id: 'whisper-stt-core', name: 'Whisper Frame Cluster (STT / Transcription)', rate: '14x Real', memory: '16GB VRAM Assigned', status: 'Optimal', latency: '90ms', errors: '0.02%' }
];

const MULTIMODAL_UPLOAD_MOCK = [
  { id: 'UPL-881', filename: 'lecture_neuroscience_recording.mp3', size: '42.8 MB', type: 'Audio', status: 'Completed', speechStatus: 'Transcribed (100%)', language: 'en', ocrStatus: 'Skipped' },
  { id: 'UPL-882', filename: 'mit_linear_algebra_ps4.pdf', size: '12.4 MB', type: 'PDF', status: 'Processing', speechStatus: 'Skipped', language: 'en', ocrStatus: 'Extracting Chunks (45%)' },
  { id: 'UPL-883', filename: 'organic_chemistry_mechanisms.mp4', size: '184.0 MB', type: 'Video', status: 'Completed', speechStatus: 'Transcribed (100%)', language: 'en', ocrStatus: 'Keyframes OCR (94%)' },
  { id: 'UPL-884', filename: 'https://youtube.com/watch?v=v89k01', size: 'URL Source', type: 'YouTube', status: 'Queued', speechStatus: 'Pending Fetch', language: 'es', ocrStatus: 'Pending' }
];

const AI_GENERATED_CONTENT_MOCK = [
  { id: 'CNT-01', type: 'Notes', title: 'Deep Learning Optimization Coordinates', owner: 'Aniket Sharma', date: '2h ago', confidence: '99.4%', views: 42, downloads: 12 },
  { id: 'CNT-02', type: 'Flashcards', title: 'Medical Pathology Board Flashset (250 Cards)', owner: 'Elena Rostova', date: '5h ago', confidence: '98.1%', views: 184, downloads: 89 },
  { id: 'CNT-03', type: 'Quizzes', title: 'Advanced Microeconomics Mock Midterm Exam', owner: 'Raj Malhotra', date: '1d ago', confidence: '94.7%', views: 12, downloads: 3 },
  { id: 'CNT-04', type: 'Mind Maps', title: 'Roman Empire Structural Fall Architecture', owner: 'Priya Patel', date: '3d ago', confidence: '97.6%', views: 240, downloads: 112 }
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
  content: BrainCircuit,
  uploads: Layers,
  models: Cpu,
  analytics: TrendingUp,
  billing: ShieldCheck,
  logs: Terminal,
  settings: Settings
};

// ==========================================
// 2. PREMIUM SURFACE BACKDROP GRAPHIC SUBSTRATE
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
      className={`relative overflow-hidden rounded-2xl border border-zinc-200/80 bg-white/70 backdrop-blur-md p-5 shadow-xs transition-all duration-300 hover:border-zinc-300 hover:shadow-sm ${className}`}
    >
      <div 
        className="absolute inset-0 pointer-events-none transition-opacity duration-500 rounded-2xl"
        style={{
          opacity: isFocused ? 1 : 0,
          background: `radial-gradient(350px circle at ${coords.x}px ${coords.y}px, rgba(59,130,246,0.06), transparent 80%)`
        }}
      />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-zinc-200 to-transparent pointer-events-none" />
      <div className="relative z-10 w-full h-full">{children}</div>
    </div>
  );
});

// ==========================================
// 3. CORE MANAGEMENT PANEL ENVIRONMENT
// ==========================================
export default function AdminDashboard() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [activeWorkspace] = useState('Global Production Instance');

  // Unified State Stores
  const [users, setUsers] = useState(INITIAL_USERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [contentTab, setContentTab] = useState('All');
  const [activeEngine, setActiveEngine] = useState('openai-gpt4');
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

  // ⌘K Gateway Hotkey Catchers
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

  // DevOps Asynchronous Log Simulation Thread
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

  // Operational Mutators
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

  const filteredContent = useMemo(() => {
    if (contentTab === 'All') return AI_GENERATED_CONTENT_MOCK;
    return AI_GENERATED_CONTENT_MOCK.filter(c => c.type === contentTab);
  }, [contentTab]);

  const quickSystemRoutes = useMemo(() => {
    return [
      { label: "Switch Routing To Local Inference Engine Cluster", target: 'models' },
      { label: "Audit Directory Clearance Access Matrix", target: 'users' },
      { label: "Flush Asynchronous Multi-Modal Upload Buffers", target: 'uploads' },
      { label: "Query Core Process Log Trace Sequences", target: 'logs' }
    ].filter(route => route.label.toLowerCase().includes(commandQuery.toLowerCase()));
  }, [commandQuery]);

  return (
    <div className="flex h-screen w-full bg-zinc-50/60 text-zinc-900 overflow-hidden relative font-sans antialiased select-none">
      
      {/* CRYSTAL MESH TOPOLOGY GLOW BACKDROP */}
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
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 shrink-0 flex items-center justify-center bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-lg shadow-sm shadow-blue-500/10 text-white font-black text-xs">
              ★
            </div>
            <div className="flex flex-col">
              <span className="font-black text-xs uppercase tracking-wider text-zinc-800 leading-none">NotelyAI</span>
              <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 mt-0.5">Admin Cluster</span>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(false)} className="text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 h-7 w-7 rounded-lg">
            <PanelLeftClose className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-3 w-[260px] border-b border-zinc-200">
          <div className="bg-zinc-100/70 border border-zinc-200 rounded-xl p-2 flex items-center justify-between cursor-pointer hover:bg-zinc-100 transition-colors">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-5 h-5 rounded-md bg-gradient-to-br from-zinc-700 to-zinc-900 flex items-center justify-center text-[9px] font-black text-white shadow-xs">P</div>
              <span className="text-xs font-bold truncate text-zinc-700">{activeWorkspace}</span>
            </div>
            <ChevronDown className="w-3 h-3 text-zinc-400 shrink-0" />
          </div>
        </div>

        <nav className="flex-1 py-3 px-2 space-y-0.5 w-[260px]" aria-label="Master Console Modules Link Panel">
          {SIDEBAR_MANIFEST.map((item) => {
            const IconComponent = ICON_MAP[item.id] || Settings;
            const isSelected = currentView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left text-xs font-bold transition-all border ${isSelected ? 'bg-white border-zinc-200 text-zinc-900 shadow-xs' : 'text-zinc-500 hover:text-zinc-900 border-transparent hover:bg-zinc-101/80'}`}
              >
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

      {/* --- MASTER RUNTIME PANE SECTION --- */}
      <div className="flex-1 flex flex-col relative min-w-0 h-full w-full z-10">
        
        {/* PREMIUM ADAPTIVE DASHBOARD HEADER */}
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
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Topology Secure
            </div>
          </div>
        </header>

        {/* WORKSPACE CENTRAL CONTENT CANVAS VIEWPORT */}
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

          {/* RENDERING MATRIX PANE ROUTER VIEWPORTS */}
          {currentView === 'dashboard' && (
            <>
              {/* TELEMETRY HARDWARE OVERVIEW GRID ROW */}
              <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="System Performance Real-time Stats">
                {[
                  { title: "AI Requests Handled", value: "842,190", desc: "+18.4% processing spikes today", icon: BrainCircuit, color: "text-blue-600", barFill: "84%" },
                  { title: "Active Synthesis Sessions", value: "3,842 Nodes", desc: "Live note & flashcard builds", icon: Activity, color: "text-emerald-600", barFill: "68.4%" },
                  { title: "Multimodal Upload Volume", value: "14.2 TB", desc: "PDF, Audio, Video datasets bound", icon: Layers, color: "text-purple-600", barFill: "78%" },
                  { title: "Ledger Financial MRR", value: "$48,900", desc: "Subscription plan metrics optimal", icon: TrendingUp, color: "text-amber-600", barFill: "92%" }
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
                      <h3 className="text-sm font-black uppercase tracking-wider text-zinc-800">User Structural Clearance Matrix</h3>
                      <p className="text-xs text-zinc-500">Configure token weights and adjust client runtime tier clearances.</p>
                    </div>
                    <div className="relative w-full sm:w-56 group">
                      <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-zinc-400" />
                      <input 
                        type="text" placeholder="Filter parameters..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-1.5 pl-8 pr-4 text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-zinc-300"
                      />
                    </div>
                  </div>

                  <div className="overflow-x-auto w-full">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-zinc-200 text-zinc-400 uppercase font-black text-[9px] tracking-widest">
                          <th className="py-2.5 px-3">Identity Record Mapping</th>
                          <th className="py-2.5 px-3">System State</th>
                          <th className="py-2.5 px-3">Authorization Tier</th>
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
                              <button type="button" onClick={() => handleToggleClearanceTier(user.id)} className={`px-2 py-0.5 rounded-md font-black text-[9px] uppercase tracking-wider transition-all border ${user.tier === 'Pro' ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-zinc-100 text-zinc-500 border-zinc-200 hover:bg-zinc-100'}`}>
                                {user.tier}
                              </button>
                            </td>
                            <td className="py-3 px-3 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button type="button" onClick={() => handleAdjustTokenWeight(user.id, -10000)} className="w-5 h-5 bg-white border border-zinc-200 rounded flex items-center justify-center font-bold text-zinc-500 hover:bg-zinc-100 focus:outline-none">-</button>
                                <span className="font-mono font-bold text-zinc-700 w-12 text-center">{(user.tokens / 1000).toFixed(0)}K</span>
                                <button type="button" onClick={() => handleAdjustTokenWeight(user.id, 10000)} className="w-5 h-5 bg-white border border-zinc-200 rounded flex items-center justify-center font-bold text-zinc-500 hover:bg-zinc-100 focus:outline-none">+</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* BROADCAST CENTER MODULE FORM PANEL */}
                <div className="border border-zinc-200 bg-white/80 backdrop-blur-xl rounded-2xl p-5 shadow-xs flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-wider text-zinc-700 flex items-center gap-2 mb-3">
                      <Megaphone className="w-4 h-4 text-purple-600" /> System Broadcast Core
                    </h3>
                    <p className="text-xs text-zinc-500 mb-4">Propagate markdown rules or workspace alerts downstream to edge endpoints.</p>
                  </div>
                  <form onSubmit={handleBroadcastDispatch} className="space-y-3 flex-1 flex flex-col justify-end">
                    <textarea 
                      value={announcementInput} onChange={(e) => setAnnouncementInput(e.target.value)}
                      placeholder="Type alert logs to distribute globally to active workspace contexts..."
                      className="w-full h-28 text-xs p-3 rounded-xl border border-zinc-200 bg-zinc-50 outline-none text-zinc-800 placeholder-zinc-400 font-medium resize-none focus:border-zinc-300 transition-colors"
                      required
                    />
                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-9 border-transparent shadow-xs">
                      Propagate Alert Rule
                    </Button>
                  </form>
                </div>
              </div>

              {/* HARDWARE DEVOPS STREAM TERMINAL CONSOLE ACTIVITY OUTPUT */}
              <section className="border border-zinc-200 bg-zinc-900 text-zinc-100 rounded-2xl p-5 shadow-md flex flex-col font-mono text-xs h-64 relative" aria-label="DevOps Infrastructure Log Output Console">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-800 text-[10px] font-black uppercase tracking-wider text-zinc-500 select-none">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-blue-400" /> Real-Time Inference Model Compute Activity Output Trace
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
          )}

          {/* --- MODULE MODULE 2: USER DIRECTORIES MANAGE --- */}
          {currentView === 'users' && (
            <div className="border border-zinc-200 bg-white/80 backdrop-blur-xl rounded-2xl p-5 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-zinc-800">Master Accounts Directory Database</h3>
                  <p className="text-xs text-zinc-500">Query global seat vectors, audit structural database registrations, and adjust subscription billing access parameters.</p>
                </div>
              </div>
              <div className="overflow-x-auto w-full">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-200 text-zinc-400 uppercase font-black text-[9px] tracking-widest">
                      <th className="py-2.5 px-3">Identity UUID Signature</th>
                      <th className="py-2.5 px-3">Account Email</th>
                      <th className="py-2.5 px-3">Geographic Locale</th>
                      <th className="py-2.5 px-3">Storage footprint</th>
                      <th className="py-2.5 px-3">Creation Date</th>
                      <th className="py-2.5 px-3 text-right">Actions Matrix</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-zinc-50/50 transition-colors">
                        <td className="py-3 px-3 font-mono font-bold text-zinc-900">{u.id} <span className="font-sans text-zinc-400 ml-1">({u.name})</span></td>
                        <td className="py-3 px-3 font-medium text-zinc-600">{u.email}</td>
                        <td className="py-3 px-3 font-mono text-zinc-500 uppercase">{u.country}</td>
                        <td className="py-3 px-3 font-mono text-zinc-500">{u.currentStorage}</td>
                        <td className="py-3 px-3 font-mono text-zinc-400">{u.registration}</td>
                        <td className="py-3 px-3 text-right space-x-1">
                          <button type="button" onClick={() => handleToggleClearanceTier(u.id)} className="px-2 py-1 border border-zinc-200 rounded-md bg-white hover:bg-zinc-50 text-[10px] font-black uppercase tracking-wide transition-colors">Modify Tier</button>
                          <button type="button" className="px-2 py-1 border border-transparent rounded-md bg-rose-50 hover:bg-rose-100 text-rose-600 text-[10px] font-black uppercase tracking-wide transition-colors">Suspend</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* --- MODULE SECTION 3: GENERATED CONTENT TABS ENGINE --- */}
          {currentView === 'content' && (
            <div className="border border-zinc-200 bg-white/80 backdrop-blur-xl rounded-2xl p-5 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-zinc-800">Synthesized AI Content Layer Records</h3>
                  <p className="text-xs text-zinc-500">Monitor and audit structural AI compliance accuracy maps, note downloads, and card indices.</p>
                </div>
              </div>
              
              {/* TABS BUTTON BAR NAVIGATION */}
              <div className="flex border-b border-zinc-200 gap-1 overflow-x-auto p-1 bg-zinc-100/60 rounded-xl max-w-md">
                {['All', 'Notes', 'Flashcards', 'Quizzes', 'Mind Maps'].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setContentTab(tab)}
                    className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${contentTab === tab ? 'bg-white shadow-xs text-zinc-900 border border-zinc-200/80' : 'text-zinc-500 hover:text-zinc-800'}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="overflow-x-auto w-full">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-200 text-zinc-400 uppercase font-black text-[9px] tracking-widest">
                      <th className="py-2.5 px-3">Content Blueprint Title</th>
                      <th className="py-2.5 px-3">Synthesis Category</th>
                      <th className="py-2.5 px-3">Workspace Owner</th>
                      <th className="py-2.5 px-3">Inference Confidence</th>
                      <th className="py-2.5 px-3 font-mono text-right"><Eye className="w-3.5 h-3.5 inline mr-1" />Views</th>
                      <th className="py-2.5 px-3 font-mono text-right"><Download className="w-3.5 h-3.5 inline mr-1" />Downloads</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {filteredContent.map((cnt) => (
                      <tr key={cnt.id} className="hover:bg-zinc-50/50 transition-colors">
                        <td className="py-3 px-3 font-bold text-zinc-800">{cnt.title}</td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-600 border border-blue-100 text-[10px] font-black uppercase tracking-wide">{cnt.type}</span>
                        </td>
                        <td className="py-3 px-3 font-medium text-zinc-600">{cnt.owner}</td>
                        <td className="py-3 px-3 font-mono font-bold text-emerald-600">{cnt.confidence}</td>
                        <td className="py-3 px-3 font-mono text-right text-zinc-500 font-medium">{cnt.views}</td>
                        <td className="py-3 px-3 font-mono text-right text-zinc-500 font-medium">{cnt.downloads}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* --- MODULE MATRIX 4: MULTIMODAL INGESTION CENTER CENTER --- */}
          {currentView === 'uploads' && (
            <div className="border border-zinc-200 bg-white/80 backdrop-blur-xl rounded-2xl p-5 shadow-xs">
              <div className="mb-6">
                <h3 className="text-sm font-black uppercase tracking-wider text-zinc-800">Multi-Modal Content Ingestion Center</h3>
                <p className="text-xs text-zinc-500">Track raw file assets uploaded to platform processing clusters, monitoring STT pipelines and OCR models.</p>
              </div>
              <div className="overflow-x-auto w-full">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-200 text-zinc-400 uppercase font-black text-[9px] tracking-widest">
                      <th className="py-2.5 px-3">Ingested Asset Name</th>
                      <th className="py-2.5 px-3">Format Type</th>
                      <th className="py-2.5 px-3">Speech Recognition State (STT)</th>
                      <th className="py-2.5 px-3">Vision Core Extraction (OCR)</th>
                      <th className="py-2.5 px-3">File Weight</th>
                      <th className="py-2.5 px-3 text-right">Cluster Pipeline State</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {MULTIMODAL_UPLOAD_MOCK.map((upl) => (
                      <tr key={upl.id} className="hover:bg-zinc-50/50 transition-colors">
                        <td className="py-3 px-3 font-bold text-zinc-800 flex items-center gap-2">
                          {upl.type === 'Audio' && <Music className="w-3.5 h-3.5 text-blue-500" />}
                          {upl.type === 'Video' && <Video className="w-3.5 h-3.5 text-purple-500" />}
                          {upl.type === 'PDF' && <FileText className="w-3.5 h-3.5 text-amber-500" />}
                          {upl.type === 'YouTube' && <Youtube className="w-3.5 h-3.5 text-rose-500" />}
                          <span className="truncate max-w-xs">{upl.filename}</span>
                        </td>
                        <td className="py-3 px-3 font-mono font-bold text-[10px] text-zinc-400 uppercase">{upl.type}</td>
                        <td className="py-3 px-3 font-medium text-zinc-600">{upl.speechStatus}</td>
                        <td className="py-3 px-3 font-medium text-zinc-600">{upl.ocrStatus}</td>
                        <td className="py-3 px-3 font-mono text-zinc-500">{upl.size}</td>
                        <td className="py-3 px-3 text-right">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-black text-[9px] uppercase tracking-wide ${upl.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : upl.status === 'Processing' ? 'bg-amber-50 text-amber-700 border border-amber-100 animate-pulse' : 'bg-zinc-100 text-zinc-500'}`}>
                            {upl.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* --- MODULE BOX 5: AI MODEL MANAGER MANAGEMENT --- */}
          {currentView === 'models' && (
            <div className="border border-zinc-200 bg-white/80 backdrop-blur-xl rounded-2xl p-5 shadow-xs space-y-6">
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-zinc-800">AI Compute Orchestration Layer</h3>
                <p className="text-xs text-zinc-500">Monitor framework loads, latency boundaries, and operational nodes.</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {COMPUTE_LAYER_MOCK.map((engine) => (
                  <div key={engine.id} className="border border-zinc-200 bg-white p-4 rounded-xl shadow-xs space-y-3 relative overflow-hidden">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black uppercase tracking-wide text-zinc-800">{engine.name}</h4>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                    <div className="grid grid-cols-2 gap-2 font-mono text-[10px] text-zinc-500 border-t border-b border-zinc-100 py-2">
                      <div>Load Rate: <span className="font-bold text-zinc-800">{engine.rate}</span></div>
                      <div>VRAM Matrix: <span className="font-bold text-zinc-800">{engine.memory}</span></div>
                      <div>Ping Latency: <span className="font-bold text-zinc-800">{engine.latency}</span></div>
                      <div>Error Rate: <span className="font-bold text-zinc-800 text-rose-600">{engine.errors}</span></div>
                    </div>
                    <div className="flex items-center gap-1.5 justify-end">
                      <button type="button" className="px-2 py-0.5 border border-zinc-200 rounded text-[9px] font-bold text-zinc-600 bg-white hover:bg-zinc-50 transition-colors">Restart Node</button>
                      <button type="button" className="px-2 py-0.5 border border-transparent rounded text-[9px] font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors">Pause</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* --- UNMAPPED LAYOUT STANDBY INTERFACES FALLBACKS --- */}
          {/* 🌟 CRITICAL REFACTOR BUGFIX: RESOLVED BROKEN TEMPLATE CURLY STRING ENCODING COLLISION ON THE EMBEDDED BUTTON TAGS */}
          {!['dashboard', 'users', 'content', 'uploads', 'models'].includes(currentView) && (
            <div className="h-[60vh] border border-zinc-200 border-dashed rounded-2xl bg-white/40 flex flex-col items-center justify-center text-center p-6">
              <Sparkles className="w-8 h-8 text-zinc-300 animate-pulse mb-2" />
              <h4 className="text-sm font-black uppercase tracking-wider text-zinc-400">Context Workspace Frame Allocation</h4>
              <p className="text-xs text-zinc-500 mt-1 max-w-sm leading-relaxed">Underlay metrics database datasets matching routing targets are mounting cleanly onto the template viewport frame loops shortly.</p>
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
                  placeholder="Type command coordinates..." className="w-full bg-transparent text-xs text-zinc-800 placeholder-zinc-700 outline-none" 
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