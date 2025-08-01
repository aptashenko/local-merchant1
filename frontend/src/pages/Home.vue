<template>
  <section class="max-w-5xl mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold mb-6">Сервисы поблизости</h1>
    <div class="mb-4 flex gap-4 items-center">
      <button
        class="text-sm px-4 py-2 bg-gray-100 text-gray-800 border border-gray-300 rounded"
        @click="viewMode = viewMode === 'list' ? 'map' : 'list'"
      >
        {{ viewMode === 'list' ? 'Показать на карте' : 'Показать списком' }}
      </button>
      <button
        v-if="authStore.token && viewMode === 'list'"
        class="text-sm px-4 py-2 bg-blue-500 text-white rounded"
        @click="toggleMine"
      >
        {{ showOnlyMine ? 'Показать все' : 'Показать только мои' }}
      </button>
    </div>

    <div v-if="loading">Загрузка...</div>
    <div v-else-if="services.length === 0">Нет доступных сервисов</div>

    <!-- Список -->
    <div v-else-if="viewMode === 'list'" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <ServiceCard v-for="s in services" :key="s.id" :service="s" />
    </div>

    <!-- Карта -->
    <div v-else class="h-[600px] w-full rounded overflow-hidden border">
      <div ref="mapRef" class="h-full w-full"></div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useServices } from '../composables/useServices'
import ServiceCard from '../components/ServiceCard.vue'
import L from 'leaflet'
import { useAuthStore } from '../store/auth.ts';

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore();

const { services, loading, fetchServices } = useServices()
const showOnlyMine = ref(route.query.my === 'true')
const viewMode = ref<'list' | 'map'>('list')

const mapRef = ref<HTMLDivElement | null>(null)
let map: L.Map | null = null
let markers: L.Marker[] = []

onMounted(() => {
  fetchServices(showOnlyMine.value)
})

// Watch query param
watch(
  () => route.query.my,
  (newVal) => {
    showOnlyMine.value = newVal === 'true'
    fetchServices(showOnlyMine.value)
  }
)

// Toggle query param
const toggleMine = () => {
  const newValue = !showOnlyMine.value
  router.replace({ query: { ...route.query, my: newValue ? 'true' : undefined } })
}

// Watch view change
watch(viewMode, async (mode) => {
  if (mode === 'map') {
    await nextTick()
    initMap()
  }
})

// Init map
function initMap() {
  if (!mapRef.value) return

  if (map) {
    map.remove()
    map = null
  }

  map = L.map(mapRef.value).setView([48.85, 2.35], 6)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(map)

  // Маркеры
  markers.forEach(m => m.remove())
  markers = []

  services.value.forEach((s) => {
    if (s.lat && s.lg) {
      const marker = L.marker([s.lat, s.lg])
        .addTo(map)
        .bindPopup(`<strong>${s.title}</strong><br>${s.price} ${s.currency}`)
      markers.push(marker)
    }
  })

  if (services.value.length && services.value[0].lat) {
    map.setView([services.value[0].lat, services.value[0].lg], 10)
  }
}
</script>
