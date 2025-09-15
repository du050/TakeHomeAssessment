<template>
  <div class="flex-1 bg-gray-100 p-6">
    <div v-if="!selectedUser" class="text-center text-gray-500 py-20">
      <p class="text-xl">Select a user to view details</p>
    </div>

    <div v-else class="bg-white rounded-lg shadow-lg p-8">
      <!-- User Avatar and Basic Info -->
      <div class="flex items-center mb-8">
        <div
          class="w-24 h-24 bg-blue-100 rounded-lg mr-6 flex items-center justify-center"
        >
          <img
            :src="selectedUser.avatar"
            class="w-20 h-20 rounded-lg object-cover"
          />
        </div>
        <div>
          <h3 class="text-2xl font-semibold text-gray-800 mb-1">
            {{ selectedUser.firstName }} {{ selectedUser.lastName }}
          </h3>
          <p class="text-gray-600 mb-2">Product Manager</p>
          <span
            class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
            >{{ selectedUser.plan }}</span
          >
        </div>
      </div>

      <!-- User Details Section -->
      <div class="mb-6">
        <h4 class="text-lg font-semibold text-gray-800 mb-4">User Details</h4>

        <!-- Form Fields -->
        <div class="space-y-4">
          <div class="flex items-center bg-gray-50 p-4 rounded-lg">
            <label class="w-32 text-sm font-medium text-gray-700"
              >* First Name:</label
            >
            <input
              v-model="form.firstName"
              :readonly="!isEditing"
              type="text"
              class="flex-1 p-2 border border-gray-300 rounded bg-white"
              :class="{ 'bg-gray-100': !isEditing }"
            />
          </div>

          <div class="flex items-center bg-gray-50 p-4 rounded-lg">
            <label class="w-32 text-sm font-medium text-gray-700"
              >* Last Name:</label
            >
            <input
              v-model="form.lastName"
              :readonly="!isEditing"
              type="text"
              class="flex-1 p-2 border border-gray-300 rounded bg-white"
              :class="{ 'bg-gray-100': !isEditing }"
            />
          </div>

          <div class="flex items-center bg-gray-50 p-4 rounded-lg">
            <label class="w-32 text-sm font-medium text-gray-700"
              >* Plan:</label
            >
            <select
              v-model="form.plan"
              :disabled="!isEditing"
              class="flex-1 p-2 border border-gray-300 rounded bg-white"
              :class="{ 'bg-gray-100': !isEditing }"
            >
              <option value="Free">Free Plan</option>
              <option value="Basic">Basic Plan</option>
              <option value="Pro">Pro Plan</option>
              <option value="Enterprise">Enterprise Plan</option>
            </select>
          </div>

          <div class="flex items-center bg-gray-50 p-4 rounded-lg">
            <label class="w-32 text-sm font-medium text-gray-700"
              >* Company:</label
            >
            <select
              v-model="form.company"
              :disabled="!isEditing"
              class="flex-1 p-2 border border-gray-300 rounded bg-white"
              :class="{ 'bg-gray-100': !isEditing }"
            >
              <option value="Apple">Apple</option>
              <option value="Microsoft">Microsoft</option>
              <option value="Google">Google</option>
              <option value="Axiom">Axiom</option>
            </select>
          </div>

          <div class="flex items-center bg-gray-50 p-4 rounded-lg">
            <label class="w-32 text-sm font-medium text-gray-700"
              >* E-mail:</label
            >
            <input
              v-model="form.email"
              :readonly="!isEditing"
              type="email"
              class="flex-1 p-2 border border-gray-300 rounded bg-white"
              :class="{ 'bg-gray-100': !isEditing }"
            />
          </div>

          <div class="flex items-center bg-gray-50 p-4 rounded-lg">
            <label class="w-32 text-sm font-medium text-gray-700"
              >* Phone #:</label
            >
            <input
              v-model="form.phone"
              :readonly="!isEditing"
              type="tel"
              class="flex-1 p-2 border border-gray-300 rounded bg-white"
              :class="{ 'bg-gray-100': !isEditing }"
            />
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-between">
        <!-- Delete Button (Left) -->
        <button
          v-if="!isEditing"
          @click="deleteUser"
          class="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center"
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
          Delete User
        </button>

        <!-- Edit/Save/Cancel Buttons (Right) -->
        <div class="flex space-x-3">
          <button
            v-if="!isEditing"
            @click="startEdit"
            class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
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
            class="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
          >
            <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path
                d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6a1 1 0 10-2 0v5.586l-1.293-1.293z"
              ></path>
            </svg>
            Save
          </button>
          <button
            v-if="isEditing"
            @click="cancelEdit"
            class="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// watch is used to watch the selectedUser prop and update the form
import { ref, watch } from "vue";

// Props and Emits
const props = defineProps(["selectedUser"]);
const emit = defineEmits(["updateUser", "deleteUser"]);

// State
const isEditing = ref(false);
const form = ref({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  company: "",
  plan: "",
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

// delete user with confirmation
const deleteUser = () => {
  if (
    confirm(
      `Are you sure you want to delete ${props.selectedUser.firstName} ${props.selectedUser.lastName}? This action cannot be undone.`
    )
  ) {
    emit("deleteUser", props.selectedUser.id);
  }
};
</script>
