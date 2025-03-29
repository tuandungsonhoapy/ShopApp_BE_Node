import { productModel } from '~/models/v1/productModel.js'
import ApiError from '~/utils/ApiError.js'
import { StatusCodes } from 'http-status-codes'
import { IProduct } from '~/@types/product/interface.js'
import { CloudinaryProvider } from '~/providers/CloudinaryProvider.js'
import { getNextSequenceValue } from '~/models/v1/counterModel.js'
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

const processImagesForUpdate = async (id: string, images: any[], thumbnail: any, imagesURL: any) => {
  const product = await productModel.getProductById(id)
  if (!product) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found!')
  }

  let uploadedThumbnail = product.thumbnail
  let uploadedImages = product.images || []

  // Upload new thumbnail if provided
  if (thumbnail && thumbnail.buffer) {
    if (product.thumbnail) {
      await CloudinaryProvider.deleteFile(product.thumbnail) // Xóa ảnh thumbnail cũ
    }
    uploadedThumbnail = await CloudinaryProvider.streamUpload(thumbnail.buffer, 'NapunBakary').then(
      (result) => (result as { secure_url: string }).secure_url
    )
  }

  if (typeof images === 'string') {
    images = JSON.parse(images)
  }

  const newImageFiles = images.filter((img) => img.buffer) // Ảnh mới cần upload

  if (newImageFiles.length > 0) {
    const uploadedNewImages = await Promise.all(
      newImageFiles.map((image) =>
        CloudinaryProvider.streamUpload(image.buffer, 'NapunBakary').then(
          (result) => (result as { secure_url: string }).secure_url
        )
      )
    )
    uploadedImages = [...imagesURL, ...uploadedNewImages]
  } else {
    uploadedImages = imagesURL
  }

  // Find images to delete
  const imagesToDelete = product.images.filter((oldImage: string) => !imagesURL.includes(oldImage))

  // Delete images from Cloudinary
  await Promise.all(imagesToDelete.map((img: string) => CloudinaryProvider.deleteFile(img)))

  return { uploadedThumbnail, uploadedImages }
}

const isJsonString = (str: any) => {
  if (typeof str !== 'string') return false
  try {
    JSON.parse(str)
    return true
  } catch (e) {
    return false
  }
}

const updateProduct = async (id: string, updateData: IProduct) => {
  const product = await productModel.getProductById(id)
  if (!product) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found!')
  }

  let updatedThumbnail = product.thumbnail
  let updatedImages = product.images || []

  if (updateData.imagesURL && isJsonString(updateData.imagesURL)) {
    updateData.imagesURL = JSON.parse(updateData.imagesURL)
  }
  if (updateData.images || updateData.thumbnail) {
    const { uploadedThumbnail, uploadedImages } = await processImagesForUpdate(
      id,
      updateData.images || product.images,
      updateData.thumbnail || product.thumbnail,
      updateData.imagesURL || []
    )
    updatedThumbnail = uploadedThumbnail
    updatedImages = uploadedImages
  }
  if (updateData.imagesURL) {
    delete updateData.imagesURL
  }
  const updatedProduct = await productModel.updateProduct(id, {
    ...updateData,
    thumbnail: updatedThumbnail,
    images: [...updatedImages]
  })

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
