import { api } from './client'
import type { Task, CreateTaskInput, UpdateTaskInput, ViewType } from '../types'

export const tasksApi = {
  list: (params: { view?: ViewType; list_id?: string; search?: string } = {}) => {
    const qs = new URLSearchParams()
    if (params.view) qs.set('view', params.view)
    if (params.list_id) qs.set('list_id', params.list_id)
    if (params.search) qs.set('search', params.search)
    const query = qs.toString()
    return api.get<Task[]>(`/tasks${query ? `?${query}` : ''}`)
  },

  get: (id: string) => api.get<Task>(`/tasks/${id}`),

  create: (input: CreateTaskInput) => api.post<Task>('/tasks', input),

  update: (id: string, input: UpdateTaskInput) =>
    api.patch<Task>(`/tasks/${id}`, input),

  complete: (id: string) => api.post<Task>(`/tasks/${id}/complete`),

  uncomplete: (id: string) => api.post<Task>(`/tasks/${id}/uncomplete`),

  delete: (id: string) => api.delete<void>(`/tasks/${id}`),
}
