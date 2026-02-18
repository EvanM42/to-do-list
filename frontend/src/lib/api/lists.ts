import { api } from './client'
import type { List, CreateListInput, UpdateListInput } from '../types'

export const listsApi = {
  list: () => api.get<List[]>('/lists'),
  get: (id: string) => api.get<List>(`/lists/${id}`),
  create: (input: CreateListInput) => api.post<List>('/lists', input),
  update: (id: string, input: UpdateListInput) =>
    api.patch<List>(`/lists/${id}`, input),
  delete: (id: string) => api.delete<void>(`/lists/${id}`),
}
