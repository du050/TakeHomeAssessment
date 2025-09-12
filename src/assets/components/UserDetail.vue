<template>
    <!-- User Detail -->
    <div class="flex-1 bg-white p-6">
    <div v-if="!selectedUser" class="text-center text-gray-500">
      <p>Select a user to view details</p>
    </div>

    <div v-else>
      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold">User Details</h2>
        <div>
          <button
            v-if="!isEditing"
            @click="startEdit"
            class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2"
          >
            Edit
          </button>
          <button
            v-if="isEditing"
            @click="saveUser"
            class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mr-2"
          >
            Save
          </button>
          <button
            v-if="isEditing"
            @click="cancelEdit"
            class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </div>

      <!-- User Info -->
      <div class="flex items-center mb-6">
        <img 
          :src="selectedUser.avatar" 
          class="w-20 h-20 rounded-full mr-4"
        />
        <div>
          <h3 class="text-xl font-semibold">{{ selectedUser.firstName }} {{ selectedUser.lastName }}</h3>
          <p class="text-gray-600">{{ selectedUser.email }}</p>
          <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">{{ selectedUser.plan }}</span>
        </div>
      </div>

      <!-- Form -->
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium mb-1">First Name</label>
          <input
            v-model="form.firstName"
            :readonly="!isEditing"
            type="text"
            class="w-full p-2 border rounded"
            :class="{ 'bg-gray-100': !isEditing }"
          />
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Last Name</label>
          <input
            v-model="form.lastName"
            :readonly="!isEditing"
            type="text"
            class="w-full p-2 border rounded"
            :class="{ 'bg-gray-100': !isEditing }"
          />
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Email</label>
          <input
            v-model="form.email"
            :readonly="!isEditing"
            type="email"
            class="w-full p-2 border rounded"
            :class="{ 'bg-gray-100': !isEditing }"
          />
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Phone</label>
          <input
            v-model="form.phone"
            :readonly="!isEditing"
            type="tel"
            class="w-full p-2 border rounded"
            :class="{ 'bg-gray-100': !isEditing }"
          />
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Company</label>
          <select
            v-model="form.company"
            :disabled="!isEditing"
            class="w-full p-2 border rounded"
            :class="{ 'bg-gray-100': !isEditing }"
          >
            <option value="Apple">Apple</option>
            <option value="Microsoft">Microsoft</option>
            <option value="Google">Google</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Plan</label>
          <select
            v-model="form.plan"
            :disabled="!isEditing"
            class="w-full p-2 border rounded"
            :class="{ 'bg-gray-100': !isEditing }"
          >
            <option value="Free">Free</option>
            <option value="Basic">Basic</option>
            <option value="Pro">Pro</option>
            <option value="Enterprise">Enterprise</option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

// watch is used to watch the selectedUser prop and update the form
import { ref, watch } from 'vue'

// Props and Emits
const props = defineProps(['selectedUser']);
const emit = defineEmits(['updateUser']);

// State
const isEditing = ref(false);
const form = ref({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    plan: ''
});

// watch the selectedUser prop and update the form
watch(() => props.selectedUser, (newUser) => {
    if (newUser) {
        form.value = {...newUser};
        isEditing.value = false;
    }
}, { immediate: true });

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
    emit('updateUser', form.value);
    isEditing.value = false;
};
</script>