import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  FileText, 
  Clock, 
  Sparkles, 
  MoreHorizontal, 
  Plus, 
  Command,
  FileQuestion
} from 'lucide-react';

// Simulated Backend Data
const MOCK_NOTES = [
  { id: '1', title: 'Q3 AI Product Roadmap', excerpt: 'Strategic goals and feature rollouts for Q3, focusing on deep LLM integrations and context-aware UI...', date: '2 hrs ago', aiSynthesized: true, tags: ['Strategy', 'Product'] },
  { id: '2', title: 'React 19 Performance Tuning', excerpt: 'Deep dive into the new compiler, removing useMemo dependencies, and optimizing the virtual DOM...', date: 'Yesterday', aiSynthesized: false, tags: ['Engineering'] },
  { id: '3', title: 'Neuroscience: Memory Retention', excerpt: 'Analysis of spaced repetition algorithms and how the brain encodes short-term data into long-term structures.', date: '3 days ago', aiSynthesized: true, tags: ['Research'] },
  { id: '4', title: 'Competitor Analysis 2026', excerpt: 'Evaluating Notion AI, Arc Search, and ChatGPT for UI/UX patterns and market positioning.', date: 'Last week', aiSynthesized: true, tags: ['Design'] },
  { id: '5', title: 'Y-Combinator Application Draft', excerpt: 'Answers to the standard YC application questions. Need to refine the unique value proposition section.', date: 'Last week', aiSynthesized: false, tags: ['Startup'] },
];

export default function NotesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [notes, setNotes] = useState([]);

  // Simulate Initial Network Fetch
  useEffect(() => {
    const fetchNotes = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate 1.5s latency
      setNotes(MOCK_NOTES);
      setIsLoading(false);
    };
    fetchNotes();
  }, []);

  // Instant Client-Side Filtering
  const filteredNotes = useMemo(() => {
    if (!searchQuery.trim()) return notes;
    const lowerQuery = searchQuery.toLowerCase();
    return notes.filter(note => 
      note.title.toLowerCase().includes(lowerQuery) || 
      note.excerpt.toLowerCase().includes(lowerQuery) ||
      note.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }, [searchQuery, notes]);

  return (
    <div className="min-h-full w-full bg-zinc-950 text-zinc-50 p-8 md:p-12 font-sans">
      
      {/* Top Header & Actions */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-2">
            Knowledge Base
          </h1>
          <p className="text-zinc-400 text-sm md:text-base">
            Manage, search, and synthesize your imported documents.
          </p>
        </div>
        
        <button className="group flex items-center gap-2 px-5 py-2.5 bg-white text-zinc-950 font-medium rounded-lg hover:bg-zinc-200 transition-colors">
          <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
          <span>New Document</span>
        </button>
      </header>

      {/* Command Palette Style Search */}
      <div className="relative max-w-2xl mb-8 group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-zinc-500 group-focus-within:text-blue-400 transition-colors" />
        </div>
        <input
          type="text"
          placeholder="Search documents, tags, or AI briefs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-16 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all backdrop-blur-md"
        />
        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
          <div className="flex items-center gap-1 text-xs text-zinc-500 font-medium">
            <Command className="w-3 h-3" />
            <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/10">K</kbd>
          </div>
        </div>
      </div>

      {/* Main Grid Workspace */}
      <main>
        {isLoading ? (
          // Premium Sequential Skeleton Loaders
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="h-48 rounded-2xl bg-white/[0.02] border border-white/5 p-6 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-lg bg-white/5 animate-pulse" />
                  <div className="h-5 w-3/4 rounded bg-white/5 animate-pulse" />
                  <div className="space-y-2">
                    <div className="h-3 w-full rounded bg-white/5 animate-pulse" />
                    <div className="h-3 w-5/6 rounded bg-white/5 animate-pulse" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredNotes.length > 0 ? (
                filteredNotes.map((note) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    key={note.id}
                    className="group relative flex flex-col justify-between h-48 p-6 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] hover:border-white/10 transition-all cursor-pointer overflow-hidden"
                  >
                    {/* Hover Glow Effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent pointer-events-none" />

                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <div className="p-2 rounded-lg bg-white/5 text-zinc-400 group-hover:text-blue-400 group-hover:bg-blue-500/10 transition-colors">
                          <FileText className="w-5 h-5" />
                        </div>
                        <button className="text-zinc-600 hover:text-zinc-300 transition-colors">
                          <MoreHorizontal className="w-5 h-5" />
                        </button>
                      </div>
                      <h3 className="text-lg font-medium text-zinc-200 truncate mb-1">
                        {note.title}
                      </h3>
                      <p className="text-sm text-zinc-500 line-clamp-2">
                        {note.excerpt}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                      <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{note.date}</span>
                      </div>
                      
                      <div className="flex gap-2">
                        {note.aiSynthesized && (
                          <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-purple-500/10 text-purple-400 text-xs font-medium">
                            <Sparkles className="w-3 h-3" />
                            <span>AI Brief</span>
                          </div>
                        )}
                        {note.tags.slice(0, 1).map(tag => (
                          <div key={tag} className="px-2 py-1 rounded-md bg-white/5 text-zinc-400 text-xs font-medium">
                            {tag}
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                // Empty Search State
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full flex flex-col items-center justify-center py-20 text-center"
                >
                  <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                    <FileQuestion className="w-8 h-8 text-zinc-500" />
                  </div>
                  <h3 className="text-xl font-medium text-zinc-300 mb-1">No documents found</h3>
                  <p className="text-zinc-500">
                    We couldn't find any notes matching "{searchQuery}"
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </main>
    </div>
  );
}