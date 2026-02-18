import fp from 'fastify-plugin'
import { createClient } from '@supabase/supabase-js'
import type { FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify'

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (req: FastifyRequest, reply: FastifyReply) => Promise<void>
  }
  interface FastifyRequest {
    user: { id: string; email?: string }
  }
}

const authPlugin: FastifyPluginAsync = async (fastify) => {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } },
  )

  fastify.decorate(
    'authenticate',
    async (req: FastifyRequest, reply: FastifyReply) => {
      const authHeader = req.headers.authorization
      if (!authHeader?.startsWith('Bearer ')) {
        return reply
          .status(401)
          .send({ code: 'UNAUTHORIZED', message: 'Missing authorization token' })
      }

      const token = authHeader.slice(7)
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser(token)

      if (error || !user) {
        return reply
          .status(401)
          .send({ code: 'UNAUTHORIZED', message: 'Invalid or expired token' })
      }

      req.user = { id: user.id, email: user.email ?? undefined }
    },
  )
}

export default fp(authPlugin, { name: 'auth' })
