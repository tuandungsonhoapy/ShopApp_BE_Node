import { productModel } from '~/models/productModel.js'
import ApiError from '~/utils/ApiError.js'
import { StatusCodes } from 'http-status-codes'
import { IProduct } from '~/@types/interface.js'
import { CloudinaryProvider } from '~/providers/CloudinaryProvider.js'
import { getNextSequenceValue } from '~/models/counterModel.js'

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
  let uploadedThumbnail = data.thumbnail

  if (data.thumbnail.buffer) {
    uploadedThumbnail = await CloudinaryProvider.streamUpload(data.thumbnail.buffer, 'NapunBakary').then(
      (result) => (result as { secure_url: string }).secure_url
    )
  }

  const code = await getNextSequenceValue(productModel.PRODUCT_COLLECTION_NAME)

  return await productModel.createProduct({
    ...data,
    thumbnail: uploadedThumbnail,
    code: `PP${String(code).padStart(3, '0')}`
  })
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
