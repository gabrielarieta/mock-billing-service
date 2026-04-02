import { defineStore } from 'pinia'
import api from '@/composables/api'

interface User {
  id: string
  name: string
  email: string
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async signup(name: string, email: string, password: string) {
      this.loading = true
      this.error = null
      try {
        const res = await api.post('/auth/signup', { name, email, password })
        localStorage.setItem('access_token', res.data.access_token)
        localStorage.setItem('refresh_token', res.data.refresh_token)
        await this.loadUser()
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Signup failed'
        throw err
      } finally {
        this.loading = false
      }
    },

    async login(email: string, password: string) {
      this.loading = true
      this.error = null
      try {
        const res = await api.post('/auth/login', { email, password })
        localStorage.setItem('access_token', res.data.access_token)
        localStorage.setItem('refresh_token', res.data.refresh_token)
        await this.loadUser()
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Login failed'
        throw err
      } finally {
        this.loading = false
      }
    },

    async refreshToken() {
      this.loading = true
      this.error = null
      try {
        const refresh = localStorage.getItem('refresh_token')
        const res = await api.post('/auth/refresh', {}, {
          headers: { Authorization: `Bearer ${refresh}` },
        })
        localStorage.setItem('access_token', res.data.access_token)
        // não atualiza refresh no store, só localStorage
      } catch (err) {
        this.logout()
      } finally {
        this.loading = false
      }
    },

    async loadUser() {
      this.loading = true
      this.error = null
      try {
        const res = await api.get('/auth/profile')
        this.user = res.data
      } catch (err) {
        this.logout()
      } finally {
        this.loading = false
      }
    },

    logout() {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      this.user = null
      window.location.href = '/login'
    },
  },
})