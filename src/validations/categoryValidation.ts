/* eslint-disable @typescript-eslint/no-explicit-any */
import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError.js'
import { Request, Response, NextFunction } from 'express'

const create = async (req: Request, res: Response, next: NextFunction) => {
  const validationCondition = Joi.object({
    name: Joi.string().required().trim().strict(),
    description: Joi.string().optional().trim().strict()
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
    name: Joi.string().optional().trim().strict(),
    description: Joi.string().optional().trim().strict()
  })

  try {
    await validationCondition.validateAsync(req.body, { abortEarly: false })

    next()
  } catch (error: any) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

export const categoryValidation = {
  create,
  update
}
