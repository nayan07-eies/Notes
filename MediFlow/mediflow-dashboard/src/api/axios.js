import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Auto-attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('mediflow_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-handle 401 (expired token)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.clear();
      const onSupplierPortal = window.location.pathname.startsWith('/supplier');
      window.location.href = onSupplierPortal ? '/supplier/login' : '/login';
    }
    return Promise.reject(err);
  }
);

export default api;