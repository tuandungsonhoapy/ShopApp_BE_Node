/* eslint-disable @typescript-eslint/no-explicit-any */
import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError.js'
import { EMAIL_RULE, EMAIL_RULE_MESSAGE, OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators.js'
import { Request, Response, NextFunction } from 'express'
import { GENDER } from '~/utils/constants.js'

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
    fullname: Joi.string().trim().strict().min(3).max(50),
    dateOfBirth: Joi.date().timestamp('javascript'),
    gender: Joi.string().valid(GENDER.MALE, GENDER.FEMALE),
    phoneNumber: Joi.string().trim().strict(),
    addresses: Joi.array().items(
      Joi.object({
        address: Joi.string().trim().strict(),
        province: Joi.string().trim().strict(),
        district: Joi.string().trim().strict(),
        fullname: Joi.string().trim().strict(),
        phoneNumber: Joi.string().trim().strict(),
        isDefault: Joi.boolean()
      })
    )
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
    confirmPassword: Joi.string().required().valid(Joi.ref('password')).trim().strict(),
    verifyToken: Joi.string().required().trim().strict()
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
