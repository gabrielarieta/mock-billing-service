<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/composables/api'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const invoices = ref<any[]>([])
const customers = ref<any[]>([])

const number = ref('')
const amount = ref<number | ''>('')
const customer_id = ref('')
const issue_date = ref('')
const due_date = ref('')

const loadCustomers = async () => {
  const res = await api.get('/customers')
  customers.value = res.data
}

const loadInvoices = async () => {
  const res = await api.get('/invoices')
  invoices.value = res.data
}

const create = async () => {
  await api.post('/invoices', {
    number: number.value,
    amount: Number(amount.value),
    customerId: customer_id.value,
    issueDate: issue_date.value,
    dueDate: due_date.value,
  })
  number.value = ''
  amount.value = ''
  issue_date.value = ''
  due_date.value = ''
  await loadInvoices()
}

const pay = async (id: string, amount: number) => {
  await api.post(`/invoices/${id}/pay`, { amount })
  await loadInvoices()
}

onMounted(async () => {
  await loadCustomers()
  await loadInvoices()
})
</script>

<template>
  <div class="p-4">
    <header class="mb-6">
      <h1 class="text-2xl font-bold">Invoices</h1>
    </header>

    <div class="border rounded p-4 mb-6 bg-gray-50">
      <h2 class="text-lg font-medium mb-2">Create an invoice</h2>
      <form @submit.prevent="create" class="space-y-3">
        <div class="flex gap-2">
          <input
            v-model="number"
            placeholder="Invoice number"
            required
            class="rounded px-2 py-1 border flex-1"
          />
          <input
            v-model="amount"
            type="number"
            placeholder="Amount"
            step="0.01"
            required
            class="rounded px-2 py-1 border w-24"
          />
        </div>
        <div class="flex gap-2">
          <select
            v-model="customer_id"
            required
            class="block rounded px-2 py-1 border flex-1"
          >
            <option value="">Choose a customer</option>
            <option v-for="c in customers" :key="c.id" :value="c.id">
              {{ c.name }} – {{ c.email }}
            </option>
          </select>
        </div>
        <div class="flex gap-2">
          <input
            v-model="issue_date"
            type="date"
            required
            class="rounded px-2 py-1 border flex-1"
          />
          <input
            v-model="due_date"
            type="date"
            required
            class="rounded px-2 py-1 border flex-1"
          />
        </div>
        <button
          type="submit"
          class="px-4 py-1 bg-blue-600 text-white rounded"
        >
          Create invoice
        </button>
      </form>
    </div>

    <ul class="space-y-3">
      <li v-for="i in invoices" :key="i.id" class="border rounded p-3 space-y-2">
        <div>
          <span class="font-medium">Num</span>: {{ i.number }}
        </div>
        <div>
          <span class="font-medium">Amount</span>: {{ i.amount }}
        </div>
        <div>
          <span class="font-medium">Customer</span>: {{ i.customer?.name }}
        </div>
        <div class="flex gap-2">
          <button
            v-if="i.status === 'PENDING'"
            class="px-3 py-1 text-sm bg-green-600 text-white rounded"
            @click="pay(i.id, i.amount)"
          >
            Pay invoice
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>