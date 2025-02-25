import { ObjectId } from 'mongodb'
import Joi from 'joi'
import { IProduct } from '~/@types/interface.js'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators.js'
import { getDB } from '~/configs/mongodb.js'
import { skipPageNumber } from '~/utils/algorithms.js'
import { handleThrowError } from '~/middlewares/errorHandlingMiddleware.js'

const PRODUCT_COLLECTION_NAME = 'products'

const PRODUCT_COLLECTION_SCHEMA = Joi.object({
  title: Joi.string().required(),
  code: Joi.string().required(),
  categoryId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  description: Joi.string().optional(),
  price: Joi.number().optional().min(0),
  sizes: Joi.array()
    .items(
      Joi.object({
        size: Joi.string().required(),
        stock: Joi.number().required().min(0),
        price: Joi.number().required().min(0)
      })
    )
    .default([]),
  thumbnail: Joi.string(),
  images: Joi.array().items(Joi.string()).default([]),
  status: Joi.string().valid('available', 'unavailable').default('unavailable'),
  slug: Joi.string(),
  createdAt: Joi.date().timestamp('javascript').default(Date.now()),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

const validateData = async (data: IProduct) => {
  return await PRODUCT_COLLECTION_SCHEMA.validateAsync(data, {
    abortEarly: false
  })
}

// const getAllProducts = async (page: number, limit: number, query: string, categoryId: string) => {
//   console.log('limit', limit)
//   try {
//     const queryConditions = [
//       { _destroy: false },
//       {
//         $or: [
//           {
//             title: {
//               $regex: new RegExp(query, 'i')
//             }
//           },
//           {
//             description: {
//               $regex: new RegExp(query, 'i')
//             }
//           },
//           {
//             code: {
//               $regex: new RegExp(query, 'i')
//             }
//           },
//           {
//             slug: {
//               $regex: new RegExp(query, 'i')
//             }
//           },
//           {
//             status: {
//               $regex: new RegExp(query, 'i')
//             }
//           }
//         ]
//       },
//       {
//         categoryId: categoryId ? ObjectId.createFromHexString(categoryId.toString()) : { $exists: true }
//       }
//     ]

//     const response = (
//       await getDB()
//         .collection(PRODUCT_COLLECTION_NAME)
//         .aggregate(
//           [
//             { $match: { $and: queryConditions } },
//             { $sort: { title: 1 } },
//             {
//               $lookup: {
//                 from: 'categories',
//                 localField: 'categoryId',
//                 foreignField: '_id',
//                 as: 'category'
//               }
//             },
//             {
//               $facet: {
//                 // * Thread 1: Query products
//                 queryProducts: [{ $skip: skipPageNumber(page, limit) }, { $limit: limit }],
//                 // * Thread 2: Query number of products
//                 queryNumberProducts: [{ $count: 'queryProducts' }]
//               }
//             }
//           ],
//           { collation: { locale: 'en' } }
//         )
//         .toArray()
//     )[0]

//     return {
//       data: response.queryProducts,
//       total: response.queryNumberProducts[0]?.queryProducts || 0
//     }
//   } catch (error) {
//     handleThrowError(error)
//   }
// }

const getAllProducts = async (page: number, limit: number, query: string, categoryId: string) => {
  try {
    const queryConditions = [
      { _destroy: false },
      {
        $or: [
          { title: { $regex: new RegExp(query, 'i') } },
          { description: { $regex: new RegExp(query, 'i') } },
          { code: { $regex: new RegExp(query, 'i') } },
          { slug: { $regex: new RegExp(query, 'i') } },
          { status: { $regex: new RegExp(query, 'i') } }
        ]
      },
      {
        categoryId: categoryId ? ObjectId.createFromHexString(categoryId.toString()) : { $exists: true }
      }
    ]

    // Chuyển đổi page và limit thành số nguyên hoặc gán giá trị hợp lệ
    const pageNumber = Number.isInteger(page) ? Number(page) : undefined
    const limitNumber = Number.isInteger(limit) ? Number(limit) : undefined

    // Xây dựng pipeline
    const pipeline: any[] = [
      { $match: { $and: queryConditions } },
      { $sort: { title: 1 } },
      {
        $lookup: {
          from: 'categories',
          localField: 'categoryId',
          foreignField: '_id',
          as: 'category'
        }
      }
    ]

    // Nếu có page và limit thì thêm phân trang
    if (pageNumber !== undefined && limitNumber !== undefined) {
      pipeline.push({
        $facet: {
          queryProducts: [{ $skip: skipPageNumber(pageNumber, limitNumber) }, { $limit: limitNumber }],
          queryNumberProducts: [{ $count: 'queryProducts' }]
        }
      })
    } else {
      // Nếu không có phân trang, lấy toàn bộ sản phẩm
      pipeline.push({
        $facet: {
          queryProducts: [],
          queryNumberProducts: [{ $count: 'queryProducts' }]
        }
      })
    }

    const response = (
      await getDB()
        .collection(PRODUCT_COLLECTION_NAME)
        .aggregate(pipeline, { collation: { locale: 'en' } })
        .toArray()
    )[0]

    return {
      data: response.queryProducts,
      total: response.queryNumberProducts[0]?.queryProducts || 0
    }
  } catch (error) {
    handleThrowError(error)
  }
}

const getProductById = async (id: string) => {
  if (!OBJECT_ID_RULE.test(id)) throw new Error(OBJECT_ID_RULE_MESSAGE)
  return await getDB()
    .collection(PRODUCT_COLLECTION_NAME)
    .findOne({ _id: new ObjectId(id), _destroy: false })
}

const createProduct = async (data: IProduct) => {
  const dataValidated = await validateData(data)
  const newProduct = await getDB()
    .collection(PRODUCT_COLLECTION_NAME)
    .insertOne({
      ...dataValidated,
      categoryId: ObjectId.createFromHexString(dataValidated.categoryId.toString())
    })
  return await getDB().collection(PRODUCT_COLLECTION_NAME).findOne({ _id: newProduct.insertedId })
}

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
