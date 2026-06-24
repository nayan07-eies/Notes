import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNotes, useCreateNote } from "@/entities/note/model/queries";
import { setSearchQuery } from "@/entities/note/model/slice";
import { Search, Plus, FileText, Calendar, Sparkles } from 'lucide-react';
import { setSelectedNoteId } from '@/entities/note/model/slice';
import { EditNoteModal } from '@/features/notes/edit/EditNoteModal';

export default function NotesPage() {
  const dispatch = useDispatch();
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
    <div className="space-y-6 h-full flex flex-col">
      {/* View Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">My Notes</h2>
          <p className="text-muted-foreground">Capture thoughts, edit data logs, and synthesize with AI context models.</p>
        </div>
        <button
          onClick={handleCreateNote}
          disabled={createNoteMutation.isPending}
          className="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50 self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          New Document
        </button>
      </div>

      {/* Action Filters Bar */}
      <div className="relative max-w-md w-full">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => dispatch(setSearchQuery(e.target.value))}
          placeholder="Search through records and AI briefs..."
          className="w-full rounded-md border border-input bg-card pl-10 pr-4 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        />
      </div>

      {/* Primary Context Workspace Grid */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {isLoading ? (
          <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
            Indexing database models...
          </div>
        ) : isError ? (
          <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-4 text-sm text-destructive">
            Network Error: Failed to communicate with internal data stream node. Check your server connection.
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="flex h-60 flex-col items-center justify-center border border-dashed border-border rounded-xl p-8 text-center bg-card">
            <FileText className="h-10 w-10 text-muted-foreground mb-3 opacity-60" />
            <h3 className="font-semibold text-lg">No documents found</h3>
            <p className="text-sm text-muted-foreground max-w-sm mt-1">
              {searchQuery ? "No database matches for your current search parameter filter query." : "Initialize your dashboard by generating your first knowledge stream container."}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredNotes.map((note) => (
              <div 
                key={note.id} 
                onClick={() => dispatch(setSelectedNoteId(note.id))}
                className="flex flex-col justify-between p-5 border border-border bg-card rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer relative overflow-hidden group"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-semibold text-lg tracking-tight line-clamp-1 group-hover:text-primary transition-colors">
                      {note.title || 'Untitled Note'}
                    </h4>
                    {note.hasSummary && (
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-primary/10 text-primary">
                        <Sparkles className="h-3 w-3" />
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                    {note.content || <span className="italic text-muted-foreground/50">Empty text body field...</span>}
                  </p>
                </div>
                
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-5 border-t border-border/60 pt-3">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{new Date(note.updatedAt || Date.now()).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex-1 overflow-y-auto min-h-0">
         {/* ... existing loading/error/grid logic ... */}
      </div>
      {}
      <EditNoteModal/>
    </div>
  );
}