import Joi from 'joi'
import { EMAIL_RULE, EMAIL_RULE_MESSAGE, OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators.js'
import { ORDER_STATUS, paymentStatus } from '~/utils/constants.js'
import { Order, OrderDetail, OrderWithUser, UpdateOrderStatusParams } from '~/@types/order/interface.js'
import { getDB } from '~/configs/mongodb.js'
import { handleThrowError } from '~/middlewares/errorHandlingMiddleware.js'
import { ObjectId } from 'mongodb'
import { skipPageNumber } from '~/utils/algorithms.js'
import { PRODUCT_COLLECTION_NAME } from './productModel.js'
import { IProduct } from '~/@types/product/interface.js'
import { pickUser } from '~/utils/formatters.js'

const ORDER_COLLECTION_NAME = 'orders'
const ORDER_COLLECTION_SCHEMA = Joi.object({
  orderId: Joi.string().optional().trim().required(),
  fullName: Joi.string().min(3).max(100).required(),
  address: Joi.string().min(3).max(255).required(),
  email: Joi.string().pattern(EMAIL_RULE).message(EMAIL_RULE_MESSAGE).required(),
  phoneNumber: Joi.string().min(10).max(11).required(),
  orderDate: Joi.date().timestamp('javascript').default(Date.now()),
  voucher: Joi.string().default(''),
  shippingFee: Joi.number().min(0).required(),
  status: Joi.string()
    .valid(...Object.values(ORDER_STATUS))
    .default(ORDER_STATUS.PENDING),
  total: Joi.number().min(0).required(),
  shippingMethod: Joi.string().max(100).required(),
  shippingAddress: Joi.string().default(''),
  trackingNumber: Joi.string().optional().default(''),
  paymentMethod: Joi.string().max(100).required(),
  shippingDate: Joi.date().timestamp('javascript').default(null),
  isActive: Joi.boolean().default(true),
  paymentStatus: Joi.string()
    .valid(...Object.values(paymentStatus))
    .default(paymentStatus.UNPAID),
  paymentDate: Joi.date().timestamp('javascript').default(null),
  userId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),
  orderDetails: Joi.array()
    .items(
      Joi.object({
        productId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),
        title: Joi.string().min(3).max(500).required(),
        quantity: Joi.number().min(1).required(),
        price: Joi.number().min(0).required(),
        total: Joi.number().min(0).required(),
        size: Joi.string().max(20).default(''),
        note: Joi.string().default('')
      })
    )
    .default([]),

  createdAt: Joi.date().timestamp('javascript').default(Date.now()),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

const generateOrderId = async () => {
  const db = getDB()
  const orderCount = await db.collection(ORDER_COLLECTION_NAME).countDocuments()
  const newOrderNumber = orderCount + 1

  const orderId = `HD${newOrderNumber.toString().padStart(10, '0')}`
  return orderId
}

const create = async (data: Order) => {
  try {
    // Validate
    data.orderId = await generateOrderId()
    const value = await ORDER_COLLECTION_SCHEMA.validateAsync(data)

    const orderId = await generateOrderId()

    // Insert order
    const result = await getDB()
      .collection(ORDER_COLLECTION_NAME)
      .insertOne({
        ...value,
        orderId,
        userId: ObjectId.createFromHexString(value.userId.toString()),
        orderDetails: value.orderDetails.map((detail: OrderDetail) => ({
          ...detail,
          productId: ObjectId.createFromHexString(detail.productId.toString())
        })),
        shippingDate: value.shippingDate ? new Date(value.shippingDate) : null,
        paymentDate: value.paymentDate ? new Date(value.paymentDate) : null
      })
    const orderResponse = await getDB().collection(ORDER_COLLECTION_NAME).findOne({ _id: result.insertedId })

    // Create order fail
    if (!orderResponse) throw new Error('Cannot create order')

    // Create order success => Update stock
    const objectIds = data.orderDetails?.map((detail: OrderDetail) =>
      ObjectId.createFromHexString(detail.productId.toString())
    ) as unknown as string[]

    const products: IProduct[] = await getDB()
      .collection<IProduct>(PRODUCT_COLLECTION_NAME)
      .find({ _id: { $in: objectIds || [] }, _destroy: false })
      .toArray()

    // create array contain update stock for size of product
    const bulkOperations = products.map((product) => {
      const updatedSizes = product.sizes.map((sizeItem) => {
        const update = data.orderDetails?.find((u) => u.size === sizeItem.size)
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

    // update stock for size of product to database
    if (bulkOperations.length > 0) {
      await getDB().collection(PRODUCT_COLLECTION_NAME).bulkWrite(bulkOperations)
    }

    return orderResponse
  } catch (error) {
    handleThrowError(error)
  }
}

const getOrders = async (page: number, limit: number, query: string, userId?: string, status?: string) => {
  try {
    const queryConditions = [
      { _destroy: false },
      {
        $or: [
          { fullName: { $regex: new RegExp(query, 'i') } },
          { address: { $regex: new RegExp(query, 'i') } },
          { email: { $regex: new RegExp(query, 'i') } },
          { phoneNumber: { $regex: new RegExp(query, 'i') } },
          { status: { $regex: new RegExp(query, 'i') } },
          { orderDate: { $regex: new RegExp(query, 'i') } }
        ]
      },
      {
        userId: userId ? ObjectId.createFromHexString(userId.toString()) : { $exists: true }
      },
      {
        status: status ? status : { $exists: true }
      }
    ]

    // Chuyển đổi page và limit thành số nguyên hoặc gán giá trị hợp lệ
    const pageNumber = Number.isInteger(page) ? Number(page) : undefined
    const limitNumber = Number.isInteger(limit) ? Number(limit) : undefined

    // Xây dựng pipeline
    const pipeline: any[] = [
      { $match: { $and: queryConditions } },
      { $sort: { orderDate: -1 } },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user'
        }
      }
    ]

    // Nếu có page và limit thì thêm phân trang
    if (pageNumber !== undefined && limitNumber !== undefined) {
      pipeline.push({
        $facet: {
          queryOrders: [{ $skip: skipPageNumber(pageNumber, limitNumber) }, { $limit: limitNumber }],
          queryNumberOrders: [{ $count: 'queryOrders' }]
        }
      })
    } else {
      // Nếu không có phân trang, lấy toàn bộ sản phẩm
      pipeline.push({
        $facet: {
          queryOrders: [],
          queryNumberOrders: [{ $count: 'queryOrders' }]
        }
      })
    }

    const response = (
      await getDB()
        .collection(ORDER_COLLECTION_NAME)
        .aggregate(pipeline, { collation: { locale: 'en' } })
        .toArray()
    )[0]

    // Lọc bỏ những thông tin không cần thiết của user, chỉ lấy những thông tin cần thiết
    const orders: OrderWithUser[] = response.queryOrders.map((order: OrderWithUser) => {
      const user = pickUser(Array.isArray(order.user) && order.user.length > 0 ? order.user[0] : null)
      return {
        ...order,
        user
      }
    })

    return {
      data: orders,
      total: response.queryNumberOrders[0]?.queryOrders || 0
    }
  } catch (error) {
    handleThrowError(error)
  }
}

const updateOrderStatus = async ({ orderId, newStatus }: UpdateOrderStatusParams) => {
  const db = getDB()
  // Cập nhật trạng thái đơn hàng
  const result = await db
    .collection<Order>(ORDER_COLLECTION_NAME)
    .updateOne({ _id: new ObjectId(orderId) }, { $set: { status: newStatus, updatedAt: Date.now() } })

  // Trả về kết quả
  if (result.modifiedCount === 0) throw new Error('Failed to update order status')
  return { message: 'Order status updated successfully', newStatus }
}

export const orderModel = {
  create,
  getOrders,
  updateOrderStatus,
  ORDER_COLLECTION_NAME,
  ORDER_COLLECTION_SCHEMA
}
