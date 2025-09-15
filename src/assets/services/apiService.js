import axios from 'axios'

// API Configuration
const API_BASE_URL = 'https://jsonplaceholder.typicode.com/users'
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

// Transform user data from API to our format
const transformUser = (apiUser) => ({
  id: apiUser.id,
  firstName: apiUser.name?.split(' ')[0] || '',
  lastName: apiUser.name?.split(' ').slice(1).join(' ') || '',
  email: apiUser.email || '',
  phone: apiUser.phone || '',
  company: apiUser.company?.name || 'Unknown',
  plan: ['Free', 'Basic', 'Pro', 'Enterprise'][Math.floor(Math.random() * 4)],
  avatar: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${apiUser.id}`
})

// Transform user data from our format to API format
const transformToApiUser = (user) => ({
  name: `${user.firstName} ${user.lastName}`.trim(),
  email: user.email,
  phone: user.phone,
  company: {
    name: user.company
  }
})

export const apiService = {
  /**
   * Fetch all users from the API
   * @returns {Promise<Array>} Array of transformed user objects
   */
  async getUsers() {
    try {
      const response = await apiClient.get('/')
      return response.data.map(transformUser)
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
      const response = await apiClient.put(`/${id}`, apiData)
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
      const response = await apiClient.get(`/?q=${encodeURIComponent(query)}`)
      return response.data.map(transformUser)
    } catch (error) {
      console.error('Failed to search users:', error)
      throw error
    }
  }
}