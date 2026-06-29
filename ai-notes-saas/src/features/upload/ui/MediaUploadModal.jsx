import React, { useState, useRef } from 'react';
import { useUploadMedia, useImportYoutube } from '@/entities/note/model/queries';
import { 
  FileText, Image as ImageIcon, Mic, Video, Loader2, 
  Users, GraduationCap, BookOpen, Sparkles 
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const TEMPLATES = [
  { id: 'standard', label: 'Standard', icon: FileText },
  { id: 'meeting', label: 'Meeting Minutes', icon: Users },
  { id: 'lecture', label: 'Lecture Notes', icon: GraduationCap },
  { id: 'revision', label: 'Revision / Study', icon: BookOpen },
];

export function MediaUploadModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('file');
  const [selectedTemplate, setSelectedTemplate] = useState('standard');
  const [file, setFile] = useState(null);
  const [ytLink, setYtLink] = useState('');
  
  const fileInputRef = useRef(null);
  const uploadMediaMutation = useUploadMedia();
  const importYoutubeMutation = useImportYoutube();

  const isProcessing = uploadMediaMutation.isPending || importYoutubeMutation.isPending;

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleProcess = () => {
    // We now pass the selectedTemplate alongside the data so the backend AI knows what prompt to use
    if (activeTab === 'file' && file) {
      uploadMediaMutation.mutate({ file, template: selectedTemplate }, {
        onSuccess: () => {
          setFile(null);
          onClose();
        }
      });
    } else if (activeTab === 'youtube' && ytLink) {
      importYoutubeMutation.mutate({ url: ytLink, template: selectedTemplate }, {
        onSuccess: () => {
          setYtLink('');
          onClose();
        }
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isProcessing && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Import Context to AI
          </DialogTitle>
          <DialogDescription>
            Select a processing template, then upload your media to instantly generate structured knowledge.
          </DialogDescription>
        </DialogHeader>

        {/* AI CONTEXT TEMPLATE SELECTOR */}
        <div className="py-2 space-y-3">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            AI Processing Template
          </label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {TEMPLATES.map((tmpl) => {
              const Icon = tmpl.icon;
              const isActive = selectedTemplate === tmpl.id;
              return (
                <button
                  key={tmpl.id}
                  onClick={() => setSelectedTemplate(tmpl.id)}
                  disabled={isProcessing}
                  className={`flex flex-col items-center justify-center gap-2 rounded-xl border p-3 text-xs font-medium transition-all duration-200 ${
                    isActive 
                      ? 'border-primary bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20' 
                      : 'border-border bg-card text-muted-foreground hover:bg-muted hover:border-primary/50'
                  } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Icon className={`h-5 w-5 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                  <span className="text-center">{tmpl.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-2">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="file" disabled={isProcessing}>Local File</TabsTrigger>
            <TabsTrigger value="youtube" disabled={isProcessing}>YouTube Link</TabsTrigger>
          </TabsList>

          {/* FILE UPLOAD TAB */}
          <TabsContent value="file" className="mt-4">
            <div 
              onClick={() => !isProcessing && fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors
                ${file ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50'}
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
                  <div className="p-3 bg-primary/10 text-primary rounded-full">
                    {file.type.includes('audio') ? <Mic className="h-6 w-6" /> : 
                     file.type.includes('pdf') ? <FileText className="h-6 w-6" /> : 
                     <ImageIcon className="h-6 w-6" />}
                  </div>
                  <span className="font-medium text-sm text-foreground truncate max-w-[200px]">{file.name}</span>
                  <span className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                  <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setFile(null); }} className="mt-2 h-8">
                    Remove File
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <div className="p-3 bg-muted rounded-full mb-2">
                    <FileText className="h-6 w-6" />
                  </div>
                  <span className="font-medium text-sm text-foreground">Click to browse or drag and drop</span>
                  <span className="text-xs">Supports Audio (MP3/WAV), PDF, and Images</span>
                </div>
              )}
            </div>
          </TabsContent>

          {/* YOUTUBE TAB */}
          <TabsContent value="youtube" className="mt-4 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Video URL</label>
              <div className="relative">
                <Video className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  value={ytLink}
                  onChange={(e) => setYtLink(e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                  className="pl-10 focus-visible:ring-primary/50"
                  disabled={isProcessing}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                We will automatically fetch the transcript and process it through the AI.
              </p>
            </div>
          </TabsContent>
        </Tabs>

        {/* PROCESS BUTTON */}
        <Button 
          className="w-full mt-4 transition-all" 
          onClick={handleProcess}
          disabled={isProcessing || (activeTab === 'file' && !file) || (activeTab === 'youtube' && !ytLink)}
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Synthesizing Knowledge...
            </>
          ) : (
            'Generate Context'
          )}
        </Button>
      </DialogContent>
    </Dialog>
  );
}