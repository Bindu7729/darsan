import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to inject token on every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('darshanease_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor to handle session expirations (401 errors)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If unauthorized, clear tokens and redirect to auth page
      localStorage.removeItem('darshanease_token');
      localStorage.removeItem('darshanease_user');
      if (window.location.pathname !== '/auth') {
        window.location.href = '/auth?session_expired=true';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
