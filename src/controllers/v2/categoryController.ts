import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ICategory } from '~/@types/v2/category/interface.js'
import { categoryService_V2 } from '~/services/v2/categoryService.js'

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
    const page = parseInt(req.query.page as string, 10)
    const limit = parseInt(req.query.limit as string, 10)
    const query = req.query.q as string

    if (isNaN(page) || isNaN(limit)) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Page and limit must be numbers' })
    }

    const result = await categoryService.getAll(page, limit, query)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const getOneById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id, 10)

    if (isNaN(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid category ID' })
    }

    const result = await categoryService.getOneById(id)

    if (!result) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Category not found' })
    }

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
    const id = parseInt(req.params.id, 10)

    if (isNaN(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid category ID' })
    }

    const result = await categoryService.update(id, req.body as Partial<ICategory>)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const deleteOneById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id, 10)

    if (isNaN(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid category ID' })
    }

    await categoryService.deleteOneById(id)
    res.status(StatusCodes.NO_CONTENT).send()
  } catch (error) {
    next(error)
  }
}

const getSubCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parentId = parseInt(req.params.parent_id, 10)

    if (isNaN(parentId)) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid parent category ID' })
    }

    const subCategories = await categoryService.getSubCategories(parentId)
    res.status(StatusCodes.OK).json(subCategories)
  } catch (error) {
    next(error)
  }
}

const createCategoryTree = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categoryTree = await categoryService.createCategoryTree()
    res.status(StatusCodes.OK).json(categoryTree)
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
