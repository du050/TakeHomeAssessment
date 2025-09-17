<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    role="dialog"
    aria-modal="true"
    aria-labelledby="create-user-title"
  >
    <div
      class="bg-white rounded-xl shadow-xl w-[48rem] max-w-[95vw] max-h-[80vh] overflow-y-auto"
    >
      <!-- Header -->
      <div
        class="p-6 border-b border-gray-200 flex justify-between items-start sticky top-0 bg-white z-10"
      >
        <div>
          <h3 id="create-user-title" class="text-xl font-bold text-gray-800">
            Creating New User
          </h3>
          <div class="text-gray-500 text-sm mt-1">-</div>
          <h4 class="text-lg font-semibold text-gray-800 mt-2">User Details</h4>
        </div>
        <button
          @click="closeModal"
          class="text-gray-400 hover:text-gray-600 transition-colors p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded"
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
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div
            class="bg-gray-50 p-4 rounded-lg border border-dashed border-gray-300"
          >
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >* First Name :</label
            >
            <input
              v-model="form.firstName"
              type="text"
              required
              placeholder="First Name"
              class="w-full p-2 border border-gray-300 rounded bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            />
          </div>

          <div
            class="bg-gray-50 p-4 rounded-lg border border-dashed border-gray-300"
          >
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >* Last Name :</label
            >
            <input
              v-model="form.lastName"
              type="text"
              required
              placeholder="Last Name"
              class="w-full p-2 border border-gray-300 rounded bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            />
          </div>

          <div
            class="bg-gray-50 p-4 rounded-lg border border-dashed border-gray-300"
          >
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >* Plan :</label
            >
            <select
              v-model="form.plan"
              required
              class="w-full p-2 border border-gray-300 rounded bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <option value="">Select Plan</option>
              <option
                v-for="opt in planOptions"
                :key="opt.value"
                :value="opt.value"
              >
                {{ opt.label }}
              </option>
            </select>
          </div>

          <div
            class="bg-gray-50 p-4 rounded-lg border border-dashed border-gray-300"
          >
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >* Company :</label
            >
            <input
              v-model="form.company"
              required
              type="text"
              placeholder="e.g., Apple, Microsoft"
              class="w-full p-2 border border-gray-300 rounded bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            />
          </div>

          <div
            class="bg-gray-50 p-4 rounded-lg border border-dashed border-gray-300"
          >
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >* E-mail :</label
            >
            <input
              v-model="form.email"
              type="email"
              required
              placeholder="E-mail"
              class="w-full p-2 border border-gray-300 rounded bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            />
          </div>

          <div
            class="bg-gray-50 p-4 rounded-lg border border-dashed border-gray-300"
          >
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >* Phone # :</label
            >
            <input
              v-model="form.phone"
              type="tel"
              placeholder="555-555-5555"
              class="w-full p-2 border border-gray-300 rounded bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            />
          </div>
        </div>

        <!-- Save Button -->
        <div class="flex justify-end mt-6">
          <button
            type="submit"
            :disabled="isLoading"
            class="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
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
import { ref, watch, computed } from "vue";
import { useUserStore } from "../../stores/userStore.js";

// Props and Emits
const props = defineProps(["isOpen", "isLoading"]);
const emit = defineEmits(["close", "createUser"]);

// Access store for plan options
const store = useUserStore();
const planOptions = computed(() => store.getPlanOptions());

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
