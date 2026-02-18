import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { listsApi } from '../../../lib/api/lists'
import type { CreateListInput, UpdateListInput } from '../../../lib/types'

export function useLists() {
  return useQuery({
    queryKey: ['lists'],
    queryFn: () => listsApi.list(),
  })
}

export function useCreateList() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateListInput) => listsApi.create(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['lists'] }),
  })
}

export function useUpdateList() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateListInput }) =>
      listsApi.update(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['lists'] }),
  })
}

export function useDeleteList() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => listsApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['lists'] })
      qc.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}
