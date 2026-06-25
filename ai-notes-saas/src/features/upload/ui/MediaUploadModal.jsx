import React, { useState, useRef } from 'react';
import { useUploadMedia, useImportYoutube } from '@/entities/note/model/queries';
import { UploadCloud, FileText, Image as ImageIcon, Mic, Video, Loader2, X } from 'lucide-react';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function MediaUploadModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('file');
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
    if (activeTab === 'file' && file) {
      uploadMediaMutation.mutate(file, {
        onSuccess: () => {
          setFile(null);
          onClose();
        }
      });
    } else if (activeTab === 'youtube' && ytLink) {
      importYoutubeMutation.mutate(ytLink, {
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
          <DialogTitle className="text-xl">Import Context to AI</DialogTitle>
          <DialogDescription>
            Upload files or paste links to instantly generate indexed AI notes.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="file" disabled={isProcessing}>Local File</TabsTrigger>
            <TabsTrigger value="youtube" disabled={isProcessing}>YouTube Link</TabsTrigger>
          </TabsList>

          {/* FILE UPLOAD TAB */}
          <TabsContent value="file" className="space-y-4 pt-4">
            <div 
              onClick={() => !isProcessing && fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors
                ${file ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50'}
                ${isProcessing ? 'opacity-50 pointer-events-none' : ''}
              `}
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
                  <p className="font-semibold text-sm">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setFile(null); }} className="mt-2 h-8">
                    Remove File
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <div className="p-4 bg-muted text-muted-foreground rounded-full">
                    <UploadCloud className="h-8 w-8" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Click to browse or drag and drop</p>
                    <p className="text-xs text-muted-foreground mt-1">Supports Audio (MP3/WAV), PDF, and Images</p>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          {/* YOUTUBE TAB */}
          <TabsContent value="youtube" className="space-y-4 pt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Video URL</label>
              <div className="relative">
                {/* Swapped Youtube icon out for the safe Video icon here */}
                <Video className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-red-500" />
                <Input 
                  value={ytLink}
                  onChange={(e) => setYtLink(e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                  className="pl-10"
                  disabled={isProcessing}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                We will automatically fetch the transcript and process it through the AI.
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-3 pt-4 border-t border-border mt-4">
          <Button variant="outline" onClick={onClose} disabled={isProcessing}>Cancel</Button>
          <Button 
            onClick={handleProcess} 
            disabled={(!file && activeTab === 'file') || (!ytLink && activeTab === 'youtube') || isProcessing}
            className="w-[140px]"
          >
            {isProcessing ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</>
            ) : (
              'Process Media'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}