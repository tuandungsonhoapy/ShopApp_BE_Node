import express from 'express'
import { productController } from '~/controllers/productsController.js'

const router = express.Router()
/**
 * @swagger
 * components:
 *  schemas:
 *     Product:
 *      type: object
 *      required:
 *      - title
 *      - price
 *      - status
 *      - deleted
 *      properties:
 *       _id:
 *         type: string
 *         description: The unique identifier for the product
 *         example: "65f7c5d2d2b5f2a7c2f8b9e3"
 *       title:
 *         type: string
 *         description: The title of the product
 *         example: "Cake"
 *       product_category_id:
 *         type: string
 *         description: The ID of the product category
 *         example: "65f7c5d2d2b5f2a7c2f8b9e4"
 *       description:
 *         type: string
 *         description: A detailed description of the product
 *         example: "Delicious cake."
 *       price:
 *         type: number
 *         description: The price of the product
 *         example: 99.99
 *       thumbnail:
 *         type: string
 *         description: URL of the product thumbnail
 *         example: "https://example.com/cake-image.jpg"
 *       status:
 *         type: string
 *         description: Status of the product (e.g., available, out of stock)
 *         example: "available"
 *       deleted:
 *         type: boolean
 *         description: Whether the product is deleted
 *         example: false
 *       stock:
 *         type: number
 *         description: Number of products in stock
 *         example: 50
 *       createdAt:
 *         type: string
 *         format: date-time
 *         description: Timestamp of when the product was created
 *         example: "2024-02-08T12:34:56.789Z"
 *       updatedAt:
 *         type: string
 *         format: date-time
 *         description: Timestamp of the update
 *         example: "2024-02-09T14:22:33.456Z"
 *       _destroy:
 *         type: boolean
 *         description: Whether to destroy
 *         example: false
 */

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
 * /products/edit/{id}:
 *  patch:
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
 * /products/delete/{id}:
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
