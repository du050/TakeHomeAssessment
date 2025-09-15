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
import { onMounted } from "vue";
import { useUserStore } from "./stores/userStore.js";
import UserList from "./assets/components/UserList.vue";
import UserDetail from "./assets/components/UserDetail.vue";
import UserModal from "./assets/components/UserModal.vue";

// Use Pinia store
const userStore = useUserStore();
const { users, selectedUser, isModalOpen } = userStore;

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
  userStore.setUsers(mockUsers);
});

// Handlers - now using store methods
const selectUser = (user) => {
  userStore.selectUser(user);
  console.log("Selected User:", user);
};

const updateUser = (userData) => {
  const updatedUser = userStore.updateUser(selectedUser.value.id, userData);
  if (updatedUser) {
    console.log("Updated User:", updatedUser);
  }
};

const createUser = (userData) => {
  const newUser = userStore.addUser(userData);
  console.log("Created User:", newUser);
};

const deleteUser = (userId) => {
  const deletedUser = userStore.deleteUser(userId);
  if (deletedUser) {
    console.log("Deleted User:", deletedUser);
  }
};

const openModal = () => {
  userStore.openModal();
  console.log("Modal Opened!");
};

const closeModal = () => {
  userStore.closeModal();
};
</script>
