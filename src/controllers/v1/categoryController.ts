import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ICategory } from '~/@types/category/interface.js'
import { categoryModel } from '~/models/v1/categoryModel.js'
import { categoryService } from '~/services/v1/categoryService.js'

const getAllCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await categoryService.getAllCategories()
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit, q } = req.query

    const result = await categoryService.getAll(
      parseInt(page as string, 10),
      parseInt(limit as string, 10),
      q as string
    )

    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const getOneById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const result = await categoryService.getOneById(id)

    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await categoryService.create(req.body as ICategory)

    res.status(StatusCodes.CREATED).json(result)
  } catch (error) {
    next(error)
  }
}

const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const result = await categoryService.update(id, req.body as ICategory)

    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const deleteOneById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const result = await categoryService.deleteOneById(id)

    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const getSubCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const subCategories = await categoryModel.getSubCategories(req.params.parent_id)
    res.json(subCategories)
  } catch (error) {
    next(error)
  }
}

const createCategoryTree = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categoryTree = await categoryModel.createCategoryTree()
    res.json(categoryTree)
  } catch (error) {
    next(error)
  }
}

export const categoryController = {
  getAll,
  getOneById,
  create,
  update,
  deleteOneById,
  getSubCategories,
  createCategoryTree,
  getAllCategories
}
