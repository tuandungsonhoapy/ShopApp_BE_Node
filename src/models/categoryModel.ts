import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { ICategory } from '~/@types/interface.js'
import { getDB } from '~/configs/mongodb.js'
import { handleThrowError } from '~/middlewares/errorHandlingMiddleware.js'

const CATEGORY_COLLECTION_NAME = 'categories'
const CATEGORY_COLLECTION_SCHEMA = Joi.object({
  name: Joi.string().required().trim().strict(),
  description: Joi.string().trim().strict().default(''),

  createdAt: Joi.date().timestamp('javascript').default(Date.now()),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

const INVALID_UPDATE_FIELDS = ['_id', 'createdAt', 'updatedAt']

const getAll = async () => {
  try {
    return await getDB().collection(CATEGORY_COLLECTION_NAME).find().toArray()
  } catch (error) {
    handleThrowError(error)
  }
}

const getOneById = async (id: string) => {
  try {
    const objectId = ObjectId.createFromHexString(id)
    return await getDB().collection(CATEGORY_COLLECTION_NAME).findOne({ _id: objectId })
  } catch (error) {
    handleThrowError(error)
  }
}

const create = async (data: ICategory) => {
  try {
    const value = await CATEGORY_COLLECTION_SCHEMA.validateAsync(data)
    const result = await getDB().collection(CATEGORY_COLLECTION_NAME).insertOne(value)
    return await getDB().collection(CATEGORY_COLLECTION_NAME).findOne({ _id: result.insertedId })
  } catch (error) {
    handleThrowError(error)
  }
}

const update = async (id: string, data: ICategory) => {
  try {
    INVALID_UPDATE_FIELDS.forEach((field) => {
      delete (data as any)[field]
    })

    return await getDB()
      .collection(CATEGORY_COLLECTION_NAME)
      .findOneAndUpdate({ _id: ObjectId.createFromHexString(id) }, { $set: data }, { returnDocument: 'after' })
  } catch (error) {
    handleThrowError(error)
  }
}

const deleteOneById = async (id: string) => {
  try {
    return await getDB()
      .collection(CATEGORY_COLLECTION_NAME)
      .deleteOne({ _id: ObjectId.createFromHexString(id) })
  } catch (error) {
    handleThrowError(error)
  }
}

export const categoryModel = {
  CATEGORY_COLLECTION_NAME,
  CATEGORY_COLLECTION_SCHEMA,
  getAll,
  getOneById,
  create,
  update,
  deleteOneById
}
