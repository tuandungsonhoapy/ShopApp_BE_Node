import { ICategory } from '~/@types/v2/category/interface.js'
import { categoryModel_V2 } from '~/models/v2/categoryModel.js'

const getAllCategories = async (): Promise<ICategory[]> => {
  return await categoryModel_V2.getAllCategories()
}

const getAll = async (page: number, limit: number, query?: string): Promise<{ data: ICategory[]; total: number }> => {
  return await categoryModel_V2.getAll(page, limit, query)
}

const getOneById = async (id: number): Promise<ICategory | null> => {
  return await categoryModel_V2.getOneById(id)
}

const create = async (data: ICategory): Promise<ICategory | null> => {
  return await categoryModel_V2.create(data)
}

const update = async (id: number, data: Partial<ICategory>): Promise<ICategory | null> => {
  return await categoryModel_V2.update(id, data)
}

const deleteOneById = async (id: number): Promise<void> => {
  return await categoryModel_V2.deleteOneById(id)
}

const getSubCategories = async (parentId: number): Promise<ICategory[]> => {
  return await categoryModel_V2.getSubCategories(parentId)
}

const createCategoryTree = async (): Promise<ICategory[]> => {
  return await categoryModel_V2.createCategoryTree()
}

export const categoryService_V2 = {
  getAll,
  getOneById,
  create,
  update,
  deleteOneById,
  getSubCategories,
  createCategoryTree,
  getAllCategories
}
