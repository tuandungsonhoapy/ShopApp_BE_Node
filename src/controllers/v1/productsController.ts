import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import { productService } from '~/services/v1/productService.js'

const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit, q, categoryId } = req.query

    const products = await productService.getAllProducts(
      parseInt(page as string, 10),
      parseInt(limit as string, 10),
      q as string,
      categoryId as string
    )
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
  const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined
  const thumbnail = files?.thumbnail ? files.thumbnail[0] : undefined
  const images = files?.images || []

  const sizes = JSON.parse(req.body.sizes)
  let newProduct = { ...req.body, sizes }

  if (thumbnail) {
    newProduct = { ...newProduct, thumbnail }
  }

  if (images) {
    newProduct = { ...newProduct, images }
  }

  try {
    const product = await productService.updateProduct(req.params.id, newProduct)
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
