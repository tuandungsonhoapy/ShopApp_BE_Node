class ApiError extends Error {
  statusCode: string | number

  constructor(statusCode: string | number, message: string) {
    super(message)

    this.name = 'ApiError'

    this.statusCode = statusCode

    // Ghi lại Stack Trace (dấu vết ngăn xếp) để thuận tiện cho việc debug
    Error.captureStackTrace(this, this.constructor)
  }
}

export default ApiError
