import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ICategory } from '~/@types/interface.js'
import { categoryService } from '~/services/categoryService.js'

const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await categoryService.getAll()

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

export const categoryController = {
  getAll,
  getOneById,
  create,
  update,
  deleteOneById
}
