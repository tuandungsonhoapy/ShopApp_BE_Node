import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import { productService } from '~/services/productService.js'
// import { uploadToCloudinary } from '~/providers/CloudinaryProvider.js'
import { CloudinaryProvider } from '~/providers/CloudinaryProvider.js'
import ApiError from '../utils/ApiError.js'

const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await productService.getAllProducts()
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
    if (!req.file) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Thumbnail image is required')
    }

    // Upload ảnh lên Cloudinary
    const imageUrl = await CloudinaryProvider.streamUpload(req.file.buffer, 'NapunBakary')

    // Thêm URL vào dữ liệu sản phẩm
    const productData = {
      ...req.body,
      thumbnail: (imageUrl as { secure_url: string }).secure_url
    }

    // Tiếp tục logic tạo sản phẩm (giả sử có service xử lý)
    const newProduct = await productService.createProduct(productData)

    res.status(StatusCodes.CREATED).json(newProduct)
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
