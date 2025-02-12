import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { EMAIL_RULE, EMAIL_RULE_MESSAGE, OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators.js'
import { getDB } from '~/configs/mongodb.js'
import { IUser } from '~/@types/interface.js'
import { USER_ROLES } from '~/utils/constants.js'
import { handleThrowError } from '~/middlewares/errorHandlingMiddleware.js'

const USER_COLLECTION_NAME = 'users'
const USER_COLLECTION_SCHEMA = Joi.object({
  email: Joi.string().required().pattern(EMAIL_RULE).message(EMAIL_RULE_MESSAGE),
  password: Joi.string().required(),
  fullname: Joi.string().required().trim().strict(),
  displayName: Joi.string().required().trim().strict(),
  address: Joi.string().required().trim().strict(),
  phoneNumber: Joi.string().optional().trim().strict(),
  dateOfBirth: Joi.date().timestamp('javascript').optional(),
  avatar: Joi.string().default(null),
  province: Joi.string().required().trim().strict(),
  district: Joi.string().required().trim().strict(),
  role: Joi.string().valid(USER_ROLES.ADMIN, USER_ROLES.CUSTOMER).default(USER_ROLES.CUSTOMER),
  isActive: Joi.boolean().default(false),
  verifyToken: Joi.string(),
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
  require_2fa: Joi.boolean().default(false),
  secretKey_2fa: Joi.string(),
  forgotPasswordOTP: Joi.string().default(null),

  createdAt: Joi.date().timestamp('javascript').default(Date.now()),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

const INVALID_UPDATE_FIELDS = ['_id', 'email', 'username', 'createdAt']

const validateData = async (data: IUser) => {
  return await USER_COLLECTION_SCHEMA.validateAsync(data, {
    abortEarly: false
  })
}

const registerUser = async (data: IUser) => {
  try {
    const validatedData = await validateData(data)
    return await getDB().collection(USER_COLLECTION_NAME).insertOne(validatedData)
  } catch (error) {
    handleThrowError(error)
  }
}

const findOneByEmail = async (email: string) => {
  try {
    return await getDB().collection(USER_COLLECTION_NAME).findOne({ email })
  } catch (error) {
    handleThrowError(error)
  }
}

const findOneById = async (id: string | ObjectId) => {
  try {
    return await getDB()
      .collection(USER_COLLECTION_NAME)
      .findOne({ _id: ObjectId.createFromHexString(id.toString()) })
  } catch (error) {
    handleThrowError(error)
  }
}

const updateOneById = async (id: string | ObjectId, data: Partial<IUser>) => {
  try {
    INVALID_UPDATE_FIELDS.forEach((field) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (data as any)[field]
    })
    return await getDB()
      .collection(USER_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: ObjectId.createFromHexString(id.toString()) },
        {
          $set: {
            ...data,
            updatedAt: new Date()
          }
        },
        { returnDocument: 'after' }
      )
  } catch (error) {
    handleThrowError(error)
  }
}

export const userModel = {
  USER_COLLECTION_NAME,
  USER_COLLECTION_SCHEMA,
  registerUser,
  findOneByEmail,
  findOneById,
  updateOneById
}
