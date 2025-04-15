import Joi from 'joi'
import { getDBPostgre } from '~/configs/postgres.js'
import { IUser } from '~/@types/v1/auth/interface.js'
import { GENDER, USER_ROLES } from '~/utils/constants.js'
import { handleThrowError } from '~/middlewares/errorHandlingMiddleware.js'
import { skipPageNumber } from '~/utils/algorithms.js'

const USER_TABLE_NAME = 'users'

const USER_TABLE_SCHEMA = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  fullname: Joi.string().required().trim().strict(),
  displayName: Joi.string().required().trim().strict(),
  address: Joi.string().required().trim().strict(),
  phoneNumber: Joi.string().optional().trim().strict(),
  dateOfBirth: Joi.date().optional(),
  avatar: Joi.string().default(null),
  province: Joi.string().required().trim().strict(),
  district: Joi.string().required().trim().strict(),
  role: Joi.string().valid(USER_ROLES.ADMIN, USER_ROLES.CUSTOMER).default(USER_ROLES.CUSTOMER),
  isActive: Joi.boolean().default(false),
  verifyToken: Joi.string().optional(),
  birthday: Joi.date().default(null),
  gender: Joi.string().valid(GENDER.MALE, GENDER.FEMALE).default(GENDER.MALE),
  facebookAccountId: Joi.string().default(null),
  googleAccountId: Joi.string().default(null),
  require_2fa: Joi.boolean().default(false),
  secretKey_2fa: Joi.string().optional(),
  forgotPasswordOTP: Joi.string().default(null)
})

const validateData = async (data: IUser) => {
  return await USER_TABLE_SCHEMA.validateAsync(data, { abortEarly: false })
}

const registerUser = async (data: IUser) => {
  try {
    const validatedData = await validateData(data)
    const {
      email,
      password,
      fullname,
      displayName,
      address,
      phoneNumber,
      province,
      district,
      role,
      isActive,
      birthday,
      gender
    } = validatedData

    const query = `
      INSERT INTO ${USER_TABLE_NAME} (email, password, fullname, display_name, address, phone_number, province, district, role, is_active, birthday, gender)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *
    `
    const values = [
      email,
      password,
      fullname,
      displayName,
      address,
      phoneNumber,
      province,
      district,
      role,
      isActive,
      birthday,
      gender
    ]

    const result = await getDBPostgre().query(query, values)
    return result.rows[0]
  } catch (error) {
    handleThrowError(error)
  }
}

const findOneByEmail = async (email: string) => {
  try {
    const result = await getDBPostgre().query(`SELECT * FROM ${USER_TABLE_NAME} WHERE email = $1 LIMIT 1`, [email])
    return result.rows[0]
  } catch (error) {
    handleThrowError(error)
  }
}

const findOneById = async (id: number) => {
  try {
    const result = await getDBPostgre().query(`SELECT * FROM ${USER_TABLE_NAME} WHERE id = $1 LIMIT 1`, [id])
    return result.rows[0]
  } catch (error) {
    handleThrowError(error)
  }
}

const updateOneById = async (id: number, data: Partial<IUser>) => {
  try {
    const fields = Object.keys(data)
    const values = Object.values(data)
    const setString = fields.map((field, index) => `${field} = $${index + 1}`).join(', ')

    const query = `UPDATE ${USER_TABLE_NAME} SET ${setString}, updated_at = NOW() WHERE id = $${fields.length + 1} RETURNING *`
    const result = await getDBPostgre().query(query, [...values, id])

    return result.rows[0]
  } catch (error) {
    handleThrowError(error)
  }
}

const getAllUsers = async (page: number, limit: number, query: string, type: string) => {
  try {
    const offset = skipPageNumber(page, limit)

    const queryConditions: string[] = ['_destroy = false']
    const values: any[] = []

    if (query) {
      queryConditions.push(`
        (fullname ILIKE $${values.length + 1} OR email ILIKE $${values.length + 1} OR phone_number ILIKE $${values.length + 1})
      `)
      values.push(`%${query}%`)
    }

    if (type) {
      queryConditions.push(`role = $${values.length + 1}`)
      values.push(type)
    }

    const whereClause = queryConditions.length ? `WHERE ${queryConditions.join(' AND ')}` : ''

    const dataQuery = `SELECT * FROM ${USER_TABLE_NAME} ${whereClause} ORDER BY fullname LIMIT $${values.length + 1} OFFSET $${values.length + 2}`
    values.push(limit, offset)

    const countQuery = `SELECT COUNT(*) FROM ${USER_TABLE_NAME} ${whereClause}`

    const [dataResult, countResult] = await Promise.all([
      getDBPostgre().query(dataQuery, values),
      getDBPostgre().query(countQuery, values.slice(0, values.length - 2))
    ])

    return {
      data: dataResult.rows,
      total: Number(countResult.rows[0].count)
    }
  } catch (error) {
    handleThrowError(error)
  }
}

export const userModel_V2 = {
  USER_TABLE_NAME,
  USER_TABLE_SCHEMA,
  registerUser,
  findOneByEmail,
  findOneById,
  updateOneById,
  getAllUsers
}
