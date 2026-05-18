// src/api/axiosInstance.js — Q4: API Integration using Axios
import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor: attach JWT token to every request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 (token expired)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ── Employee API calls ──────────────────────────────────────────────────────
export const employeeAPI = {
  getAll: (params) => API.get('/employees', { params }),
  getOne: (id) => API.get(`/employees/${id}`),
  search: (params) => API.get('/employees/search', { params }),
  add: (data) => API.post('/employees', data),
  update: (id, data) => API.put(`/employees/${id}`, data),
  delete: (id) => API.delete(`/employees/${id}`),
  getAnalytics: () => API.get('/employees/analytics'),
};

// ── AI API calls ─────────────────────────────────────────────────────────────
export const aiAPI = {
  recommend: (employeeId) => API.post('/ai/recommend', { employeeId }),
  rank: (data) => API.post('/ai/rank', data),
};

// ── Auth API calls ────────────────────────────────────────────────────────────
export const authAPI = {
  signup: (data) => API.post('/auth/signup', data),
  login: (data) => API.post('/auth/login', data),
  getMe: () => API.get('/auth/me'),
};

export default API;
