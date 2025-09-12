
<template>
<div class="min-h-screen bg-gray-100">
    <div class="flex h-screen">
      <UserList 
        :users="users"
        :selected-user="selectedUser"
        @select-user="selectUser"
        @open-modal="openModal"
      />

      <!-- Simple user detail viewer for testing -->
      <div class="flex-1 p-6">
        <h2 class="text-2xl font-bold mb-4">Selected User</h2>
        <div v-if="selectedUser" class="bg-white shadow p-4 rounded">
          <img :src="selectedUser.avatar" class="w-20 h-20 rounded-full mb-3" />
          <p><strong>Name:</strong> {{ selectedUser.firstName }} {{ selectedUser.lastName }}</p>
          <p><strong>Email:</strong> {{ selectedUser.email }}</p>
          <p><strong>Plan:</strong> {{ selectedUser.plan }}</p>
        </div>
        <div v-else class="text-gray-500">No user selected</div>
      </div>
    </div>

    <!-- Very simple modal preview -->
    <div v-if="isModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white p-6 rounded shadow-lg">
        <h3 class="text-xl font-bold mb-4">New User Modal</h3>
        <p>This is where you would add a new user form.</p>
        <button @click="isModalOpen = false" class="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
          Close
        </button>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import UserList from './assets/components/UserList.vue'

// Simple local state for testing 
const users = ref([])
const selectedUser = ref(null)
const isModalOpen = ref(false)

// Mock Data for testing
const mockUsers = [
  { id: 1, firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', plan: 'Free' },
  { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@example.com', plan: 'Basic' },
  { id: 3, firstName: 'Jim', lastName: 'Beam', email: 'jim.beam@example.com', plan: 'Pro' },
  { id: 4, firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', plan: 'Free' },
  ]

  // Mount mock users for testing
onMounted(() => {
  users.value = mockUsers
})

// Handlers
const selectUser = (user) => {
  selectedUser.value = user
  console.log('Selected User:', user)
}

const openModal = () => {
  isModalOpen.value = true
  console.log('Modal Opened!')
}
</script>
