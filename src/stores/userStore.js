import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { apiService } from '../assets/services/apiService.js'
import { PLAN_OPTIONS } from '../constants/formOptions.js'

export const useUserStore = defineStore('user', () => {
  // State - reactive data
  const users = ref([])
  const selectedUser = ref(null)
  const isModalOpen = ref(false)
  const loading = ref(false)
  const error = ref(null)
  const successMessage = ref(null)
  // Plan options state (derived from API data, fallback to constants)
  const planOptionsState = ref([...PLAN_OPTIONS])
  // Filters
  const filterFirstName = ref("")
  const filterLastName = ref("")
  const filterPlan = ref("")
  // Pagination
  const page = ref(1)
  const limit = ref(8)
  const total = ref(0)

  // Internal computed state
  // good for searching without mutating the original users array
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

  // Public getters (functions only)
  const getSelectedUser = () => selectedUser.value
  const getIsModalOpen = () => isModalOpen.value
  const isLoadingState = () => loading.value
  const getError = () => error.value
  const getSuccessMessage = () => successMessage.value
  // filter getters intentionally not exported to avoid external mutation patterns
  // hide limit; provide total pages helper instead
  const getFilteredUsers = () => filteredUsers.value
  const getPagination = () => ({
    page: page.value,
    total: total.value,
    totalPages: Math.ceil((total.value || 0) / (limit.value || 1)) || 1
  })

  // Get plan options for components
  const getPlanOptions = () => planOptionsState.value

  // Internal: build plan options from current users (fallback to defaults)
  const rebuildPlanOptionsFromUsers = () => {
    try {
      const uniquePlans = Array.from(
        new Set((users.value || []).map(u => (u.plan || '').toString()).filter(Boolean))
      )
      if (uniquePlans.length === 0) {
        planOptionsState.value = [...PLAN_OPTIONS]
        return
      }
      // Preserve default order where possible, then append any new ones
      const defaultOrder = PLAN_OPTIONS.map(p => p.value)
      const inDefaults = uniquePlans.filter(p => defaultOrder.includes(p))
      const notInDefaults = uniquePlans.filter(p => !defaultOrder.includes(p))
      const ordered = [
        ...defaultOrder.filter(p => inDefaults.includes(p)),
        ...notInDefaults
      ]
      planOptionsState.value = ordered.map(p => ({ value: p, label: p }))
    } catch {
      // On any failure, ensure we still have sane options
      planOptionsState.value = [...PLAN_OPTIONS]
    }
  }

  // Actions - methods that modify state (encapsulated)
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

  // internal setters (not exported)
  const setLoading = (isLoading) => { loading.value = isLoading }
  const setError = (errorMessage) => { error.value = errorMessage }

  

  const setSuccess = (message) => { successMessage.value = message || null }

  

  // Internal helper to reset error/success together
  const resetStatus = () => {
    error.value = null
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
    // Validate against current plan options (reactive, includes API-derived values)
    const validPlans = (planOptionsState.value || []).map(p => p.value)
    if (value && !validPlans.includes(value)) {
      console.warn(`Invalid plan filter: ${value}. Valid options: ${validPlans.join(', ')}`)
      filterPlan.value = ""
      return
    }
    filterPlan.value = value || ""
  }
  const resetFilters = () => {
    filterFirstName.value = ""
    filterLastName.value = ""
    filterPlan.value = ""
  }

  // API Integration Methods
  const fetchUsers = async (options = {}) => {
    try {
      setLoading(true)
      resetStatus()
      // Persist incoming pagination options internally
      if (typeof options.page === 'number') {
        page.value = options.page
      }
      if (typeof options.limit === 'number') {
        limit.value = options.limit
      }
      const { users: apiUsers, total: apiTotal } = await apiService.getUsers({
        page: options.page ?? page.value,
        limit: options.limit ?? limit.value,
        q: options.q,
        firstName: (options.firstName ?? filterFirstName.value) || undefined,
        lastName: (options.lastName ?? filterLastName.value) || undefined,
        plan: (options.plan ?? filterPlan.value) || undefined,
      })
        
      setUsers(apiUsers)
      // Derive plan options from fetched data
      rebuildPlanOptionsFromUsers()
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

  // (Removed setPage/setLimit from public API; use fetchUsers({ page, limit }) instead)

  const createUserAPI = async (userData) => {
    try {
      setLoading(true)
      resetStatus()
      const newUser = await apiService.createUser(userData)
      users.value.push(newUser)
      // Immediately select the newly created user so details pane updates
      selectedUser.value = newUser
      // Update plan options if a new plan was introduced
      rebuildPlanOptionsFromUsers()
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
      resetStatus()
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
      // Update plan options in case plan changed to a new value
      rebuildPlanOptionsFromUsers()
      
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
      resetStatus()
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

  // (Removed searchUsersAPI; not used externally)

  return {
    // Getters (functions only)
    getSelectedUser,
    getIsModalOpen,
    isLoadingState,
    getError,
    getSuccessMessage,
    getFilteredUsers,
    getPagination,
    getPlanOptions,
    // Actions
    setUsers,
    selectUser,
    clearSelection,
    openModal,
    closeModal,
    setFirstNameFilter,
    setLastNameFilter,
    setPlanFilter,
    resetFilters,
    fetchUsers,
    createUserAPI,
    updateUserAPI,
    deleteUserAPI
  }
})
