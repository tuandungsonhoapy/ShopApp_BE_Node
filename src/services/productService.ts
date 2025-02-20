import { productModel } from '~/models/productModel.js'
import ApiError from '~/utils/ApiError.js'
import { StatusCodes } from 'http-status-codes'
import { IProduct } from '~/@types/interface.js'
import { CloudinaryProvider } from '~/providers/CloudinaryProvider.js'
import { getNextSequenceValue } from '~/models/counterModel.js'
// import { result } from 'lodash'

const getAllProducts = async (page: number, limit: number, query: string, categoryId: string) => {
  return await productModel.getAllProducts(page, limit, query, categoryId)
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

  // const uploadedImages = data.images
  let uploadedImages: string[] = []
  if (data.thumbnail.buffer) {
    uploadedThumbnail = await CloudinaryProvider.streamUpload(data.thumbnail.buffer, 'NapunBakary').then(
      (result) => (result as { secure_url: string }).secure_url
    )
  }

  // if (data.images) {
  //   data.images.map((image: { buffer: any }) => {
  //     CloudinaryProvider.streamUpload(image.buffer, 'NapunBakary').then(
  //       (result) => (result as { secure_url: string }).secure_url
  //     )
  //   })
  // }
  if (Array.isArray(data.images) && data.images.length > 0) {
    uploadedImages = await Promise.all(
      data.images
        .filter((image) => image && image.buffer) // Chỉ upload nếu có buffer
        .map((image) =>
          CloudinaryProvider.streamUpload(image.buffer, 'NapunBakary').then(
            (result) => (result as { secure_url: string }).secure_url
          )
        )
    )
  }

  const code = await getNextSequenceValue(productModel.PRODUCT_COLLECTION_NAME)

  return await productModel.createProduct({
    ...data,
    thumbnail: uploadedThumbnail,
    code: `PP${String(code).padStart(4, '0')}`,
    images: uploadedImages
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
