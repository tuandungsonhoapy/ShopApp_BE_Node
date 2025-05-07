import { ObjectId, AnyBulkWriteOperation } from 'mongodb'
import { Order, OrderDetail, UpdateOrderStatusParams } from '~/@types/v1/order/interface.js'
import { sendMessage } from '~/configs/kafka-producer.js'
import { bulkUpdateProducts, getProductsByIds, orderModel } from '~/models/v1/orderModel.js'
import { ORDER_STATUS } from '~/utils/constants.js'

const getOrders = async (page: number, limit: number, query: string, userId: string, status: string) => {
  return await orderModel.getOrders(page, limit, query, userId, status)
}

export const updateProductStock = async (orderDetails: OrderDetail[] = [], isCancleStatus: boolean = false) => {
  const objectIds = orderDetails.map((detail) => ObjectId.createFromHexString(detail.productId.toString()))

  const products = await getProductsByIds(objectIds)

  // Chuẩn bị dữ liệu cập nhật stock
  const bulkOperations: AnyBulkWriteOperation[] = products.map((product) => {
    const updatedSizes = product.sizes.map((sizeItem) => {
      const update = orderDetails.find((u) => u.size === sizeItem.size)
      if (update) {
        const updateStock = isCancleStatus ? sizeItem.stock + update.quantity : sizeItem.stock - update.quantity
        return { ...sizeItem, stock: Math.max(0, updateStock) }
      }
      return sizeItem
    })

    return {
      updateOne: {
        filter: { _id: new ObjectId(product._id) },
        update: { $set: { sizes: updatedSizes, updatedAt: new Date() } }
      }
    }
  })

  // Cập nhật stock sản phẩm
  await bulkUpdateProducts(bulkOperations)
}

const create = async (data: Order) => {
  // await sendOrder(data)

  const orderResponse = await orderModel.create(data)

  if (!orderResponse) throw new Error('Cannot create order')

  await updateProductStock(data?.orderDetails)

  return orderResponse
}

const updateOrderStatus = async ({ orderId, newStatus }: UpdateOrderStatusParams) => {
  const updateOrderResponse = await orderModel.updateOrderStatus({ orderId, newStatus })
  if (updateOrderResponse && newStatus === ORDER_STATUS.CANCEL) {
    await updateProductStock(updateOrderResponse.result.orderDetails, true)
  }
  return updateOrderResponse
}

export const orderService = {
  getOrders,
  create,
  updateOrderStatus
}
