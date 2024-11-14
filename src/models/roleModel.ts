import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { getDB } from '~/configs/mongodb.js'

const ROLE_COLLECTION_NAME = 'roles'
const ROLE_COLLECTION_SCHEMA = Joi.object({
  name: Joi.string().required().trim().strict(),

  createdAt: Joi.date().timestamp('javascript').default(Date.now()),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

export const roleModel = {
  ROLE_COLLECTION_NAME,
  ROLE_COLLECTION_SCHEMA
}
