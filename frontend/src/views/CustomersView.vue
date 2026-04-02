<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/composables/api'
import type { Customer } from '@/types'

type Customer = {
  id: string
  name: string
  email: string
}

const customers = ref<Customer[]>([])
const name = ref('')
const email = ref('')

const load = async () => {
  const res = await api.get('/customers')
  customers.value = res.data
}

const create = async () => {
  await api.post('/customers', { name: name.value, email: email.value })
  name.value = ''
  email.value = ''
  await load()
}

onMounted(() => {
  load()
})
</script>

<template>
  <div class="p-4">
    <header class="mb-6">
      <h1 class="text-2xl font-bold">Customers</h1>
    </header>

    <div class="border rounded p-4 mb-6 bg-gray-50">
      <h2 class="text-lg font-medium mb-2">Create a customer</h2>
      <form @submit.prevent="create" class="flex gap-2">
        <input
          v-model="name"
          placeholder="Name"
          required
          class="rounded px-2 py-1 border flex-1"
        />
        <input
          v-model="email"
          type="email"
          placeholder="Email"
          required
          class="rounded px-2 py-1 border flex-1"
        />
        <button
          type="submit"
          class="px-4 py-1 bg-blue-600 text-white rounded"
        >
          Create
        </button>
      </form>
    </div>

    <ul class="space-y-2">
      <li v-for="c in customers" :key="c.id" class="border p-3 rounded">
        {{ c.name }} – {{ c.email }}
      </li>
    </ul>
  </div>
</template>