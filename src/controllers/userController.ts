import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(StatusCodes.OK).json({ message: 'Login successful' })
  } catch (error) {
    next(error)
  }
}

export const UserController = {
  login
}
