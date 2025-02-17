// import mongoose from 'mongoose'
import { ObjectId } from 'mongodb'
import Joi from 'joi'
import { IProduct } from '~/@types/interface.js'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators.js'
import { getDB } from '~/configs/mongodb.js'

const PRODUCT_COLLECTION_NAME = 'products'

const PRODUCT_COLLECTION_SCHEMA = Joi.object({
  title: Joi.string().trim().strict().required(),
  categoryId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),
  description: Joi.string().trim().strict().required(),
  price: Joi.number().min(0).required(),
  stock: Joi.number().min(0).required(),
  thumbnail: Joi.string().trim().optional(),
  status: Joi.string().valid('available').optional(),
  slug: Joi.string().trim().optional(),
  deleted: Joi.boolean().default(false),
  _destroy: Joi.boolean().default(false),
  createdAt: Joi.date()
    .timestamp('javascript')
    .default(() => Date.now()),
  updateAt: Joi.date().timestamp('javascript').allow(null).default(null)
})

const validateData = async (data: IProduct) => {
  return await PRODUCT_COLLECTION_SCHEMA.validateAsync(data, {
    abortEarly: false
  })
}

// // Tìm tất cả sản phẩm
const getAllProducts = async () => {
  return await getDB().collection(PRODUCT_COLLECTION_NAME).find({ _destroy: false }).toArray()
}

// // Tìm sản phẩm theo ID
const getProductById = async (id: string) => {
  if (!OBJECT_ID_RULE.test(id)) throw new Error(OBJECT_ID_RULE_MESSAGE)
  return await getDB()
    .collection(PRODUCT_COLLECTION_NAME)
    .findOne({ _id: new ObjectId(id), _destroy: false })
}

// Thêm sản phẩm
const createProduct = async (data: IProduct) => {
  const dataValidated = await validateData(data)
  const newProduct = await getDB().collection(PRODUCT_COLLECTION_NAME).insertOne(dataValidated)
  return await getDB().collection(PRODUCT_COLLECTION_NAME).findOne({ _id: newProduct.insertedId })
}

// // Cập nhật sản phẩm
const updateProduct = async (id: string, updateData: IProduct) => {
  if (!OBJECT_ID_RULE.test(id)) throw new Error(OBJECT_ID_RULE_MESSAGE)
  await validateData(updateData)
  return await getDB()
    .collection(PRODUCT_COLLECTION_NAME)
    .findOneAndUpdate(
      { _id: new ObjectId(id), _destroy: false },
      { $set: { ...updateData, updatedAt: Date.now() } },
      { returnDocument: 'after' }
    )
}

// // Xóa mềm sản phẩm
const deleteProduct = async (id: string) => {
  if (!OBJECT_ID_RULE.test(id)) throw new Error(OBJECT_ID_RULE_MESSAGE)
  return await getDB()
    .collection(PRODUCT_COLLECTION_NAME)
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { _destroy: true, updatedAt: Date.now() } },
      { returnDocument: 'after' }
    )
}

export const productModel = {
  PRODUCT_COLLECTION_NAME,
  PRODUCT_COLLECTION_SCHEMA,
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
}
