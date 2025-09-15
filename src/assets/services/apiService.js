import axios from 'axios'

// API Configuration
const API_BASE_URL = 'https://retoolapi.dev/YYCwBG/users'
const API_TIMEOUT = 10000 // 10 seconds

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  }
})

// Request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => {
    console.error('API Request Error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`)
    return response
  },
  (error) => {
    console.error('API Response Error:', error)
    
    // Transform axios errors into user-friendly messages
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Please check your connection and try again.')
    }
    
    if (error.response) {
      // Server responded with error status
      const status = error.response.status
      switch (status) {
        case 400:
          throw new Error('Invalid request. Please check your data and try again.')
        case 401:
          throw new Error('Unauthorized. Please log in again.')
        case 403:
          throw new Error('Forbidden. You don\'t have permission to perform this action.')
        case 404:
          throw new Error('Resource not found.')
        case 500:
          throw new Error('Server error. Please try again later.')
        default:
          throw new Error(`Request failed with status ${status}`)
      }
    } else if (error.request) {
      // Network error
      throw new Error('Network error. Please check your connection and try again.')
    } else {
      // Other error
      throw new Error('An unexpected error occurred. Please try again.')
    }
  }
)

// Transform user data from API to our app format (snake_case source)
const transformUser = (apiUser) => ({
  id: apiUser.id,
  firstName: apiUser.first_name ?? apiUser.firstName ?? '',
  lastName: apiUser.last_name ?? apiUser.lastName ?? '',
  email: apiUser.email ?? '',
  phone: apiUser.phone_number ?? apiUser.phone ?? '',
  company: apiUser.company ?? 'Unknown',
  plan: apiUser.plan ?? 'Free',
  avatar: apiUser.avatar ?? `https://api.dicebear.com/7.x/pixel-art/svg?seed=${apiUser.id}`
})

// Transform app user to API format (snake_case)
const transformToApiUser = (user) => ({
  first_name: user.firstName,
  last_name: user.lastName,
  email: user.email,
  phone_number: user.phone,
  company: user.company,
  plan: user.plan,
  avatar: user.avatar
})

export const apiService = {
  /**
   * Fetch users with optional filters and pagination
   * @param {Object} [options]
   * @param {number} [options.page] - Page number (1-based)
   * @param {number} [options.limit] - Page size
   * @param {string} [options.firstName] - Filter by first name (server-side key: "First Name")
   * @param {string} [options.lastName] - Filter by last name (server-side key: "Last Name")
   * @param {string} [options.plan] - Filter by plan
   * @param {string} [options.q] - Full-text search
   * @returns {Promise<Array>} Array of transformed user objects
   */
  async getUsers(options = {}) {
    try {
      const params = {}
      if (options.page) params._page = options.page
      if (options.limit) params._limit = options.limit
      if (options.q) params.q = options.q
      // json-server filter by field names (snake_case per API sample)
      if (options.firstName) params.first_name = options.firstName
      if (options.lastName) params.last_name = options.lastName
      if (options.plan) params.plan = options.plan

      const response = await apiClient.get('/', { params })
      const total = Number(response.headers['x-total-count'] || response.data.length || 0)
      return {
        users: response.data.map(transformUser),
        total
      }
    } catch (error) {
      console.error('Failed to fetch users:', error)
      throw error
    }
  },

  /**
   * Fetch a single user by ID
   * @param {number} id - User ID
   * @returns {Promise<Object>} Transformed user object
   */
  async getUserById(id) {
    try {
      const response = await apiClient.get(`/${id}`)
      return transformUser(response.data)
    } catch (error) {
      console.error(`Failed to fetch user ${id}:`, error)
      throw error
    }
  },

  /**
   * Create a new user
   * @param {Object} userData - User data to create
   * @returns {Promise<Object>} Created user object
   */
  async createUser(userData) {
    try {
      const apiData = transformToApiUser(userData)
      const response = await apiClient.post('/', apiData)
      return transformUser(response.data)
    } catch (error) {
      console.error('Failed to create user:', error)
      throw error
    }
  },

  /**
   * Update an existing user
   * @param {number} id - User ID
   * @param {Object} userData - Updated user data
   * @returns {Promise<Object>} Updated user object
   */
  async updateUser(id, userData) {
    try {
      const apiData = transformToApiUser(userData)
      // Use PATCH to update only provided fields
      const response = await apiClient.patch(`/${id}`, apiData)
      return transformUser(response.data)
    } catch (error) {
      console.error(`Failed to update user ${id}:`, error)
      throw error
    }
  },

  /**
   * Delete a user
   * @param {number} id - User ID
   * @returns {Promise<void>}
   */
  async deleteUser(id) {
    try {
      await apiClient.delete(`/${id}`)
    } catch (error) {
      console.error(`Failed to delete user ${id}:`, error)
      throw error
    }
  },

  /**
   * Search users by query
   * @param {string} query - Search query
   * @returns {Promise<Array>} Array of matching users
   */
  async searchUsers(query) {
    try {
      // Retool API supports search with q parameter
      const response = await apiClient.get(`/?q=${encodeURIComponent(query)}`)
      return response.data.map(transformUser)
    } catch (error) {
      console.error('Failed to search users:', error)
      throw error
    }
  }
}