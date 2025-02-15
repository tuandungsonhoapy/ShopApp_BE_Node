import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import { productService } from '~/services/productService.js'

const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await productService.getAllProducts()
    res.status(StatusCodes.OK).json(products)
  } catch (error) {
    next(error)
  }
}

const getProductById = async (req: Request, res: Response, next: NextFunction) => {
  console.log(req.params.id)
  try {
    const product = await productService.getProductById(req.params.id)
    res.status(StatusCodes.OK).json(product)
  } catch (error) {
    next(error)
  }
}

const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const thumbnail = req.file
    let newProduct = req.body
    if (thumbnail) {
      newProduct = { ...req.body, thumbnail }
    }
    const product = await productService.createProduct(newProduct)
    res.status(StatusCodes.CREATED).json({ message: 'Product created successfully!', product })
  } catch (error) {
    next(error)
  }
}

const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
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
