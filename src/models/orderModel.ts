import Joi from 'joi'
import { EMAIL_RULE, EMAIL_RULE_MESSAGE, OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators.js'
import { orderStatus, paymentStatus } from '~/utils/constants.js'
import { Order, OrderDetail } from '~/@types/order/interface.js'
import { getDB } from '~/configs/mongodb.js'
import { handleThrowError } from '~/middlewares/errorHandlingMiddleware.js'
import { ObjectId } from 'mongodb'
import { skipPageNumber } from '~/utils/algorithms.js'

const ORDER_COLLECTION_NAME = 'orders'
const ORDER_COLLECTION_SCHEMA = Joi.object({
  fullName: Joi.string().min(3).max(100).required(),
  address: Joi.string().min(3).max(255).required(),
  email: Joi.string().pattern(EMAIL_RULE).message(EMAIL_RULE_MESSAGE).required(),
  phoneNumber: Joi.string().min(10).max(11).required(),
  orderDate: Joi.date().timestamp('javascript').default(Date.now()),
  status: Joi.string()
    .valid(...Object.values(orderStatus))
    .default(orderStatus.PENDING),
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
        note: Joi.string().min(3).max(150).default('')
      })
    )
    .default([]),

  createdAt: Joi.date().timestamp('javascript').default(Date.now()),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

const create = async (data: Order) => {
  try {
    const value = await ORDER_COLLECTION_SCHEMA.validateAsync(data)
    const result = await getDB()
      .collection(ORDER_COLLECTION_NAME)
      .insertOne({
        ...value,
        userId: ObjectId.createFromHexString(value.userId.toString()),
        orderDetails: value.orderDetails.map((detail: OrderDetail) => ({
          ...detail,
          productId: ObjectId.createFromHexString(detail.productId.toString())
        })),
        shippingDate: value.shippingDate ? new Date(value.shippingDate) : null,
        paymentDate: value.paymentDate ? new Date(value.paymentDate) : null
      })
    return await getDB().collection(ORDER_COLLECTION_NAME).findOne({ _id: result.insertedId })
  } catch (error) {
    handleThrowError(error)
  }
}

const getOrders = async (page: number, limit: number, query: string, userId: string, status: string) => {
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
      { $sort: { orderDate: 1 } },
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

    return {
      data: response.queryOrders,
      total: response.queryNumberOrders[0]?.queryOrders || 0
    }
  } catch (error) {
    handleThrowError(error)
  }
}

export const orderModel = {
  create,
  getOrders,
  ORDER_COLLECTION_NAME,
  ORDER_COLLECTION_SCHEMA
}
