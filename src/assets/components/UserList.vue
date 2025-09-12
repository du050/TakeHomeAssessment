<template> 
    <div class="w-1/3 bg-white border-r border-gray-200">
    <!-- Header -->
     <div class="p-4 border-b">
      <h2 class="text-xl font-bold text-gray-800">Users</h2>
      <button 
        @click="openModal"
        class="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        + New User
      </button>



<!-- Search and Filter -->
<div class="p-4 border-b">
      <input
        v-model="searchTerm"
        type="text"
        placeholder="Search users..."
        class="w-full p-2 border rounded"
      />
</div>
 <div class="p-4 border-b">
      <select v-model="planFilter" class="w-full p-2 border rounded">
        <option value="">All Plans</option>
        <option value="Free">Free</option>
        <option value="Basic">Basic</option>
        <option value="Pro">Pro</option>
        <option value="Enterprise">Enterprise</option>
      </select>
    </div>

<!-- User List -->
<div class="overflow-y-auto" style="height: 400px;">
      <div
        v-for="user in filteredUsers"
        :key="user.id"
        @click="selectUser(user)"
        :class="[
          'p-4 border-b cursor-pointer hover:bg-gray-50',
          selectedUser?.id === user.id ? 'bg-blue-100' : ''
        ]"
      >
        <div class="flex items-center">
          <img 
            :src="user.avatar" 
            class="w-10 h-10 rounded-full mr-3"
          />
          <div>
            <p class="font-medium">{{ user.firstName }} {{ user.lastName }}</p>
            <p class="text-sm text-gray-600">{{ user.email }}</p>
            <span class="text-xs bg-gray-200 px-2 py-1 rounded">{{ user.plan }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

// Props and Emits
const props = defineProps(['users', 'selectedUser']);
const emit = defineEmits(['selectUser', 'openModal']);

// State
const searchTerm = ref('');
const planFilter = ref('');

// Computed used to filter users based on search and plan filter and returns the filtered users
const filteredUsers = computed(() => {
    let filtered = props.users;

// Filter users based on search term
    if (searchTerm.value) {
        filtered = filtered.filter(user => 
            user.firstName.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
            user.lastName.toLowerCase().includes(searchTerm.value.toLowerCase()) 
        )
    }
    // if plan filter is not empty, filter users based on plan
    if(planFilter.value) {
        filtered = filtered.filter(user => user.plan === planFilter.value)
    }
    return filtered;
});

// emits the selected user to the parent, so parent can display details or update UI
const selectUser = (user) => {
    emit('selectUser', user);
};

// emits to parent to open the "New User" modal
const openModal = () => {
    emit('openModal');
};
</script>



