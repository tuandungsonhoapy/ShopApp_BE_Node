import { Order, UpdateOrderStatusParams } from '~/@types/order/interface.js'
import { orderModel } from '~/models/orderModel.js'
import { ORDER_STATUS } from '~/utils/constants.js'

const getOrders = async (page: number, limit: number, query: string, userId: string, status: string) => {
  return await orderModel.getOrders(page, limit, query, userId, status)
}

// const getOneById = async (id: string) => {
//   return await orderModel.getOneById(id)
// }

const create = async (data: Order) => {
  return await orderModel.create(data)
}

const updateOrderStatus = async ({ orderId, newStatus }: UpdateOrderStatusParams) => {
  return await orderModel.updateOrderStatus({ orderId, newStatus })
}

// const update = async (id: string, data: IOrder) => {
//   return await orderModel.update(id, data)
// }

// const deleteOneById = async (id: string) => {
//   return await orderModel.deleteOneById(id)
// }

// const getSubCategories = async (parentId: string) => {
//   return await orderModel.getSubCategories(parentId)
// }

// const createOrderTree = async () => {
//   return await orderModel.createOrderTree()
// }
export const orderService = {
  getOrders,
  // getOneById,
  create,
  updateOrderStatus
  // update,
  // deleteOneById,
  // getSubCategories,
  // createOrderTree
}
