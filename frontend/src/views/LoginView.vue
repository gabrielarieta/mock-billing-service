<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()

const email = ref('')
const password = ref('')
const mode = ref<'login' | 'signup'>('login') // toggle

const action = async () => {
  try {
    if (mode.value === 'signup') {
      await auth.signup('Gabriel', email.value, password.value)
    } else {
      await auth.login(email.value, password.value)
    }
    router.push('/')
  } catch (err) {
    // já setado no store
  }
}
</script>

<template>
  <div class="p-6 max-w-sm mx-auto bg-white rounded shadow">
    <h2 class="text-2xl mb-4">{{ mode === 'login' ? 'Login' : 'Sign up' }}</h2>

    <form @submit.prevent="action">
      <div class="mb-4">
        <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
        <input
          id="email"
          v-model="email"
          type="email"
          required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring focus:ring-opacity-50"
        />
      </div>

      <div class="mb-4">
        <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
        <input
          id="password"
          v-model="password"
          type="password"
          required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring focus:ring-opacity-50"
        />
      </div>

      <p v-if="auth.loading" class="text-sm text-gray-500">Loading...</p>
      <p v-if="auth.error" class="text-sm text-red-500">{{ auth.error }}</p>

      <button
        type="submit"
        class="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {{ mode === 'login' ? 'Login' : 'Sign up' }}
      </button>
    </form>

    <div class="mt-2 text-sm">
      <span>Want to {{ mode === 'login' ? 'signup instead' : 'login' }}?</span>
      <button class="ml-1 text-blue-600" @click="mode = mode === 'login' ? 'signup' : 'login'">
        Switch
      </button>
    </div>
  </div>
</template>