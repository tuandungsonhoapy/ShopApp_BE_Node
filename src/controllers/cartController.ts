import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { cartService } from '~/services/cartService.js'

export const addToCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { _id } = req.jwtDecoded as { _id: string }

    const response = await cartService.addToCart(_id, req.body)

    res.status(StatusCodes.OK).json(response)
  } catch (error) {
    next(error)
  }
}

export const cartController = {
  addToCart
}
