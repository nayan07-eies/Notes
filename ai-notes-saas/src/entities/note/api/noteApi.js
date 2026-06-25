// Comment out the real apiClient for now so we don't trigger network requests
// import { apiClient } from '../../../shared/api/apiClient';
// import { apiClient } from '../../../shared/api/apiClient';

let mockNotes = [
  { 
    id: '1', 
    title: 'Project Architecture', 
    content: 'We are using Vite, React, Redux Toolkit, and React Query with Feature Sliced Design. The setup is highly scalable.', 
    updatedAt: new Date().toISOString(),
    hasSummary: false
  },
  { 
    id: '2', 
    title: 'AI Integration Ideas', 
    content: 'Need to add a button that summarizes long meeting transcripts using the new LLM models.', 
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    hasSummary: true
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
      hasSummary: false
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
  }, // <-- Commas here are required to separate methods!
  
  uploadMedia: async (file) => {
    await delay(2000); 
    
    const fileType = file.type;
    let contentPrefix = "Processed Data Stream: ";
    if (fileType.includes('audio')) contentPrefix = "Audio Transcription: ";
    if (fileType.includes('pdf')) contentPrefix = "PDF Extracted Text: ";
    if (fileType.includes('image')) contentPrefix = "Image Vision Analysis: ";

    const newNote = {
      id: Math.random().toString(36).substring(7),
      title: `${file.name.split('.')[0]} (Parsed)`,
      content: `${contentPrefix} We successfully extracted the context from ${file.name}. The AI models have indexed this data for future synthesis.`,
      updatedAt: new Date().toISOString(),
      hasSummary: false
    };
    mockNotes = [newNote, ...mockNotes];
    return newNote;
  }, // <-- Required comma!

  importYoutube: async (url) => {
    await delay(1500); 
    const newNote = {
      id: Math.random().toString(36).substring(7),
      title: 'YouTube Transcript Insight',
      content: `Video Source: ${url}\n\nTranscript: In this video, we discuss the core architecture of scalable systems...`,
      updatedAt: new Date().toISOString(),
      hasSummary: false
    };
    mockNotes = [newNote, ...mockNotes];
    return newNote;
  }
};