import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import ReactMarkdown from 'react-markdown';
import FlashcardModule from './FlashcardModule'; 
import QuizModule from './QuizModule';

// --- SAFE STANDBY FALLBACKS ---
const MindmapModule = () => <div className="p-8 text-center text-zinc-500 font-medium">Mind Map Engine Standby</div>;
const TutorChatModule = () => <div className="p-8 text-center text-zinc-500 font-medium">AI Tutor Chat Standby</div>;

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
  Image as ImageIcon,
  PanelLeftClose,
  PanelLeft,
  ChevronRight,
  Plus,
  Copy,
  Check,
  Bold,
  Italic,
  Underline,
  Heading2,
  Minus,
  ChevronDown,
  Palette,
  Type,
  Network,
  PenTool,
  LayoutTemplate
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const MOCK_SIDEBAR_NOTES = [
  { id: '1', title: 'React 19 Compiler Notes', date: '2h ago' },
  { id: '2', title: 'Vector Embeddings Research', date: 'Yesterday' }
];

const FONTS_LIST = ['Clarika', 'Arial', 'Times New Roman', 'Courier New', 'Georgia', 'Verdana'];

const COLOR_PALETTE = [
  ['#4a4a4a', '#7a7a7a', '#ffffff', '#ff4d4d', '#ff9933', '#ffff33', '#99ff33', '#33ff33', '#33ff99', '#33ffff', '#3399ff', '#3333ff', '#9933ff', '#ff33ff'],
  ['#2b2b2b', '#5a5a5a', '#cccccc', '#cc0000', '#cc6600', '#cccc00', '#66cc00', '#00cc00', '#00cc66', '#00cccc', '#0066cc', '#0000cc', '#6600cc', '#cc00cc'],
  ['#000000', '#3a3a3a', '#999999', '#800000', '#b34700', '#999900', '#478000', '#008000', '#008047', '#008080', '#004780', '#000080', '#470080', '#800080']
];

const MOCK_AI_SUMMARY = `# 📚 Node.js Basics & Architecture Tutorial

### 🔍 Brief Overview
This note covers the foundational elements of **Node.js** derived from the *Node.js Tutorial for Beginners: Learn Node in 1 Hour* video course. It explores execution frameworks, runtime differences, and how the asynchronous non-blocking engine optimizes distributed application workflows.

---

### 🚀 Key Takeaways

* **Environment Separation:** Deep understanding of how the Node runtime environment operates completely detached from standard client-side browser windows.
* **Asynchronous Scalability:** Mastering how non-blocking I/O routines bypass traditional multi-threaded platform bottlenecks.
* **Module Assembly:** Exporting and importing isolated modular logical blocks securely using structural \`module.exports\` and \`require\` methods.

---

### ⚡ Deep-Dive: Asynchronous vs. Blocking Architecture

> 🍽️ **The Restaurant Metaphor:**
> Traditional frameworks operate like a synchronous waiter who takes an order from Table A and stands still at the kitchen door waiting for the food to be cooked before helping anyone else. **Node.js acts like an optimized waiter** who drops the request at the kitchen window and immediately moves on to take orders from Tables B, C, and D while Table A's meal prepares in the background.

| Performance Metric | Asynchronous Model (Node.js) | Blocking Model (Traditional Systems) |
| :--- | :--- | :--- |
| **Thread Strategy** | Single active thread coordinates requests | Dedicated thread context spun up per client connection |
| **System I/O Actions** | Continues handling incoming loop event flags | Thread goes completely idle while waiting on DB updates |
| **Hardware Footprint** | Low memory usage; highly scalable | High CPU context switching; resource heavy |

---

### ⚙️ Installation Quick-Start
Verify your local runtime compiler layer version by executing this string inside your active terminal console pane:

\`\`\`bash
node -v
\`\`\`

Always ensure production deployment parameters target current stable **LTS (Long Term Support)** releases to preserve package stability layout maps.`;

