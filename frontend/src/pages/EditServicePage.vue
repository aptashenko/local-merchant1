<!-- src/pages/EditServicePage.vue -->
<template>
  <section class="max-w-2xl mx-auto px-6 py-10">
    <h1 class="text-2xl font-bold mb-6 text-center">Редактировать услугу</h1>

    <form @submit.prevent="onSubmit" class="space-y-6 bg-white p-6 rounded-xl shadow-md">
      <!-- Название -->
      <div>
        <label class="block mb-1 font-medium">Название</label>
        <input v-model="form.title" type="text" class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      <!-- Описание -->
      <div>
        <label class="block mb-1 font-medium">Описание</label>
        <textarea v-model="form.description" class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none" />
      </div>

      <!-- Категория -->
      <div>
        <label class="block mb-1 font-medium">Категория</label>
        <select v-model="form.category" class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option disabled value="">Выберите категорию</option>
          <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
        </select>
      </div>

      <!-- Валюта и цена -->
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block mb-1 font-medium">Валюта</label>
          <select v-model="form.currency" class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option v-for="c in currencies" :key="c" :value="c">{{ c }}</option>
          </select>
        </div>
        <div>
          <label class="block mb-1 font-medium">Цена</label>
          <input v-model.number="form.price" type="number" class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>

      <!-- Фото -->
      <div>
        <label class="block mb-1 font-medium">Фото</label>
        <input
          v-model="photosInput"
          type="text"
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="URL и Enter"
          @keydown.enter.prevent="addPhoto"
        />
        <div class="flex flex-wrap mt-2 gap-2">
          <div v-for="(photo, idx) in form.photos" :key="idx" class="relative">
            <img :src="photo" class="w-20 h-20 object-cover rounded" />
            <button
              @click="removePhoto(idx)"
              class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5"
            >
              ×
            </button>
          </div>
        </div>
      </div>

      <!-- Координаты -->
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block mb-1 font-medium">lat</label>
          <input v-model.number="form.location.lat" type="number" class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label class="block mb-1 font-medium">lg</label>
          <input v-model.number="form.location.lg" type="number" class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>

      <button type="submit" class="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
        Обновить
      </button>
    </form>
  </section>
  <BaseModal
    v-if="showModal"
    :show="showModal"
    :title="modalTitle"
    :message="modalMessage"
    :onClose="() => (showModal = false)"
  />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useServiceActions } from '../composables/useServices'
import { ServicesApi } from '../api/endpoints/services'

import BaseModal from '../components/BaseModal.vue'
const showModal = ref(false)
const modalMessage = ref('')
const modalTitle = ref('Успех')

function showError(msg: string) {
  modalTitle.value = 'Ошибка'
  modalMessage.value = msg
  showModal.value = true
}

function showSuccess(msg: string) {
  modalTitle.value = 'Успех'
  modalMessage.value = msg
  showModal.value = true
}

const { updateService } = useServiceActions()
const route = useRoute()
const router = useRouter()

const id = route.params.id as string

const form = ref({
  title: '',
  description: '',
  category: '',
  currency: '',
  price: 0,
  photos: [] as string[],
  location: {
    lat: 0,
    lg: 0,
  },
})

const photosInput = ref('')

const ServiceCategory = {
  BARBER: 'barber',
  NAILS: 'nails',
  CLEANING: 'cleaning',
  OTHER: 'other',
}
const ServiceCurrency = {
  USD: 'usd',
  UAH: 'uah',
  EUR: 'eur',
}
const categories = Object.values(ServiceCategory)
const currencies = Object.values(ServiceCurrency)

function addPhoto() {
  if (photosInput.value.trim()) {
    form.value.photos.push(photosInput.value.trim())
    photosInput.value = ''
  }
}
function removePhoto(index: number) {
  form.value.photos.splice(index, 1)
}

async function onSubmit() {
  try {
    await updateService(id, form.value)
    showSuccess('Услуга успешно добавлена')
    router.push('/?my=true')
  } catch (err) {
    console.error(err)
    showError('Ошибка при добавлении услуги')
  }
}

onMounted(async () => {
  const data = await ServicesApi.getById(id)
  form.value = {
    title: data.title,
    description: data.description,
    category: data.category,
    currency: data.currency,
    price: data.price,
    photos: data.photos,
    location: {
      lat: data.lat,
      lg: data.lg,
    },
  }
})
</script>
