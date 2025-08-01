<template>
  <div class="max-w-md mx-auto mt-20 text-center">
    <h1 class="text-3xl font-bold mb-4">Profile</h1>
    <div v-if="auth.user">
      <p class="mb-2">ID: {{ auth.user.id }}</p>
      <p class="mb-2">Username: {{ auth.user.login }}</p>
      <button @click="logout"
              class="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition">
        Logout
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '../composables/useAuth'
import { useAuthStore } from '../store/auth'

const auth = useAuthStore()
const { logout } = useAuth()
</script>
