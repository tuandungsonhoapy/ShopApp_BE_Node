/* eslint-disable @typescript-eslint/no-explicit-any */
import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError.js'
import { Request, Response, NextFunction } from 'express'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators.js'

const create = async (req: Request, res: Response, next: NextFunction) => {
  const validationCondition = Joi.object({
    title: Joi.string().trim().required(),
    categoryId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    description: Joi.string().trim().optional(),
    price: Joi.number().optional().min(0),
    sizes: Joi.array()
      .items(
        Joi.object({
          size: Joi.string().required(),
          stock: Joi.number().required().min(0),
          price: Joi.number().required().min(0)
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

const isJsonString = (str: any) => {
  if (typeof str !== 'string') return false
  try {
    JSON.parse(str)
    return true
  } catch (e) {
    return false
  }
}

const update = async (req: Request, res: Response, next: NextFunction) => {
  if (isJsonString(req.body.sizes)) {
    req.body.sizes = JSON.parse(req.body.sizes)
  }

  if (isJsonString(req.body.imagesURL)) {
    req.body.imagesURL = JSON.parse(req.body.imagesURL)
  }

  const validationCondition = Joi.object({
    title: Joi.string().trim().required(),
    categoryId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    description: Joi.string().trim().optional(),
    images: Joi.string().required(),
    imagesURL: Joi.array().items(Joi.string()).default([]),
    thumbnail: Joi.string(),
    code: Joi.string().required(),
    sizes: Joi.array()
      .items(
        Joi.object({
          size: Joi.string().required(),
          stock: Joi.number().required().min(0),
          price: Joi.number().min(0)
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

export const productValidation = {
  create,
  update
}
