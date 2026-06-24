import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  searchQuery: '',
  selectedNoteId: null,
  sortBy: 'updatedAt', // 'updatedAt' | 'title'
};

export const noteUiSlice = createSlice({
  name: 'noteUi',
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setSelectedNoteId: (state, action) => {
      state.selectedNoteId = action.payload;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
  },
});

export const { setSearchQuery, setSelectedNoteId, setSortBy } = noteUiSlice.actions;
export default noteUiSlice.reducer;