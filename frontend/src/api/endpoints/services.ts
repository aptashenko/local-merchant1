// src/api/endpoints/services.ts
import { api, apiAuth } from '../index';

export interface Coordinates {
  lat: number
  lg: number
}

export interface Service {
  id: string
  title: string
  description: string
  category: string
  price: number
  location: Coordinates
  photos: string[]
  createdAt: string
}

export const ServicesApi = {
  async getAll(): Promise<Service[]> {
    const res = await api.get('/services/all')
    return res.data.data
  },

  async getMy(): Promise<Service[]> {
    const res = await apiAuth.get('/services/my')
    return res.data.data
  },

  async getById(id: string): Promise<Service> {
    const res = await api.get(`/services/${id}`)
    return res.data.data
  },

  async create(service: Omit<Service, 'id' | 'createdAt'>): Promise<Service> {
    const res = await apiAuth.post('/services/create', service)
    return res.data.data
  },

  async update(id: string, service: Partial<Service>): Promise<Service> {
    const res = await apiAuth.put(`/services/update/${id}`, service)
    return res.data.data
  },

  async delete(id: string): Promise<boolean> {
    await apiAuth.delete(`/services/${id}`)
  },
}
