import { StatusCodes } from 'http-status-codes'
import { env } from '~/configs/enviroment.js'
import { Request, Response, NextFunction } from 'express'
import { MongoError } from 'mongodb'

// Middleware xử lý lỗi tập trung trong ứng dụng Back-end
interface Error {
  statusCode?: number
  message?: string
  stack?: string
}

interface ResponseError {
  statusCode: number
  message: string
  stack?: string
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandlingMiddleware = (err: Error, req: Request, res: Response, next: NextFunction) => {
  // Status code default to 500
  if (!err.statusCode) err.statusCode = StatusCodes.INTERNAL_SERVER_ERROR

  const responseError: ResponseError = {
    statusCode: err.statusCode,
    message: err.message || StatusCodes[err.statusCode],
    stack: err.stack
  }

  if (env.BUILD_MODE !== 'dev') delete responseError.stack

  // Trả responseError về phía Front-end
  res.status(responseError.statusCode).json(responseError)
}

export const handleThrowError = (error: unknown) => {
  if (error instanceof Error) {
    console.error('Validation error:', error.message)
    throw new Error(`Validation failed: ${error.message}`)
  } else if (error instanceof MongoError) {
    console.error('Database error:', error.message)
    throw new Error(`Database operation failed: ${error.message}`)
  } else {
    console.error('Unexpected error:', error)
    throw new Error(`Unexpected error: ${error instanceof Error ? error.message : String(error)}`)
  }
}
