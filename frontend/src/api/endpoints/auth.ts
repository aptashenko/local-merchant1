// src/api/endpoints/auth.ts
import { api } from '../index'

interface AuthDto {
  login: string
  password: string
}

export const AuthApi = {
  async signup(payload: AuthDto) {
    return await api.post('/auth/signup', payload)
  },

  async signin(payload: AuthDto) {
    return await api.post('/auth/signin', payload)
  },

  async refresh() {
    return await api.post('/auth/refresh')
  },

  async logout() {
    return await api.post('/auth/logout')
  },
}
