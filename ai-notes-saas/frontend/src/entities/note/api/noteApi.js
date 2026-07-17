// Comment out the real apiClient for now so we don't trigger network requests
// import { apiClient } from '../../../shared/api/apiClient';

let mockNotes = [
  { 
    id: '1', 
    title: 'Project Architecture', 
    content: 'We are using Vite, React, Redux Toolkit, and React Query with Feature Sliced Design. The setup is highly scalable.', 
    updatedAt: new Date().toISOString(),
    hasSummary: false,
    tags: ['Architecture', 'Frontend']
  },
  { 
    id: '2', 
    title: 'AI Integration Ideas', 
    content: 'Need to add a button that summarizes long meeting transcripts using the new LLM models.', 
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    hasSummary: true,
    tags: ['AI', 'Ideas']
  }
];

// Helper to simulate network latency
const delay = (ms = 800) => new Promise(resolve => setTimeout(resolve, ms));

export const noteApi = {
  getAllNotes: async () => {
    await delay();
    return [...mockNotes];
  },
  
  getNoteById: async (id) => {
    await delay();
    return mockNotes.find(n => n.id === id);
  },
  
  createNote: async (noteData) => {
    await delay();
    const newNote = {
      ...noteData,
      id: Math.random().toString(36).substring(7),
      updatedAt: new Date().toISOString(),
      hasSummary: false,
      tags: noteData.tags || ['General']
    };
    mockNotes = [newNote, ...mockNotes];
    return newNote;
  },
  
  updateNote: async ({ id, ...updates }) => {
    await delay();
    const index = mockNotes.findIndex(n => n.id === id);
    if (index !== -1) {
      mockNotes[index] = { ...mockNotes[index], ...updates, updatedAt: new Date().toISOString() };
      return mockNotes[index];
    }
    throw new Error("Note not found");
  },
  
  deleteNote: async (id) => {
    await delay();
    mockNotes = mockNotes.filter(n => n.id !== id);
    return { success: true };
  },
  
  generateAiSummary: async (id) => {
    await delay(1500); 
    const index = mockNotes.findIndex(n => n.id === id);
    if (index !== -1) {
      mockNotes[index] = { 
        ...mockNotes[index], 
        hasSummary: true,
        content: mockNotes[index].content + '\n\n---\nAI Summary: This note discusses ' + mockNotes[index].title.toLowerCase() + '...'
      };
      return mockNotes[index];
    }
    throw new Error("Note not found");
  },
  
  // NEW: Accepts the selected template and applies AI Auto-Tags
  uploadMedia: async (file, template = 'standard') => {
    await delay(2500); 
    
    // Simulate auto-tagging based on the template selected
    const templateTags = {
      standard: ['Document', 'Summary'],
      meeting: ['Minutes', 'Action Items', 'Team'],
      lecture: ['Education', 'Study Guide', 'Academic'],
      revision: ['Flashcards', 'Exam Prep', 'Review']
    };

    const newNote = {
      id: Date.now().toString(),
      title: `Parsed ${file.name} (${template.toUpperCase()})`,
      content: `Simulated extraction from ${file.name}. Processed using the ${template} AI directive.`,
      tags: templateTags[template] || ['AI Generated'],
      hasSummary: false,
      updatedAt: new Date().toISOString(),
    };
    mockNotes.unshift(newNote);
    return newNote;
  },

  // NEW: Accepts the selected template and applies AI Auto-Tags
  importYoutube: async (url, template = 'standard') => {
    await delay(2500);
    
    const templateTags = {
      standard: ['Video', 'Transcript'],
      meeting: ['Webinar', 'Action Items'],
      lecture: ['Online Course', 'Academic'],
      revision: ['Study Material', 'Review']
    };

    const newNote = {
      id: Date.now().toString(),
      title: `YouTube Synthesis (${template.toUpperCase()})`,
      content: `Simulated transcript extraction from ${url}. Processed using the ${template} AI directive.`,
      tags: templateTags[template] || ['AI Generated'],
      hasSummary: false,
      updatedAt: new Date().toISOString(),
    };
    mockNotes.unshift(newNote);
    return newNote;
  }
};