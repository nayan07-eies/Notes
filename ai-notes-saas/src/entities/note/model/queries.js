import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { noteApi } from '../api/noteApi';

export const NOTE_QUERY_KEYS = {
  all: ['notes'],
  detail: (id) => ['notes', id],
};

export function useNotes() {
  return useQuery({
    queryKey: NOTE_QUERY_KEYS.all,
    queryFn: noteApi.getAllNotes,
  });
}

export function useNoteDetails(id) {
  return useQuery({
    queryKey: NOTE_QUERY_KEYS.detail(id),
    queryFn: () => noteApi.getNoteById(id),
    enabled: !!id,
  });
}

export function useCreateNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: noteApi.createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTE_QUERY_KEYS.all });
    },
  });
}

export function useUpdateNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: noteApi.updateNote,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: NOTE_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: NOTE_QUERY_KEYS.detail(data.id) });
    },
  });
}

export function useDeleteNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: noteApi.deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTE_QUERY_KEYS.all });
    },
  });
}
export function useGenerateSummary() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: noteApi.generateAiSummary,
    onSuccess: (data) => {
      // Instantly update both the global list and the specific note view!
      queryClient.invalidateQueries({ queryKey: NOTE_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: NOTE_QUERY_KEYS.detail(data.id) });
    },
  });
}
export function useUploadMedia() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: noteApi.uploadMedia,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTE_QUERY_KEYS.all });
    },
  });
}

export function useImportYoutube() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: noteApi.importYoutube,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTE_QUERY_KEYS.all });
    },
  });
}