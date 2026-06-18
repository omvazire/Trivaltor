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
    create: (data) => API.post('/popup-leads', data),
    getAll: (params) => API.get('/popup-leads', { params }),
    delete: (id) => API.delete(`/popup-leads/${id}`)
  },
  enquiry: {
    create: (data) => API.post('/enquiries', data),
    getAll: (params) => API.get('/enquiries', { params }),
    markContacted: (id) => API.patch(`/enquiries/${id}/contacted`),
    delete: (id) => API.delete(`/enquiries/${id}`)
  },
  review: {
    create: (data) => API.post('/reviews', data),
    getApproved: () => API.get('/reviews/approved'),
    getAll: (params) => API.get('/reviews', { params }),
    approve: (id) => API.patch(`/reviews/${id}/approve`),
    reject: (id) => API.patch(`/reviews/${id}/reject`),
    delete: (id) => API.delete(`/reviews/${id}`)
  },
  admin: {
    login: (credentials) => API.post('/admin/login', credentials),
    profile: () => API.get('/admin/profile'),
    getAnalytics: () => API.get('/admin/analytics'),
    exportEnquiries: () => API.get('/admin/export/enquiries', { responseType: 'blob' }),
    exportPopupLeads: () => API.get('/admin/export/popup-leads', { responseType: 'blob' }),
    exportVisitors: () => API.get('/admin/export/visitors', { responseType: 'blob' }),
    getMonthlyReport: (params) => API.get('/admin/reports/monthly', { params }),
    exportMonthlyReport: (params) => API.get('/admin/reports/monthly/export', { params, responseType: 'blob' })
  }
};
