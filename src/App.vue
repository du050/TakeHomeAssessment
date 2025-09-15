<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Tailwind Test Banner -->
    <div class="bg-green-500 text-white p-4 text-center">
      <h1 class="text-2xl font-bold">🎉 Tailwind CSS is Working!</h1>
      <p class="text-sm">
        If you can see this green banner, Tailwind is properly configured.
      </p>
    </div>

    <div class="flex h-screen">
      <UserList
        :users="users"
        :selected-user="selectedUser"
        @select-user="selectUser"
        @open-modal="openModal"
      />
      <UserDetail :selected-user="selectedUser" @update-user="updateUser" />
      <UserModal
        :is-open="isModalOpen"
        @close="closeModal"
        @create-user="createUser"
      />

      <!-- Simple user detail viewer for testing -->
      <div class="flex-1 p-6">
        <h2 class="text-2xl font-bold mb-4 text-gray-800">Selected User</h2>
        <div
          v-if="selectedUser"
          class="bg-white shadow-lg p-6 rounded-lg border"
        >
          <img :src="selectedUser.avatar" class="w-20 h-20 rounded-full mb-3" />
          <p class="text-lg">
            <strong>Name:</strong> {{ selectedUser.firstName }}
            {{ selectedUser.lastName }}
          </p>
          <p class="text-gray-600">
            <strong>Email:</strong> {{ selectedUser.email }}
          </p>
          <p class="text-blue-600">
            <strong>Plan:</strong> {{ selectedUser.plan }}
          </p>
        </div>
        <div v-else class="text-gray-500 text-center py-8">
          No user selected
        </div>
      </div>
    </div>

    <!-- Very simple modal preview -->
    <div
      v-if="isModalOpen"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
        <h3 class="text-xl font-bold mb-4 text-gray-800">New User Modal</h3>
        <p class="text-gray-600 mb-4">
          This is where you would add a new user form.
        </p>
        <button
          @click="isModalOpen = false"
          class="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import UserList from "./assets/components/UserList.vue";
import UserDetail from "./assets/components/UserDetail.vue";
import UserModal from "./assets/components/UserModal.vue";

// Simple local state for testing
const users = ref([]);
const selectedUser = ref(null);
const isModalOpen = ref(false);

// Mock Data for testing
const mockUsers = [
  {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    plan: "Free",
  },
  {
    id: 2,
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
    plan: "Basic",
  },
  {
    id: 3,
    firstName: "Jim",
    lastName: "Beam",
    email: "jim.beam@example.com",
    plan: "Pro",
  },
  {
    id: 4,
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    plan: "Free",
  },
];

// Mount mock users for testing
onMounted(() => {
  users.value = mockUsers;
});

// Handlers
const selectUser = (user) => {
  selectedUser.value = user;
  console.log("Selected User:", user);
};

const updateUser = (userData) => {
  const index = users.value.findIndex((u) => u.id === selectedUser.value.id);
  if (index !== -1) {
    users.value[index] = { ...users.value[index], ...userData };
    selectedUser.value = users.value[index];
  }
};

const createUser = (userData) => {
  const newUser = {
    ...userData,
    id: Date.now(),
    avatar:
      "https://ui-avatars.com/api/?name=" +
      userData.firstName +
      "+" +
      userData.lastName,
  };
  users.value.push(newUser);
  console.log("Created User:", newUser);
};

const openModal = () => {
  isModalOpen.value = true;
  console.log("Modal Opened!");
};

const closeModal = () => {
  isModalOpen.value = false;
};
</script>
