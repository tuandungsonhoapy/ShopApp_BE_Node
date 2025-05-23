import Joi from 'joi'
import { ObjectId } from 'mongodb'
// import { queryObjects } from 'v8'
import { ICategory } from '~/@types/category/interface.js'
import { getDB } from '~/configs/mongodb.js'
import { handleThrowError } from '~/middlewares/errorHandlingMiddleware.js'
import { Filter } from 'mongodb'
import { IProduct } from '~/@types/product/interface.js'

const CATEGORY_COLLECTION_NAME = 'categories'
const CATEGORY_COLLECTION_SCHEMA = Joi.object({
  name: Joi.string().required().trim().strict(),
  description: Joi.string().trim().strict().default(''),
  parent_id: Joi.alternatives()
    .try(Joi.string().regex(/^[0-9a-fA-F]{24}$/), Joi.object())
    .allow(null)
    .default(null),
  createdAt: Joi.date().timestamp('javascript').default(Date.now()),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

const INVALID_UPDATE_FIELDS = ['_id', 'createdAt', 'updatedAt']

const getAllCategories = async () => {
  try {
    return await getDB()
      .collection(CATEGORY_COLLECTION_NAME)
      .aggregate([
        {
          $match: { _destroy: false } // Lọc các category không bị xóa
        },
        {
          $lookup: {
            from: 'products', // Collection products
            localField: '_id', // Field trong categories
            foreignField: 'categoryId', // Field trong products
            as: 'products' // Tên field chứa danh sách sản phẩm
          }
        }
      ])
      .toArray()
  } catch (error) {
    handleThrowError(error)
  }
}

const getAll = async (page: number, limit: number, query: string) => {
  try {
    const queryConditions: Filter<IProduct> = { _destroy: false }

    if (query && typeof query === 'string' && query.trim() !== '') {
      queryConditions.$or = [
        { name: { $regex: new RegExp(query.trim(), 'i') } },
        { description: { $regex: new RegExp(query.trim(), 'i') } }
      ]
    }

    const pageNumber = Number.isInteger(page) && page > 0 ? page : 1
    const limitNumber = Number.isInteger(limit) && limit > 0 ? limit : 10
    const skipNumber = (pageNumber - 1) * limitNumber

    const result = await getDB()
      .collection(CATEGORY_COLLECTION_NAME)
      .aggregate([
        { $match: queryConditions },
        {
          $lookup: {
            from: 'products', // Collection cần join
            localField: '_id', // Trường trong categories
            foreignField: 'categoryId', // Trường liên kết trong products
            as: 'products' // Kết quả join lưu vào products
          }
        },
        {
          $facet: {
            data: [{ $sort: { name: 1 } }, { $skip: skipNumber }, { $limit: limitNumber }],
            total: [{ $count: 'count' }]
          }
        }
      ])
      .toArray()

    return {
      data: result[0].data,
      total: result[0].total.length > 0 ? result[0].total[0].count : 0
    }
  } catch (error) {
    handleThrowError(error)
  }
}

const getOneById = async (id: string) => {
  try {
    const objectId = new ObjectId(id)
    const result = await getDB()
      .collection(CATEGORY_COLLECTION_NAME)
      .aggregate([
        { $match: { _id: objectId } },
        {
          $lookup: {
            from: 'products',
            localField: '_id',
            foreignField: 'categoryId',
            as: 'products'
          }
        }
      ])
      .toArray()

    return result[0] || null // Trả về document đầu tiên (hoặc null nếu không tìm thấy)
  } catch (error) {
    handleThrowError(error)
  }
}

const create = async (data: ICategory) => {
  try {
    if (data.parent_id) {
      data.parent_id = new ObjectId(data.parent_id)
    }
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

const getSubCategories = async (parentId: string) => {
  try {
    if (!ObjectId.isValid(parentId)) throw new Error('Invalid parent_id')
    return await getDB().collection(CATEGORY_COLLECTION_NAME).find({ parent_id: parentId }).toArray()
  } catch (error) {
    handleThrowError(error)
  }
}

const createCategoryTree = async () => {
  // try {
  //   const categories = await getDB().collection(CATEGORY_COLLECTION_NAME).find().toArray()

  //   const categoryMap = new Map()

  //   categories.forEach((category) => {
  //     category._id = (category._id as any).toString()
  //     category.children = []
  //     categoryMap.set(category._id, category)
  //   })

  //   const tree: any[] = []

  //   categories.forEach((category) => {
  //     if (category.parent_id) {
  //       const parent = categoryMap.get(category.parent_id)
  //       if (parent) {
  //         parent.children.push(category)
  //       }
  //     } else {
  //       tree.push(category)
  //     }
  //   })

  //   return tree
  // } catch (error) {
  //   handleThrowError(error)
  // }
  try {
    const categories = await getDB().collection(CATEGORY_COLLECTION_NAME).find().toArray()

    const categoryMap = new Map()

    const formattedCategories = categories.map((category) => ({
      ...category,
      _id: category._id.toString(),
      parent_id: category.parent_id ? category.parent_id.toString() : null,
      children: []
    }))

    formattedCategories.forEach((category) => {
      categoryMap.set(category._id, category)
    })

    const tree: any[] = []

    formattedCategories.forEach((category) => {
      if (category.parent_id && categoryMap.has(category.parent_id)) {
        const parent = categoryMap.get(category.parent_id)
        if (parent) {
          parent.children.push(category)
        }
      } else {
        tree.push(category)
      }
    })

    return tree
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
  deleteOneById,
  getSubCategories,
  createCategoryTree,
  getAllCategories
}
