import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedNoteId } from '@/entities/note/model/slice';
import { useNoteDetails, useUpdateNote, useGenerateSummary } from '@/entities/note/model/queries';
import { Save, Loader2, Sparkles } from 'lucide-react';

// shadcn/ui components
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

export function EditNoteModal() {
  const dispatch = useDispatch();
  const selectedNoteId = useSelector((state) => state.noteUi.selectedNoteId);
  
  // React Query hooks
  const { data: note, isLoading } = useNoteDetails(selectedNoteId);
  const updateNoteMutation = useUpdateNote();
  const generateSummaryMutation = useGenerateSummary();

  // Local state for the form inputs
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // Sync local state when the note data arrives
  useEffect(() => {
    if (note) {
      setTitle(note.title || '');
      setContent(note.content || '');
    }
  }, [note]);

  const handleClose = () => {
    dispatch(setSelectedNoteId(null));
    setTitle('');
    setContent('');
  };

  const handleSave = () => {
    if (!selectedNoteId) return;
    
    updateNoteMutation.mutate(
      { id: selectedNoteId, title, content },
      {
        onSuccess: () => {
          handleClose();
        },
      }
    );
  };

  const isOpen = !!selectedNoteId;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[600px] gap-6">
        <DialogHeader>
          <DialogTitle className="text-xl">Edit Document</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-10 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Retrieving data stream...</span>
          </div>
        ) : (
          <div className="space-y-4">
            
            {/* Title Input */}
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium text-foreground">
                Document Title
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a descriptive title..."
                className="text-lg font-semibold"
              />
            </div>

            {/* Content Textarea with AI Generation Button */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="content" className="text-sm font-medium text-foreground">
                  Content Body
                </label>
                
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => generateSummaryMutation.mutate(selectedNoteId)}
                  disabled={!content || generateSummaryMutation.isPending || (note?.hasSummary && note?.content.includes('AI Summary:'))}
                  className="h-8 text-xs font-semibold bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                >
                  {generateSummaryMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                      Synthesizing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-3.5 w-3.5" />
                      {note?.hasSummary ? 'Insight Generated' : 'Generate Insight'}
                    </>
                  )}
                </Button>
              </div>

              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Start typing your note here..."
                className={`min-h-[250px] resize-none font-medium text-foreground/90 leading-relaxed transition-all duration-300 ${
                  generateSummaryMutation.isPending ? 'opacity-50 blur-[1px]' : ''
                }`}
              />
            </div>
            
            {/* Display the AI Summary if it exists */}
            {note?.hasSummary && note?.content.includes('AI Summary:') && (
               <div className="rounded-md bg-primary/5 p-4 border border-primary/20">
                 <h4 className="text-sm font-bold text-primary mb-1">Generated Insight</h4>
                 <p className="text-sm text-muted-foreground">
                   {note.content.split('AI Summary:')[1]?.trim()}
                 </p>
               </div>
            )}
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={updateNoteMutation.isPending || isLoading}
            className="flex items-center gap-2"
          >
            {updateNoteMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}