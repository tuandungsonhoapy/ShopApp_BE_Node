import { productModel } from '~/models/productModel.js'
import ApiError from '~/utils/ApiError.js'
import { StatusCodes } from 'http-status-codes'
import { IProduct } from '~/@types/interface.js'

const getAllProducts = async () => {
  return await productModel.getAllProducts()
}

const getProductById = async (id: string) => {
  const product = await productModel.getProductById(id)
  if (!product) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found!')
  }
  return product
}

const createProduct = async (data: IProduct) => {
  if (!data.title || !data.price) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Title and price are required!')
  }
  return await productModel.createProduct(data)
}

const updateProduct = async (id: string, updateData: IProduct) => {
  const updatedProduct = await productModel.updateProduct(id, updateData)
  if (!updatedProduct) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found!')
  }
  return updatedProduct
}

const deleteProduct = async (id: string) => {
  const deletedProduct = await productModel.deleteProduct(id)
  if (!deletedProduct) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found!')
  }
  return deletedProduct
}

export const productService = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
}
