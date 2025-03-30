import Joi from 'joi'
import { EMAIL_RULE, EMAIL_RULE_MESSAGE, OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators.js'
import { ORDER_STATUS, paymentStatus } from '~/utils/constants.js'
import { Order, OrderDetail, OrderWithUser, UpdateOrderStatusParams, VoucherUsed } from '~/@types/order/interface.js'
import { getDB } from '~/configs/mongodb.js'
import { handleThrowError } from '~/middlewares/errorHandlingMiddleware.js'
import { AnyBulkWriteOperation, ObjectId } from 'mongodb'
import { skipPageNumber } from '~/utils/algorithms.js'
import { PRODUCT_COLLECTION_NAME } from './productModel.js'
import { VOUCHER_COLLECTION_NAME } from './voucherModel.js'
import { IProduct } from '~/@types/product/interface.js'
import { pickUser } from '~/utils/formatters.js'
import { PipelineStage } from 'mongoose'

const ORDER_COLLECTION_NAME = 'orders'
const ORDER_COLLECTION_SCHEMA = Joi.object({
  orderId: Joi.string().optional().trim().required(),
  fullName: Joi.string().min(3).max(100).required(),
  address: Joi.string().min(3).max(255).required(),
  email: Joi.string().pattern(EMAIL_RULE).message(EMAIL_RULE_MESSAGE).required(),
  phoneNumber: Joi.string().min(10).max(11).required(),
  orderDate: Joi.date().timestamp('javascript').default(Date.now()),
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
        note: Joi.string().default('').optional().allow('')
      })
    )
    .default([]),
  vouchersUsed: Joi.array()
    .items(
      Joi.object({
        voucherId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),
        code: Joi.string().required(),
        discountAmount: Joi.number().min(0).required(),
        maxDiscount: Joi.number().min(0).optional(),
        productsApplied: Joi.array()
          .items(
            Joi.object({
              productId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),
              discountPerProduct: Joi.number().min(0).required()
            })
          )
          .default([])
      })
    )
    .default([]),
  createdAt: Joi.date().timestamp('javascript').default(Date.now()),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

export const generateOrderId = async () => {
  const db = getDB()
  const orderCount = await db.collection(ORDER_COLLECTION_NAME).countDocuments()
  const newOrderNumber = orderCount + 1

  const orderId = `HD${newOrderNumber.toString().padStart(10, '0')}`
  return orderId
}

export const getProductsByIds = async (productIds: ObjectId[]) => {
  return await getDB()
    .collection<IProduct>(PRODUCT_COLLECTION_NAME)
    .find({ _id: { $in: productIds || [] }, _destroy: false })
    .toArray()
}

export const bulkUpdateProducts = async (bulkOperations: AnyBulkWriteOperation[]) => {
  if (bulkOperations.length > 0) {
    await getDB().collection(PRODUCT_COLLECTION_NAME).bulkWrite(bulkOperations)
  }
}

const checkVouchers = async (vouchersUsed: VoucherUsed[], userId: string) => {
  for (const voucher of vouchersUsed) {
    // Check voucher ton tại va con han su dung
    const voucherFromDB = await getDB()
      .collection(VOUCHER_COLLECTION_NAME)
      .findOne({
        _id: ObjectId.createFromHexString(voucher.voucherId.toString()),
        isActive: true,
        expirationDate: { $gt: new Date() }
      })
    if (!voucherFromDB) throw new Error(`Voucher ${voucher.code} không hợp lệ`)

    // Kiem tra so lan su dung
    const usedCount = await getDB()
      .collection('orders')
      .countDocuments({
        userId: new ObjectId(userId),
        'vouchersUsed.voucherId': voucher.voucherId
      })
    if (usedCount >= voucherFromDB.usageLimitPerUser) {
      throw new Error(`Bạn đã dùng hết lượt cho voucher ${voucher.code}`)
    }

    // Kiểm tra discountAmount có khớp với logic không?
    if (voucher.discountAmount > voucherFromDB.maxDiscount) {
      throw new Error(`Số tiền giảm giá vượt quá ${voucherFromDB.maxDiscount}`)
    }
  }
}

const create = async (data: Order) => {
  try {
    // Validate
    data.orderId = await generateOrderId()
    const value = await ORDER_COLLECTION_SCHEMA.validateAsync(data)
    if (value.vouchersUsed?.length > 0) {
      await checkVouchers(value.vouchersUsed, value.userId)
    }

    // Chuyen id sang ObjectId
    const vouchersUsed =
      data.vouchersUsed?.map((voucher) => ({
        ...voucher,
        voucherId: ObjectId.createFromHexString(voucher.voucherId.toString()),
        productsApplied: voucher.productsApplied.map((product) => ({
          ...product,
          productId: ObjectId.createFromHexString(product.productId.toString())
        }))
      })) || []

    const totalDiscount = vouchersUsed.reduce(
      (sum, voucher) =>
        sum + voucher.productsApplied.reduce((sumProduct, product) => sumProduct + product.discountPerProduct, 0),
      0
    )
    const totalProducts = data.orderDetails?.reduce((sum, product) => sum + product.quantity * product.price, 0) || 0
    const shippingFee = data.shippingFee ?? 0
    const totalFinal = Math.max(0, totalProducts - totalDiscount + shippingFee)
    data.total = totalFinal

    const orderToInsert = {
      ...value,
      userId: ObjectId.createFromHexString(value.userId.toString()),
      orderDetails: value.orderDetails.map((detail: OrderDetail) => ({
        ...detail,
        productId: ObjectId.createFromHexString(detail.productId.toString())
      })),
      vouchersUsed,
      total: totalFinal,
      shippingDate: value.shippingDate ? new Date(value.shippingDate) : null,
      paymentDate: value.paymentDate ? new Date(value.paymentDate) : null
    }
    // Insert order
    const result = await getDB().collection(ORDER_COLLECTION_NAME).insertOne(orderToInsert)

    // return await getDB().collection(ORDER_COLLECTION_NAME).findOne({ _id: result.insertedId })
    return {
      ...orderToInsert,
      _id: result.insertedId
    }

    // return orderResponse
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
    const pipeline: PipelineStage[] = [
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
  const result = await db.collection<Order>(ORDER_COLLECTION_NAME).findOneAndUpdate(
    { _id: new ObjectId(orderId) },
    { $set: { status: newStatus, updatedAt: Date.now() } },
    { returnDocument: 'after' } // Trả về document sau khi cập nhật
  )

  // Trả về kết quả
  if (!result) {
    throw new Error('Order not found or update failed')
  }
  return { message: 'Order status updated successfully', newStatus, result: result }
}

export const orderModel = {
  create,
  getOrders,
  updateOrderStatus,
  ORDER_COLLECTION_NAME,
  ORDER_COLLECTION_SCHEMA
}
