<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()
</script>

<template>
  <div class="p-4">
    <header class="mb-6">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold">Invoice App</h1>
        <div class="flex items-center space-x-4 text-sm">
          <span v-if="auth.user">Hello {{ auth.user.name }}</span>
          <button
            class="px-3 py-1 bg-red-600 text-white rounded text-sm"
            @click="auth.logout()"
          >
            Logout
          </button>
        </div>
      </div>
    </header>

    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <router-link
        to="/customers"
        class="p-4 border rounded shadow-sm hover:bg-gray-50 text-blue-600"
      >
        <h2 class="text-lg font-medium">Customers</h2>
      </router-link>

      <router-link
        to="/invoices"
        class="p-4 border rounded shadow-sm hover:bg-gray-50 text-blue-600"
      >
        <h2 class="text-lg font-medium">Invoices</h2>
      </router-link>
    </div>
  </div>
</template>