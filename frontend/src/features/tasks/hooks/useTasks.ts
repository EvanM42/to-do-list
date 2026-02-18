import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { tasksApi } from '../../../lib/api/tasks'
import type { ViewType, CreateTaskInput, UpdateTaskInput } from '../../../lib/types'

export function useTasks(view: ViewType, listId?: string | null) {
  return useQuery({
    queryKey: ['tasks', view, listId ?? null],
    queryFn: () =>
      tasksApi.list({
        view: view === 'inbox' && listId ? undefined : view,
        list_id: listId ?? undefined,
      }),
  })
}

export function useCreateTask() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateTaskInput) => tasksApi.create(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tasks'] }),
  })
}

export function useUpdateTask() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateTaskInput }) =>
      tasksApi.update(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tasks'] }),
  })
}

export function useCompleteTask() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, completed }: { id: string; completed: boolean }) =>
      completed ? tasksApi.uncomplete(id) : tasksApi.complete(id),
    onMutate: async ({ id, completed }) => {
      await qc.cancelQueries({ queryKey: ['tasks'] })
      const snapshot = qc.getQueriesData({ queryKey: ['tasks'] })
      // Optimistic update
      qc.setQueriesData({ queryKey: ['tasks'] }, (old: unknown) => {
        if (!Array.isArray(old)) return old
        return old.map((t: { id: string; completed_at: string | null }) =>
          t.id === id
            ? { ...t, completed_at: completed ? null : new Date().toISOString() }
            : t,
        )
      })
      return { snapshot }
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.snapshot) {
        for (const [key, data] of ctx.snapshot) {
          qc.setQueryData(key, data)
        }
      }
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ['tasks'] }),
  })
}

export function useDeleteTask() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => tasksApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tasks'] }),
  })
}