export function DocumentWorkspace() {
  const isDarkMode = useSelector((state) => state.ui?.isDarkMode || false);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileToolboxOpen, setIsMobileToolboxOpen] = useState(false);
  const [pipelineState, setPipelineState] = useState('ingest'); 
  const [fontSize, setFontSize] = useState(15);
  const [isCopied, setIsCopied] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Dropdown Toggles
  const [activeFont, setActiveFont] = useState('Clarika');
  const [showFontMenu, setShowFontMenu] = useState(false);
  const [showColorMenu, setShowColorMenu] = useState(false);
  
  const [activeNoteId, setActiveNoteId] = useState(null);
  const [documentTitle, setDocumentTitle] = useState('');
  const [documentContent, setDocumentContent] = useState('');
  const [activeStudyTool, setActiveStudyTool] = useState(null); 
  const [mediaUrl, setMediaUrl] = useState('');

  const editorRef = useRef(null);
  const fileInputRef = useRef(null);
  const fontMenuRef = useRef(null);
  const colorMenuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (fontMenuRef.current && !fontMenuRef.current.contains(event.target)) setShowFontMenu(false);
      if (colorMenuRef.current && !colorMenuRef.current.contains(event.target)) setShowColorMenu(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const execEditorCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    if (editorRef.current) editorRef.current.focus();
  };

  const handleFontSelect = (font) => {
    setActiveFont(font);
    execEditorCommand('fontName', font);
    setShowFontMenu(false);
  };

  const handleColorSelect = (color) => {
    execEditorCommand('foreColor', color);
    setShowColorMenu(false);
  };

  const handleCopyRawText = async () => {
    if (!editorRef.current) return;
    try {
      const textToCopy = editorRef.current.textContent;
      await navigator.clipboard.writeText(textToCopy);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      try {
        const range = document.createRange();
        range.selectNode(editorRef.current);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
        document.execCommand('copy');
        window.getSelection().removeAllRanges();
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } catch (fallbackErr) {
        console.error("Fallback copy failed", fallbackErr);
      }
    }
  };

  const processUploadedFile = (file) => {
    if (!file) return;
    setPipelineState('processing');
    setTimeout(() => {
      setDocumentTitle(file.name.split('.')[0] || 'Processed Summary');
      setDocumentContent(MOCK_AI_SUMMARY);
      setPipelineState('editor');
    }, 1800);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    processUploadedFile(file);
  };

  const handleIngestData = (e) => {
    e?.preventDefault();
    if (!mediaUrl) return;
    setPipelineState('processing');
    setTimeout(() => {
      setDocumentTitle('Transcribed AI Summary');
      setDocumentContent(MOCK_AI_SUMMARY);
      setPipelineState('editor');
    }, 1800);
  };

  const handleGenerateDerivatives = (toolType) => {
    setIsMobileToolboxOpen(false);
    setPipelineState('processing');
    setTimeout(() => {
      setActiveStudyTool(toolType);
      setPipelineState('study');
    }, 1500);
  };

  const startNewDocument = () => {
    setActiveNoteId(null);
    setDocumentTitle('');
    setDocumentContent('');
    setMediaUrl('');
    setPipelineState('ingest');
    setIsSidebarOpen(true);
  };

  const ToolboxContent = () => (
    <div className="flex flex-col gap-6 w-full pb-8">
      {/* STUDY ENGINE CONTAINER */}
      <div>
        <h4 className="text-[11px] font-bold tracking-widest text-zinc-400 dark:text-zinc-500 uppercase mb-3 px-1">Study Engine</h4>
        <div className="grid grid-cols-2 gap-2 w-full">
          <button onClick={() => handleGenerateDerivatives('flashcards')} className="flex flex-col items-center justify-center p-4 gap-2 rounded-xl bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/5 hover:bg-blue-50 hover:border-blue-200 dark:hover:bg-blue-500/10 dark:hover:border-blue-500/20  transition-all group">
            <Layers className="w-4 h-4 text-blue-500" />
            <span className="text-[11px] font-medium text-zinc-600 dark:text-zinc-300">Flashcards</span>
          </button>
          <button onClick={() => handleGenerateDerivatives('quiz')} className="flex flex-col items-center justify-center p-4 gap-2 rounded-xl bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/5 hover:bg-purple-50  hover:border-purple-200 dark:hover:bg-purple-500/10  dark:hover:border-purple-500/20  transition-all group">
            <FileQuestion className="w-4 h-4 text-purple-500" />
            <span className="text-[11px] font-medium text-zinc-600 dark:text-zinc-300">Quizzes</span>
          </button>
          <button onClick={() => handleGenerateDerivatives('mindmap')} className="flex flex-col items-center justify-center p-3.5 gap-1.5 rounded-xl bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/5 hover:bg-emerald-50 hover:border-emerald-200 dark:hover:bg-emerald-500/10  dark:hover:border-emerald-500/20 transition-all group">
            <Network className="w-4 h-4 text-emerald-500" />
            <span className="text-[11px] font-medium text-zinc-600 dark:text-zinc-300">Mind Map</span>
          </button>
          <button onClick={() => handleGenerateDerivatives('practice-paper')} className="flex flex-col items-center justify-center p-3.5 gap-1.5 rounded-xl bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/5 hover:bg-orange-50 hover:border-orange-200 dark:hover:bg-orange-500/10 dark:hover:border-orange-500/20 transition-all group">
            <PenTool className="w-4 h-4 text-orange-500" />
            <span className="text-[11px] font-medium text-zinc-600 dark:text-zinc-300">Practice</span>
          </button>
          <button onClick={() => handleGenerateDerivatives('tutor')} className="flex items-center justify-center p-3 gap-2 rounded-xl bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/5 hover:bg-blue-50 hover:border:bg-blue-200  dark:hover:bg-blue-500/10  dark:hover:border-blue-500/20 transition-all group col-span-2 w-full">
            <Bot className="w-4 h-4 text-blue-500" />
            <span className="text-[11px] font-medium text-zinc-600 dark:text-zinc-300">AI Tutor Q&A</span>
          </button>
        </div>
      </div>

      {/* REFORMAT DOCUMENT LIST */}
      <div>
        <h4 className="text-[11px] font-bold tracking-widest text-zinc-400 dark:text-zinc-500 uppercase mb-2 px-1">Reformat Document</h4>
        <div className="space-y-0.5">
          {[
            { id: 'meeting-notes', label: 'Meeting Minutes' },
            { id: 'revision-notes', label: 'Revision Summary' },
            { id: 'lecture-notes', label: 'Lecture Notes' }
          ].map((template) => (
            <button key={template.id} onClick={() => handleGenerateDerivatives(template.id)} className="w-full flex items-center px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors text-left group">
              <LayoutTemplate className="w-4 h-4 text-zinc-400 mr-2.5 group-hover:text-zinc-600 dark:group-hover:text-zinc-200" />
              <span className="text-xs font-medium text-zinc-600 dark:text-zinc-300">{template.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* MEDIA MANAGEMENT DIAGRAMS */}
      <div>
        <h4 className="text-[11px] font-semibold tracking-widest text-zinc-500 dark:text-zinc-400 uppercase mb-3 px-1">Media</h4>
        <button onClick={() => handleGenerateDerivatives('image-gen')} className="w-full flex items-center px-3 py-2.5 rounded-lg border border-zinc-200 dark:border-white/5 bg-zinc-50 dark:bg-white/[0.01] hover:bg-zinc-100 dark:hover:bg-white/[0.04] transition-colors group">
          <ImageIcon className="w-4 h-4 text-pink-500 dark:text-pink-400 mr-3" />
          <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-zinc-50">Generate Diagrams</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-[100dvh] lg:h-[calc(100vh-4rem)] w-full bg-zinc-50 dark:bg-[#09090b] text-zinc-900 dark:text-zinc-50 overflow-hidden lg:rounded-2xl lg:border border-zinc-200 dark:border-white/10 lg:shadow-2xl relative font-sans antialiased transition-colors duration-300">
      
      {/* --- SIDEBAR --- */}
      <div 
        className="hidden lg:flex flex-col border-r border-zinc-200 dark:border-white/5 bg-white dark:bg-[#0a0a0c] shrink-0 overflow-hidden transition-all duration-300 ease-in-out"
        style={{ width: isSidebarOpen ? '260px' : '0px', borderRightWidth: isSidebarOpen ? '1px' : '0px' }}
      >
        <div className="p-4 border-b border-zinc-200 dark:border-white/5 w-[260px]">
          <Button onClick={startNewDocument} variant="outline" className="w-full justify-start text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/5">
            <FileText className="w-4 h-4 mr-2" /> New Document
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
                  setDocumentTitle(note.title);
                  setDocumentContent(MOCK_AI_SUMMARY);
                  setPipelineState('editor');
                }}
                className={`w-full text-left px-3 py-2 rounded-lg flex flex-col transition-all hover:bg-zinc-100 dark:hover:bg-white/5 ${activeNoteId === note.id ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-medium' : 'text-zinc-600 dark:text-zinc-400'}`}
              >
                <span className="text-sm truncate">{note.title}</span>
                <span className="text-[10px] opacity-60 mt-0.5">{note.date}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* --- MAIN CANVAS HUB --- */}
      <div className="flex-1 flex flex-col relative min-w-0 h-full w-full">
        
        <header className="flex items-center justify-between px-4 h-14 border-b shrink-0 z-20 bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-md border-zinc-200 dark:border-white/5">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="hidden lg:flex text-zinc-500 dark:text-zinc-400 h-8 w-8 hover:bg-zinc-100 dark:hover:bg-white/5">
              {isSidebarOpen ? <PanelLeftClose className="w-4.5 h-4.5" /> : <PanelLeft className="w-4.5 h-4.5" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(true)} className="lg:hidden text-zinc-500 dark:text-zinc-400 h-8 w-8 hover:bg-zinc-100 dark:hover:bg-white/5">
              <Menu className="w-5 h-5" />
            </Button>

            <div className="flex items-center gap-2 text-sm text-zinc-500">
              <span className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-zinc-100 dark:bg-white/5 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-white/5 font-medium text-xs">
                <Sparkles className="w-3.5 h-3.5 text-blue-500" /> StudyTime
              </span>
              {pipelineState !== 'ingest' && (
                <>
                  <ChevronRight className="w-3.5 h-3.5 hidden sm:block shrink-0 text-zinc-400" />
                  <span className="text-zinc-800 dark:text-zinc-200 font-semibold truncate hidden sm:block">{documentTitle || 'Untitled'}</span>
                </>
              )}
            </div>
          </div>

          {pipelineState === 'study' && (
            <Button 
              variant="outline"
              onClick={() => setPipelineState('editor')} 
              className="text-zinc-600 dark:text-zinc-300 border-zinc-200 dark:border-white/10 hover:bg-zinc-100 dark:hover:bg-white/5 h-8 text-xs font-semibold gap-1.5 px-3 rounded-lg shadow-sm transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Back to Editor</span>
            </Button>
          )}
        </header>

        <main className="flex-1 relative flex overflow-hidden">
          <AnimatePresence mode="wait">
            
            {/* INGEST STATE */}
            {pipelineState === 'ingest' && (
              <motion.div key="ingest" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98 }} className="absolute inset-0 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
                <div className="w-full max-w-xl bg-white dark:bg-[#0a0a0c] border border-zinc-200 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl dark:shadow-2xl relative overflow-hidden transition-colors duration-300">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-60" />
                  
                  <div className="text-center mb-8">
                    <div className="mx-auto w-12 h-12 bg-blue-50 dark:bg-blue-500/10 rounded-full flex items-center justify-center mb-4 border border-blue-100 dark:border-blue-500/20 shadow-inner">
                      <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">Initialize Knowledge</h2>
                    <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">Provide a remote stream link or source file to compile your workspace.</p>
                  </div>
                  
                  <div className="space-y-5">
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Video className="h-4 w-4 text-zinc-400 dark:text-zinc-500 group-focus-within:text-blue-500 transition-colors" />
                      </div>
                      <input 
                        type="text" 
                        value={mediaUrl} 
                        onChange={(e) => setMediaUrl(e.target.value)} 
                        placeholder="Paste YouTube URL link here..." 
                        className="w-full bg-zinc-50 dark:bg-[#09090b] border border-zinc-200 dark:border-white/10 rounded-xl py-3.5 pl-11 pr-24 text-sm text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-inner" 
                      />
                      <div className="absolute inset-y-0 right-2 flex items-center">
                        <Button 
                          onClick={handleIngestData} 
                          disabled={!mediaUrl} 
                          size="sm" 
                          className="h-8 text-xs bg-zinc-900 dark:bg-zinc-50 text-white dark:text-[#09090b] hover:bg-zinc-800 dark:hover:bg-zinc-200 font-semibold rounded-lg disabled:opacity-40"
                        >
                          Extract
                        </Button>
                      </div>
                    </div>

                    <div className="relative flex items-center py-1">
                      <div className="flex-grow border-t border-zinc-200 dark:border-white/5"></div>
                      <span className="flex-shrink-0 mx-4 text-[10px] font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest">Or</span>
                      <div className="flex-grow border-t border-zinc-200 dark:border-white/5"></div>
                    </div>

                    <div className="relative">
                      <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} accept=".pdf,.png,.jpg,.jpeg,.mp3,.txt" />
                      <div 
                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={(e) => { e.preventDefault(); setIsDragging(false); processUploadedFile(e.dataTransfer.files?.[0]); }}
                        onClick={() => fileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all ${isDragging ? 'border-blue-500 bg-blue-500/5 dark:bg-blue-500/[0.03]' : 'border-zinc-200 dark:border-white/10 hover:border-zinc-300 dark:hover:border-white/20 bg-zinc-50/50 dark:bg-white/[0.005] hover:bg-zinc-100/50 dark:hover:bg-white/[0.015]'}`}
                      >
                        <UploadCloud className={`w-8 h-8 mb-3 transition-transform duration-200 ${isDragging ? 'scale-110 text-blue-500' : 'text-zinc-400 dark:text-zinc-500'}`} />
                        <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 transition-colors">
                          {isDragging ? 'Release to drop your data' : 'Click or Drag asset file here'}
                        </span>
                        <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-1">Supports secure local parsing on PDF, Audio notes, Text logs, or Images</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* PROCESSING OVERLAY */}
            {pipelineState === 'processing' && (
              <motion.div key="processing" className="absolute inset-0 flex flex-col items-center justify-center">
                <Bot className="w-8 h-8 text-blue-500 animate-pulse mb-3" />
                <h3 className="text-sm font-semibold text-zinc-600 dark:text-zinc-300 tracking-wide animate-pulse">Compiling matrix profiles...</h3>
              </motion.div>
            )}

            {/* EDITOR CANVAS STAGE */}
            {pipelineState === 'editor' && (
              <motion.div key="editor" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute inset-0 flex w-full h-full">
                
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 pb-32 flex flex-col items-center min-w-0">
                  <div className="w-full max-w-4xl space-y-4 md:space-y-6">
                    <input 
                      value={documentTitle} 
                      onChange={(e) => setDocumentTitle(e.target.value)} 
                      placeholder="Untitled Document"
                      className="w-full bg-transparent text-2xl md:text-3xl font-bold tracking-tight outline-none placeholder:text-zinc-300 dark:placeholder:text-zinc-800 text-zinc-900 dark:text-zinc-50 px-1" 
                    />

                    {/* TOOLBAR */}
                    <div className="sticky top-2 z-30 flex flex-wrap items-center gap-1.5 md:gap-2 bg-white dark:bg-[#1e1e22] border border-zinc-200 dark:border-zinc-800 rounded-xl p-2 shadow-lg w-full transition-colors">
                      <div className="relative shrink-0" ref={fontMenuRef}>
                        <button onClick={() => setShowFontMenu(!showFontMenu)} className="flex items-center justify-between gap-1 sm:gap-1.5 w-[100px] sm:w-[120px] px-2 sm:px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-md text-xs font-medium text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#18181c] transition-colors">
                          <span className="flex items-center gap-1.5 truncate">
                            <Type className="w-3.5 h-3.5 shrink-0 text-zinc-400" />
                            <span className="truncate">{activeFont}</span>
                          </span>
                          <ChevronDown className="w-3 h-3 shrink-0 text-zinc-500" />
                        </button>
                        <AnimatePresence>
                          {showFontMenu && (
                            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="absolute left-0 mt-2 w-44 bg-white dark:bg-[#18181c] border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-2xl p-1 z-50 flex flex-col">
                              {FONTS_LIST.map((font) => (
                                <button key={font} onClick={() => handleFontSelect(font)} className={`w-full text-left px-3 py-2 rounded-md text-xs font-medium transition-colors hover:bg-zinc-100 dark:hover:bg-white/5 ${activeFont === font ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/5' : 'text-zinc-700 dark:text-zinc-300'}`} style={{ fontFamily: font }}>{font}</button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      <div className="hidden sm:block w-px h-5 bg-zinc-200 dark:bg-zinc-800 shrink-0" />

                      <div className="flex items-center border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#18181c] rounded-md px-1 shrink-0 transition-colors">
                        <button onClick={() => setFontSize(Math.max(12, fontSize - 1))} className="p-1.5 hover:bg-zinc-200 dark:hover:bg-white/5 rounded text-zinc-500 dark:text-zinc-400 transition-colors"><Minus className="w-3.5 h-3.5" /></button>
                        <span className="px-2 text-xs font-mono font-bold text-zinc-700 dark:text-zinc-300 w-8 text-center">{fontSize}</span>
                        <button onClick={() => setFontSize(Math.min(32, fontSize + 1))} className="p-1.5 hover:bg-zinc-200 dark:hover:bg-white/5 rounded text-zinc-500 dark:text-zinc-400 transition-colors"><Plus className="w-3.5 h-3.5" /></button>
                      </div>

                      <div className="hidden md:block w-px h-5 bg-zinc-200 dark:bg-zinc-800 shrink-0" />

                      <div className="flex items-center gap-0.5 shrink-0">
                        <button onClick={() => execEditorCommand('bold')} className="p-2 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-md text-zinc-600 dark:text-zinc-300 transition-colors" title="Bold"><Bold className="w-4 h-4" /></button>
                        <button onClick={() => execEditorCommand('italic')} className="p-2 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-md text-zinc-600 dark:text-zinc-300 transition-colors" title="Italic"><Italic className="w-4 h-4" /></button>
                        <button onClick={() => execEditorCommand('underline')} className="p-2 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-md text-zinc-600 dark:text-zinc-300 transition-colors" title="Underline"><Underline className="w-4 h-4" /></button>
                        <button onClick={() => execEditorCommand('formatBlock', '<h2>')} className="p-2 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-md text-zinc-600 dark:text-zinc-300 transition-colors hidden sm:block" title="Add Header Tag"><Heading2 className="w-4 h-4" /></button>
                      </div>

                      <div className="relative shrink-0" ref={colorMenuRef}>
                        <button onClick={() => setShowColorMenu(!showColorMenu)} className="p-2 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-md text-zinc-600 dark:text-zinc-300 relative transition-colors" title="Text Color Matrix">
                          <Palette className="w-4 h-4" />
                          <span className="absolute bottom-0.5 right-1 w-1.5 h-1.5 rounded-full bg-white dark:bg-black border border-zinc-400 dark:border-zinc-500" />
                        </button>
                        <AnimatePresence>
                          {showColorMenu && (
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="absolute -left-16 sm:left-0 mt-2 p-3 bg-white dark:bg-[#1e1e22] border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl z-50 w-[240px] sm:w-[270px] space-y-2">
                              <div className="flex items-center gap-1.5 text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 tracking-wider uppercase pb-1.5 border-b border-zinc-200 dark:border-zinc-800"><Palette className="w-3 h-3" /> Default Swatches</div>
                              <div className="flex flex-col gap-1.5">
                                {COLOR_PALETTE.map((row, rIdx) => (
                                  <div key={rIdx} className="flex gap-1 sm:gap-1.5 justify-between">
                                    {row.map((color) => (
                                      <button key={color} onClick={() => handleColorSelect(color)} className="w-4 h-4 sm:w-4 sm:h-4 rounded-[3px] border border-black/20 dark:border-black/40 shadow-sm transition-transform hover:scale-125 focus:outline-none" style={{ backgroundColor: color }} title={color} />
                                    ))}
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      <div className="ml-auto pl-2 border-l border-zinc-200 dark:border-zinc-800 shrink-0 hidden sm:block">
                        <button onClick={handleCopyRawText} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all rounded-md text-xs font-semibold text-white shadow-md">
                          {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{isCopied ? 'Copied!' : 'Copy Data'}</span>
                        </button>
                      </div>
                    </div>

                    {/* EDITABLE SUMMARY INTERFACE CANVAS */}
                    <div className="border border-zinc-200 dark:border-white/10 rounded-2xl bg-white dark:bg-[#121214] shadow-xl dark:shadow-2xl overflow-hidden min-h-[500px] md:min-h-[600px] w-full flex flex-col transition-colors">
                      <div className="prose prose-zinc dark:prose-invert max-w-none 
                        prose-headings:tracking-tight prose-headings:font-bold
                        prose-h1:text-3xl prose-h1:mb-4
                        prose-h3:text-lg prose-h3:text-blue-500 dark:prose-h3:text-blue-400 prose-h3:mt-6 prose-h3:mb-2
                        prose-p:text-zinc-600 dark:prose-p:text-zinc-300 prose-p:leading-relaxed
                        prose-ul:list-disc prose-ul:pl-5 prose-li:my-1
                        prose-strong:text-zinc-900 dark:prose-strong:text-zinc-50 prose-strong:font-bold
                        prose-code:text-xs prose-code:bg-zinc-100 dark:prose-code:bg-white/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:font-mono
                        prose-blockquote:border-l-4 prose-blockquote:border-purple-500 prose-blockquote:bg-purple-500/5 prose-blockquote:px-5 prose-blockquote:py-1 prose-blockquote:rounded-r-xl prose-blockquote:my-6
                        prose-table:w-full prose-table:text-sm prose-th:py-3 prose-th:px-4 prose-th:bg-zinc-100 dark:prose-th:bg-white/5 prose-td:py-3 prose-td:px-4 prose-td:border-b prose-td:border-zinc-200 dark:prose-td:border-white/5">
                        
                        <div 
                          ref={editorRef}
                          contentEditable
                          suppressContentEditableWarning
                          className="w-full flex-1 p-6 outline-none select-text [&_font[face]]:font-[attr(face)] [&_font[color]]:color-[attr(color)]"
                          style={{ fontSize: `${fontSize}px` }} 
                        >
                          <ReactMarkdown>{documentContent}</ReactMarkdown>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

                {/* --- DESKTOP RIGHT SIDEBAR (TOOLBOX) --- */}
                <div className="hidden lg:flex w-[320px] border-l border-zinc-200 dark:border-white/5 bg-white dark:bg-[#0a0a0c] p-6 flex-col overflow-y-auto shrink-0 shadow-[-10px_0_30px_rgba(0,0,0,0.05)] transition-colors duration-300">
                  <ToolboxContent />
                </div>
              </motion.div>
            )}

            {/* STAGE 4: ACTIVE STUDY */}
            {pipelineState === 'study' && (
              <motion.div key="study" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 overflow-y-auto p-4 md:p-8 h-full w-full">
                {activeStudyTool === 'flashcards' && <FlashcardModule />}
                {activeStudyTool === 'quiz' && <QuizModule />}
                {activeStudyTool === 'mindmap' && <MindmapModule />}
                {activeStudyTool === 'tutor' && <TutorChatModule />}
                
                {['practice-paper', 'meeting-notes', 'revision-notes', 'lecture-notes', 'image-gen'].includes(activeStudyTool) && (
                  <div className="h-full flex flex-col items-center justify-center min-h-[400px]">
                    <Sparkles className="w-8 h-8 text-zinc-400 dark:text-zinc-600 mb-4 animate-pulse" />
                    <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-2 capitalize tracking-tight">{activeStudyTool.replace('-', ' ')} Tool Pipeline</h2>
                    <p className="text-sm font-medium text-zinc-500">Execution context loading parameters shortly.</p>
                  </div>
                )}
              </motion.div>
            )}

          </AnimatePresence>
        </main>
      </div>

      {/* --- MOBILE/TABLET FAB (FLOATING ACTION BUTTON) --- */}
      <AnimatePresence>
        {pipelineState === 'editor' && !isMobileToolboxOpen && (
          <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }} className="lg:hidden absolute bottom-6 right-6 z-40">
            <Button onClick={() => setIsMobileToolboxOpen(true)} className="rounded-full w-14 h-14 bg-zinc-900 dark:bg-zinc-50 hover:bg-zinc-800 dark:hover:bg-zinc-200 shadow-xl text-white dark:text-[#09090b] flex items-center justify-center p-0 transition-transform active:scale-95">
              <Plus className="w-6 h-6" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- MOBILE/TABLET BOTTOM DRAWER SHEET MODAL --- */}
      <AnimatePresence>
        {isMobileToolboxOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-zinc-900/40 dark:bg-black/70 backdrop-blur-sm" onClick={() => setIsMobileToolboxOpen(false)} />
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: "spring", bounce: 0, duration: 0.35 }} className={`relative w-full max-h-[85vh] border-t rounded-t-3xl flex flex-col overflow-hidden shadow-2xl transition-colors ${isDarkMode ? 'bg-[#0a0a0c] border-white/10' : 'bg-white border-zinc-200'}`}>
              <div className="w-full flex justify-center pt-4 pb-2 cursor-grab active:cursor-grabbing" onClick={() => setIsMobileToolboxOpen(false)}>
                <div className="w-12 h-1.5 rounded-full bg-zinc-300 dark:bg-white/20 transition-colors" />
              </div>
              <div className="p-6 overflow-y-auto flex-1">
                 <ToolboxContent />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MOBILE LEFT SIDEBAR NAVIGATION DRAWER */}
      <AnimatePresence>
        {isSidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-zinc-900/40 dark:bg-black/70 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
            <motion.div initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: "spring", bounce: 0, duration: 0.3 }} className={`relative w-[280px] sm:w-[320px] h-full border-r flex flex-col shadow-2xl transition-colors ${isDarkMode ? 'bg-[#0a0a0c] border-white/10' : 'bg-white border-zinc-200'}`}>
              <div className={`p-5 border-b ${isDarkMode ? 'border-white/5' : 'border-zinc-200'}`}>
                <Button onClick={startNewDocument} className="w-full justify-start font-semibold bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-950">
                  <FileText className="w-4 h-4 mr-2" /> New Document
                </Button>
              </div>
              <div className="flex-1 overflow-y-auto py-5">
                <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-3 px-5">Recent Projects</p>
                <div className="px-3 space-y-1">
                  {MOCK_SIDEBAR_NOTES.map(note => (
                    <button
                      key={note.id}
                      onClick={() => {
                        setActiveNoteId(note.id);
                        setDocumentTitle(note.title);
                        setDocumentContent(MOCK_AI_SUMMARY);
                        setPipelineState('editor');
                        setIsSidebarOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 rounded-xl flex flex-col transition-all active:scale-[0.98] ${activeNoteId === note.id ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 font-semibold' : 'text-zinc-700 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5'}`}
                    >
                      <span className="text-sm truncate">{note.title}</span>
                      <span className="text-[10px] opacity-70 mt-1 font-medium">{note.date}</span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}