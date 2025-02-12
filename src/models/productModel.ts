// import Joi from 'joi'
// import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators.js'

// const PRODUCT_COLLECTION_NAME = 'products'
// const PRODUCT_COLLECTION_SCHEMA = Joi.object({
//   name: Joi.string().required().trim().strict(),
//   description: Joi.string().optional().trim().strict(),
//   price: Joi.number().required().min(0),
//   thumbnail: Joi.string().optional().trim().strict().default(null),
//   categoryId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),

//   createdAt: Joi.date().timestamp('javascript').default(Date.now()),
//   updatedAt: Joi.date().timestamp('javascript').default(null),
//   _destroy: Joi.boolean().default(false)
// })

// export const productModel = {
//   PRODUCT_COLLECTION_NAME,
//   PRODUCT_COLLECTION_SCHEMA
// }

// import mongoose from 'mongoose'
// import { getDB } from '~/configs/mongodb.js'
// import { OBJECT_ID_RULE } from '~/utils/validators.js'
// import { handleThrowError } from '~/middlewares/errorHandlingMiddleware.js'

// const PRODUCT_COLLECTION_NAME = 'products'

// const PRODUCT_COLLECTION_SCHEMA = new mongoose.Schema(
//   {
//     title: { type: String, required: true, trim: true },
//     product_category_id: { type: String, trim: true, default: '' },
//     description: { type: String, trim: true },
//     price: { type: Number, required: true, min: 0 },
//     thumbnail: { type: String, trim: true, default: null },
//     status: { type: String, trim: true },
//     featured: { type: String, trim: true },
//     slug: { type: String, trim: true },
//     deleted: { type: Boolean, default: false },
//     deletedTime: { type: Date, default: null },
//     position: { type: Number },
//     discountPercentage: { type: Number },
//     stock: { type: Number, min: 0 },
//     createdBy: {
//       account_id: { type: String, required: true, match: OBJECT_ID_RULE },
//       createdAt: { type: Date, default: Date.now }
//     },
//     deletedBy: {
//       account_id: { type: String, match: OBJECT_ID_RULE },
//       deletedAt: { type: Date, default: null }
//     },
//     updatedBy: [
//       {
//         account_id: { type: String, required: true, match: OBJECT_ID_RULE },
//         updatedAt: { type: Date, default: null }
//       }
//     ]
//   },
//   { timestamps: true }
// )

// const Product = mongoose.model(PRODUCT_COLLECTION_NAME, PRODUCT_COLLECTION_SCHEMA)

// const getAllProducts = async () => {
//   return await getDB().collection(PRODUCT_COLLECTION_NAME).find()
// }

// export const productModel = { Product, PRODUCT_COLLECTION_NAME, PRODUCT_COLLECTION_SCHEMA, getAllProducts }
//
//
//
//
// CODE MỚI
// import mongoose from 'mongoose'
import { ObjectId } from 'mongodb'
import Joi from 'joi'
import { IProduct } from '~/@types/interface.js'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators.js'
import { getDB } from '~/configs/mongodb.js'

const PRODUCT_COLLECTION_NAME = 'products'

// const PRODUCT_COLLECTION_SCHEMA = new mongoose.Schema(
//   {
//     title: { type: String, required: true, trim: true },
//     product_category_id: { type: String, trim: true, default: '' },
//     description: { type: String, trim: true },
//     price: { type: Number, required: true, min: 0 },
//     thumbnail: { type: String, trim: true, default: null },
//     status: { type: String, trim: true },
//     slug: { type: String, trim: true },
//     deleted: { type: Boolean, default: false },
//     stock: { type: Number, min: 0 },
//     createdBy: {
//       account_id: { type: String, required: true, match: OBJECT_ID_RULE },
//       createdAt: { type: Date, default: Date.now }
//     }
//   },
//   { timestamps: true }
// )

const PRODUCT_COLLECTION_SCHEMA = Joi.object({
  title: Joi.string().required(),
  product_category_id: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  description: Joi.string().required(),
  price: Joi.number().required().min(0),
  thumbnail: Joi.string(),
  status: Joi.string().valid('available'),
  slug: Joi.string(),
  deleted: Joi.boolean().default(false),
  stock: Joi.number().required().min(0),
  createdAt: Joi.date().timestamp('javascript').default(Date.now()),
  updateAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

// const Product = mongoose.model(PRODUCT_COLLECTION_NAME, PRODUCT_COLLECTION_SCHEMA)

const validateData = async (data: IProduct) => {
  return await PRODUCT_COLLECTION_SCHEMA.validateAsync(data, {
    abortEarly: false
  })
}

// // Tìm tất cả sản phẩm
// const getAllProducts = async () => {
//   return await PRODUCT_COLLECTION_SCHEMA.find({ deleted: false })
// }
const getAllProducts = async () => {
  return await getDB().collection(PRODUCT_COLLECTION_NAME).find({ deleted: false }).toArray()
}

// // Tìm sản phẩm theo ID
// const getProductById = async (id: string) => {
//   return await PRODUCT_COLLECTION_SCHEMA.findOne({ _id: id, deleted: false })
// }
const getProductById = async (id: string) => {
  // if (!OBJECT_ID_RULE.test(id)) throw new Error(OBJECT_ID_RULE_MESSAGE)
  return await getDB()
    .collection(PRODUCT_COLLECTION_NAME)
    .findOne({ _id: new ObjectId(id), deleted: false })
}

// Thêm sản phẩm
const createProduct = async (data: IProduct) => {
  const dataValidated = await validateData(data)
  const newProduct = await getDB().collection(PRODUCT_COLLECTION_NAME).insertOne(dataValidated)
  return await getDB().collection(PRODUCT_COLLECTION_NAME).findOne({ _id: newProduct.insertedId })
}

// // Cập nhật sản phẩm
// const updateProduct = async (id: string, updateData: IProduct) => {
//   return await PRODUCT_COLLECTION_SCHEMA.findByIdAndUpdate(id, updateData, { new: true })
// }
const updateProduct = async (id: string, updateData: IProduct) => {
  if (!OBJECT_ID_RULE.test(id)) throw new Error(OBJECT_ID_RULE_MESSAGE)
  await validateData(updateData)
  return await getDB()
    .collection(PRODUCT_COLLECTION_NAME)
    .findOneAndUpdate(
      { _id: new ObjectId(id), deleted: false },
      { $set: { ...updateData, updatedAt: Date.now() } },
      { returnDocument: 'after' }
    )
}

// // Xóa mềm sản phẩm
// const deleteProduct = async (id: string) => {
//   return await PRODUCT_COLLECTION_SCHEMA.findByIdAndUpdate(id, { deleted: true }, { new: true })
// }
const deleteProduct = async (id: string) => {
  if (!OBJECT_ID_RULE.test(id)) throw new Error(OBJECT_ID_RULE_MESSAGE)
  return await getDB()
    .collection(PRODUCT_COLLECTION_NAME)
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { deleted: true, updatedAt: Date.now() } },
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
