import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getCurrentUser: () => api.get('/auth/me')
};

// Result APIs
export const resultAPI = {
  getMyResults: () => api.get('/results/my-results'),
  getResults: (params) => api.get('/results', { params }),
  getStats: (params) => api.get('/results/stats', { params }),
  addResult: (data) => api.post('/results', data),
  updateResult: (id, data) => api.put(`/results/${id}`, data),
  deleteResult: (id) => api.delete(`/results/${id}`)
};

export default api;
