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

const applyFilters = () => {
  store.setFirstNameFilter(firstName.value);
  store.setLastNameFilter(lastName.value);
  store.setPlanFilter(plan.value);
};

const resetFilters = () => {
  firstName.value = "";
  lastName.value = "";
  plan.value = "";
  store.resetFilters();
};

// emits the selected user to the parent, so parent can display details or update UI
const selectUser = (user) => {
  emit("selectUser", user);
};

// emits to parent to open the "New User" modal
const openModal = () => {
  emit("openModal");
};
</script>
