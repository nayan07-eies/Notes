import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import ReactMarkdown from 'react-markdown';
import FlashcardModule from './FlashcardModule'; 
import QuizModule from './QuizModule';
import MindmapModule from './MindMapModule';
import TutorChatModule from './TutorChatModule';

import { 
  UploadCloud, Video, Sparkles, Layers, FileQuestion, ArrowLeft,
  Bot, FileText, Menu, Image as ImageIcon, PanelLeftClose, PanelLeft, 
  ChevronRight, Plus, Copy, Check, Bold, Italic, Underline, 
  Minus, ChevronDown, Palette, Type, Network, PenTool, LayoutTemplate,
  Globe, Sliders, Target, SidebarClose, SidebarOpen, Wand2, X
} from 'lucide-react';
import { Button } from "@/components/ui/button";

const MOCK_SIDEBAR_NOTES = [
  { id: '1', title: 'React 19 Compiler Notes', date: '2h ago' },
  { id: '2', title: 'Vector Embeddings Research', date: 'Yesterday' }
];

const FONTS_LIST = ['Clarika', 'Arial', 'Times New Roman', 'Courier New', 'Georgia', 'Verdana'];

const COLOR_PALETTE = [
  ['#4a4a4a', '#7a7a7a', '#ffffff', '#ff4d4d', '#ff9933', '#ffff33', '#99ff33', '#33ff33', '#33ff99', '#33ffff', '#3399ff', '#3333ff', '#9933ff', '#ff33ff'],
  ['#2b2b2b', '#5a5a5a', '#cccccc', '#cc0000', '#cc6600', '#cccc00', '#66cc00', '#00cc00', '#00cc66', '#00cccc', '#0066cc', '#0000cc', '#6600cc', '#cc00cc']
];

const MOCK_AI_SUMMARY = `# 📚 Node.js Basics & Architecture Tutorial

### 🔍 Brief Overview
This note covers the foundational elements of **Node.js** derived from the *Node.js Tutorial for Beginners: Learn Node in 1 Hour* video course. It explores execution frameworks, runtime differences, and how the asynchronous non-blocking engine optimizes distributed application workflows.

---

### 🚀 Key Takeaways
* **Environment Separation:** Deep understanding of how the Node runtime environment operates completely detached from standard client-side browser windows.
* **Asynchronous Scalability:** Mastering how non-blocking I/O routines bypass traditional multi-threaded platform bottlenecks.
* **Module Assembly:** Exporting and importing isolated modular logical blocks securely using structural \`module.exports\` and \`require\` methods.`;

