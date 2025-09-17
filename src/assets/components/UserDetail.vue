<template>
  <div class="flex-1 bg-gray-100 p-4 sm:p-6">
    <div v-if="!selectedUser" class="text-center text-gray-500 py-20">
      <p class="text-xl">Select a user to view details</p>
    </div>

    <!-- Loading State -->
    <div v-else-if="isLoading" class="text-center py-20">
      <div class="inline-flex items-center">
        <svg
          class="animate-spin -ml-1 mr-3 h-6 w-6 text-blue-600"
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
        <span class="text-gray-600 text-lg">Loading user details...</span>
      </div>
    </div>

    <div
      v-else
      :class="[
        'rounded-lg p-6 sm:p-8 shadow-lg bg-white',
        isEditing ? 'border border-blue-200' : '',
      ]"
    >
      <!-- User Avatar and Basic Info -->
      <div class="flex items-center mb-6 sm:mb-8">
        <div
          class="w-20 h-20 sm:w-24 sm:h-24 bg-blue-50 rounded-lg mr-4 sm:mr-6 flex items-center justify-center ring-1 ring-blue-100"
        >
          <img
            :src="selectedUser.avatar"
            class="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover"
            alt="User avatar"
          />
        </div>
        <div>
          <h3 class="text-xl sm:text-2xl font-semibold text-gray-800 mb-1">
            {{ selectedUser.firstName }} {{ selectedUser.lastName }}
          </h3>
          <p class="text-gray-600 mb-2">Product Manager</p>
          <span
            class="bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full text-xs sm:text-sm font-medium"
            >{{ displayPlan }}</span
          >
        </div>
      </div>

      <!-- User Details Section -->
      <div class="mb-6">
        <h4 class="text-lg font-semibold text-gray-800 mb-4">User Details</h4>

        <!-- Form Fields -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div class="bg-gray-50 p-3 rounded-lg">
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >* First Name:</label
            >
            <input
              v-model="form.firstName"
              :readonly="!isEditing"
              type="text"
              class="w-full p-2 rounded bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              :class="[
                isEditing
                  ? 'border border-gray-300'
                  : 'border border-transparent bg-gray-100',
              ]"
            />
          </div>

          <div class="bg-gray-50 p-3 rounded-lg">
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >* Last Name:</label
            >
            <input
              v-model="form.lastName"
              :readonly="!isEditing"
              type="text"
              class="w-full p-2 rounded bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              :class="[
                isEditing
                  ? 'border border-gray-300'
                  : 'border border-transparent bg-gray-100',
              ]"
            />
          </div>

          <div class="bg-gray-50 p-3 rounded-lg">
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >* Plan:</label
            >
            <select
              v-model="form.plan"
              :disabled="!isEditing"
              class="w-full p-2 rounded bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              :class="[
                isEditing
                  ? 'border border-gray-300'
                  : 'border border-transparent bg-gray-100',
              ]"
            >
              <option
                v-for="opt in planOptions"
                :key="opt.value"
                :value="opt.value"
              >
                {{ opt.label }}
              </option>
            </select>
          </div>

          <div class="bg-gray-50 p-3 rounded-lg">
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >* Company:</label
            >
            <input
              v-model="form.company"
              :readonly="!isEditing"
              type="text"
              class="w-full p-2 rounded bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              :class="[
                isEditing
                  ? 'border border-gray-300'
                  : 'border border-transparent bg-gray-100',
              ]"
            />
          </div>

          <div class="bg-gray-50 p-3 rounded-lg">
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >* E-mail:</label
            >
            <input
              v-model="form.email"
              :readonly="!isEditing"
              type="email"
              class="w-full p-2 rounded bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              :class="[
                isEditing
                  ? 'border border-gray-300'
                  : 'border border-transparent bg-gray-100',
              ]"
            />
          </div>

          <div class="bg-gray-50 p-3 rounded-lg md:col-span-1">
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >* Phone #:</label
            >
            <input
              v-model="form.phone"
              :readonly="!isEditing"
              type="tel"
              class="w-full p-2 rounded bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              :class="[
                isEditing
                  ? 'border border-gray-300'
                  : 'border border-transparent bg-gray-100',
              ]"
            />
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-end">
        <div class="flex flex-wrap gap-2 sm:gap-3 justify-end">
          <button
            v-if="!isEditing"
            @click="startEdit"
            :disabled="isLoading"
            class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path
                d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
              ></path>
            </svg>
            Edit
          </button>
          <button
            v-if="isEditing"
            @click="saveUser"
            :disabled="isLoading"
            class="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            <svg
              v-if="isLoading"
              class="animate-spin -ml-1 mr-2 h-4 w-4"
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
            <svg
              v-else
              class="w-4 h-4 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6a1 1 0 10-2 0v5.586l-1.293-1.293z"
              ></path>
            </svg>
            {{ isLoading ? "Saving..." : "Save" }}
          </button>
          <button
            v-if="isEditing"
            @click="cancelEdit"
            :disabled="isLoading"
            class="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            Cancel
          </button>
          <button
            v-if="isEditing"
            @click="deleteUser"
            :disabled="isLoading"
            class="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"
                clip-rule="evenodd"
              ></path>
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clip-rule="evenodd"
              ></path>
            </svg>
            Delete
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg shadow-xl w-96 max-w-[90vw] mx-4">
        <!-- Header -->
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center">
            <div
              class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4"
            >
              <svg
                class="w-6 h-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                ></path>
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-800">Delete User</h3>
              <p class="text-sm text_gray-600">This action cannot be undone</p>
            </div>
          </div>
        </div>

        <!-- Content -->
        <div class="p-6">
          <p class="text-gray-700 mb-4">
            Are you sure you want to delete
            <span class="font-semibold"
              >{{ selectedUser?.firstName }} {{ selectedUser?.lastName }}</span
            >? This will permanently remove the user from the system.
          </p>
        </div>

        <!-- Actions -->
        <div class="p-6 bg-gray-50 rounded-b-lg flex justify-end space-x-3">
          <button
            @click="cancelDelete"
            :disabled="isLoading"
            class="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            Cancel
          </button>
          <button
            @click="confirmDelete"
            :disabled="isLoading"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            <svg
              v-if="isLoading"
              class="animate-spin -ml-1 mr-2 h-4 w-4"
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
            <svg
              v-else
              class="w-4 h-4 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"
                clip-rule="evenodd"
              ></path>
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clip-rule="evenodd"
              ></path>
            </svg>
            {{ isLoading ? "Deleting..." : "Delete User" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// watch is used to watch the selectedUser prop and update the form
import { ref, watch, computed } from "vue";
import { useUserStore } from "../../stores/userStore.js";

// Props and Emits
const props = defineProps(["selectedUser", "isLoading"]);
const emit = defineEmits(["updateUser", "deleteUser"]);

// Access store for plan options
const store = useUserStore();
const planOptions = computed(() => store.getPlanOptions());

// State
const isEditing = ref(false);
const showDeleteModal = ref(false);
const form = ref({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  company: "",
  plan: "",
});

// Display plan label for header badge
const displayPlan = computed(() => {
  const value = form.value.plan || "";
  const match = planOptions.value.find((p) => p.value === value);
  return match ? match.label : value || "—";
});

// watch the selectedUser prop and update the form
watch(
  () => props.selectedUser,
  (newUser) => {
    if (newUser) {
      form.value = { ...newUser };
      isEditing.value = false;
    }
  },
  { immediate: true }
);

// start edit and set isEditing to true
const startEdit = () => {
  isEditing.value = true;
};

// cancel edit and set isEditing to false
const cancelEdit = () => {
  isEditing.value = false;
};

// save user and set isEditing to false
const saveUser = () => {
  emit("updateUser", form.value);
  isEditing.value = false;
};

// show delete confirmation modal
const deleteUser = () => {
  showDeleteModal.value = true;
};

// confirm delete user
const confirmDelete = () => {
  emit("deleteUser", props.selectedUser.id);
  showDeleteModal.value = false;
};

// cancel delete
const cancelDelete = () => {
  showDeleteModal.value = false;
};
</script>
