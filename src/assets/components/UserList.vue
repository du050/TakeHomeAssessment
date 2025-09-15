<template>
  <div class="w-80 bg-white rounded-t-lg shadow-lg">
    <!-- Filter Header -->
    <div class="bg-blue-600 text-white p-4 rounded-t-lg">
      <div class="flex items-center">
        <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
            clip-rule="evenodd"
          ></path>
        </svg>
        <span class="font-medium">Filter Users</span>
      </div>
    </div>

    <!-- User List -->
    <div class="bg-white">
      <!-- Inline Filters -->
      <div class="px-4 pt-3 pb-4 border-b border-gray-100 space-y-2">
        <input
          v-model="firstName"
          type="text"
          placeholder="First Name"
          class="w-full px-3 py-2 border border-gray-300 rounded"
        />
        <input
          v-model="lastName"
          type="text"
          placeholder="Last Name"
          class="w-full px-3 py-2 border border-gray-300 rounded"
        />
        <select
          v-model="plan"
          class="w-full px-3 py-2 border border-gray-300 rounded"
        >
          <option value="">All Plans</option>
          <option value="Free">Free</option>
          <option value="Basic">Basic</option>
          <option value="Pro">Pro</option>
          <option value="Enterprise">Enterprise</option>
        </select>
        <div class="flex gap-2">
          <button
            @click="applyFilters"
            class="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 text-sm"
          >
            Filter
          </button>
          <button
            @click="resetFilters"
            class="flex-1 bg-gray-100 text-gray-700 py-2 rounded hover:bg-gray-200 text-sm"
          >
            Reset
          </button>
        </div>
      </div>
      <!-- Loading State -->
      <div v-if="store.loading" class="p-8 text-center">
        <div class="inline-flex items-center">
          <svg
            class="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span class="text-gray-600">Loading users...</span>
        </div>
      </div>

      <!-- Error State -->
      <div
        v-else-if="store.error"
        class="p-4 mx-4 my-4 rounded border border-red-200 bg-red-50 text-red-700"
      >
        <div class="flex items-start justify-between">
          <div class="flex items-start">
            <svg
              class="w-5 h-5 mr-2 mt-0.5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            <span class="text-sm">{{ store.error }}</span>
          </div>
          <div class="flex gap-2">
            <button
              @click="retryFetch"
              class="px-2 py-1 rounded text-xs bg-red-600 text-white hover:bg-red-700"
            >
              Retry
            </button>
            <button
              @click="store.clearError()"
              class="px-2 py-1 rounded text-xs bg-white border border-red-300 text-red-700 hover:bg-red-100"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="store.filteredUsers.length === 0"
        class="p-8 text-center text-gray-500"
      >
        <svg
          class="w-12 h-12 mx-auto mb-4 text-gray-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
          ></path>
        </svg>
        <p class="text-lg font-medium mb-2">No users found</p>
        <p class="text-sm">Try adjusting your filters or create a new user</p>
      </div>

      <!-- User List -->
      <div v-else>
        <div
          v-for="user in store.filteredUsers"
          :key="user.id"
          @click="selectUser(user)"
          :class="[
            'p-4 cursor-pointer transition-colors',
            selectedUser?.id === user.id
              ? 'bg-blue-50 text-blue-600'
              : 'hover:bg-gray-50 text-gray-800',
          ]"
        >
          <div class="flex items-center">
            <img :src="user.avatar" class="w-10 h-10 rounded-full mr-3" />
            <div class="flex-1">
              <p class="font-medium">
                {{ user.firstName }} {{ user.lastName }}
              </p>
              <p class="text-sm text-gray-600">{{ user.email }}</p>
              <span class="text-xs bg-gray-200 px-2 py-1 rounded">{{
                user.plan
              }}</span>
            </div>
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
          <path
            fill-rule="evenodd"
            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
            clip-rule="evenodd"
          ></path>
        </svg>
        Create New User
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useUserStore } from "../../stores/userStore.js";

// Props and Emits
const props = defineProps(["users", "selectedUser"]);
const emit = defineEmits(["selectUser", "openModal"]);

// Access store
const store = useUserStore();

// Local filter inputs (bound to store on apply)
const firstName = ref("");
const lastName = ref("");
const plan = ref("");

const applyFilters = async () => {
  store.setFirstNameFilter(firstName.value);
  store.setLastNameFilter(lastName.value);
  store.setPlanFilter(plan.value);
  try {
    await store.fetchUsers();
  } catch (_) {}
};

const resetFilters = async () => {
  firstName.value = "";
  lastName.value = "";
  plan.value = "";
  store.resetFilters();
  try {
    await store.fetchUsers();
  } catch (_) {}
};

// emits the selected user to the parent, so parent can display details or update UI
const selectUser = (user) => {
  emit("selectUser", user);
};

// emits to parent to open the "New User" modal
const openModal = () => {
  emit("openModal");
};

// Retry fetch users
const retryFetch = async () => {
  try {
    await store.fetchUsers();
  } catch (_) {
    // Error already handled/set in store
  }
};
</script>
