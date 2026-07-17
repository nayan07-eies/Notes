import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    isSidebarOpen: true,
    isDarkMode: false,
    isAuthenticated: true, // or false
    user: null
  },
  reducers: {
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    toggleDarkMode: (state) => {
      state.isDarkMode = !state.isDarkMode;
    },
    // Add this reducer
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
    },
  },
});

// CRITICAL: You must export the actions like this
export const { toggleSidebar, toggleDarkMode, logout } = uiSlice.actions;

export default uiSlice.reducer;