import { useAuthStore } from '../store/auth'
import { useRouter } from 'vue-router'

const API_BASE = 'http://localhost:3000'

export function useAuth() {
  const auth = useAuthStore()
  const router = useRouter()

  const login = async (login: string, password: string) => {
    const res = await fetch(`${API_BASE}/auth/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login, password })
    })

    if (!res.ok) throw new Error('Login failed')

    const data = await res.json()
    auth.login(data.data.access_token)
    await getProfile()
    router.push('/profile')
  }

  const register = async (login: string, password: string) => {
    const res = await fetch(`${API_BASE}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login, password })
    })

    if (!res.ok) throw new Error('Register failed')

    const data = await res.json()
    auth.login(data.data.access_token)
    await getProfile()
    router.push('/profile')
  }

  const getProfile = async () => {
    const res = await fetch(`${API_BASE}/profile`, {
      headers: {
        Authorization: `Bearer ${auth.token}`
      }
    })

    if (!res.ok) throw new Error('Failed to get profile')

    const user = await res.json()
    console.log(user.data)
    auth.setUser(user.data)
  }

  const logout = () => {
    auth.logout()
    router.push('/login')
  }

  return { login, register, getProfile, logout }
}
