export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly code: string,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export const unauthorized = (message = 'Unauthorized') =>
  new AppError(401, 'UNAUTHORIZED', message)

export const forbidden = (message = 'Forbidden') =>
  new AppError(403, 'FORBIDDEN', message)

export const notFound = (resource = 'Resource') =>
  new AppError(404, 'NOT_FOUND', `${resource} not found`)

export const validationError = (details: unknown) =>
  new AppError(422, 'VALIDATION_ERROR', 'Validation failed', details)

export const internalError = (message = 'Internal server error') =>
  new AppError(500, 'INTERNAL_ERROR', message)
