import { z } from 'zod'

export const createTaskSchema = z.object({
  title: z.string().min(1).max(500),
  notes: z.string().max(5000).optional(),
  list_id: z.string().uuid().nullable().optional(),
  priority: z.enum(['none', 'low', 'medium', 'high']).optional().default('none'),
  due_at: z.string().datetime().nullable().optional(),
  tags: z.array(z.string().max(50)).optional().default([]),
})

export const updateTaskSchema = z.object({
  title: z.string().min(1).max(500).optional(),
  notes: z.string().max(5000).nullable().optional(),
  list_id: z.string().uuid().nullable().optional(),
  priority: z.enum(['none', 'low', 'medium', 'high']).optional(),
  due_at: z.string().datetime().nullable().optional(),
  tags: z.array(z.string().max(50)).optional(),
})

export const listTasksQuerySchema = z.object({
  view: z.enum(['inbox', 'today', 'scheduled', 'all', 'completed']).optional(),
  list_id: z.string().uuid().optional(),
  search: z.string().max(200).optional(),
})

export type CreateTaskInput = z.infer<typeof createTaskSchema>
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>
export type ListTasksQuery = z.infer<typeof listTasksQuerySchema>
