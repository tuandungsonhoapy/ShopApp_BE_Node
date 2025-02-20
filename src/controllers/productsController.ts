import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import { productService } from '~/services/productService.js'

const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit, q, categoryId } = req.query

    const pageNumber = page ? parseInt(page as string, 10) : 1
    const limitNumber = limit ? parseInt(limit as string, 10) : 10

    const products = await productService.getAllProducts(pageNumber, limitNumber, q as string, categoryId as string)
    res.status(StatusCodes.OK).json(products)
  } catch (error) {
    next(error)
  }
}

const getProductById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await productService.getProductById(req.params.id)
    res.status(StatusCodes.OK).json(product)
  } catch (error) {
    next(error)
  }
}

const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined
    // const thumbnail = req.file
    const thumbnail = files?.thumbnail ? files.thumbnail[0] : undefined
    console.log(req.file)
    // const images = req.files
    const images = files?.images || []

    const sizes = JSON.parse(req.body.sizes)
    let newProduct = { ...req.body, sizes }

    if (thumbnail) {
      newProduct = { ...newProduct, thumbnail }
    }

    if (images) {
      newProduct = { ...newProduct, images }
    }

    // if (imagesUpload) {
    //   newProduct = { ...newProduct, imagesUpload }
    // }
    const product = await productService.createProduct(newProduct)
    res.status(StatusCodes.CREATED).json({ message: 'Product created successfully!', product })
  } catch (error) {
    next(error)
  }
}

const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  console.log(req.params.id)
  try {
    const product = await productService.updateProduct(req.params.id, req.body)
    res.status(StatusCodes.OK).json({ message: 'Product updated successfully!', product })
  } catch (error) {
    next(error)
  }
}

const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await productService.deleteProduct(req.params.id)
    res.status(StatusCodes.OK).json({ message: 'Product deleted successfully!', product })
  } catch (error) {
    next(error)
  }
}

export const productController = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
}
