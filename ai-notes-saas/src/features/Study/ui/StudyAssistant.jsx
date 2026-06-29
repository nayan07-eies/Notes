import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FlashcardModule from './FlashcardModule'; 
import QuizModule from './QuizModule';
// (adjust path if necessary based on your structure)
import { 
  BrainCircuit, 
  Layers, 
  FileQuestion, 
  FileText, 
  Network, 
  Sparkles,
  Command,
  Clock,
  Target,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const TABS = [
  { id: 'flashcards', label: 'Flashcards', icon: Layers },
  { id: 'quiz', label: 'Knowledge Quiz', icon: FileQuestion },
  { id: 'paper', label: 'Practice Paper', icon: FileText },
  { id: 'mindmap', label: 'Mind Map', icon: Network },
];

export function StudyAssistant() {
  const [activeTab, setActiveTab] = useState(TABS[0].id);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasData, setHasData] = useState(false); 

  // Simulated AI Generation
  const handleGenerate = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setHasData(true);
    }, 2500);
  };

  // Extract the active tab and explicitly assign the icon to a Capitalized variable
  const activeTabData = TABS.find(t => t.id === activeTab);
  const ActiveIcon = activeTabData?.icon;

  return (
    <div className="relative min-h-full w-full bg-zinc-950 text-zinc-50 overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
      {/* Ambient Animated Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1] 
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-blue-600/30 blur-[120px] rounded-full"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.2, 0.1] 
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-[20%] -right-[10%] w-[40%] h-[60%] bg-purple-600/30 blur-[120px] rounded-full"
        />
      </div>

      <div className="relative z-10 p-8 md:p-12 h-full flex flex-col gap-8">
        
        {/* Header & Stats Dashboard */}
        <header className="flex flex-col lg:flex-row gap-8 justify-between items-start lg:items-end">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-blue-400 font-medium text-sm tracking-widest uppercase">
              <Sparkles className="w-4 h-4" />
              <span>AI Study Engine</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-white to-white/40">
              Focus Workspace
            </h1>
            <p className="text-zinc-400 text-lg max-w-xl">
              Your intelligent learning environment. Select a module to synthesize your knowledge base.
            </p>
          </div>

          {/* Floating Glass Stats */}
          <div className="flex gap-4 w-full lg:w-auto">
            {[
              { label: 'Mastery', value: '84%', icon: Target, color: 'text-emerald-400' },
              { label: 'Study Time', value: '2.4h', icon: Clock, color: 'text-blue-400' }
            ].map((stat, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                key={stat.label} 
                className="flex-1 lg:flex-none flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md"
              >
                <div className={`p-3 rounded-xl bg-white/5 ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-zinc-400">{stat.label}</p>
                  <p className="text-2xl font-semibold tracking-tight">{stat.value}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </header>

        {/* Linear-Style Tab Navigation */}
        <div className="flex items-center gap-2 p-1.5 rounded-xl bg-black/40 border border-white/10 backdrop-blur-xl w-fit">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors rounded-lg ${
                  isActive ? 'text-white' : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute inset-0 bg-white/10 border border-white/10 rounded-lg"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <tab.icon className="w-4 h-4 relative z-10" />
                <span className="relative z-10">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Main Content Area */}
        <main className="flex-1 relative min-h-[400px]">
          <AnimatePresence mode="wait">
            {!hasData ? (
              // Premium Empty State
              <motion.div 
                key="empty"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 rounded-3xl border border-dashed border-white/20 bg-white/[0.02]"
              >
                <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 mb-6">
                  <BrainCircuit className="w-12 h-12 text-blue-400" />
                </div>
                <h3 className="text-2xl font-semibold tracking-tight mb-2">No Synthesis Detected</h3>
                <p className="text-zinc-400 max-w-md mb-8">
                  The AI needs to process your active document before generating interactive {activeTabData?.label} materials.
                </p>
                <Button 
                  onClick={handleGenerate}
                  disabled={isProcessing}
                  className="group relative h-12 px-8 bg-white text-zinc-950 hover:bg-zinc-200 transition-all rounded-full overflow-hidden"
                >
                  {isProcessing ? (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-2 font-medium"
                    >
                      <Sparkles className="w-4 h-4 animate-spin" />
                      Synthesizing Data...
                    </motion.div>
                  ) : (
                    <span className="flex items-center gap-2 font-semibold">
                      Generate {activeTabData?.label}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  )}
                </Button>
                
                {/* Command Palette Hint */}
                <div className="mt-8 flex items-center gap-2 text-xs text-zinc-500 font-medium">
                  <Command className="w-3 h-3" />
                  <span>Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/20 text-zinc-300">G</kbd> to quick-generate</span>
                </div>
              </motion.div>

            ) : (
              // Active Content Area
              
              <motion.div
                    key="content"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="h-full flex flex-col items-center justify-center p-4 md:p-8 rounded-3xl border border-white/10 bg-black/20 backdrop-blur-sm"
                    >
                    {/* Render specific modules based on active tab */}
                    {activeTab === 'flashcards' ? (
                        <FlashcardModule />
                    ) : (
                        // Fallback for the other tabs (Quiz, Paper, Mind Map) until we build them
                        <div className="text-center">
                        {ActiveIcon && <ActiveIcon className="w-16 h-16 text-zinc-700 mx-auto mb-4" />}
                        <h3 className="text-xl font-medium text-zinc-300">
                            {activeTabData?.label} Engine Active
                        </h3>
                        <p className="text-sm text-zinc-500 mt-2">
                            Module in development...
                        </p>
                        </div>
                    )}
                    </motion.div>
                    
                                )}
                                <motion.div
  key="content"
  initial={{ opacity: 0, y: 10 }}
  // ...
>
  {activeTab === 'flashcards' ? (
    <FlashcardModule />
  ) : activeTab === 'quiz' ? (      // Add this condition
    <QuizModule />
  ) : (
    <div className="text-center">
      {/* ... fallback for paper and mindmap */}
    </div>
  )}
</motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}