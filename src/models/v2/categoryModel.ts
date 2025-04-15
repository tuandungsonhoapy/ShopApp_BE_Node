import Joi from 'joi'
import { getDBPostgre } from '~/configs/postgres.js'
import { handleThrowError } from '~/middlewares/errorHandlingMiddleware.js'
import { ICategory } from '~/@types/v2/category/interface.js'

const CATEGORY_TABLE_NAME = 'categories'

const CATEGORY_SCHEMA = Joi.object({
  name: Joi.string().required().trim().strict(),
  description: Joi.string().trim().strict().default(''),
  parent_id: Joi.number().allow(null).default(null),
  created_at: Joi.date().default(() => new Date()),
  updated_at: Joi.date().default(null),
  _destroy: Joi.boolean().default(false)
})

const INVALID_UPDATE_FIELDS = ['id', 'created_at', 'updated_at']

const getAllCategories = async (): Promise<ICategory[]> => {
  try {
    const result = await getDBPostgre().query(`SELECT * FROM ${CATEGORY_TABLE_NAME} WHERE _destroy = false`)
    return result.rows
  } catch (error) {
    handleThrowError(error)
    return []
  }
}

const getAll = async (page: number, limit: number, query?: string): Promise<{ data: ICategory[]; total: number }> => {
  try {
    const offset = (page - 1) * limit
    const queryConditions = query ? `AND (name ILIKE $1 OR description ILIKE $1)` : ''
    const values: (string | number)[] = query ? [`%${query}%`] : []

    const dataResult = await getDBPostgre().query(
      `SELECT * FROM ${CATEGORY_TABLE_NAME} WHERE _destroy = false ${queryConditions} ORDER BY name ASC LIMIT $2 OFFSET $3`,
      [...values, limit, offset]
    )

    const countResult = await getDBPostgre().query(
      `SELECT COUNT(*) FROM ${CATEGORY_TABLE_NAME} WHERE _destroy = false ${queryConditions}`,
      values
    )

    return {
      data: dataResult.rows,
      total: parseInt(countResult.rows[0].count, 10)
    }
  } catch (error) {
    handleThrowError(error)
    return { data: [], total: 0 }
  }
}

const getOneById = async (id: number): Promise<ICategory | null> => {
  try {
    const result = await getDBPostgre().query(`SELECT * FROM ${CATEGORY_TABLE_NAME} WHERE id = $1`, [id])
    return result.rows[0] || null
  } catch (error) {
    handleThrowError(error)
    return null
  }
}

const create = async (data: ICategory): Promise<ICategory | null> => {
  try {
    const value = await CATEGORY_SCHEMA.validateAsync(data)
    const result = await getDBPostgre().query(
      `INSERT INTO ${CATEGORY_TABLE_NAME} (name, description, parent_id, created_at, updated_at, _destroy) 
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [value.name, value.description, value.parent_id, value.created_at, value.updated_at, value._destroy]
    )
    return result.rows[0]
  } catch (error) {
    handleThrowError(error)
    return null
  }
}

const update = async (id: number, data: Partial<ICategory>): Promise<ICategory | null> => {
  try {
    INVALID_UPDATE_FIELDS.forEach((field) => delete data[field as keyof ICategory])

    const fields = Object.keys(data)
      .map((key, index) => `${key} = $${index + 1}`)
      .join(', ')
    const values = Object.values(data)

    if (fields.length === 0) return null

    const result = await getDBPostgre().query(
      `UPDATE ${CATEGORY_TABLE_NAME} SET ${fields}, updated_at = NOW() WHERE id = $${values.length + 1} RETURNING *`,
      [...values, id]
    )
    return result.rows[0]
  } catch (error) {
    handleThrowError(error)
    return null
  }
}

const deleteOneById = async (id: number): Promise<void> => {
  try {
    await getDBPostgre().query(`DELETE FROM ${CATEGORY_TABLE_NAME} WHERE id = $1`, [id])
  } catch (error) {
    handleThrowError(error)
  }
}

const getSubCategories = async (parentId: number): Promise<ICategory[]> => {
  try {
    const result = await getDBPostgre().query(`SELECT * FROM ${CATEGORY_TABLE_NAME} WHERE parent_id = $1`, [parentId])
    return result.rows
  } catch (error) {
    handleThrowError(error)
    return []
  }
}

const createCategoryTree = async (): Promise<ICategory[]> => {
  try {
    const result = await getDBPostgre().query(`SELECT * FROM ${CATEGORY_TABLE_NAME}`)
    const categories: ICategory[] = result.rows

    const categoryMap = new Map<number, ICategory & { children: ICategory[] }>()
    categories.forEach((category) => {
      categoryMap.set(category.id!, { ...category, children: [] })
    })

    const tree: (ICategory & { children: ICategory[] })[] = []
    categories.forEach((category) => {
      if (category.parent_id && categoryMap.has(category.parent_id)) {
        categoryMap.get(category.parent_id)!.children.push(categoryMap.get(category.id!)!)
      } else {
        tree.push(categoryMap.get(category.id!)!)
      }
    })

    return tree
  } catch (error) {
    handleThrowError(error)
    return []
  }
}

export const categoryModel_V2 = {
  CATEGORY_TABLE_NAME,
  CATEGORY_SCHEMA,
  getAll,
  getOneById,
  create,
  update,
  deleteOneById,
  getSubCategories,
  createCategoryTree,
  getAllCategories
}
