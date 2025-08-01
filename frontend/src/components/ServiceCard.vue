<template>
  <div class="border rounded-xl p-4 shadow hover:shadow-md transition relative">
    <h2 class="text-lg font-semibold">{{ service.title }}</h2>
    <p class="text-sm text-gray-600">{{ service.description }}</p>
    <div class="text-sm mt-2">Категория: {{ service.category }}</div>
    <div class="text-sm">Цена: €{{ service.price }}</div>

    <!-- Владелец: редактирование / удаление -->
    <div v-if="isOwner" class="absolute top-2 right-2 flex gap-2">
      <router-link :to="`/services/edit/${service.id}`" class="text-blue-600">✏️</router-link>
      <button @click="onDelete" class="text-red-600">🗑</button>
    </div>

    <!-- Кнопка показать карту -->
    <button @click="showMap = true" class="mt-4 text-sm text-green-600 cursor-pointer">
      📍 Показать на карте
    </button>

    <!-- Модалка -->
    <div v-if="showMap" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl p-6 w-full max-w-xl relative shadow-lg">
        <h3 class="text-lg font-bold mb-4">Где находится услуга</h3>

        <div class="h-72 w-full rounded overflow-hidden border" ref="mapEl"></div>

        <button
          @click="showMap = false"
          class="absolute top-3 right-4 text-gray-500 hover:text-black text-xl"
        >
          ×
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '../store/auth'
import { ServicesApi } from '../api/endpoints/services'
import { computed, ref, watch, nextTick } from 'vue'
import L from 'leaflet'

const props = defineProps<{ service: any }>()
const store = useAuthStore()

const isOwner = computed(() => store.user?.id === props.service.owner)

const onDelete = async () => {
  if (!confirm('Удалить услугу?')) return

  try {
    await ServicesApi.delete(props.service.id)
    window.location.reload()
  } catch (e) {
    alert('Ошибка при удалении')
    console.error(e)
  }
}

// Модалка и карта
const showMap = ref(false)
const mapEl = ref<HTMLDivElement | null>(null)
let map: L.Map | null = null
let marker: L.Marker | null = null

watch(showMap, (visible) => {
  if (visible) {
    nextTick(() => {
      if (!mapEl.value) return
      map = L.map(mapEl.value).setView([props.service.lat, props.service.lg], 13)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap',
      }).addTo(map)
      marker = L.marker([props.service.lat, props.service.lg]).addTo(map)
    })
  } else {
    if (map) {
      map.remove()
      map = null
    }
  }
})
</script>
