/* eslint-disable @typescript-eslint/no-explicit-any */
import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError.js'
import { Request, Response, NextFunction } from 'express'
import { EMAIL_RULE, EMAIL_RULE_MESSAGE, OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators.js'

const create = async (req: Request, res: Response, next: NextFunction) => {
  const validationCondition = Joi.object({
    fullName: Joi.string().trim().min(3).max(100).required(),
    address: Joi.string().trim().min(3).max(255).required(),
    email: Joi.string().pattern(EMAIL_RULE).message(EMAIL_RULE_MESSAGE).required(),
    phoneNumber: Joi.string().min(10).max(11).required(),
    total: Joi.number().min(0).required(),
    shippingMethod: Joi.string().max(100).required(),
    shippingAddress: Joi.string().default(''),
    trackingNumber: Joi.string().optional().default(''),
    paymentMethod: Joi.string().max(100).required(),
    shippingFee: Joi.number().min(0).required(),
    orderDetails: Joi.array()
      .items(
        Joi.object({
          productId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),
          title: Joi.string().min(3).max(500).required(),
          quantity: Joi.number().min(1).required(),
          price: Joi.number().min(0).required(),
          total: Joi.number().min(0).required(),
          size: Joi.string().max(20).default(''),
          note: Joi.string().optional().default('')
        })
      )
      .default([]),
    vouchersUsed: Joi.array()
      .items(
        Joi.object({
          voucherId: Joi.string().required(),
          code: Joi.string().required(),
          discountAmount: Joi.number().required(),
          maxDiscount: Joi.number().required(),
          productsApplied: Joi.array()
            .items(
              Joi.object({
                productId: Joi.string().required(),
                discountPerProduct: Joi.number().required()
              })
            )
            .min(1)
            .required()
        })
      )
      .min(1)
      .optional()
  })

  try {
    await validationCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error: any) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

const updateOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
  const validationCondition = Joi.object({
    orderId: Joi.string().trim().required(),
    newStatus: Joi.string().trim().required()
  })

  try {
    await validationCondition.validateAsync(req.body, { abortEarly: false })

    next()
  } catch (error: any) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

export const orderValidation = {
  create,
  updateOrderStatus
}
