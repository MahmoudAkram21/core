// Install Axios: npm install axios

import axios from 'axios'
import Cookies from 'universal-cookie'

const cookies = new Cookies()

export const api = axios.create({
  baseURL: 'http://192.168.1.66:8000/api/',
  headers: {
    'Content-Type': 'application/json',
    accept: 'application/json',
  },
})

// Add token to every request
api.interceptors.request.use((config) => {
  // Try cookies first, fallback to localStorage
  let token = cookies.get('token')
  
  if (!token || token === 'undefined') {
    token = localStorage.getItem('token')
  }
  
  if (token && token !== 'undefined' && token !== 'null') {
    config.headers.Authorization = `Bearer ${token}`
    console.log('🔑 Token added to request')
  } else {
    console.log('⚠️ No valid token available')
  }
  
  return config
})

// Handle token refresh or 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('❌ Unauthorized (401) - Token may be expired')
      // Clear stored auth data
      cookies.remove('token', { path: '/' })
      cookies.remove('user', { path: '/' })
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
    return Promise.reject(error)
  }
)

// ==================== AUTH ENDPOINTS ====================

export const authAPI = {
  // Login
  login: (email, password) => {
    console.log('📤 Sending login request to:', 'http://192.168.1.66:8000/api/login')
    return api.post('login', { email, password })
  },

  // Register with FormData (supports file upload)
  register: (formData) => {
    console.log('📤 Sending register request to:', 'http://192.168.1.66:8000/api/register')
    // console.log('📦 FormData entries:', Array.from(formData.entries()))
    return api.post('register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  // Logout
  logout: () => {
    return api.post('logout')
  },

  // Get User Profile
  getProfile: () => {
    return api.get('user')
  },

  // Send Verification Code
  sendVerificationCode: () => {
    return api.post('send-verification-code')
  },

  // Verify Email
  verifyEmail: (code) => {
    const formData = new FormData()
    formData.append('code', code)
    return api.post('verify-code', formData)
  },

  // Forgot Password
  forgotPassword: (email) => {
    const formData = new FormData()
    formData.append('email', email)
    return api.post('forgot-password', formData, {
      headers: { Authorization: '' },
    })
  },

  // Reset Password
  resetPassword: (email, otp, password, re_password) => {
    const formData = new FormData()
    formData.append('email', email)
    formData.append('otp', otp)
    formData.append('password', password)
    formData.append('re_password', re_password)
    return api.post('reset-password', formData, {
      headers: { Authorization: '' },
    })
  },

  // Delete Account
  deleteAccount: () => {
    return api.delete('delete-account')
  },
}

// ==================== CATEGORIES ENDPOINTS ====================

export const categoriesAPI = {
  // Get all categories
  getAll: (status = null, search = null) => {
    const params = {}
    if (status) params.status = status
    if (search) params.search = search
    return api.get('categories', { params })
  },

  // Get single category
  getById: (id) => {
    return api.get(`categories/${id}`)
  },

  // Create category
  create: (formData) => {
    return api.post('categories', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  // Update category
  update: (id, formData) => {
    formData.append('_method', 'PUT')
    return api.post(`categories/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  // Delete category
  delete: (id) => {
    return api.delete(`categories/${id}`)
  },
}

// ==================== PACKAGES ENDPOINTS ====================

export const packagesAPI = {
  // Get all packages
  getAll: () => {
    return api.get('packages')
  },

  // Get single package
  getById: (id) => {
    return api.get(`packages/${id}`)
  },

  // Create package
  create: (formData) => {
    return api.post('packages', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  // Update package
  update: (id, formData) => {
    formData.append('_method', 'PUT')
    return api.post(`packages/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  // Delete package
  delete: (id) => {
    return api.delete(`packages/${id}`)
  },
}

// ==================== SETTINGS ENDPOINTS ====================

export const settingsAPI = {
  // Get settings
  get: () => {
    return api.get('settings')
  },

  // Update settings
  update: (formData) => {
    return api.put('settings/update', formData)
  },
}