<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div
      class="bg-white rounded-lg shadow-xl w-96 max-h-[90vh] overflow-y-auto"
    >
      <!-- Header -->
      <div
        class="p-6 border-b border-gray-200 flex justify-between items-start"
      >
        <div>
          <h3 class="text-xl font-bold text-gray-800">Creating New User</h3>
          <div class="text-gray-500 text-sm mt-1">-</div>
          <h4 class="text-lg font-semibold text-gray-800 mt-2">User Details</h4>
        </div>
        <button
          @click="closeModal"
          class="text-gray-400 hover:text-gray-600 transition-colors p-1"
          aria-label="Close modal"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="createUser" class="p-6">
        <div class="space-y-4">
          <div
            class="flex items-center bg-gray-50 p-4 rounded-lg border border-dashed border-gray-300"
          >
            <label class="w-32 text-sm font-medium text-gray-700"
              >* First Name :</label
            >
            <input
              v-model="form.firstName"
              type="text"
              required
              placeholder="First Name"
              class="flex-1 p-2 border border-gray-300 rounded bg-white"
            />
          </div>

          <div
            class="flex items-center bg-gray-50 p-4 rounded-lg border border-dashed border-gray-300"
          >
            <label class="w-32 text-sm font-medium text-gray-700"
              >* Last Name :</label
            >
            <input
              v-model="form.lastName"
              type="text"
              required
              placeholder="Last Name"
              class="flex-1 p-2 border border-gray-300 rounded bg-white"
            />
          </div>

          <div
            class="flex items-center bg-gray-50 p-4 rounded-lg border border-dashed border-gray-300"
          >
            <label class="w-32 text-sm font-medium text-gray-700"
              >* Plan :</label
            >
            <select
              v-model="form.plan"
              required
              class="flex-1 p-2 border border-gray-300 rounded bg-white"
            >
              <option value="">Select Plan</option>
              <option value="Free">Free Plan</option>
              <option value="Basic">Basic Plan</option>
              <option value="Pro">Pro Plan</option>
              <option value="Enterprise">Enterprise Plan</option>
            </select>
          </div>

          <div
            class="flex items-center bg-gray-50 p-4 rounded-lg border border-dashed border-gray-300"
          >
            <label class="w-32 text-sm font-medium text-gray-700"
              >* Company :</label
            >
            <select
              v-model="form.company"
              required
              class="flex-1 p-2 border border-gray-300 rounded bg-white"
            >
              <option value="">Select Company</option>
              <option value="Apple">Apple</option>
              <option value="Microsoft">Microsoft</option>
              <option value="Google">Google</option>
              <option value="Axiom">Axiom</option>
            </select>
          </div>

          <div
            class="flex items-center bg-gray-50 p-4 rounded-lg border border-dashed border-gray-300"
          >
            <label class="w-32 text-sm font-medium text-gray-700"
              >* E-mail :</label
            >
            <input
              v-model="form.email"
              type="email"
              required
              placeholder="E-mail"
              class="flex-1 p-2 border border-gray-300 rounded bg-white"
            />
          </div>

          <div
            class="flex items-center bg-gray-50 p-4 rounded-lg border border-dashed border-gray-300"
          >
            <label class="w-32 text-sm font-medium text-gray-700"
              >* Phone # :</label
            >
            <input
              v-model="form.phone"
              type="tel"
              placeholder="555-555-5555"
              class="flex-1 p-2 border border-gray-300 rounded bg-white"
            />
          </div>
        </div>

        <!-- Save Button -->
        <div class="flex justify-end mt-6">
          <button
            type="submit"
            :disabled="isLoading"
            class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
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
            {{ isLoading ? "Creating..." : "Save" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

// Props and Emits
const props = defineProps(["isOpen", "isLoading"]);
const emit = defineEmits(["close", "createUser"]);

// State
const form = ref({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  company: "",
  plan: "",
});

const createUser = () => {
  emit("createUser", { ...form.value });
  emit("close");
};

const closeModal = () => {
  emit("close");
};

// reset form when modal opens
watch(
  () => props.isOpen,
  (newVal) => {
    if (newVal) {
      form.value = {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        company: "",
        plan: "",
      };
    }
  },
  { immediate: true }
);
</script>