export function DocumentWorkspace() {
  const isDarkMode = useSelector((state) => state.ui?.isDarkMode || false);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false); // Default to false for clean canvas
  const [isMobileToolboxOpen, setIsMobileToolboxOpen] = useState(false);
  const [pipelineState, setPipelineState] = useState('ingest'); 
  const [fontSize, setFontSize] = useState(15);
  const [isCopied, setIsCopied] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Advanced Optimization States
  const [targetLang, setTargetLang] = useState('en');
  const [contentLength, setContentLength] = useState('balanced');
  const [focusTheme, setFocusTheme] = useState('academic');

  // Toggles
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
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
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
      await navigator.clipboard.writeText(editorRef.current.textContent);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const processUploadedFile = (file) => {
    if (!file) return;
    setPipelineState('processing');
    setTimeout(() => {
      setDocumentTitle(file.name.split('.')[0] || 'Processed Summary');
      setDocumentContent(MOCK_AI_SUMMARY);
      setPipelineState('editor');
    }, 1200);
  };

  const handleFileChange = (e) => {
    processUploadedFile(e.target.files?.[0]);
  };

  const handleIngestData = (e) => {
    e?.preventDefault();
    if (!mediaUrl) return;
    setPipelineState('processing');
    setTimeout(() => {
      setDocumentTitle('Transcribed AI Summary');
      setDocumentContent(MOCK_AI_SUMMARY);
      setPipelineState('editor');
    }, 1200);
  };

  const handleGenerateDerivatives = (toolType) => {
    setIsMobileToolboxOpen(false);
    setPipelineState('processing');
    setTimeout(() => {
      setActiveStudyTool(toolType);
      setPipelineState('study');
    }, 1000);
  };

  const startNewDocument = () => {
    setActiveNoteId(null);
    setDocumentTitle('');
    setDocumentContent('');
    setMediaUrl('');
    setPipelineState('ingest');
    setIsSidebarOpen(false);
  };

  const ToolboxContent = () => (
    <div className="flex flex-col gap-5 w-full pb-8 select-none">
      <div>
        <h4 className="text-[10px] font-bold tracking-widest text-zinc-400 dark:text-zinc-500 uppercase mb-2.5 px-1">Study Engine</h4>
        <div className="grid grid-cols-2 gap-2 w-full">
          <button onClick={() => handleGenerateDerivatives('flashcards')} className="flex flex-col items-center justify-center p-3.5 gap-2 rounded-xl bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/5 hover:bg-blue-50 hover:border-blue-500/30 dark:hover:bg-blue-500/5 transition-all">
            <Layers className="w-4 h-4 text-blue-500" />
            <span className="text-[11px] font-bold text-zinc-600 dark:text-zinc-300">Flashcards</span>
          </button>
          <button onClick={() => handleGenerateDerivatives('quiz')} className="flex flex-col items-center justify-center p-3.5 gap-2 rounded-xl bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/5 hover:bg-purple-50 hover:border-purple-500/30 dark:hover:bg-purple-500/5 transition-all">
            <FileQuestion className="w-4 h-4 text-purple-500" />
            <span className="text-[11px] font-bold text-zinc-600 dark:text-zinc-300">Quizzes</span>
          </button>
          <button onClick={() => handleGenerateDerivatives('mindmap')} className="flex flex-col items-center justify-center p-3.5 gap-2 rounded-xl bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/5 hover:bg-emerald-50 hover:border-emerald-500/30 dark:hover:bg-emerald-500/5 transition-all">
            <Network className="w-4 h-4 text-emerald-500" />
            <span className="text-[11px] font-bold text-zinc-600 dark:text-zinc-300">Mind Map</span>
          </button>
          <button onClick={() => handleGenerateDerivatives('practice-paper')} className="flex flex-col items-center justify-center p-3.5 gap-2 rounded-xl bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/5 hover:bg-orange-50 hover:border-orange-500/30 dark:hover:bg-orange-500/5 transition-all">
            <PenTool className="w-4 h-4 text-orange-500" />
            <span className="text-[11px] font-bold text-zinc-600 dark:text-zinc-300">Practice</span>
          </button>
          <button onClick={() => handleGenerateDerivatives('tutor')} className="flex items-center justify-center p-3 gap-2 rounded-xl bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/5 hover:bg-blue-50 hover:border-indigo-500/30 dark:hover:bg-indigo-500/5 transition-all col-span-2 w-full">
            <Bot className="w-4 h-4 text-indigo-500" />
            <span className="text-[11px] font-bold text-zinc-600 dark:text-zinc-300">AI Tutor Q&A</span>
          </button>
        </div>
      </div>
      <div>
        <h4 className="text-[10px] font-bold tracking-widest text-zinc-400 dark:text-zinc-500 uppercase mb-2 px-1">Reformat Document</h4>
        <div className="space-y-1">
          {[{ id: 'meeting-notes', label: 'Meeting Minutes' }, { id: 'revision-notes', label: 'Revision Summary' },{ id: 'lecture-notes', label: 'Lecture Notes' }].map((template) => (
            <button key={template.id} onClick={() => handleGenerateDerivatives(template.id)} className="w-full flex items-center px-2.5 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors text-left text-xs font-semibold text-zinc-600 dark:text-zinc-300">
              <LayoutTemplate className="w-3.5 h-3.5 text-zinc-400 mr-2" />
              {template.label}
            </button>
          ))}
        </div>
      </div>
      <div>
        <h4 className="text-[10px] font-bold tracking-widest text-zinc-400 dark:text-zinc-500 uppercase mb-2 px-1">Media</h4>
        <button onClick={() => handleGenerateDerivatives('image-gen')} className="w-full flex items-center px-3 py-2 rounded-lg border border-zinc-200 dark:border-white/5 bg-zinc-50 dark:bg-white/[0.01] hover:bg-zinc-100 dark:hover:bg-white/[0.04] transition-colors text-xs font-semibold text-zinc-600 dark:text-zinc-300">
          <ImageIcon className="w-3.5 h-3.5 text-pink-500 mr-2.5" />
          Generate Diagrams
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen w-full bg-zinc-50 dark:bg-[#09090b] text-zinc-900 dark:text-zinc-50 overflow-hidden relative font-sans antialiased transition-colors duration-300">
      
      {/* DESKTOP LEFT SIDEBAR */}
      <div 
        className="hidden lg:flex flex-col border-r border-zinc-200 dark:border-white/5 bg-white dark:bg-[#0a0a0c] shrink-0 overflow-hidden transition-all duration-300"
        style={{ width: isSidebarOpen ? '260px' : '0px', borderRightWidth: isSidebarOpen ? '1px' : '0px' }}
      >
        <div className="p-4 border-b border-zinc-200 dark:border-white/5 w-[260px]">
          <Button onClick={startNewDocument} variant="outline" className="w-full justify-start text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/5 font-bold">
            <FileText className="w-4 h-4 mr-2" /> New Document
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto py-4 w-[260px]">
          <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 tracking-wider mb-2 px-4 uppercase">Recent</p>
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
                className={`w-full text-left px-3 py-2 rounded-lg flex flex-col transition-all hover:bg-zinc-100 dark:hover:bg-white/5 ${activeNoteId === note.id ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold' : 'text-zinc-600 dark:text-zinc-400 font-medium'}`}
              >
                <span className="text-sm truncate">{note.title}</span>
                <span className="text-[10px] opacity-60 mt-0.5">{note.date}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* MAIN CANVAS */}
      <div className="flex-1 flex flex-col relative min-w-0 h-full w-full">
        
        <header className="flex items-center justify-between px-4 h-14 border-b shrink-0 z-20 bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-md border-zinc-200 dark:border-white/5">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="hidden lg:flex text-zinc-500 h-8 w-8 hover:bg-zinc-100 dark:hover:bg-white/5">
              {isSidebarOpen ? <PanelLeftClose className="w-4.5 h-4.5" /> : <PanelLeft className="w-4.5 h-4.5" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(true)} className="lg:hidden text-zinc-500 h-8 w-8 hover:bg-zinc-100 dark:hover:bg-white/5">
              <Menu className="w-5 h-5" />
            </Button>

            <div className="flex items-center gap-2 text-sm text-zinc-500">
              <span className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-zinc-100 dark:bg-white/5 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-white/5 font-bold text-xs">
                <Sparkles className="w-3.5 h-3.5 text-blue-500" /> StudyTime
              </span>
              {pipelineState !== 'ingest' && (
                <>
                  <ChevronRight className="w-3.5 h-3.5 hidden sm:block shrink-0 text-zinc-400" />
                  <span className="text-zinc-800 dark:text-zinc-200 font-bold truncate hidden sm:block max-w-[200px]">{documentTitle || 'Untitled'}</span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {pipelineState === 'editor' && (
              <Button 
                onClick={() => setIsRightSidebarOpen(!isRightSidebarOpen)} 
                variant="ghost"
                size="icon"
                className="hidden lg:flex text-zinc-500 h-8 w-8 hover:bg-zinc-100 dark:hover:bg-white/5"
                title={isRightSidebarOpen ? "Collapse Tools" : "Expand Tools"}
              >
                {isRightSidebarOpen ? <SidebarClose className="w-4.5 h-4.5" /> : <SidebarOpen className="w-4.5 h-4.5" />}
              </Button>
            )}
            {pipelineState === 'study' && (
              <Button variant="outline" size="sm" onClick={() => setPipelineState('editor')} className="text-xs h-8 font-bold gap-1.5 px-3 rounded-lg shadow-xs">
                <ArrowLeft className="w-3.5 h-3.5" /> <span>Back to Editor</span>
              </Button>
            )}
          </div>
        </header>

        {/* BROADCAST BANNER */}
        {localStorage.getItem('global_system_announcement') && (
          <div className="w-full bg-blue-600 text-white px-4 py-2 text-xs font-bold flex items-center justify-between shadow-md select-none">
            <div className="flex items-center gap-2 truncate">
              <span className="bg-blue-800 px-1.5 py-0.5 rounded text-[9px] uppercase tracking-wider animate-pulse">System Broadcast</span>
              <span className="truncate">{localStorage.getItem('global_system_announcement')}</span>
            </div>
            <button 
              onClick={() => {
                localStorage.removeItem('global_system_announcement');
                window.location.reload();
              }} 
              className="hover:opacity-80 text-[10px] font-black uppercase tracking-wider ml-4 shrink-0"
            >
              Dismiss
            </button>
          </div>
        )}

        <main className="flex-1 relative flex overflow-hidden w-full">
          <AnimatePresence mode="wait">
            
            {/* INGEST MODE */}
            {pipelineState === 'ingest' && (
              <motion.div key="ingest" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.99 }} className="absolute inset-0 flex items-center justify-center p-4 overflow-y-auto w-full">
                <div className="w-full max-w-4xl bg-white dark:bg-[#0a0a0c] border border-zinc-200 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl grid md:grid-cols-5 gap-6 relative overflow-hidden transition-colors">
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-60" />
                  
                  <div className="md:col-span-3 space-y-4">
                    <div>
                      <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-blue-500" /> Initialize Knowledge
                      </h2>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Provide a remote stream link or source file to compile your workspace.</p>
                    </div>
                    
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Video className="h-4 w-4 text-zinc-400" />
                      </div>
                      <input 
                        type="text" 
                        value={mediaUrl} 
                        onChange={(e) => setMediaUrl(e.target.value)} 
                        placeholder="Paste YouTube URL link here..." 
                        className="w-full bg-zinc-50 dark:bg-[#09090b] border border-zinc-200 dark:border-white/10 rounded-xl py-3 pl-10 pr-24 text-xs font-medium" 
                      />
                      <div className="absolute inset-y-0 right-1.5 flex items-center">
                        <Button onClick={handleIngestData} disabled={!mediaUrl} size="sm" className="h-7 text-[10px] font-bold rounded-lg">
                          Extract
                        </Button>
                      </div>
                    </div>

                    <div className="relative flex items-center py-0.5">
                      <div className="flex-grow border-t border-zinc-200 dark:border-white/5" />
                      <span className="flex-shrink-0 mx-3 text-[9px] font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest">Or</span>
                      <div className="flex-grow border-t border-zinc-200 dark:border-white/5" />
                    </div>

                    <div>
                      <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} accept=".pdf,.png,.jpg,.jpeg,.mp3,.txt" />
                      <div 
                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={(e) => { e.preventDefault(); setIsDragging(false); processUploadedFile(e.dataTransfer.files?.[0]); }}
                        onClick={() => fileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all ${isDragging ? 'border-blue-500 bg-blue-500/5' : 'border-zinc-200 dark:border-white/10 hover:bg-zinc-50/50'}`}
                      >
                        <UploadCloud className="w-7 h-7 mb-2 text-zinc-400" />
                        <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">Click or Drag asset file here</span>
                        <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5">Supports PDF, Audio, Text logs, or Images</p>
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-2 border-t md:border-t-0 md:border-l border-zinc-200 dark:border-white/5 pt-4 md:pt-0 md:pl-5 space-y-4">
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 flex items-center gap-1">
                        <Sliders className="w-3.5 h-3.5 text-zinc-500" /> Tuning Controls
                      </h3>
                    </div>
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide flex items-center gap-1"><Globe className="w-3 h-3" /> Output Language</label>
                        <select value={targetLang} onChange={(e) => setTargetLang(e.target.value)} className="w-full text-xs bg-zinc-50 dark:bg-[#09090b] border border-zinc-200 dark:border-white/10 rounded-lg p-2 outline-none font-medium">
                          <option value="en">English Standard</option>
                          <option value="es">Español</option>
                          <option value="fr">Français</option>
                          <option value="hi">हिन्दी</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide flex items-center gap-1"><LayoutTemplate className="w-3 h-3" /> Summary Footprint</label>
                        <div className="grid grid-cols-3 gap-1 bg-zinc-100 dark:bg-[#09090b] p-1 rounded-lg border border-zinc-200 dark:border-white/5">
                          {['concise', 'balanced', 'deep-dive'].map((mode) => (
                            <button key={mode} onClick={() => setContentLength(mode)} className={`text-[9px] capitalize font-bold p-1 rounded transition-all ${contentLength === mode ? 'bg-white dark:bg-[#1a1a1e] text-blue-500 shadow-xs' : 'text-zinc-400'}`}>
                              {mode.replace('-', ' ')}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide flex items-center gap-1"><Target className="w-3 h-3" /> Strategic Focus</label>
                        <select value={focusTheme} onChange={(e) => setFocusTheme(e.target.value)} className="w-full text-xs bg-zinc-50 dark:bg-[#09090b] border border-zinc-200 dark:border-white/10 rounded-lg p-2 outline-none font-medium">
                          <option value="academic">Conceptual Logic</option>
                          <option value="exam">Exam Preparation Log</option>
                          <option value="operational">Action Item Bullet Lists</option>
                        </select>
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
                <h3 className="text-xs font-bold text-zinc-500 tracking-wide animate-pulse">Compiling model parameters...</h3>
              </motion.div>
            )}

            {/* EDITOR CANVAS STAGE */}
            {pipelineState === 'editor' && (
              <motion.div key="editor" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 flex w-full h-full">
                
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-32 flex flex-col items-center min-w-0 transition-all duration-300 w-full">
                  <div className="w-full max-w-5xl space-y-4">
                    <input 
                      value={documentTitle} 
                      onChange={(e) => setDocumentTitle(e.target.value)} 
                      placeholder="Untitled Document"
                      className="w-full bg-transparent text-2xl font-bold tracking-tight outline-none text-zinc-900 dark:text-zinc-50 px-1" 
                    />

                    {/* TOOLBAR */}
                    <div className="sticky top-2 z-30 flex flex-wrap items-center gap-2 bg-white dark:bg-[#1e1e22] border border-zinc-200 dark:border-zinc-800 rounded-xl p-1.5 shadow-md w-full">
                      <div className="relative shrink-0" ref={fontMenuRef}>
                        <button onClick={() => setShowFontMenu(!showFontMenu)} className="flex items-center justify-between gap-1 w-[110px] px-2.5 py-1.5 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-md text-xs font-bold border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#18181c]">
                          <span className="flex items-center gap-1.5 truncate">
                            <Type className="w-3.5 h-3.5 shrink-0 text-zinc-400" />
                            <span className="truncate">{activeFont}</span>
                          </span>
                          <ChevronDown className="w-3 h-3 text-zinc-500" />
                        </button>
                        <AnimatePresence>
                          {showFontMenu && (
                            <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }} className="absolute left-0 mt-1 w-40 bg-white dark:bg-[#18181c] border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-xl p-1 z-50 flex flex-col">
                              {FONTS_LIST.map((font) => (
                                <button key={font} onClick={() => handleFontSelect(font)} className="w-full text-left px-2 py-1.5 rounded-md text-xs font-semibold" style={{ fontFamily: font }}>{font}</button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      <div className="flex items-center border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#18181c] rounded-md px-0.5 shrink-0">
                        <button onClick={() => setFontSize(Math.max(12, fontSize - 1))} className="p-1 hover:bg-zinc-200 rounded"><Minus className="w-3.5 h-3.5" /></button>
                        <span className="px-1.5 text-xs font-bold w-6 text-center">{fontSize}</span>
                        <button onClick={() => setFontSize(Math.min(32, fontSize + 1))} className="p-1 hover:bg-zinc-200 rounded"><Plus className="w-3.5 h-3.5" /></button>
                      </div>

                      <div className="flex items-center gap-0.5 shrink-0">
                        <button onClick={() => execEditorCommand('bold')} className="p-2 hover:bg-zinc-100 rounded-md"><Bold className="w-3.5 h-3.5" /></button>
                        <button onClick={() => execEditorCommand('italic')} className="p-2 hover:bg-zinc-100 rounded-md"><Italic className="w-3.5 h-3.5" /></button>
                        <button onClick={() => execEditorCommand('underline')} className="p-2 hover:bg-zinc-100 rounded-md"><Underline className="w-3.5 h-3.5" /></button>
                      </div>

                      <div className="relative shrink-0" ref={colorMenuRef}>
                        <button onClick={() => setShowColorMenu(!showColorMenu)} className="p-2 hover:bg-zinc-100 rounded-md"><Palette className="w-3.5 h-3.5" /></button>
                        <AnimatePresence>
                          {showColorMenu && (
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="absolute left-0 mt-1 p-2.5 bg-white dark:bg-[#1e1e22] border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl z-50 w-[220px] flex flex-col gap-1">
                              {COLOR_PALETTE.map((row, rIdx) => (
                                <div key={rIdx} className="flex gap-1 justify-between">
                                  {row.slice(0, 10).map((color) => (
                                    <button key={color} onClick={() => handleColorSelect(color)} className="w-3.5 h-3.5 rounded border" style={{ backgroundColor: color }} />
                                  ))}
                                </div>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      <div className="ml-auto pl-2 border-l border-zinc-200 dark:border-zinc-800 shrink-0">
                        <button onClick={handleCopyRawText} className="flex items-center justify-center gap-1.5 px-2.5 py-1 bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all rounded-md text-xs font-bold text-white shadow-xs h-8">
                          {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          <span className="hidden sm:inline">{isCopied ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    </div>

                    {/* EDITABLE SUMMARY AREA CONTAINER */}
                    <div className="border border-zinc-200 dark:border-white/10 rounded-2xl bg-white dark:bg-[#121214] shadow-md overflow-hidden min-h-[520px] w-full flex flex-col">
                      <div className="prose prose-zinc dark:prose-invert max-w-none text-sm p-6
                        prose-headings:tracking-tight prose-headings:font-bold
                        prose-p:text-zinc-600 dark:prose-p:text-zinc-300 prose-p:leading-relaxed
                        prose-blockquote:border-l-4 prose-blockquote:border-purple-500 prose-blockquote:bg-purple-500/5 prose-blockquote:px-4 prose-blockquote:py-0.5 prose-blockquote:rounded-r-lg
                        prose-table:w-full prose-table:text-sm prose-th:py-2.5 prose-th:px-3 prose-th:bg-zinc-100 dark:prose-th:bg-white/5 prose-td:py-2.5 prose-td:px-3 prose-td:border-b dark:prose-td:border-white/5">
                        <div 
                          ref={editorRef}
                          contentEditable
                          suppressContentEditableWarning
                          className="w-full flex-1 outline-none select-text min-h-[460px]"
                          style={{ fontSize: `${fontSize}px` }} 
                        >
                          <ReactMarkdown>{documentContent || MOCK_AI_SUMMARY}</ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* DESKTOP RIGHT TOOLBOX PANEL */}
                <AnimatePresence>
                  {isRightSidebarOpen && (
                    <motion.div 
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: 320, opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="hidden lg:flex w-[320px] border-l border-zinc-200 dark:border-white/5 bg-white dark:bg-[#0a0a0c] p-6 flex-col overflow-y-auto shrink-0 shadow-xs"
                    >
                      <ToolboxContent />
                    </motion.div>
                  )}
                </AnimatePresence>

              </motion.div>
            )}

            {/* STUDY CONTEXTS */}
            {pipelineState === 'study' && (
              <motion.div key="study" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 overflow-y-auto p-4 md:p-6 h-full w-full">
                {activeStudyTool === 'flashcards' && <FlashcardModule />}
                {activeStudyTool === 'quiz' && <QuizModule />}
                {activeStudyTool === 'mindmap' && <MindmapModule />}
                {activeStudyTool === 'tutor' && <TutorChatModule />}
                
                {['practice-paper', 'meeting-notes', 'revision-notes', 'lecture-notes', 'image-gen'].includes(activeStudyTool) && (
                  <div className="h-full flex flex-col items-center justify-center min-h-[400px]">
                    <Sparkles className="w-6 h-6 text-zinc-400 animate-pulse mb-3" />
                    <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-50 mb-1 capitalize tracking-tight">{activeStudyTool.replace('-', ' ')} Tool Pipeline</h2>
                    <p className="text-xs font-semibold text-zinc-400">Execution context loading parameters shortly.</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* 🌟 FLOATING DOCK (AUTO-HIDES ON DESKTOP WHEN RIGHT SIDEBAR IS OPEN) */}
      <AnimatePresence>
        {pipelineState === 'editor' && !isRightSidebarOpen && (
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ type: 'spring', damping: 22, stiffness: 320 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-white/90 dark:bg-[#121214]/90 backdrop-blur-xl border border-zinc-200/80 dark:border-white/10 rounded-full p-1.5 shadow-xl flex items-center gap-1.5"
          >
            <button 
              onClick={() => handleGenerateDerivatives('flashcards')} 
              className="p-2 sm:px-3 sm:py-2 rounded-full hover:bg-blue-50 dark:hover:bg-blue-500/10 text-blue-500 transition-all flex items-center gap-1.5 text-xs font-bold group"
              title="Flashcards"
            >
              <Layers className="w-4 h-4" />
              <span className="hidden md:inline group-hover:inline text-zinc-700 dark:text-zinc-300">Flashcards</span>
            </button>

            <button 
              onClick={() => handleGenerateDerivatives('quiz')} 
              className="p-2 sm:px-3 sm:py-2 rounded-full hover:bg-purple-50 dark:hover:bg-purple-500/10 text-purple-500 transition-all flex items-center gap-1.5 text-xs font-bold group"
              title="Quizzes"
            >
              <FileQuestion className="w-4 h-4" />
              <span className="hidden md:inline group-hover:inline text-zinc-700 dark:text-zinc-300">Quizzes</span>
            </button>

            <button 
              onClick={() => handleGenerateDerivatives('mindmap')} 
              className="p-2 sm:px-3 sm:py-2 rounded-full hover:bg-emerald-50 dark:hover:bg-emerald-500/10 text-emerald-500 transition-all flex items-center gap-1.5 text-xs font-bold group"
              title="Mind Map"
            >
              <Network className="w-4 h-4" />
              <span className="hidden md:inline group-hover:inline text-zinc-700 dark:text-zinc-300">Mind Map</span>
            </button>

            <button 
              onClick={() => handleGenerateDerivatives('tutor')} 
              className="p-2 sm:px-3 sm:py-2 rounded-full hover:bg-indigo-50 dark:hover:bg-indigo-500/10 text-indigo-500 transition-all flex items-center gap-1.5 text-xs font-bold group"
              title="AI Tutor"
            >
              <Bot className="w-4 h-4" />
              <span className="hidden md:inline group-hover:inline text-zinc-700 dark:text-zinc-300">AI Tutor</span>
            </button>

            <div className="w-px h-5 bg-zinc-200 dark:bg-white/10 mx-0.5" />

            <button 
              onClick={() => {
                if (window.innerWidth >= 1024) {
                  setIsRightSidebarOpen(true);
                } else {
                  setIsMobileToolboxOpen(true);
                }
              }} 
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-600 dark:bg-blue-500/10 dark:border-blue-500/20 dark:text-blue-400 font-bold text-xs hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-all shadow-xs"
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>Tools</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MOBILE TOOLBOX DRAWER */}
      <AnimatePresence>
        {isMobileToolboxOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-zinc-900/40 dark:bg-black/70 backdrop-blur-xs" onClick={() => setIsMobileToolboxOpen(false)} />
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: "spring", bounce: 0, duration: 0.3 }} className={`relative w-full max-h-[80vh] border-t rounded-t-2xl flex flex-col overflow-hidden shadow-xl ${isDarkMode ? 'bg-[#0a0a0c] border-white/10' : 'bg-white border-zinc-200'}`}>
              <div className="w-full flex justify-between items-center px-5 pt-4 pb-2 border-b border-zinc-200 dark:border-white/5">
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Study Tools</span>
                <button onClick={() => setIsMobileToolboxOpen(false)} className="p-1 rounded-full text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-5 overflow-y-auto flex-1">
                 <ToolboxContent />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MOBILE LEFT SIDEBAR DRAWER */}
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