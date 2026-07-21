import React, { useState, useRef } from 'react';
import { 
  FileText, Image as ImageIcon, Mic, Video, Loader2, 
  Users, GraduationCap, BookOpen, Sparkles, X 
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from "@/components/ui/button";

const TEMPLATES = [
  { id: 'standard', label: 'Standard', icon: FileText },
  { id: 'meeting', label: 'Meeting Minutes', icon: Users },
  { id: 'lecture', label: 'Lecture Notes', icon: GraduationCap },
  { id: 'revision', label: 'Revision / Study', icon: BookOpen },
];

export function MediaUploadModal({ isOpen, onClose, onUploadSuccess }) {
  const [activeTab, setActiveTab] = useState('file');
  const [selectedTemplate, setSelectedTemplate] = useState('standard');
  const [file, setFile] = useState(null);
  const [ytLink, setYtLink] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleProcess = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate backend ingestion framework sequence
    setTimeout(() => {
      setIsProcessing(false);
      if (activeTab === 'file' && file) {
        if (onUploadSuccess) onUploadSuccess(file.name.split('.')[0], selectedTemplate);
      } else if (activeTab === 'youtube' && ytLink) {
        if (onUploadSuccess) onUploadSuccess('Transcribed AI Video Summary', selectedTemplate);
      }
      setFile(null);
      setYtLink('');
      onClose();
    }, 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isProcessing && onClose()}>
      <DialogContent className="sm:max-w-[500px] border border-zinc-200 dark:border-white/10 bg-white dark:bg-[#0a0a0c] text-zinc-900 dark:text-zinc-50 rounded-2xl shadow-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold tracking-tight">
            <Sparkles className="h-5 w-5 text-blue-500" />
            Import Context to AI
          </DialogTitle>
          <DialogDescription className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Select a processing template, then upload your media to instantly generate structured knowledge assets.
          </DialogDescription>
        </DialogHeader>

        {/* AI CONTEXT TEMPLATE SELECTOR */}
        <div className="py-2 space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            AI Processing Prompt Template
          </label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {TEMPLATES.map((tmpl) => {
              const Icon = tmpl.icon;
              const isActive = selectedTemplate === tmpl.id;
              return (
                <button
                  type="button"
                  key={tmpl.id}
                  onClick={() => setSelectedTemplate(tmpl.id)}
                  disabled={isProcessing}
                  className={`flex flex-col items-center justify-center gap-2 rounded-xl border p-3 text-xs font-semibold transition-all duration-200 ${
                    isActive 
                      ? 'border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400 shadow-sm' 
                      : 'border-zinc-200 dark:border-white/5 bg-zinc-50 dark:bg-black/20 text-zinc-500 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-white/10'
                  } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Icon className={`h-5 w-5 ${isActive ? 'text-blue-500' : 'text-zinc-400'}`} />
                  <span className="text-center text-[10px] leading-tight">{tmpl.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-2">
          <TabsList className="grid w-full grid-cols-2 bg-zinc-100 dark:bg-white/5 rounded-xl p-1">
            <TabsTrigger value="file" disabled={isProcessing} className="rounded-lg text-xs font-semibold py-2 transition-all">Local File</TabsTrigger>
            <TabsTrigger value="youtube" disabled={isProcessing} className="rounded-lg text-xs font-semibold py-2 transition-all">YouTube Link</TabsTrigger>
          </TabsList>

          {/* FILE UPLOAD TAB */}
          <TabsContent value="file" className="mt-4 outline-none">
            <div 
              onClick={() => !isProcessing && fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300
                ${file ? 'border-blue-500 bg-blue-500/5' : 'border-zinc-200 dark:border-white/10 bg-zinc-50/50 dark:bg-white/[0.005] hover:bg-zinc-100/70 dark:hover:bg-white/[0.02]'}
                ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="audio/*,application/pdf,image/*" 
              />
              
              {file ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="p-3 bg-blue-500/10 text-blue-500 rounded-full">
                    {file.type.includes('audio') ? <Mic className="h-6 w-6" /> : 
                     file.type.includes('pdf') ? <FileText className="h-6 w-6" /> : 
                     <ImageIcon className="h-6 w-6" />}
                  </div>
                  <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-50 truncate max-w-[240px]">{file.name}</span>
                  <span className="text-xs text-zinc-400">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                  <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setFile(null); }} className="mt-2 h-8 text-xs text-red-500 hover:text-red-600 hover:bg-red-500/5 rounded-xl">
                    Remove File
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-zinc-500 dark:text-zinc-400">
                  <div className="p-3 bg-zinc-100 dark:bg-white/5 rounded-full mb-1">
                    <UploadCloud className="h-6 w-6 text-zinc-400" />
                  </div>
                  <span className="font-semibold text-sm text-zinc-800 dark:text-zinc-200">Click to browse or drag and drop</span>
                  <span className="text-xs text-zinc-400">Supports secure parsing on Audio, PDF, and Images</span>
                </div>
              )}
            </div>
          </TabsContent>

          {/* YOUTUBE LINK EXTRACTION TAB */}
          <TabsContent value="youtube" className="mt-4 space-y-4 outline-none">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Video Context URL</label>
              <div className="relative">
                <Video className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 dark:text-zinc-600" />
                <Input 
                  value={ytLink}
                  onChange={(e) => setYtLink(e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                  className="pl-10 h-11 rounded-xl bg-zinc-50 dark:bg-black/50 border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-400 dark:placeholder:text-zinc-700 focus-visible:ring-blue-500/50"
                  disabled={isProcessing}
                />
              </div>
              <p className="text-xs text-zinc-400 dark:text-zinc-500 leading-relaxed">
                Note AI will safely extract the remote textual context and compile it cleanly into your workspace database structures.
              </p>
            </div>
          </TabsContent>
        </Tabs>

        {/* CONTROLLER ACTION BUTTON */}
        <Button 
          className="w-full h-11 font-bold rounded-xl shadow-md mt-4 transition-all bg-zinc-900 dark:bg-zinc-50 text-white dark:text-[#09090b] hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-40" 
          onClick={handleProcess}
          disabled={isProcessing || (activeTab === 'file' && !file) || (activeTab === 'youtube' && !ytLink)}
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Synthesizing Note Assets...
            </>
          ) : (
            'Generate Context'
          )}
        </Button>
      </DialogContent>
    </Dialog>
  );
}