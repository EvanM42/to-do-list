import type { FastifyPluginAsync } from 'fastify'
import { createListSchema, updateListSchema } from './schema'
import * as service from './service'

export const listsRoutes: FastifyPluginAsync = async (fastify) => {
  // All list routes require auth
  fastify.addHook('preHandler', fastify.authenticate)

  // GET /lists
  fastify.get('/', async (req) => {
    return service.getUserLists(req.user.id)
  })

  // GET /lists/:id
  fastify.get<{ Params: { id: string } }>('/:id', async (req) => {
    return service.getListById(req.params.id, req.user.id)
  })

  // POST /lists
  fastify.post('/', async (req, reply) => {
    const parsed = createListSchema.safeParse(req.body)
    if (!parsed.success) {
      return reply.status(422).send({
        code: 'VALIDATION_ERROR',
        message: 'Invalid request body',
        details: parsed.error.flatten(),
      })
    }
    const list = await service.createList(req.user.id, parsed.data)
    return reply.status(201).send(list)
  })

  // PATCH /lists/:id
  fastify.patch<{ Params: { id: string } }>('/:id', async (req, reply) => {
    const parsed = updateListSchema.safeParse(req.body)
    if (!parsed.success) {
      return reply.status(422).send({
        code: 'VALIDATION_ERROR',
        message: 'Invalid request body',
        details: parsed.error.flatten(),
      })
    }
    return service.updateList(req.params.id, req.user.id, parsed.data)
  })

  // DELETE /lists/:id
  fastify.delete<{ Params: { id: string } }>('/:id', async (req, reply) => {
    await service.deleteList(req.params.id, req.user.id)
    return reply.status(204).send()
  })
}
