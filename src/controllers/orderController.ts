import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import { Order } from '~/@types/order/interface.js'
import { orderService } from '~/services/orderService.js'

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.jwtDecoded) {
      res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized: Missing or invalid token' })
    }

    const { _id: userId } = req.jwtDecoded as { _id: string }

    const result = await orderService.create({
      ...req.body,
      userId
    } as Order)

    res.status(StatusCodes.CREATED).json(result)
  } catch (error) {
    next(error)
  }
}

const getOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit, q, status, userId } = req.query

    const products = await orderService.getOrders(
      parseInt(page as string, 10),
      parseInt(limit as string, 10),
      q as string,
      userId as string,
      status as string
    )
    res.status(StatusCodes.OK).json(products)
  } catch (error) {
    next(error)
  }
}

export const updateOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orderId, newStatus } = req.body
    const result = await orderService.updateOrderStatus({ orderId, newStatus })
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

export const orderController = {
  create,
  getOrders,
  updateOrderStatus
}
