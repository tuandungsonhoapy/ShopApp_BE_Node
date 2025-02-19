/* eslint-disable @typescript-eslint/no-explicit-any */
import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError.js'
import { Request, Response, NextFunction } from 'express'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators.js'

const addToCart = async (req: Request, res: Response, next: NextFunction) => {
  const validationCondition = Joi.object({
    productId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    quantity: Joi.number().required().min(1),
    size: Joi.string().required(),
    title: Joi.string(),
    price: Joi.number().required().min(0),
    thumbnail: Joi.string()
  })

  try {
    await validationCondition.validateAsync(req.body, { abortEarly: false })

    next()
  } catch (error: any) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

export const cartValidation = {
  addToCart
}
