/* eslint-disable @typescript-eslint/no-explicit-any */
import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError.js'
import { EMAIL_RULE, EMAIL_RULE_MESSAGE, OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators.js'
import { Request, Response, NextFunction } from 'express'

const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  const validationCondition = Joi.object({
    email: Joi.string().required().pattern(EMAIL_RULE).message(EMAIL_RULE_MESSAGE),
    password: Joi.string().required().min(6).trim().strict(),
    confirmPassword: Joi.string().required().valid(Joi.ref('password')).trim().strict(),
    phoneNumber: Joi.string().required().trim().strict(),
    address: Joi.string().required().trim().strict(),
    fullname: Joi.string().required().trim().strict().min(3).max(50),
    province: Joi.string().required().trim().strict(),
    district: Joi.string().required().trim().strict()
  })

  try {
    await validationCondition.validateAsync(req.body, { abortEarly: false })

    next()
  } catch (error: any) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

const verifyAccount = async (req: Request, res: Response, next: NextFunction) => {
  const validationCondition = Joi.object({
    email: Joi.string().required().pattern(EMAIL_RULE).message(EMAIL_RULE_MESSAGE),
    token: Joi.string().required().trim().strict()
  })

  try {
    await validationCondition.validateAsync(req.body, { abortEarly: false })

    next()
  } catch (error: any) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

const login = async (req: Request, res: Response, next: NextFunction) => {
  const validationCondition = Joi.object({
    email: Joi.string().required().pattern(EMAIL_RULE).message(EMAIL_RULE_MESSAGE),
    password: Joi.string().required().min(6).trim().strict()
  })

  try {
    await validationCondition.validateAsync(req.body, { abortEarly: false })

    next()
  } catch (error: any) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  const validationCondition = Joi.object({
    displayName: Joi.string().trim().strict().min(3).max(50),
    current_password: Joi.string()
      .min(6)
      .trim()
      .strict()
      .message('Current password is required and at least 6 characters!'),
    new_password: Joi.string().min(6).trim().strict().message('New password is required and at least 6 characters!')
  })

  try {
    await validationCondition.validateAsync(req.body, {
      abortEarly: false,
      allowUnknown: true
    })

    next()
  } catch (error: any) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  const validationCondition = Joi.object({
    email: Joi.string().required().pattern(EMAIL_RULE).message(EMAIL_RULE_MESSAGE)
  })

  try {
    await validationCondition.validateAsync(req.body, { abortEarly: false })

    next()
  } catch (error: any) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

const verifyOTP = async (req: Request, res: Response, next: NextFunction) => {
  const validationCondition = Joi.object({
    userId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    otp: Joi.string().required().trim().strict().length(6)
  })

  try {
    await validationCondition.validateAsync(req.body, { abortEarly: false })

    next()
  } catch (error: any) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  const validationCondition = Joi.object({
    userId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    password: Joi.string().required().min(6).trim().strict(),
    confirmPassword: Joi.string().required().valid(Joi.ref('password')).trim().strict()
  })

  try {
    await validationCondition.validateAsync(req.body, { abortEarly: false })

    next()
  } catch (error: any) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

export const userValidation = {
  registerUser,
  verifyAccount,
  login,
  updateUser,
  forgotPassword,
  verifyOTP,
  resetPassword
}
