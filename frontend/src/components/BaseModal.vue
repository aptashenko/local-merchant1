<!-- src/components/BaseModal.vue -->
<template>
  <transition name="fade">
    <div v-if="show" class="fixed inset-0 bg-black/10 bg-opacity-40 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-lg max-w-sm w-full p-6">
        <h2 class="text-lg font-semibold mb-2">{{ title }}</h2>
        <p class="text-sm text-gray-700 mb-4">{{ message }}</p>
        <div class="flex justify-end space-x-2">
          <button @click="onClose" class="px-4 py-1 rounded bg-gray-200 hover:bg-gray-300 text-sm">Закрыть</button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
defineProps<{
  show: boolean
  title: string
  message: string
  onClose: () => void
}>()
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
