import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  // State - reactive data
  const users = ref([])
  const selectedUser = ref(null)
  const isModalOpen = ref(false)
  const loading = ref(false)
  const error = ref(null)

  // Getters - computed properties
  const userCount = computed(() => users.value.length)
  const hasUsers = computed(() => users.value.length > 0)

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

  return {
    // State
    users,
    selectedUser,
    isModalOpen,
    loading,
    error,
    // Getters
    userCount,
    hasUsers,
    // Actions
    setUsers,
    selectUser,
    clearSelection,
    openModal,
    closeModal,
    setLoading,
    setError,
    clearError,
    // CRUD Operations
    addUser,
    updateUser,
    deleteUser,
    getUserById
  }
})
