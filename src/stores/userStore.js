import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { apiService } from '../assets/services/apiService.js'

export const useUserStore = defineStore('user', () => {
  // State - reactive data
  const users = ref([])
  const selectedUser = ref(null)
  const isModalOpen = ref(false)
  const loading = ref(false)
  const error = ref(null)
  const successMessage = ref(null)
  // Filters
  const filterFirstName = ref("")
  const filterLastName = ref("")
  const filterPlan = ref("")
  // Pagination
  const page = ref(1)
  const limit = ref(8)
  const total = ref(0)

  // Getters - computed properties
  const userCount = computed(() => users.value.length)
  const hasUsers = computed(() => users.value.length > 0)
  const filteredUsers = computed(() => {
    let result = users.value

    if (filterFirstName.value) {
      const term = filterFirstName.value.toLowerCase()
      result = result.filter(u => (u.firstName || "").toLowerCase().includes(term))
    }
    if (filterLastName.value) {
      const term = filterLastName.value.toLowerCase()
      result = result.filter(u => (u.lastName || "").toLowerCase().includes(term))
    }
    if (filterPlan.value) {
      result = result.filter(u => u.plan === filterPlan.value)
    }

    return result
  })

  // Actions - methods that modify state
  const setUsers = (userList) => {
    users.value = userList
  }

  const selectUser = (user) => {
    selectedUser.value = user
  }

  const clearSelection = () => {
    selectedUser.value = null
  }

  const openModal = () => {
    isModalOpen.value = true
  }

  const closeModal = () => {
    isModalOpen.value = false
  }

  const setLoading = (isLoading) => {
    loading.value = isLoading
  }

  const setError = (errorMessage) => {
    error.value = errorMessage
  }

  const clearError = () => {
    error.value = null
  }

  const setSuccess = (message) => {
    successMessage.value = message || null
  }

  const clearSuccess = () => {
    successMessage.value = null
  }

  // Filter setters
  const setFirstNameFilter = (value) => {
    filterFirstName.value = value || ""
  }
  const setLastNameFilter = (value) => {
    filterLastName.value = value || ""
  }
  const setPlanFilter = (value) => {
    filterPlan.value = value || ""
  }
  const resetFilters = () => {
    filterFirstName.value = ""
    filterLastName.value = ""
    filterPlan.value = ""
  }

  // CRUD Operations
  const addUser = (userData) => {
    const newUser = {
      ...userData,
      id: Date.now(),
      avatar: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${userData.firstName.toLowerCase()}`,
    }
    users.value.push(newUser)
    return newUser
  }

  const updateUser = (userId, userData) => {
    const userIndex = users.value.findIndex(u => u.id === userId)
    if (userIndex !== -1) {
      users.value[userIndex] = { ...users.value[userIndex], ...userData }
      
      // Update selected user if it's the same user
      // test
      if (selectedUser.value?.id === userId) {
        selectedUser.value = users.value[userIndex]
      }
      
      return users.value[userIndex]
    }
    return null
  }

  const deleteUser = (userId) => {
    const userIndex = users.value.findIndex(u => u.id === userId)
    if (userIndex !== -1) {
      const deletedUser = users.value[userIndex]
      users.value.splice(userIndex, 1)
      
      // Clear selection if the deleted user was selected
      if (selectedUser.value?.id === userId) {
        selectedUser.value = null
      }
      
      return deletedUser
    }
    return null
  }

  const getUserById = (userId) => {
    return users.value.find(u => u.id === userId)
  }

  // API Integration Methods
  const fetchUsers = async (options = {}) => {
    try {
      setLoading(true)
      clearError()
      clearSuccess()
      const { users: apiUsers, total: apiTotal } = await apiService.getUsers({
        page: options.page ?? page.value,
        limit: options.limit ?? limit.value,
        q: options.q,
        firstName: (options.firstName ?? filterFirstName.value) || undefined,
        lastName: (options.lastName ?? filterLastName.value) || undefined,
        plan: (options.plan ?? filterPlan.value) || undefined,
      })
        
      setUsers(apiUsers)
      if (!selectedUser.value && apiUsers && apiUsers.length) {
        selectedUser.value = apiUsers[0]
      }
      total.value = apiTotal
      return apiUsers
    } catch (error) {
      console.error('API Error:', error)
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const setPage = async (newPage) => {
    page.value = newPage
    await fetchUsers()
  }

  const setLimit = async (newLimit) => {
    limit.value = newLimit
    page.value = 1
    await fetchUsers()
  }

  const createUserAPI = async (userData) => {
    try {
      setLoading(true)
      clearError()
      clearSuccess()
      const newUser = await apiService.createUser(userData)
      users.value.push(newUser)
      setSuccess('User created successfully')
      return newUser
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const updateUserAPI = async (userId, userData) => {
    try {
      setLoading(true)
      clearError()
      clearSuccess()
      const updatedUser = await apiService.updateUser(userId, userData)
      
      // Update local state
      const userIndex = users.value.findIndex(u => u.id === userId)
      if (userIndex !== -1) {
        users.value[userIndex] = updatedUser
      }
      
      // Update selected user if it's the same user
      if (selectedUser.value?.id === userId) {
        selectedUser.value = updatedUser
      }
      
      setSuccess('User updated successfully')
      return updatedUser
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const deleteUserAPI = async (userId) => {
    try {
      setLoading(true)
      clearError()
      clearSuccess()
      await apiService.deleteUser(userId)
      
      // Update local state
      const userIndex = users.value.findIndex(u => u.id === userId)
      if (userIndex !== -1) {
        users.value.splice(userIndex, 1)
      }
      
      // Clear selection if the deleted user was selected
      if (selectedUser.value?.id === userId) {
        selectedUser.value = null
      }
      
      setSuccess('User deleted successfully')
      return true
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const searchUsersAPI = async (query) => {
    try {
      setLoading(true)
      clearError()
      const searchResults = await apiService.searchUsers(query)
      return searchResults
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  return {
    // State
    users,
    selectedUser,
    isModalOpen,
    loading,
    error,
    page,
    limit,
    total,
    successMessage,
    filterFirstName,
    filterLastName,
    filterPlan,
    // Getters
    userCount,
    hasUsers,
    filteredUsers,
    // Actions
    setUsers,
    selectUser,
    clearSelection,
    openModal,
    closeModal,
    setLoading,
    setError,
    clearError,
    setSuccess,
    clearSuccess,
    setPage,
    setLimit,
    setFirstNameFilter,
    setLastNameFilter,
    setPlanFilter,
    resetFilters,
    // CRUD Operations
    addUser,
    updateUser,
    deleteUser,
    getUserById,
    // API Integration
    fetchUsers,
    createUserAPI,
    updateUserAPI,
    deleteUserAPI,
    searchUsersAPI
  }
})
