import axios from 'axios'
import { useAuth } from '../composables/useAuth.ts';

export const api = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const apiAuth = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    'authorization': `Bearer ${localStorage.getItem('token')}`,
  },
})

apiAuth.interceptors.request.use((config) => {
  return config
})

apiAuth.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const {logout} = useAuth();
      logout()
    }

    return Promise.reject(error)
  }
)
