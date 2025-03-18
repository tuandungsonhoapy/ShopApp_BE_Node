import { ObjectId, AnyBulkWriteOperation } from 'mongodb'
import { Order, OrderDetail, UpdateOrderStatusParams } from '~/@types/order/interface.js'
import { bulkUpdateProducts, getProductsByIds, orderModel } from '~/models/orderModel.js'

const getOrders = async (page: number, limit: number, query: string, userId: string, status: string) => {
  return await orderModel.getOrders(page, limit, query, userId, status)
}

// const getOneById = async (id: string) => {
//   return await orderModel.getOneById(id)
// }

const create = async (data: Order) => {
  const orderResponse = await orderModel.create(data)

  if (!orderResponse) throw new Error('Cannot create order')

  await updateProductStock(data?.orderDetails)

  return orderResponse
}

const updateOrderStatus = async ({ orderId, newStatus }: UpdateOrderStatusParams) => {
  return await orderModel.updateOrderStatus({ orderId, newStatus })
}

export const updateProductStock = async (orderDetails?: OrderDetail[]) => {
  if (!orderDetails) return
  const objectIds = orderDetails.map((detail) => ObjectId.createFromHexString(detail.productId.toString()))

  const products = await getProductsByIds(objectIds)

  // Chuẩn bị dữ liệu cập nhật stock
  const bulkOperations: AnyBulkWriteOperation[] = products.map((product) => {
    const updatedSizes = product.sizes.map((sizeItem) => {
      const update = orderDetails.find((u) => u.size === sizeItem.size)
      if (update) {
        return { ...sizeItem, stock: Math.max(0, sizeItem.stock - update.quantity) }
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
