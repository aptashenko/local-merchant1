<template>
  <nav class="flex justify-between items-center p-4 shadow-md bg-white">
    <router-link to="/" class="font-semibold">🏠 Home</router-link>
    <div v-if="isLoggedIn">
      <router-link to="/profile" class="mr-4 text-blue-600 hover:underline">👤 Profile</router-link>
      <router-link to="/add" class="mr-4">➕ Добавить</router-link>
      <button
        @click="logout"
        class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
      >
        Logout
      </button>
    </div>
    <div v-else>
      <router-link to="/login" class="mr-4 text-blue-600 hover:underline">Login</router-link>
      <router-link to="/register" class="text-blue-600 hover:underline">Register</router-link>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store/auth'

const auth = useAuthStore()
const router = useRouter()

const isLoggedIn = computed(() => !!auth.token)

const logout = () => {
  auth.logout()
  router.push('/login')
}
</script>
