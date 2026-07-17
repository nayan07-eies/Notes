import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// --- MOCK BACKEND LOGIC ---
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Simulated Database
let mockNotes = [
  { id: '1', title: 'Q3 AI Product Roadmap', excerpt: 'Strategic goals...', aiSynthesized: true, tags: ['Strategy'] },
  { id: '2', title: 'Vector Embeddings', excerpt: 'Numerical arrays...', aiSynthesized: false, tags: ['AI'] }
];

const api = {
  getNotes: async () => {
    await delay(1200); // Simulate network latency
    return mockNotes;
  },
  generateSynthesis: async () => {
    await delay(2500); // Simulate AI generation time
    return { success: true, message: 'AI processing complete.' };
  }
};

// --- REACT QUERY HOOKS ---

// Hook to fetch notes for the Grid
export const useNotes = () => {
  return useQuery({
    queryKey: ['notes'],
    queryFn: api.getNotes,
  });
};

// Hook to trigger AI Generation
export const useGenerateSynthesis = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.generateSynthesis,
    onSuccess: () => {
      // Tell React Query to refresh the notes list after a successful generation
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });
};