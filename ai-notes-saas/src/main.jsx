import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store/store';
import { QueryProvider } from './app/providers/QueryProvider';
import { AppRouter } from './app/providers/RouterProvider';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryProvider>
        <AppRouter />
      </QueryProvider>
    </Provider>
  </React.StrictMode>
);