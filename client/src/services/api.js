import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
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

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only handle 401 errors for specific endpoints that indicate actual token expiration
    if (error.response?.status === 401) {
      // Don't auto-logout for getCurrentUser calls - let AuthContext handle it
      if (!error.config.url.includes('/auth/me')) {
        console.log('Token expired, removing token and redirecting to login');
        localStorage.removeItem('token');
        // Use React Router navigation instead of hard redirect
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (userData) => api.post('/auth/register', userData),
  getCurrentUser: () => api.get('/auth/me'),
  updateProfile: (userData) => api.put('/auth/update-profile', userData),
  googleLogin: () => window.location.href = `${API_BASE_URL}/auth/google`,
  handleGoogleCallback: (token, user) => api.get('/auth/google/success', { params: { token, user } }),
};

// Projects API
export const projectsAPI = {
  getProjects: (params) => api.get('/projects', { params }),
  getProject: (id) => api.get(`/projects/${id}`),
  createProject: (projectData) => api.post('/projects', projectData),
  updateProject: (id, projectData) => api.put(`/projects/${id}`, projectData),
  deleteProject: (id) => api.delete(`/projects/${id}`),
  assignContractor: (id, contractorId) => api.put(`/projects/${id}/assign-contractor`, { contractorId }),
  getContractorProjects: (contractorId) => api.get(`/projects/contractor/${contractorId}`),
};

// Users API
export const usersAPI = {
  getUsers: (params) => api.get('/users', { params }),
  getUser: (id) => api.get(`/users/${id}`),
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/users/${id}`),
  activateUser: (id) => api.put(`/users/${id}/activate`),
  getContractors: (params) => api.get('/users/contractors', { params }),
};

// Reviews API
export const reviewsAPI = {
  test: () => api.get('/reviews/test'),
  getProjectReviews: (projectId, params) => api.get(`/reviews/project/${projectId}`, { params }),
  createReview: (reviewData) => api.post('/reviews', reviewData),
  updateReview: (reviewId, reviewData) => api.put(`/reviews/${reviewId}`, reviewData),
  deleteReview: (reviewId) => api.delete(`/reviews/${reviewId}`),
  getUserReviews: (userId) => api.get(`/reviews/user/${userId}`),
  getContractorReviews: () => api.get('/reviews/contractor-reviews'),
  getAllReviews: (params) => api.get('/reviews/all', { params }),
  respondToReview: (reviewId, response) => api.put(`/reviews/${reviewId}/respond`, { response }),
  verifyReview: (reviewId) => api.put(`/reviews/${reviewId}/verify`),
};

// Updates API
export const updatesAPI = {
  getProjectUpdates: (projectId, params) => api.get(`/updates/project/${projectId}`, { params }),
  createUpdate: (updateData) => api.post('/updates', updateData),
  updateUpdate: (id, updateData) => api.put(`/updates/${id}`, updateData),
  deleteUpdate: (id) => api.delete(`/updates/${id}`),
  getUserUpdates: (userId) => api.get(`/updates/user/${userId}`),
};

// File upload API
export const uploadAPI = {
  uploadImage: (formData) => {
    const uploadApi = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    const token = localStorage.getItem('token');
    if (token) {
      uploadApi.defaults.headers.Authorization = `Bearer ${token}`;
    }
    
    return uploadApi.post('/upload/image', formData);
  },
};

export default api;
