<template>
  <div class="w-80 bg-white rounded-t-lg shadow-lg">
    <!-- Filter Header -->
    <div class="bg-blue-600 text-white p-4 rounded-t-lg">
      <div class="flex items-center">
        <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clip-rule="evenodd"></path>
        </svg>
        <span class="font-medium">Filter Users</span>
      </div>
    </div>

    <!-- User List -->
    <div class="bg-white">
      <div
        v-for="user in filteredUsers"
        :key="user.id"
        @click="selectUser(user)"
        :class="[
          'p-4 cursor-pointer transition-colors',
          selectedUser?.id === user.id 
            ? 'bg-blue-50 text-blue-600' 
            : 'hover:bg-gray-50 text-gray-800'
        ]"
      >
        <div class="flex items-center">
          <div class="flex-1">
            <p class="font-medium">{{ user.firstName }} {{ user.lastName }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Create New User Button -->
    <div class="bg-gray-100 p-4 rounded-b-lg">
      <button 
        @click="openModal"
        class="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
      >
        <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd"></path>
        </svg>
        Create New User
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

// Props and Emits
const props = defineProps(["users", "selectedUser"]);
const emit = defineEmits(["selectUser", "openModal"]);

// State
const searchTerm = ref("");
const planFilter = ref("");

// Computed used to filter users based on search and plan filter and returns the filtered users
const filteredUsers = computed(() => {
  let filtered = props.users;

  // Filter users based on search term
  if (searchTerm.value) {
    filtered = filtered.filter(
      (user) =>
        user.firstName.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.value.toLowerCase())
    );
  }
  // if plan filter is not empty, filter users based on plan
  if (planFilter.value) {
    filtered = filtered.filter((user) => user.plan === planFilter.value);
  }
  return filtered;
});

// emits the selected user to the parent, so parent can display details or update UI
const selectUser = (user) => {
  emit("selectUser", user);
};

// emits to parent to open the "New User" modal
const openModal = () => {
  emit("openModal");
};
</script>
