// import { NextFunction, Request, Response } from 'express'
// import { productService } from '~/services/productService.js'

// // Get all products
// const getAllProducts = async (req: Request, res: Response) => {
//   try {
//     // const response = await
//     res.status(200).json({ message: "products successfully"})
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching products', error })
//   }
// }

// // Get product by ID
// const getProductById = async (req: Request, res: Response, next:NextFunction) => {
//   try {
//     const { id } = req.params
//     const product = await productService.findById(id)

//     res.status(200).json(product)
//   } catch (error) {
//     next(error)
//   }
// }

// // Create a new product
// const createProduct = async (req: Request, res: Response) => {
//   try {
//     const newProduct = new Product(req.body)
//     await newProduct.save()
//     res.status(201).json(newProduct)
//   } catch (error) {
//     res.status(500).json({ message: 'Error creating product', error })
//   }
// }

// // Update product by ID
// const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const { id } = req.params
//     const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true })
//     if (!updatedProduct) {
//       res.status(404).json({ message: 'Product not found' })
//     }
//     res.status(200).json(updatedProduct)
//   } catch (error) {
//     next(error)
//   }
// }

// // Soft delete a product by ID
// const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const { id } = req.params;
//     const deletedProduct = await Product.findByIdAndUpdate(
//     id, {
//         deleted: true,
//         deletedTime: new Date()},
// {
//         new: true})
//     if (!deletedProduct) {
//       res.status(404).json({ message: 'Product not found' })
//     }
//     res.status(200).json({ message: 'Product deleted successfully', deletedProduct })
//   } catch (error) {
//     next(error)
//   }
// }

// // export { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct }

// export const productsController = {getAllProducts, getProductById, createProduct, updateProduct, deleteProduct}
// ------------------------------------------------------------------------------------------------
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
    const product = await productService.createProduct(req.body)
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
