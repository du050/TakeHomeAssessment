<template>
<div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div class="bg-white rounded-lg p-6 w-96">
      <h3 class="text-lg font-bold mb-4">Create New User</h3>
      
      <!-- Form -->
      <form @submit.prevent="createUser">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">First Name</label>
            <input
              v-model="form.firstName"
              type="text"
              required
              class="w-full p-2 border rounded"
            />
          </div>

          <!-- Last Name -->
          <div>
            <label class="block text-sm font-medium mb-1">Last Name</label>
            <input
              v-model="form.lastName"
              type="text"
              required
              class="w-full p-2 border rounded"
            />
          </div>

          <!-- Email -->
          <div>
            <label class="block text-sm font-medium mb-1">Email</label>
            <input
              v-model="form.email"
              type="email"
              required
              class="w-full p-2 border rounded"
            />
          </div>

          <!-- Phone -->
          <div>
            <label class="block text-sm font-medium mb-1">Phone</label>
            <input
              v-model="form.phone"
              type="tel"
              class="w-full p-2 border rounded"
            />
          </div>

          <!-- Company -->
          <div>
            <label class="block text-sm font-medium mb-1">Company</label>
            <select v-model="form.company" required class="w-full p-2 border rounded">
              <option value="">Select Company</option>
              <option value="Apple">Apple</option>
              <option value="Microsoft">Microsoft</option>
              <option value="Google">Google</option>
            </select>
          </div>

          <!-- Plan -->
          <div>
            <label class="block text-sm font-medium mb-1">Plan</label>
            <select v-model="form.plan" required class="w-full p-2 border rounded">
              <option value="">Select Plan</option>
              <option value="Free">Free</option>
              <option value="Basic">Basic</option>
              <option value="Pro">Pro</option>
              <option value="Enterprise">Enterprise</option>
            </select>
          </div>
        </div>

        <!-- Buttons -->
        <div class="flex justify-end space-x-2 mt-6">
          <button
            type="button"
            @click="closeModal"
            class="px-4 py-2 text-gray-600 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'; 

// Props and Emits
const props = defineProps(['isOpen']);
const emit = defineEmits(['close','createUser']);

// State
const form = ref({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    plan: ''
});

const createUser = () => {
    emit('createUser', {...form.value});
    emit('close');
};

const closeModal = () => {
    emit('close');
};

// reset form when modal opens
watch(() => props.isOpen, (newVal) => {
    if (newVal) {
        form.value = {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            company: '',
            plan: ''
        };
    }
}, { immediate: true });

</script>
