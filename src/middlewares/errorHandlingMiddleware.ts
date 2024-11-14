import { StatusCodes } from 'http-status-codes'
import { env } from '~/configs/enviroment.js'
import { Request, Response } from 'express'

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

export const errorHandlingMiddleware = (err: Error, req: Request, res: Response) => {
  // Status code default to 500
  if (!err.statusCode) err.statusCode = StatusCodes.INTERNAL_SERVER_ERROR

  const responseError: ResponseError = {
    statusCode: err.statusCode,
    message: err.message || StatusCodes[err.statusCode],
    stack: err.stack
  }
  // console.error(responseError)

  if (env.BUILD_MODE !== 'dev') delete responseError.stack

  // Trả responseError về phía Front-end
  res.status(responseError.statusCode).json(responseError)
}
