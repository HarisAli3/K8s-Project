import axios from 'axios';

// HARDCODED TEST VERSION - This should force a change
console.log('=== TESTING NEW API SERVICE ===');
console.log('This is the NEW version of the API service');
console.log('If you see this, the Docker build is working');

// Force the correct API URL for Kubernetes
const API_BASE_URL = window.location.origin + '/api';

console.log('API Base URL:', API_BASE_URL);
console.log('Current Origin:', window.location.origin);
console.log('Hostname:', window.location.hostname);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    console.log('Full URL:', config.baseURL + config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response);
    return response;
  },
  (error) => {
    console.error('API Error:', error.message);
    return Promise.reject(error);
  }
);

export const studentAPI = {
  // Get all students
  getAll: () => api.get('/students'),
  
  // Get student by ID
  getById: (id) => api.get(`/students/${id}`),
  
  // Create new student
  create: (studentData) => api.post('/students', studentData),
  
  // Update student
  update: (id, studentData) => api.put(`/students/${id}`, studentData),
  
  // Delete student
  delete: (id) => api.delete(`/students/${id}`),
};

// Function to get current API configuration (needed by Header component)
export const getApiConfig = () => ({
  baseURL: API_BASE_URL,
  environment: 'production',
  buildEnv: 'production',
  host: window.location.hostname,
  runtimeConfig: null
});

// Export studentAPI as default for App.js compatibility
export default studentAPI;
