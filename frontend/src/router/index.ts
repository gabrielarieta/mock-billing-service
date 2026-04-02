import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'Dashboard', component: () => import('../views/DashboardView.vue') },
  { path: '/login', name: 'Login', component: () => import('../views/LoginView.vue') },
  { path: '/customers', name: 'Customers', component: () => import('../views/CustomersView.vue') },
  { path: '/invoices', name: 'Invoices', component: () => import('../views/InvoicesView.vue') },
]

export default routes