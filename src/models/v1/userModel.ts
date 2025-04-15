import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { EMAIL_RULE, EMAIL_RULE_MESSAGE, OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators.js'
import { getDB } from '~/configs/mongodb.js'
import { IUser } from '~/@types/v1/auth/interface.js'
import { GENDER, USER_ROLES } from '~/utils/constants.js'
import { handleThrowError } from '~/middlewares/errorHandlingMiddleware.js'
import { skipPageNumber } from '~/utils/algorithms.js'

const USER_COLLECTION_NAME = 'users'
const USER_COLLECTION_SCHEMA = Joi.object({
  customerId: Joi.string().required(),
  email: Joi.string().required().pattern(EMAIL_RULE).message(EMAIL_RULE_MESSAGE),
  password: Joi.string().required(),
  fullname: Joi.string().required().trim().strict(),
  displayName: Joi.string().required().trim().strict(),
  address: Joi.string().required().trim().strict(),
  addresses: Joi.array().items(
    Joi.object({
      address: Joi.string().required().trim().strict(),
      province: Joi.string().required().trim().strict(),
      district: Joi.string().required().trim().strict(),
      fullname: Joi.string().required().trim().strict(),
      phoneNumber: Joi.string().required().trim().strict(),
      isDefault: Joi.boolean().default(false)
    }).default([])
  ),
  phoneNumber: Joi.string().optional().trim().strict(),
  dateOfBirth: Joi.date().timestamp().optional(),
  avatar: Joi.string().default(null),
  province: Joi.string().required().trim().strict(),
  district: Joi.string().required().trim().strict(),
  role: Joi.string().valid(USER_ROLES.ADMIN, USER_ROLES.CUSTOMER).default(USER_ROLES.CUSTOMER),
  isActive: Joi.boolean().default(false),
  verifyToken: Joi.string(),
  birthday: Joi.date().timestamp('javascript').default(null),
  gender: Joi.string().valid(GENDER.MALE, GENDER.FEMALE).default(GENDER.MALE),
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

const getAllUsers = async (page: number, limit: number, query: string, type: string) => {
  try {
    const queryConditions: any[] = [
      { _destroy: false },
      {
        $or: [
          { fullname: { $regex: new RegExp(query, 'i') } },
          { email: { $regex: new RegExp(query, 'i') } },
          { phoneNumber: { $regex: new RegExp(query, 'i') } },
          { address: { $regex: new RegExp(query, 'i') } },
          { province: { $regex: new RegExp(query, 'i') } },
          { district: { $regex: new RegExp(query, 'i') } },
          { role: { $regex: new RegExp(query, 'i') } },
          { displayName: { $regex: new RegExp(query, 'i') } }
        ]
      }
    ]

    // Nếu có type, thêm vào điều kiện lọc
    if (type) {
      queryConditions.push({ type })
    }

    // Chuyển đổi page và limit thành số nguyên hoặc gán giá trị hợp lệ
    const pageNumber = Number.isInteger(page) ? Number(page) : undefined
    const limitNumber = Number.isInteger(limit) ? Number(limit) : undefined

    // Xây dựng pipeline
    const pipeline: any[] = [{ $match: { $and: queryConditions } }, { $sort: { name: 1 } }]

    // Nếu có page và limit thì thêm phân trang
    if (pageNumber !== undefined && limitNumber !== undefined) {
      pipeline.push({
        $facet: {
          queryUsers: [{ $skip: skipPageNumber(pageNumber, limitNumber) }, { $limit: limitNumber }],
          queryNumberUsers: [{ $count: 'queryUsers' }]
        }
      })
    } else {
      // Nếu không có phân trang, lấy toàn bộ người dùng
      pipeline.push({
        $facet: {
          queryUsers: [],
          queryNumberUsers: [{ $count: 'queryUsers' }]
        }
      })
    }

    const response = (
      await getDB()
        .collection(USER_COLLECTION_NAME)
        .aggregate(pipeline, { collation: { locale: 'en' } })
        .toArray()
    )[0]

    return {
      data: response.queryUsers,
      total: response.queryNumberUsers[0]?.queryUsers || 0
    }
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
  updateOneById,
  getAllUsers
}
