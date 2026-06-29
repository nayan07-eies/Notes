import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  UploadCloud, 
  Link as LinkIcon, 
  Youtube, 
  FileText, 
  FileAudio, 
  FileVideo,
  CheckCircle2,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const TABS = [
  { id: 'local', label: 'Local File', icon: UploadCloud },
  { id: 'youtube', label: 'YouTube Link', icon: Youtube },
];

export default function MediaUploadModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('local');
  const [isDragging, setIsDragging] = useState(false);
  
  // 'idle' | 'uploading' | 'success'
  const [uploadState, setUploadState] = useState('idle');
  const [progress, setProgress] = useState(0);
  const [activeFile, setActiveFile] = useState(null);
  
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const fileInputRef = useRef(null);

  // Reset modal state when closed
  const resetState = () => {
    setUploadState('idle');
    setProgress(0);
    setActiveFile(null);
    setYoutubeUrl('');
    setActiveTab('local');
  };

  const handleClose = () => {
    onClose();
    setTimeout(resetState, 300); // Wait for exit animation
  };

  const simulateUpload = (fileName, fileType) => {
    setActiveFile({ name: fileName, type: fileType });
    setUploadState('uploading');
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploadState('success');
          // Auto close after showing success for 1.5s
          setTimeout(() => {
            handleClose();
          }, 1500);
          return 100;
        }
        // Random increment to feel like real network traffic
        return Math.min(prev + Math.floor(Math.random() * 20) + 5, 100);
      });
    }, 250);
  };

  // Drag & Drop Handlers
  const onDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const onDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };
  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) simulateUpload(files[0].name, 'document');
  };

  const onFileSelect = (e) => {
    const files = e.target.files;
    if (files.length > 0) simulateUpload(files[0].name, 'document');
  };

  const handleYoutubeExtract = () => {
    if (!youtubeUrl) return;
    simulateUpload('YouTube Transcript Extraction', 'video');
  };

  // Helper to render correct icon based on file type
  const renderFileIcon = () => {
    if (activeFile?.type === 'video') return <Youtube className="w-8 h-8 text-red-400" />;
    if (activeFile?.type === 'audio') return <FileAudio className="w-8 h-8 text-yellow-400" />;
    return <FileText className="w-8 h-8 text-blue-400" />;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Ambient Blur Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={uploadState !== 'uploading' ? handleClose : undefined}
            className="absolute inset-0 bg-black/60 backdrop-blur-md cursor-pointer"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
            className="relative w-full max-w-lg bg-zinc-950 border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
              <div className="flex items-center gap-2 text-zinc-100">
                <Sparkles className="w-5 h-5 text-blue-400" />
                <h2 className="text-lg font-semibold tracking-tight">Import Context</h2>
              </div>
              <button 
                onClick={handleClose}
                disabled={uploadState === 'uploading'}
                className="p-2 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {uploadState === 'idle' ? (
                <motion.div
                  key="input-stage"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex flex-col gap-6"
                >
                  {/* Tabs */}
                  <div className="flex items-center gap-2 p-1.5 rounded-xl bg-white/5 border border-white/5">
                    {TABS.map((tab) => {
                      const isActive = activeTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`relative flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium transition-colors rounded-lg ${
                            isActive ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'
                          }`}
                        >
                          {isActive && (
                            <motion.div
                              layoutId="uploadModalTab"
                              className="absolute inset-0 bg-white/10 border border-white/10 rounded-lg shadow-sm"
                              transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                          )}
                          <tab.icon className="w-4 h-4 relative z-10" />
                          <span className="relative z-10">{tab.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Tab Content */}
                  <div className="min-h-[200px]">
                    {activeTab === 'local' ? (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        onDragOver={onDragOver}
                        onDragLeave={onDragLeave}
                        onDrop={onDrop}
                        className={`relative group flex flex-col items-center justify-center h-[220px] rounded-2xl border-2 border-dashed transition-all duration-300 ${
                          isDragging 
                            ? 'border-blue-500 bg-blue-500/10' 
                            : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'
                        }`}
                      >
                        <input 
                          type="file" 
                          className="hidden" 
                          ref={fileInputRef} 
                          onChange={onFileSelect}
                          accept=".pdf,.doc,.docx,.txt,.mp3,.mp4"
                        />
                        <div className="p-4 rounded-full bg-white/5 mb-4 group-hover:scale-110 group-hover:bg-blue-500/10 transition-all duration-300">
                          <UploadCloud className={`w-8 h-8 ${isDragging ? 'text-blue-400' : 'text-zinc-400 group-hover:text-blue-400'}`} />
                        </div>
                        <p className="text-sm font-medium text-zinc-200 mb-1">
                          Click or drag file to upload
                        </p>
                        <p className="text-xs text-zinc-500">
                          PDF, Word, Audio, or Video (Max 50MB)
                        </p>
                        
                        {/* Invisible clickable overlay */}
                        <div 
                          className="absolute inset-0 cursor-pointer" 
                          onClick={() => fileInputRef.current?.click()} 
                        />
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col gap-4 h-[220px] justify-center"
                      >
                        <div className="space-y-1">
                          <label className="text-sm font-medium text-zinc-300">YouTube URL</label>
                          <div className="relative group/input">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <LinkIcon className="h-5 w-5 text-zinc-500 group-focus-within/input:text-red-400 transition-colors" />
                            </div>
                            <input
                              type="text"
                              value={youtubeUrl}
                              onChange={(e) => setYoutubeUrl(e.target.value)}
                              placeholder="https://youtube.com/watch?v=..."
                              className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-transparent transition-all"
                            />
                          </div>
                        </div>
                        <Button
                          onClick={handleYoutubeExtract}
                          disabled={!youtubeUrl}
                          className="w-full h-11 bg-white text-zinc-950 hover:bg-zinc-200 font-semibold rounded-xl"
                        >
                          Extract Context
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ) : (
                // Uploading / Success State
                <motion.div
                  key="upload-stage"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center h-[300px] text-center"
                >
                  <div className="relative mb-6">
                    {uploadState === 'success' ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", bounce: 0.5 }}
                        className="p-4 rounded-full bg-emerald-500/10"
                      >
                        <CheckCircle2 className="w-12 h-12 text-emerald-400" />
                      </motion.div>
                    ) : (
                      <div className="relative flex items-center justify-center w-24 h-24">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle cx="48" cy="48" r="45" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-white/10" />
                          <motion.circle
                            cx="48" cy="48" r="45"
                            stroke="currentColor" strokeWidth="4" fill="transparent"
                            strokeDasharray={283}
                            strokeDashoffset={283 - (283 * progress) / 100}
                            className="text-blue-500 transition-all duration-300 ease-out"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          {renderFileIcon()}
                        </div>
                      </div>
                    )}
                  </div>

                  <h3 className="text-xl font-semibold text-zinc-100 mb-2">
                    {uploadState === 'success' ? 'Ingestion Complete' : 'Processing Document...'}
                  </h3>
                  
                  <p className="text-sm text-zinc-400 max-w-[250px] truncate mb-6">
                    {activeFile?.name}
                  </p>

                  {uploadState === 'uploading' && (
                    <div className="w-full max-w-[200px] space-y-2">
                      <div className="flex justify-between text-xs font-medium text-zinc-500">
                        <span>Uploading & Parsing</span>
                        <span>{progress}%</span>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}