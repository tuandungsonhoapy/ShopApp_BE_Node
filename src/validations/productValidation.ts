/* eslint-disable @typescript-eslint/no-explicit-any */
import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError.js'
import { Request, Response, NextFunction } from 'express'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators.js'

const create = async (req: Request, res: Response, next: NextFunction) => {
  const validationCondition = Joi.object({
    title: Joi.string().trim().strict().required(),
    description: Joi.string().trim().strict().optional(),
    price: Joi.number().min(0).required(),
    categoryId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),
    stock: Joi.number().min(0).required(),
    status: Joi.string().valid('available').optional()
  })

  try {
    await validationCondition.validateAsync(req.body, { abortEarly: false })

    next()
  } catch (error: any) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

const update = async (req: Request, res: Response, next: NextFunction) => {
  const validationCondition = Joi.object({
    title: Joi.string().trim().strict().optional(),
    description: Joi.string().trim().strict().optional(),
    price: Joi.number().min(0).optional(),
    thumbnail: Joi.string().trim().optional(),
    categoryId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).optional(),
    stock: Joi.number().min(0).optional(),
    status: Joi.string().valid('available').optional()
  }).min(1)
  try {
    req.body.price = Number(req.body.price)
    req.body.stock = Number(req.body.stock)
    await validationCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error: any) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

export const productValidation = {
  create,
  update
}
