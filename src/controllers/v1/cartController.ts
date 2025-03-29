import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { cartService } from '~/services/v1/cartService.js'
import ApiError from '~/utils/ApiError.js'

export const addToCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { _id } = req.jwtDecoded as { _id: string }

    const response = await cartService.addToCart(_id, req.body)

    res.status(StatusCodes.OK).json(response)
  } catch (error) {
    next(error)
  }
}

const getCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { _id } = req.jwtDecoded as { _id: string }

    const response = await cartService.getCart(_id)

    res.status(StatusCodes.OK).json(response)
  } catch (error) {
    next(error)
  }
}

const updateCartItemQuantity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productId, size, quantity } = req.body
    const { _id: userId } = req.jwtDecoded as { _id: string }
    const updatedCart = await cartService.updateCartItemQuantity(userId, productId, size, quantity)

    if (!updatedCart) {
      return next(new ApiError(StatusCodes.NOT_FOUND, 'Không tìm thấy giỏ hàng'))
    }

    res.status(StatusCodes.OK).json(updatedCart)
  } catch (error) {
    next(error)
  }
}

const deleteCartItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productId, size } = req.body
    const { _id: userId } = req.jwtDecoded as { _id: string }

    const updatedCart = await cartService.deleteCartItem(userId, productId, size)

    if (!updatedCart) {
      return next(new ApiError(StatusCodes.NOT_FOUND, 'Giỏ hàng không được tìm thấy hoặc đã bị xóa!'))
    }

    res.status(StatusCodes.OK).json(updatedCart)
  } catch (error) {
    next(error)
  }
}
export const cartController = {
  addToCart,
  getCart,
  updateCartItemQuantity,
  deleteCartItem
}
