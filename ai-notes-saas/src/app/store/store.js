import { configureStore } from '@reduxjs/toolkit';
import uiReducer from './uiSlice';
import noteUiReducer from '../../entities/note/model/slice';

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    noteUi: noteUiReducer,
    // We will add your feature slices here later (e.g., auth, UI state)
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});