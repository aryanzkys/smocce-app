// API Configuration and Utilities for SMOCCE 2025

// Prefer same-origin relative API on Netlify (handled by netlify.toml redirects)
const rawBase = process.env.NEXT_PUBLIC_API_URL || '';
// Normalize base to avoid double slashes and default to same-origin
const API_BASE_URL = rawBase.replace(/\/$/, '');

// API Client with error handling
class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
  const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    try {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch {}

    try {
      const response = await fetch(url, config);
      
      // Handle non-JSON responses
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // GET request
  async get(endpoint, options = {}) {
    return this.request(endpoint, {
      method: 'GET',
      ...options,
    });
  }

  // POST request
  async post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options,
    });
  }

  // PUT request
  async put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      ...options,
    });
  }

  // DELETE request
  async delete(endpoint, options = {}) {
    return this.request(endpoint, {
      method: 'DELETE',
      ...options,
    });
  }
}

// Create API client instance
const api = new ApiClient();

// API Endpoints
export const apiEndpoints = {
  // Health check
  // Expose health under /api as it's proxied by Netlify to functions
  health: '/api/health',
  
  // Authentication
  auth: {
    login: '/api/auth/login',
    verify: '/api/auth/verify',
    logout: '/api/auth/logout',
  },
  
  // Candidates
  candidates: {
    list: '/api/candidates',
    byId: (id) => `/api/candidates/${id}`,
    byPosition: (position) => `/api/candidates/position/${position}`,
  },
  
  // Voting
  vote: {
    submit: '/api/vote',
    status: '/api/vote/status',
    results: '/api/vote/results',
  },
  
  // Admin
  admin: {
    login: '/api/admin/login',
    stats: '/api/admin/stats',
    users: '/api/admin/users',
    import: '/api/admin/import',
    export: '/api/admin/export',
    candidates: '/api/admin/candidates',
  },
};

// API Functions
export const apiService = {
  // Health check
  async checkHealth() {
    return api.get(apiEndpoints.health);
  },

  // Authentication
  async login(credentials) {
    return api.post(apiEndpoints.auth.login, credentials);
  },

  async verifyToken() {
    return api.get(apiEndpoints.auth.verify);
  },

  // Candidates
  async getCandidates() {
    return api.get(apiEndpoints.candidates.list);
  },

  async getCandidatesByPosition(position) {
    return api.get(apiEndpoints.candidates.byPosition(position));
  },

  // Voting
  async submitVote(voteData) {
    return api.post(apiEndpoints.vote.submit, voteData);
  },

  async getVoteStatus() {
    // Force fresh status (avoid CDN/browser caching)
    return api.get(apiEndpoints.vote.status, { cache: 'no-store' });
  },

  async getVoteResults() {
    return api.get(apiEndpoints.vote.results);
  },
  async adminLogin(credentials) {
    return api.post(apiEndpoints.admin.login, credentials);
  },

  async getAdminStats() {
    return api.get(apiEndpoints.admin.stats);
  },

  async getUsers() {
    return api.get(apiEndpoints.admin.users);
  },

  async importUsers(userData) {
    return api.post(apiEndpoints.admin.import, userData);
  },

  async exportData(format = 'csv') {
    return api.get(`${apiEndpoints.admin.export}?format=${format}`);
  },
};

// Utility functions
export const utils = {
  // Check if API is available
  async isApiAvailable() {
    try {
      await apiService.checkHealth();
      return true;
    } catch (error) {
      console.error('API not available:', error);
      return false;
    }
  },

  // Get API base URL
  getApiUrl() {
    return API_BASE_URL;
  },

  // Format API error for display
  formatApiError(error) {
    if (typeof error === 'string') {
      return error;
    }
    
    if (error.message) {
      return error.message;
    }
    
    return 'Terjadi kesalahan pada server. Silakan coba lagi.';
  },
};

export default api;
