<template>
  <div class="min-h-screen bg-gray-800">
    <div class="flex h-screen">
      <UserList
        :users="users"
        :selected-user="selectedUser"
        @select-user="selectUser"
        @open-modal="openModal"
      />
      <UserDetail
        :selected-user="selectedUser"
        @update-user="updateUser"
        @delete-user="deleteUser"
      />
      <UserModal
        :is-open="isModalOpen"
        @close="closeModal"
        @create-user="createUser"
      />
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
    firstName: "Brandon",
    lastName: "M",
    email: "brandon.m@example.com",
    phone: "555-0123",
    company: "Apple",
    plan: "Free",
    avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=brandon",
  },
  {
    id: 2,
    firstName: "Nykole",
    lastName: "M",
    email: "nmasters@axiomworx.com",
    phone: "403-555-5555",
    company: "Axiom",
    plan: "Pro",
    avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=nykole",
  },
  {
    id: 3,
    firstName: "Peter",
    lastName: "Z",
    email: "peter.z@example.com",
    phone: "555-0125",
    company: "Microsoft",
    plan: "Basic",
    avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=peter",
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
    avatar: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${userData.firstName.toLowerCase()}`,
  };
  users.value.push(newUser);
  console.log("Created User:", newUser);
};

const deleteUser = (userId) => {
  const userIndex = users.value.findIndex((u) => u.id === userId);
  if (userIndex !== -1) {
    const deletedUser = users.value[userIndex];
    users.value.splice(userIndex, 1);

    // Clear selection if the deleted user was selected
    if (selectedUser.value?.id === userId) {
      selectedUser.value = null;
    }

    console.log("Deleted User:", deletedUser);
  }
};

const openModal = () => {
  isModalOpen.value = true;
  console.log("Modal Opened!");
};

const closeModal = () => {
  isModalOpen.value = false;
};
</script>
