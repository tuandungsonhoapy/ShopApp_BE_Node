/* eslint-disable @typescript-eslint/no-explicit-any */
import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError.js'
import { Request, Response, NextFunction } from 'express'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators.js'

const create = async (req: Request, res: Response, next: NextFunction) => {
  const validationCondition = Joi.object({
    title: Joi.string().required(),
    categoryId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    description: Joi.string().optional(),
    price: Joi.number().required().min(0),
    sizes: Joi.array().items(
      Joi.object({
        size: Joi.string().required(),
        stock: Joi.number().required().min(0)
      })
    ),
    thumbnail: Joi.any(),
    images: Joi.array().items(Joi.any()),
    status: Joi.string().valid('available', 'unavailable')
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
    title: Joi.string().trim().strict(),
    description: Joi.string().trim().strict(),
    price: Joi.number().min(0),
    thumbnail: Joi.string().trim().strict(),
    categoryId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    stock: Joi.number().min(0),
    status: Joi.string().valid('available'),
    deleted: Joi.boolean(),
    _destroy: Joi.boolean(),
    slug: Joi.string().trim().strict()
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
