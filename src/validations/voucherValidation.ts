import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError.js'
import { Request, Response, NextFunction } from 'express'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators.js'
// import { EMAIL_RULE, EMAIL_RULE_MESSAGE, OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators.js'

const create = async (req: Request, res: Response, next: NextFunction) => {
  const validationCondition = Joi.object({
    code: Joi.string().required(),
    description: Joi.string().max(500).default(''),
    discountType: Joi.string().valid('percent', 'fixed').required(),
    discountValue: Joi.number().required().min(0),
    minOrderValue: Joi.number().min(0),
    maxDiscount: Joi.number().min(0).allow(null),
    expirationDate: Joi.date().iso().required(),
    isActive: Joi.boolean(),
    usageLimit: Joi.number().min(0).allow(null),
    usageCount: Joi.number().min(0).default(0),
    applicableCategories: Joi.array()
      .items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE))
      .default([]),
    applicableProducts: Joi.array()
      .items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE))
      .default([])
  })

  try {
    await validationCondition.validateAsync(req.body, { abortEarly: false })
    return next()
  } catch (error: any) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

const update = async (req: Request, res: Response, next: NextFunction) => {
  const validationCondition = Joi.object({
    code: Joi.string().optional(),
    description: Joi.string().max(500),
    discountType: Joi.string().valid('percent', 'fixed'),
    discountValue: Joi.number().min(0),
    minOrderValue: Joi.number().min(0),
    maxDiscount: Joi.number().min(0).allow(null),
    expirationDate: Joi.date().iso(),
    isActive: Joi.boolean(),
    usageLimit: Joi.number().min(0).allow(null),
    usageCount: Joi.number().min(0),
    applicableCategories: Joi.array()
      .items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE))
      .default([]),
    applicableProducts: Joi.array()
      .items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE))
      .default([])
  })
  try {
    await validationCondition.validateAsync(req.body, { abortEarly: false })
    return next()
  } catch (error: any) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

export const voucherValidation = {
  create,
  update
}
