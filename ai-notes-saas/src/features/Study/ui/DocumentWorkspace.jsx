import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FlashcardModule from './FlashcardModule'; 
import QuizModule from './QuizModule';
import { 
  UploadCloud, 
  Video, 
  Sparkles, 
  Layers, 
  FileQuestion, 
  ArrowLeft,
  CheckCircle2,
  Bot,
  FileText,
  Menu,
  Network,
  PenTool,
  LayoutTemplate,
  Image as ImageIcon,
  PanelLeftClose,
  PanelLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// --- MOCK API DATA ---
const MOCK_SIDEBAR_NOTES = [
  { id: '1', title: 'React 19 Compiler Notes', date: '2h ago' },
  { id: '2', title: 'Vector Embeddings Research', date: 'Yesterday' }
];
const MOCK_AI_SUMMARY = "Optimistic UI is a frontend pattern that updates the interface instantly assuming a successful backend response. This hides network latency from the user. Vector Databases are essential for modern LLMs because they store data as multidimensional arrays to map semantic relationships, allowing search by meaning rather than exact keywords.";

export function DocumentWorkspace() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [pipelineState, setPipelineState] = useState('ingest'); 
  
  const [activeNoteId, setActiveNoteId] = useState(null);
  const [documentTitle, setDocumentTitle] = useState('');
  const [documentContent, setDocumentContent] = useState('');
  const [activeStudyTool, setActiveStudyTool] = useState(null); 
  const [mediaUrl, setMediaUrl] = useState('');
  
  const textareaRef = useRef(null);

  // Auto-resize the editor
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [documentContent, pipelineState]);

  const handleIngestData = (e) => {
    e?.preventDefault();
    setPipelineState('processing');
    setTimeout(() => {
      setDocumentTitle('Transcribed AI Summary');
      setDocumentContent(MOCK_AI_SUMMARY);
      setPipelineState('editor');
    }, 2000);
  };

  const handleGenerateDerivatives = (toolType) => {
    setPipelineState('processing');
    setTimeout(() => {
      setActiveStudyTool(toolType);
      setPipelineState('study');
    }, 2000);
  };

  const startNewDocument = () => {
    setActiveNoteId(null);
    setDocumentTitle('');
    setDocumentContent('');
    setMediaUrl('');
    setPipelineState('ingest');
  };

  return (
    <div className="flex h-[calc(100vh-2rem)] w-full bg-[#09090b] text-zinc-50 overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
      
      {/* --- LEFT SIDEBAR (Knowledge Base) --- */}
      <AnimatePresence initial={false}>
        {isSidebarOpen && (
          <motion.div 
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 260, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="flex flex-col border-r border-white/5 bg-[#09090b] shrink-0 overflow-hidden"
          >
            <div className="p-4 border-b border-white/5 w-[260px]">
              <Button onClick={startNewDocument} variant="outline" className="w-full justify-start text-zinc-300 border-white/10 hover:bg-white/5 hover:text-white">
                <FileText className="w-4 h-4 mr-2" />
                New Document
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto py-4 w-[260px]">
              <p className="text-xs font-semibold text-zinc-500 tracking-wider mb-2 px-4">RECENT</p>
              <div className="px-2 space-y-0.5">
                {MOCK_SIDEBAR_NOTES.map(note => (
                  <button
                    key={note.id}
                    onClick={() => {
                      setActiveNoteId(note.id);
                      setPipelineState('editor');
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-all flex flex-col ${
                      activeNoteId === note.id ? 'bg-blue-500/10 text-blue-400' : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200'
                    }`}
                  >
                    <span className="text-sm font-medium truncate">{note.title}</span>
                    <span className="text-[10px] opacity-60 mt-0.5">{note.date}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- MAIN CANVAS --- */}
      <div className="flex-1 flex flex-col relative overflow-hidden bg-zinc-950/50">
        
        {/* HEADER */}
        <header className="flex items-center justify-between px-4 h-14 border-b border-white/5 shrink-0">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
              className="text-zinc-400 hover:text-white hover:bg-white/10 h-8 w-8 rounded-md transition-colors"
            >
              {isSidebarOpen ? <PanelLeftClose className="w-4.5 h-4.5" /> : <PanelLeft className="w-4.5 h-4.5" />}
            </Button>
            
            {/* Minimal Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-zinc-500">
              <span className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/5 text-zinc-300">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" /> Workspace
              </span>
              {pipelineState !== 'ingest' && (
                <>
                  <ChevronRight className="w-3.5 h-3.5" />
                  <span className="text-zinc-200 truncate max-w-[200px]">{documentTitle || 'Untitled'}</span>
                </>
              )}
            </div>
          </div>

          {pipelineState === 'study' && (
            <Button variant="ghost" onClick={() => setPipelineState('editor')} className="text-zinc-400 hover:text-white h-8 text-xs">
              <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> Back to Editor
            </Button>
          )}
        </header>

        {/* PIPELINE CONTENT */}
        <main className="flex-1 relative overflow-y-auto scrollbar-hide">
          <AnimatePresence mode="wait">
            
            {/* STAGE 1: INGESTION (Unified Hub) */}
            {pipelineState === 'ingest' && (
              <motion.div 
                key="ingest"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="absolute inset-0 flex items-center justify-center p-6"
              >
                <div className="w-full max-w-xl bg-[#0a0a0c] border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
                  {/* Subtle top glow */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" />
                  
                  <div className="text-center mb-8">
                    <div className="mx-auto w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mb-4 border border-blue-500/20">
                      <Sparkles className="w-6 h-6 text-blue-400" />
                    </div>
                    <h2 className="text-2xl font-semibold text-white mb-2">Initialize Knowledge</h2>
                    <p className="text-sm text-zinc-400">Provide a source for the AI to analyze and structure.</p>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Unified Input */}
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Video className="h-5 w-5 text-zinc-500 group-focus-within:text-blue-400 transition-colors" />
                      </div>
                      <input 
                        type="text"
                        value={mediaUrl}
                        onChange={(e) => setMediaUrl(e.target.value)}
                        placeholder="Paste YouTube or Web URL..."
                        className="w-full bg-black/50 border border-white/10 rounded-xl py-4 pl-11 pr-24 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                      />
                      <div className="absolute inset-y-0 right-2 flex items-center">
                        <Button onClick={handleIngestData} disabled={!mediaUrl} size="sm" className="h-8 bg-white text-black hover:bg-zinc-200">
                          Extract
                        </Button>
                      </div>
                    </div>

                    <div className="relative flex items-center py-2">
                      <div className="flex-grow border-t border-white/5"></div>
                      <span className="flex-shrink-0 mx-4 text-xs text-zinc-600 uppercase">Or</span>
                      <div className="flex-grow border-t border-white/5"></div>
                    </div>

                    {/* File Dropzone */}
                    <button onClick={handleIngestData} className="w-full flex items-center justify-center gap-3 py-4 rounded-xl border border-dashed border-white/10 bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/20 transition-all">
                      <UploadCloud className="w-5 h-5 text-zinc-400" />
                      <span className="text-sm font-medium text-zinc-300">Upload PDF, Audio, or Image</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STAGE 2: PROCESSING */}
            {pipelineState === 'processing' && (
              <motion.div 
                key="processing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center"
              >
                <div className="relative flex items-center justify-center w-16 h-16 mb-4">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="absolute inset-0 rounded-full border-t-2 border-r-2 border-blue-500" />
                  <Bot className="w-6 h-6 text-blue-400 animate-pulse" />
                </div>
                <h3 className="text-sm font-medium text-zinc-300">Synthesizing data...</h3>
              </motion.div>
            )}

            {/* STAGE 3: EDITOR & TOOLS */}
            {pipelineState === 'editor' && (
              <motion.div 
                key="editor"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col lg:flex-row overflow-hidden"
              >
                {/* Editor Canvas (Centered prose) */}
                <div className="flex-1 overflow-y-auto scrollbar-hide flex justify-center">
                  <div className="w-full max-w-3xl px-8 py-12 space-y-6">
                    <input
                      value={documentTitle}
                      onChange={(e) => setDocumentTitle(e.target.value)}
                      placeholder="Document Title"
                      className="w-full bg-transparent text-4xl font-bold tracking-tight text-zinc-100 outline-none placeholder:text-zinc-800"
                    />
                    <div className="flex items-center gap-2 text-xs font-medium text-emerald-400/80 bg-emerald-400/10 w-fit px-2.5 py-1 rounded-md">
                      <CheckCircle2 className="w-3.5 h-3.5" /> AI Synthesis Complete
                    </div>
                    <textarea
                      ref={textareaRef}
                      value={documentContent}
                      onChange={(e) => setDocumentContent(e.target.value)}
                      placeholder="Start writing or editing..."
                      className="w-full bg-transparent text-lg text-zinc-300 leading-relaxed resize-none outline-none min-h-[500px]"
                    />
                  </div>
                </div>

                {/* Right Action Sidebar (The Toolbox) */}
                <div className="w-full lg:w-[320px] bg-[#0a0a0c] border-l border-white/5 p-5 flex flex-col gap-8 shrink-0 overflow-y-auto scrollbar-hide">
                  
                  {/* GENERATORS GRID (Better UX than stacked rows) */}
                  <div>
                    <h4 className="text-[11px] font-semibold tracking-widest text-zinc-500 uppercase mb-3">Study Engine</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <button onClick={() => handleGenerateDerivatives('flashcards')} className="flex flex-col items-center justify-center p-4 gap-2 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-blue-500/10 hover:border-blue-500/20 transition-all group">
                        <Layers className="w-5 h-5 text-blue-400" />
                        <span className="text-xs font-medium text-zinc-300 group-hover:text-blue-100">Flashcards</span>
                      </button>
                      <button onClick={() => handleGenerateDerivatives('quiz')} className="flex flex-col items-center justify-center p-4 gap-2 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-purple-500/10 hover:border-purple-500/20 transition-all group">
                        <FileQuestion className="w-5 h-5 text-purple-400" />
                        <span className="text-xs font-medium text-zinc-300 group-hover:text-purple-100">Quizzes</span>
                      </button>
                      <button onClick={() => handleGenerateDerivatives('mindmap')} className="flex flex-col items-center justify-center p-4 gap-2 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-emerald-500/10 hover:border-emerald-500/20 transition-all group">
                        <Network className="w-5 h-5 text-emerald-400" />
                        <span className="text-xs font-medium text-zinc-300 group-hover:text-emerald-100">Mind Map</span>
                      </button>
                      <button onClick={() => handleGenerateDerivatives('practice-paper')} className="flex flex-col items-center justify-center p-4 gap-2 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-orange-500/10 hover:border-orange-500/20 transition-all group">
                        <PenTool className="w-5 h-5 text-orange-400" />
                        <span className="text-xs font-medium text-zinc-300 group-hover:text-orange-100">Practice</span>
                      </button>
                    </div>
                  </div>

                  {/* FORMATTERS (Subtle List) */}
                  <div>
                    <h4 className="text-[11px] font-semibold tracking-widest text-zinc-500 uppercase mb-3">Reformat Document</h4>
                    <div className="space-y-1">
                      {[
                        { id: 'meeting-notes', label: 'Meeting Minutes' },
                        { id: 'revision-notes', label: 'Revision Summary' },
                        { id: 'lecture-notes', label: 'Lecture Notes' }
                      ].map((template) => (
                        <button key={template.id} onClick={() => handleGenerateDerivatives(template.id)} className="w-full flex items-center px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors group">
                          <LayoutTemplate className="w-4 h-4 text-zinc-600 group-hover:text-zinc-300 mr-3" />
                          <span className="text-sm font-medium text-zinc-400 group-hover:text-zinc-200">{template.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* MEDIA */}
                  <div>
                    <h4 className="text-[11px] font-semibold tracking-widest text-zinc-500 uppercase mb-3">Media</h4>
                    <button onClick={() => handleGenerateDerivatives('image-gen')} className="w-full flex items-center px-3 py-2.5 rounded-lg border border-white/5 bg-white/[0.01] hover:bg-white/[0.04] transition-colors group">
                      <ImageIcon className="w-4 h-4 text-pink-400 mr-3" />
                      <span className="text-sm font-medium text-zinc-300 group-hover:text-white">Generate Diagrams</span>
                    </button>
                  </div>

                </div>
              </motion.div>
            )}

            {/* STAGE 4: ACTIVE STUDY */}
            {pipelineState === 'study' && (
              <motion.div 
                key="study"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 overflow-y-auto p-4 md:p-8"
              >
                {activeStudyTool === 'flashcards' && <FlashcardModule />}
                {activeStudyTool === 'quiz' && <QuizModule />}
                {['mindmap', 'practice-paper', 'meeting-notes', 'revision-notes', 'lecture-notes', 'image-gen'].includes(activeStudyTool) && (
                  <div className="h-full flex flex-col items-center justify-center">
                    <Sparkles className="w-8 h-8 text-zinc-600 mb-4" />
                    <h2 className="text-xl font-medium text-white mb-2 capitalize">{activeStudyTool.replace('-', ' ')} Tool</h2>
                    <p className="text-sm text-zinc-500">Feature in development.</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}