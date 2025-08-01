import { ref, onMounted } from 'vue'
import { ServicesApi } from '../api/endpoints/services'
import type { Service } from '../api/endpoints/services'

export function useServices() {
  const services = ref<Service[]>([])
  const loading = ref(true)
  const error = ref<Error | null>(null)

  const fetchServices = async (onlyMine = false) => {
    loading.value = true
    try {
      services.value = onlyMine
        ? await ServicesApi.getMy()
        : await ServicesApi.getAll()
    } catch (err) {
      error.value = err as Error
    } finally {
      loading.value = false
    }
  }

  onMounted(fetchServices)

  return {
    services,
    loading,
    error,
    fetchServices,
  }
}

export function useServiceActions() {
  const addService = async (service: any): Promise<Service> => {
    return await ServicesApi.create(service)
  }

  const deleteService = async (id: string): Promise<boolean> => {
    return await ServicesApi.delete(id)
  }

  const updateService = async (id: string, dto: any): Promise<Service> => {
    return await ServicesApi.update(id, dto)
  }

  const getServiceById = async (id: string): Promise<Service> => {
    return await ServicesApi.getById(id)
  }

  return {
    addService,
    deleteService,
    updateService,
    getServiceById,
  }
}

