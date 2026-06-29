import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotes, useCreateNote } from "@/entities/note/model/queries";
import { setSearchQuery, setSelectedNoteId } from "@/entities/note/model/slice";
import { Search, Plus, FileText, Calendar, Sparkles, UploadCloud, Loader2 } from 'lucide-react';
import { EditNoteModal } from '@/features/notes/edit/EditNoteModal';
import { MediaUploadModal } from '@/features/upload/ui/MediaUploadModal';

// Framer Motion Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
};

export default function NotesPage() {
  const dispatch = useDispatch();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const searchQuery = useSelector((state) => state.noteUi.searchQuery);
  
  const { data: notes = [], isLoading, isError } = useNotes();
  const createNoteMutation = useCreateNote();

  const handleCreateNote = () => {
    createNoteMutation.mutate({
      title: 'Untitled Note',
      content: '',
      tags: [],
    });
  };

  const filteredNotes = notes.filter(note =>
    note.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 h-full flex flex-col"
    >
      {/* View Header controls */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">My Notes</h2>
          <p className="text-muted-foreground">Capture thoughts, edit data logs, and synthesize with AI context models.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsUploadModalOpen(true)}
            className="flex flex-1 sm:flex-none items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors shadow-sm"
          >
            <UploadCloud className="h-4 w-4" />
            Import Media
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCreateNote}
            disabled={createNoteMutation.isPending}
            className="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-all shadow-sm disabled:opacity-50 self-start sm:self-auto relative overflow-hidden"
          >
            <AnimatePresence mode="wait">
              {createNoteMutation.isPending ? (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating...
                </motion.div>
              ) : (
                <motion.div key="default" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  New Document
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </motion.div>

      {/* Action Filters Bar */}
      <motion.div variants={itemVariants} className="relative max-w-md w-full group">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => dispatch(setSearchQuery(e.target.value))}
          placeholder="Search through records and AI briefs..."
          className="w-full rounded-md border border-input bg-card pl-10 pr-4 py-2 text-sm shadow-sm placeholder:text-muted-foreground transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </motion.div>

      {/* Primary Context Workspace Grid */}
      <div className="flex-1 overflow-y-auto min-h-0 pb-6 pt-2">
        {isLoading ? (
          <motion.div variants={itemVariants} className="flex h-40 items-center justify-center text-sm text-muted-foreground gap-3">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            Indexing database models...
          </motion.div>
        ) : isError ? (
          <motion.div variants={itemVariants} className="rounded-lg border border-destructive/50 bg-destructive/5 p-4 text-sm text-destructive">
            Network Error: Failed to communicate with internal data stream node. Check your server connection.
          </motion.div>
        ) : filteredNotes.length === 0 ? (
          <motion.div 
            variants={itemVariants}
            className="flex h-60 flex-col items-center justify-center border border-dashed border-border rounded-xl p-8 text-center bg-card/50"
          >
            <FileText className="h-10 w-10 text-muted-foreground mb-3 opacity-60" />
            <h3 className="font-semibold text-lg">No documents found</h3>
            <p className="text-sm text-muted-foreground max-w-sm mt-1">
              {searchQuery ? "No database matches for your current search parameter filter query." : "Initialize your dashboard by generating your first knowledge stream container."}
            </p>
          </motion.div>
        ) : (
          <motion.div 
            variants={containerVariants} 
            initial="hidden" 
            animate="visible" 
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filteredNotes.map((note) => (
              <motion.div 
                key={note.id} 
                variants={itemVariants}
                whileHover={{ y: -4, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => dispatch(setSelectedNoteId(note.id))}
                className="flex flex-col justify-between p-5 border border-border bg-card rounded-xl shadow-sm hover:shadow-md hover:border-primary/40 transition-all cursor-pointer relative overflow-hidden group"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-semibold text-lg tracking-tight line-clamp-1 group-hover:text-primary transition-colors">
                      {note.title || 'Untitled Note'}
                    </h4>
                    {note.hasSummary && (
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                        <Sparkles className="h-3.5 w-3.5" />
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                    {note.content || <span className="italic text-muted-foreground/50">Empty text body field...</span>}
                  </p>
                </div>
                
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-5 border-t border-border/60 pt-3 group-hover:text-foreground/70 transition-colors">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{new Date(note.updatedAt || Date.now()).toLocaleDateString()}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
      
      {/* Edit Note Modal Mount Point */}
      <EditNoteModal />
      <MediaUploadModal 
        isOpen={isUploadModalOpen} 
        onClose={() => setIsUploadModalOpen(false)} 
      />
    </motion.div>
  );
}