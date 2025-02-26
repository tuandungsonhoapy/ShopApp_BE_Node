import { ICategory } from '~/@types/category/interface.js'
import { categoryModel } from '~/models/categoryModel.js'

const getAll = async () => {
  return await categoryModel.getAll()
}

const getOneById = async (id: string) => {
  return await categoryModel.getOneById(id)
}

const create = async (data: ICategory) => {
  return await categoryModel.create(data)
}

const update = async (id: string, data: ICategory) => {
  return await categoryModel.update(id, data)
}

const deleteOneById = async (id: string) => {
  return await categoryModel.deleteOneById(id)
}

const getSubCategories = async (parentId: string) => {
  return await categoryModel.getSubCategories(parentId)
}

const createCategoryTree = async () => {
  return await categoryModel.createCategoryTree()
}
export const categoryService = {
  getAll,
  getOneById,
  create,
  update,
  deleteOneById,
  getSubCategories,
  createCategoryTree
}
