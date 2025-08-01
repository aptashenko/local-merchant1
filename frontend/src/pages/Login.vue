<template>
  <div class="max-w-sm mx-auto mt-24 px-6 py-8 bg-white rounded-xl shadow-md">
    <h1 class="text-2xl font-semibold text-center text-gray-800 mb-6">Login</h1>
    <form @submit.prevent="onLogin" class="space-y-4">
      <input v-model="login" type="text" placeholder="Username"
             class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
      <input v-model="password" type="password" placeholder="Password"
             class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
      <button type="submit"
              class="w-full py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition">
        Login
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '../composables/useAuth'

const login = ref('')
const password = ref('')
const { login: loginFn } = useAuth()

const onLogin = () => {
  loginFn(login.value, password.value)
}
</script>
