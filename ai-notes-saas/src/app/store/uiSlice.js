import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isSidebarOpen: true,
  isDarkMode: false,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    toggleDarkMode: (state) => {
      state.isDarkMode = !state.isDarkMode;
    },
  },
});

export const { toggleSidebar, toggleDarkMode } = uiSlice.actions;
export default uiSlice.reducer;