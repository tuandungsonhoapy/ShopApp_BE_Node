import express from 'express'
import { productController } from '~/controllers/productsController.js'

const router = express.Router()

/**
 * @swagger
 * /products:
 *  get:
 *   summary: Get all products
 *   description: Retrieve a list of all products
 *   tags:
 *    - Products
 *   responses:
 *    200:
 *      description: A list of products
 *      content:
 *        application/json:
 *          schema:
 *            type: array
 *            items:
 *              $ref: '#/components/schemas/Product'
 */
router.get('/', productController.getAllProducts)
/**
 * @swagger
 * /products/{id}:
 *  get:
 *   summary: Get a product by ID
 *   description: Retrieve a single product by its ID
 *   tags:
 *    - Products
 *   parameters:
 *    - in: path
 *      name: id
 *      required: true
 *      schema:
 *        type: string
 *      description: The product ID
 *   responses:
 *    200:
 *      description: Product details
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Product'
 *    404:
 *      description: Product not found
 */
router.get('/:id', productController.getProductById)

/**
 * @swagger
 * /products:
 *  post:
 *   summary: Create a new product
 *   description: Add a new product to the database
 *   tags:
 *    - Products
 *   requestBody:
 *    description: Product data
 *    required: true
 *    content:
 *      application/json:
 *        schema:
 *          $ref: '#/components/schemas/Product'
 *   responses:
 *    201:
 *      description: Product created successfully
 *    400:
 *      description: Invalid input
 */
router.post('/', productController.createProduct)

/**
 * @swagger
 * /products/{id}:
 *  put:
 *   summary: Update a product
 *   description: Modify an existing product by ID
 *   tags:
 *    - Products
 *   parameters:
 *    - in: path
 *      name: id
 *      required: true
 *      schema:
 *        type: string
 *      description: The product ID
 *   requestBody:
 *    description: Updated product data
 *    required: true
 *    content:
 *      application/json:
 *        schema:
 *          $ref: '#/components/schemas/Product'
 *   responses:
 *    200:
 *      description: Product updated successfully
 *    400:
 *      description: Invalid input
 *    404:
 *      description: Product not found
 */
router.patch('/edit/:id', productController.updateProduct)

/**
 * @swagger
 * /products/{id}:
 *  delete:
 *   summary: Delete a product
 *   description: Remove a product by ID
 *   tags:
 *    - Products
 *   parameters:
 *    - in: path
 *      name: id
 *      required: true
 *      schema:
 *        type: string
 *      description: The product ID
 *   responses:
 *    200:
 *      description: Product deleted successfully
 *    404:
 *      description: Product not found
 */
router.delete('/delete/:id', productController.deleteProduct)

export const productRoute = router
