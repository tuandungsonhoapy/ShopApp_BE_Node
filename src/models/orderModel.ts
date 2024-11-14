import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { EMAIL_RULE, EMAIL_RULE_MESSAGE, OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators.js'
import { getDB } from '~/configs/mongodb.js'
import { orderStatus, paymentStatus } from '~/utils/constants.js'

const ORDER_COLLECTION_NAME = 'orders'
const ORDER_COLLECTION_SCHEMA = Joi.object({
  fullName: Joi.string().min(3).max(100).required(),
  address: Joi.string().min(3).max(255).required(),
  email: Joi.string().pattern(EMAIL_RULE).message(EMAIL_RULE_MESSAGE).required(),
  phoneNumber: Joi.string().min(10).max(11).required(),
  note: Joi.string().min(3).max(150).default(''),
  orderDate: Joi.date().timestamp('javascript').default(Date.now()),
  status: Joi.string()
    .valid(...Object.values(orderStatus))
    .default(orderStatus.PENDING),
  total: Joi.number().min(0).required(),
  shippingMethod: Joi.string().max(100).required(),
  shippingAddress: Joi.string().max(255).required(),
  trackingNumber: Joi.string().max(100).default(''),
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
        quantity: Joi.number().min(1).required(),
        price: Joi.number().min(0).required(),
        total: Joi.number().min(0).required(),
        color: Joi.string().max(20).default('')
      })
    )
    .default([]),

  createdAt: Joi.date().timestamp('javascript').default(Date.now()),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

export const orderModel = {
  ORDER_COLLECTION_NAME,
  ORDER_COLLECTION_SCHEMA
}
