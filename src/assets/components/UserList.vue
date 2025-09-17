<template>
  <div
    class="w-full md:w-80 bg-white shadow-lg flex flex-col h-full rounded-lg border border-gray-200"
  >
    <!-- Filter Header -->
    <div class="bg-blue-600 text-white p-4 rounded-t-lg sticky top-0 z-10">
      <div class="flex items-center justify-between">
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
        <button
          @click="toggleFilters"
          class="text-white/90 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-600 rounded"
          aria-label="Toggle filters"
          :aria-expanded="showFilters ? 'true' : 'false'"
        >
          <svg
            :class="[
              'w-5 h-5 transition-transform',
              showFilters ? 'rotate-0' : '-rotate-90',
            ]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>
    </div>

    <!-- User List -->
    <div class="bg-white flex-1 flex flex-col overflow-hidden px-3 pt-3 pb-2">
      <!-- Inline Filters -->
      <div
        v-show="showFilters"
        class="px-2 pt-2 pb-3 border border-gray-100 rounded-lg bg-gray-50 space-y-2"
      >
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
      <div class="flex-1 overflow-y-hidden">
        <!-- Loading State -->
        <div v-if="isLoading" class="p-8 text-center">
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
          v-else-if="store.getError()"
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
              <span class="text-sm">{{ store.getError() }}</span>
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
          v-else-if="filteredUsers.length === 0"
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
        <div v-else class="divide-y divide-gray-100">
          <div
            v-for="user in filteredUsers"
            :key="user.id"
            @click="selectUser(user)"
            @keydown.enter.prevent="selectUser(user)"
            role="button"
            tabindex="0"
            :class="[
              'p-3 cursor-pointer transition-colors outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white',
              selectedUser?.id === user.id
                ? 'bg-blue-50 text-blue-700'
                : 'hover:bg-gray-50 text-gray-800',
            ]"
          >
            <div class="flex items-center">
              <img
                :src="user.avatar"
                class="w-10 h-10 rounded-full mr-3 ring-2 ring-white shadow"
                alt="User avatar"
              />
              <div class="flex-1 min-w-0">
                <p class="font-medium truncate">
                  {{ user.firstName }} {{ user.lastName }}
                </p>
                <p class="text-sm text-gray-600 truncate">{{ user.email }}</p>
                <span
                  class="inline-block mt-1 text-xs bg-gray-200 px-2 py-0.5 rounded"
                  >{{ user.plan }}</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination Controls -->
      <div
        class="p-3 border-t border-gray-100 flex items-center justify-between"
      >
        <div class="text-xs text-gray-500">
          Page {{ page }} of {{ totalPages }} ({{ total }} users)
        </div>
        <div class="flex items-center gap-2">
          <button
            @click="prevPage"
            :disabled="page <= 1 || isLoading"
            class="px-2 py-1 text-sm rounded border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            aria-label="Previous page"
          >
            Previous
          </button>
          <button
            @click="nextPage"
            :disabled="page >= totalPages || isLoading"
            class="px-2 py-1 text-sm rounded border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            aria-label="Next page"
          >
            Next
          </button>
        </div>
      </div>
    </div>

    <!-- Create New User Button -->
    <div class="bg-gray-100 p-4">
      <button
        @click="openModal"
        class="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-100"
      >
        <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
            clip-rule="evenodd"
          ></path>
        </svg>
        Create new user
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useUserStore } from "../../stores/userStore.js";

// Props and Emits
// Props from parent are no longer needed; using store directly for data
const emit = defineEmits(["selectUser", "openModal"]);

// Access store
const store = useUserStore();
const filteredUsers = computed(() => store.getFilteredUsers());
const selectedUser = computed(() => store.getSelectedUser());
const isLoading = computed(() => store.isLoadingState());
const page = computed(() => store.getPagination().page);
const total = computed(() => store.getPagination().total);
// limit is internal; use derived totalPages

// Local filter inputs (bound to store on apply)
const firstName = ref("");
const lastName = ref("");
const plan = ref("");
const showFilters = ref(true);

const applyFilters = async () => {
  store.setFirstNameFilter(firstName.value);
  store.setLastNameFilter(lastName.value);
  store.setPlanFilter(plan.value);
  await store.fetchUsers();
};

const resetFilters = async () => {
  firstName.value = "";
  lastName.value = "";
  plan.value = "";
  store.resetFilters();
  await store.fetchUsers();
};

const toggleFilters = () => {
  showFilters.value = !showFilters.value;
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
  await store.fetchUsers();
};

// Pagination helpers
const totalPages = computed(() => store.getPagination().totalPages);

const nextPage = async () => {
  if (page.value < totalPages.value) {
    await store.fetchUsers({ page: page.value + 1 });
  }
};

const prevPage = async () => {
  if (page.value > 1) {
    await store.fetchUsers({ page: page.value - 1 });
  }
};
</script>
