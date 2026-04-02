import axios from 'axios'

const api = axios.create({
  // Nginx já roteia /api → backend
  // então o endpoint é /api/auth/login, etc.
  baseURL: '/', // ou 'http://localhost:3000/api' se testando direto no backend
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

export default api