<template>
  <div
    class="min-h-screen overflow-hidden bg-gradient-to-b from-gray-50 to-gray-100"
  >
    <!-- Global Success Toast -->
    <div
      class="pointer-events-none fixed inset-0 z-50 flex items-start justify-end p-4"
    >
      <div
        v-if="successMessage"
        role="alert"
        aria-live="polite"
        class="pointer-events-auto mt-2 w-full max-w-sm rounded-lg bg-green-50 text-green-800 shadow-lg ring-1 ring-green-600/20"
      >
        <div class="flex items-start gap-3 px-4 py-3">
          <div class="mt-0.5 flex-shrink-0">
            <svg
              class="w-5 h-5 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div class="min-w-0 flex-1">
            <p class="text-sm font-medium truncate">Success</p>
            <p class="text-sm text-green-700 break-words">
              {{ successMessage }}
            </p>
          </div>
          <button
            @click="userStore.clearSuccess()"
            class="ml-2 inline-flex rounded p-1 text-green-700 hover:bg-green-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2 focus-visible:ring-offset-green-50"
            aria-label="Dismiss success"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
    <!-- Global Error Banner -->
    <div v-if="error" class="bg-red-600 text-white">
      <div class="max-w-7xl mx-auto px-4 py-3 flex items-start justify-between">
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
          <p class="text-sm">
            {{ error }}
          </p>
        </div>
        <button
          @click="userStore.clearError()"
          class="ml-4 text-white/90 hover:text-white"
          aria-label="Dismiss error"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>

    <div class="flex h-[calc(100vh-0px)] overflow-hidden gap-2 px-2 py-2">
      <UserList @select-user="selectUser" @open-modal="openModal" />
      <UserDetail
        :selected-user="selectedUser"
        :is-loading="isLoading"
        @update-user="updateUser"
        @delete-user="deleteUser"
      />
      <UserModal
        :is-open="userStore.getIsModalOpen()"
        :is-loading="isLoading"
        @close="closeModal"
        @create-user="createUser"
      />
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from "vue";
import { useUserStore } from "./stores/userStore.js";
import UserList from "./assets/components/UserList.vue";
import UserDetail from "./assets/components/UserDetail.vue";
import UserModal from "./assets/components/UserModal.vue";

// Use Pinia store
const userStore = useUserStore();

// Computed wrappers for function-only store getters
const successMessage = computed(() => userStore.getSuccessMessage());
const error = computed(() => userStore.getError());
const selectedUser = computed(() => userStore.getSelectedUser());
const isLoading = computed(() => userStore.isLoadingState());

// Load users from API on mount
onMounted(async () => {
  await userStore.fetchUsers();
});

// Handlers - now using store methods
const selectUser = (user) => {
  userStore.selectUser(user);
};

const updateUser = async (userData) => {
  await userStore.updateUserAPI(userStore.selectedUser.id, userData);
};

const createUser = async (userData) => {
  await userStore.createUserAPI(userData);
};

const deleteUser = async (userId) => {
  await userStore.deleteUserAPI(userId);
};

const openModal = () => {
  userStore.openModal();
};

const closeModal = () => {
  userStore.closeModal();
};
</script>
