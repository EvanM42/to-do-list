import 'dotenv/config'
import Fastify from 'fastify'
import cors from '@fastify/cors'
import authPlugin from './plugins/auth'
import { listsRoutes } from './modules/lists/router'
import { tasksRoutes } from './modules/tasks/router'
import { AppError } from './lib/errors'

const server = Fastify({ logger: true })

async function start() {
  // Validate required env vars at startup
  const required = ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'] as const
  for (const key of required) {
    if (!process.env[key]) {
      throw new Error(`Missing required environment variable: ${key}`)
    }
  }

  // CORS
  await server.register(cors, {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })

  // Auth decorator
  await server.register(authPlugin)

  // Global error handler
  server.setErrorHandler((error, _req, reply) => {
    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({
        code: error.code,
        message: error.message,
        ...(error.details ? { details: error.details } : {}),
      })
    }
    server.log.error(error)
    return reply.status(500).send({ code: 'INTERNAL_ERROR', message: 'Internal server error' })
  })

  // Public health check
  server.get('/health', async () => ({
    status: 'ok',
    timestamp: new Date().toISOString(),
  }))

  // Current user
  server.get(
    '/me',
    { preHandler: [server.authenticate] },
    async (req) => ({ user: req.user }),
  )

  // Feature routes
  await server.register(listsRoutes, { prefix: '/lists' })
  await server.register(tasksRoutes, { prefix: '/tasks' })

  const port = Number(process.env.PORT) || 3000
  await server.listen({ port, host: '0.0.0.0' })
  console.log(`\n🚀 Backend running at http://localhost:${port}\n`)
}

start().catch((err) => {
  console.error(err)
  process.exit(1)
})
