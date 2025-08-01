<template>
  <div class="space-y-4">
    <!-- Поиск по городу -->
    <div class="flex gap-2">
      <input
        v-model="city"
        type="text"
        placeholder="Введите город (например, Nice)"
        class="w-full px-3 py-2 border rounded-md"
      />
      <button
        type="button"
        @click.prevent="searchCity"
        class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        🔍 Найти
      </button>
    </div>

    <!-- Кнопка геолокации -->
    <button
      type="button"
      @click.prevent="locateUser"
      class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
    >
      📍 Определить мою гео
    </button>

    <!-- Карта -->
    <div ref="mapElement" class="h-96 w-full rounded overflow-hidden border" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import L from 'leaflet'

const props = defineProps<{
  modelValue: { lat: number; lg: number }
}>()
const emit = defineEmits(['update:modelValue'])

const mapElement = ref<HTMLDivElement | null>(null)
const city = ref('')
let map: L.Map
let marker: L.Marker

const setMarker = (lat: number, lng: number) => {
  marker.setLatLng([lat, lng])
  map.setView([lat, lng], 13)
  emit('update:modelValue', { lat, lg: lng })
}

const searchCity = async () => {
  if (!city.value.trim()) return

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city.value)}`
    )
    const data = await res.json()
    if (data.length) {
      const { lat, lon } = data[0]
      setMarker(parseFloat(lat), parseFloat(lon))
    } else {
      alert('Город не найден')
    }
  } catch (err) {
    alert('Ошибка при поиске')
    console.error(err)
  }
}

function showError(message: string) {
  alert(`❌ ${message}`)
}

function showInfo(message: string) {
  console.log(`ℹ️ ${message}`)
}

function showSuccess(message: string) {
  console.log(`✅ ${message}`)
}

function handleGeolocationError(err: GeolocationPositionError) {
  const messages: Record<number, string> = {
    1: 'Вы отклонили доступ к геолокации',
    2: 'Позиция недоступна. Возможно, нет интернета или слабый сигнал.',
    3: 'Превышено время ожидания геолокации'
  }

  showError(messages[err.code] || 'Не удалось определить местоположение')
  console.error('Geolocation error:', err)
}


const locateUser = () => {
  if (!navigator.geolocation) {
    showError('Геолокация не поддерживается этим браузером')
    return
  }

  showInfo('Определяем координаты...')

  navigator.geolocation.getCurrentPosition(
    ({ coords }) => {
      setMarker(coords.latitude, coords.longitude)
      showSuccess('Геолокация успешно получена')
    },
    () => {},
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    }
  )
}

locateUser()

onMounted(() => {
  map = L.map(mapElement.value!).setView([props.modelValue.lat || 48.85, props.modelValue.lg || 2.35], 13)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map)

  marker = L.marker([props.modelValue.lat, props.modelValue.lg], { draggable: true }).addTo(map)

  marker.on('moveend', () => {
    const { lat, lng } = marker.getLatLng()
    emit('update:modelValue', { lat, lg: lng })
  })

  map.on('click', (e: L.LeafletMouseEvent) => {
    const { lat, lng } = e.latlng
    setMarker(lat, lng)
  })
})
</script>
