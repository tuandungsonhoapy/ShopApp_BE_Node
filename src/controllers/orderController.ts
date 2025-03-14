import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import { Order } from '~/@types/order/interface.js'
import { orderService } from '~/services/orderService.js'

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
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
    const { page, limit, q, status } = req.query
    const { _id: userId } = req.jwtDecoded as { _id: string }

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
export const orderController = {
  create,
  getOrders
}
