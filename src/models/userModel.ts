import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { EMAIL_RULE, EMAIL_RULE_MESSAGE, OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators.js'
import { getDB } from '~/configs/mongodb.js'

const USER_COLLECTION_NAME = 'users'
const USER_COLLECTION_SCHEMA = Joi.object({
  email: Joi.string().required().pattern(EMAIL_RULE).message(EMAIL_RULE_MESSAGE),
  password: Joi.string().required(),
  fullname: Joi.string().required().trim().strict(),
  address: Joi.string().required().trim().strict(),
  phoneNumber: Joi.string().optional().trim().strict(),
  dateOfBirth: Joi.date().timestamp('javascript').optional(),
  avatar: Joi.string().default(null),
  roleId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  isActive: Joi.boolean().default(false),
  facebookAccountId: Joi.string().default(null),
  googleAccountId: Joi.string().default(null),
  socialAccount: Joi.array()
    .items(
      Joi.object({
        userId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
        provider: Joi.string().required(),
        providerId: Joi.string().required(),
        email: Joi.string().pattern(EMAIL_RULE).message(EMAIL_RULE_MESSAGE),
        name: Joi.string()
      })
    )
    .default([]),

  createdAt: Joi.date().timestamp('javascript').default(Date.now()),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

export const userModel = {
  USER_COLLECTION_NAME,
  USER_COLLECTION_SCHEMA
}
