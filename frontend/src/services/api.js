import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to automatically attach the JWT Bearer Token if available
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('trivaltor-admin-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to extract data payload or forward clean errors
API.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const errorResponse = error.response?.data || {
      success: false,
      message: error.message || 'Network Error'
    };
    return Promise.reject(errorResponse);
  }
);

export const api = {
  visitor: {
    create: (data) => API.post('/visitors', data),
    update: (sessionId, data) => API.patch(`/visitors/${sessionId}`, data)
  },
  popupLead: {
    create: (data) => API.post('/popup-leads', data)
  },
  enquiry: {
    create: (data) => API.post('/enquiries', data)
  },
  admin: {
    login: (credentials) => API.post('/admin/login', credentials),
    profile: () => API.get('/admin/profile')
  }
};
