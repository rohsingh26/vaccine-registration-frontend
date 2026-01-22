import axios from 'axios';

const API = axios.create({
  // This line is the most important:
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://runo-assignment-vaccine-registration.onrender.com/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});
// ... rest of the code I gave you earlier

// REQUEST INTERCEPTOR: Automatically add the Token to every call
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// RESPONSE INTERCEPTOR: Handle global errors (like 401 Unauthorized)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // If the backend returns 401, the token is invalid or expired
    if (error.response && error.response.status === 401) {
      localStorage.clear();
      // Only redirect if we aren't already on a login page to avoid loops
      if (!window.location.pathname.includes('/auth')) {
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

export default API;