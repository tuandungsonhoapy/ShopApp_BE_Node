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
      .default([])
  })

  try {
    await validationCondition.validateAsync(req.body, { abortEarly: false })

    next()
  } catch (error: any) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

// const update = async (req: Request, res: Response, next: NextFunction) => {
//   const validationCondition = Joi.object({
//     name: Joi.string().optional().trim().strict(),
//     description: Joi.string().optional().trim().strict()
//   })

//   try {
//     await validationCondition.validateAsync(req.body, { abortEarly: false })

//     next()
//   } catch (error: any) {
//     next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
//   }
// }

export const orderValidation = {
  create
  // update
}
