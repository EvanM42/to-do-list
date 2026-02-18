import type { FastifyPluginAsync } from 'fastify'
import { createTaskSchema, updateTaskSchema, listTasksQuerySchema } from './schema'
import * as service from './service'

export const tasksRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook('preHandler', fastify.authenticate)

  // GET /tasks?view=today&list_id=...&search=...
  fastify.get('/', async (req, reply) => {
    const parsed = listTasksQuerySchema.safeParse(req.query)
    if (!parsed.success) {
      return reply.status(422).send({
        code: 'VALIDATION_ERROR',
        message: 'Invalid query parameters',
        details: parsed.error.flatten(),
      })
    }
    return service.listTasks(req.user.id, parsed.data)
  })

  // GET /tasks/:id
  fastify.get<{ Params: { id: string } }>('/:id', async (req) => {
    return service.getTaskById(req.params.id, req.user.id)
  })

  // POST /tasks
  fastify.post('/', async (req, reply) => {
    const parsed = createTaskSchema.safeParse(req.body)
    if (!parsed.success) {
      return reply.status(422).send({
        code: 'VALIDATION_ERROR',
        message: 'Invalid request body',
        details: parsed.error.flatten(),
      })
    }
    const task = await service.createTask(req.user.id, parsed.data)
    return reply.status(201).send(task)
  })

  // PATCH /tasks/:id
  fastify.patch<{ Params: { id: string } }>('/:id', async (req, reply) => {
    const parsed = updateTaskSchema.safeParse(req.body)
    if (!parsed.success) {
      return reply.status(422).send({
        code: 'VALIDATION_ERROR',
        message: 'Invalid request body',
        details: parsed.error.flatten(),
      })
    }
    return service.updateTask(req.params.id, req.user.id, parsed.data)
  })

  // POST /tasks/:id/complete
  fastify.post<{ Params: { id: string } }>('/:id/complete', async (req) => {
    return service.completeTask(req.params.id, req.user.id)
  })

  // POST /tasks/:id/uncomplete
  fastify.post<{ Params: { id: string } }>('/:id/uncomplete', async (req) => {
    return service.uncompleteTask(req.params.id, req.user.id)
  })

  // DELETE /tasks/:id
  fastify.delete<{ Params: { id: string } }>('/:id', async (req, reply) => {
    await service.deleteTask(req.params.id, req.user.id)
    return reply.status(204).send()
  })
}
