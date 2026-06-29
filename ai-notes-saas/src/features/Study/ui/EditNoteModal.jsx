import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Sparkles, 
  Share, 
  MoreHorizontal, 
  Clock, 
  Tag,
  Wand2,
  CheckCircle2,
  Bot
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const MOCK_AI_RESPONSE = "This document outlines the strategic shift toward latent space UI optimizations. By removing traditional loading states and utilizing optimistic client-side rendering, the perceived latency of the application drops to zero. Key actionable items include migrating the fetching layer to React Query and implementing Framer Motion layout IDs across the core navigation systems.";

export default function EditNoteModal({ isOpen, onClose, noteData }) {
  // Local state for seamless in-place editing
  const [title, setTitle] = useState(noteData?.title || 'Untitled Document');
  const [content, setContent] = useState(noteData?.excerpt || 'Start typing your notes here...');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  
  // AI Streaming State
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiSummary, setAiSummary] = useState('');
  const [generationComplete, setGenerationComplete] = useState(false);
  
  const contentRef = useRef(null);

  // Auto-resize textarea magic
  const handleContentChange = (e) => {
    setContent(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  // Simulate LLM Token Streaming
  useEffect(() => {
    if (!isGenerating) return;

    const words = MOCK_AI_RESPONSE.split(' ');
    let currentIndex = 0;
    setAiSummary(''); // Reset
    
    const interval = setInterval(() => {
      if (currentIndex < words.length) {
        setAiSummary((prev) => prev + (prev ? ' ' : '') + words[currentIndex]);
        currentIndex++;
      } else {
        clearInterval(interval);
        setIsGenerating(false);
        setGenerationComplete(true);
      }
    }, 40); // 40ms per word simulates fast token generation

    return () => clearInterval(interval);
  }, [isGenerating]);

  const handleGenerateAI = () => {
    if (isGenerating || generationComplete) return;
    setIsGenerating(true);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-6">
          {/* Ambient Blur Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
          />

          {/* Editor Canvas */}
          <motion.div
            layoutId={`note-card-${noteData?.id}`}
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="relative w-full h-full md:h-auto md:max-h-[85vh] max-w-4xl bg-zinc-950 md:border border-white/10 md:rounded-3xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Top Command Bar */}
            <header className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-zinc-950/50 backdrop-blur-xl z-10">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 text-xs font-medium text-zinc-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Edited just now</span>
                </div>
                {generationComplete && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-500/10 text-xs font-medium text-purple-400 border border-purple-500/20"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AI Synthesized</span>
                  </motion.div>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-zinc-100 hover:bg-white/10 rounded-full h-9 w-9">
                  <Share className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-zinc-100 hover:bg-white/10 rounded-full h-9 w-9">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
                <div className="w-px h-4 bg-white/10 mx-2" />
                <Button variant="ghost" size="icon" onClick={onClose} className="text-zinc-400 hover:text-white hover:bg-white/10 rounded-full h-9 w-9">
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </header>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto scrollbar-hide">
              <div className="max-w-3xl mx-auto px-6 py-12 md:px-12 flex flex-col gap-8">
                
                {/* Meta Information */}
                <div className="flex items-center gap-2 text-zinc-500 text-sm">
                  <Tag className="w-4 h-4" />
                  <span>Engineering</span>
                  <span className="text-zinc-700">•</span>
                  <span>Product Roadmap</span>
                </div>

                {/* Title Editor */}
                <div className="relative group">
                  {isEditingTitle ? (
                    <input
                      autoFocus
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      onBlur={() => setIsEditingTitle(false)}
                      className="w-full bg-transparent text-4xl md:text-5xl font-bold tracking-tight text-zinc-100 placeholder-zinc-700 focus:outline-none focus:ring-0 p-0 m-0"
                    />
                  ) : (
                    <h1 
                      onClick={() => setIsEditingTitle(true)}
                      className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-100 cursor-text"
                    >
                      {title}
                    </h1>
                  )}
                </div>

                {/* AI Action Hook */}
                <AnimatePresence>
                  {!generationComplete && !isGenerating && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, height: 0, marginBottom: 0 }}
                      className="flex items-center gap-4 py-4 mb-2 border-y border-white/5"
                    >
                      <Wand2 className="w-5 h-5 text-purple-400" />
                      <p className="text-sm text-zinc-400 flex-1">
                        Extract key insights and synthesize this document.
                      </p>
                      <Button 
                        onClick={handleGenerateAI}
                        className="bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_20px_rgba(147,51,234,0.3)] rounded-full h-9 px-6 text-sm font-medium transition-all hover:scale-105"
                      >
                        Synthesize Note
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Generative AI Summary Block */}
                <AnimatePresence>
                  {(isGenerating || generationComplete) && (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 20, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      className="relative p-6 rounded-2xl bg-purple-500/[0.03] border border-purple-500/20 group"
                    >
                      {/* Ambient background glow */}
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/5 rounded-2xl pointer-events-none" />
                      
                      <div className="relative z-10 flex gap-4">
                        <div className="mt-1">
                          {isGenerating ? (
                            <Bot className="w-6 h-6 text-purple-400 animate-pulse" />
                          ) : (
                            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                          )}
                        </div>
                        <div className="flex-1 space-y-2">
                          <h3 className="text-sm font-medium text-purple-300 flex items-center gap-2">
                            AI Synthesis 
                            {isGenerating && <span className="flex gap-1">
                              <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}>.</motion.span>
                              <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}>.</motion.span>
                              <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}>.</motion.span>
                            </span>}
                          </h3>
                          <p className="text-zinc-300 leading-relaxed">
                            {aiSummary}
                            {isGenerating && (
                              <motion.span
                                animate={{ opacity: [1, 0] }}
                                transition={{ duration: 0.8, repeat: Infinity }}
                                className="inline-block w-2 h-4 ml-1 bg-purple-400 rounded-sm translate-y-0.5"
                              />
                            )}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Body Content Editor */}
                <motion.div layout className="relative group">
                  <textarea
                    ref={contentRef}
                    value={content}
                    onChange={handleContentChange}
                    placeholder="Start typing your notes here..."
                    className="w-full bg-transparent text-lg text-zinc-400 leading-relaxed placeholder-zinc-700 resize-none focus:outline-none focus:ring-0 min-h-[300px]"
                  />
                </motion.div>

              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}