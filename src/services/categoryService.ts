import { ICategory } from '~/@types/interface.js'
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

export const categoryService = {
  getAll,
  getOneById,
  create,
  update,
  deleteOneById
}
