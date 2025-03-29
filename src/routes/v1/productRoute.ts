import express, { RequestHandler } from 'express'
import { productController } from '~/controllers/v1/productsController.js'
import { productValidation } from '~/validations/productValidation.js'
import { authMiddleware } from '~/middlewares/authMiddleware.js'
// import { CloudinaryProvider } from '~/providers/CloudinaryProvider.js'
import { multerMiddleware } from '~/middlewares/MulterMiddleware.js'

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
 *      - code
 *      - categoryId
 *      - sizes
 *      - status
 *      - _destroy
 *      properties:
 *       _id:
 *         type: string
 *         description: The unique identifier for the product
 *         example: "65f7c5d2d2b5f2a7c2f8b9e3"
 *       title:
 *         type: string
 *         description: The title of the product
 *         example: "Cake"
 *       code:
 *         type: string
 *         description: Unique product code
 *         example: "EXAMPLE123"
 *       categoryId:
 *         type: string
 *         description: The ID of the product category
 *         example: "65f7c5d2d2b5f2a7c2f8b9e4"
 *       sizes:
 *         type: array
 *         description: Available sizes and stock
 *         items:
 *           type: object
 *           properties:
 *             size:
 *               type: string
 *               description: The size of the product
 *               example: "L"
 *             stock:
 *               type: number
 *               description: The stock quantity of this size
 *               example: 20
 *       images:
 *         type: array
 *         description: Additional images of the product
 *         items:
 *           type: string
 *           example: "https://example.com/cake-side.jpg"
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
 *       slug:
 *         type: string
 *         description: SEO-friendly product slug
 *         example: "delicious-cake"
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
 *       category:
 *         type: array
 *         items:
 *           $ref: '#/components/schemas/Category'
 */

/**
 * @swagger
 * /products:
 *  get:
 *   summary: Get all products
 *   description: Return a list of all products
 *   tags:
 *    - Products
 *   parameters:
 *    - in: query
 *      name: page
 *      schema:
 *        type: integer
 *        minimum: 1
 *        default: 1
 *      required: false
 *      description: The page number
 *    - in: query
 *      name: limit
 *      schema:
 *        type: integer
 *        minimum: 1
 *        default: 10
 *      required: false
 *      description: The number of items per page
 *    - in: query
 *      name: q
 *      schema:
 *        type: string
 *        default: ""
 *      required: false
 *      description: Search for products by title
 *    - in: query
 *      name: categoryId
 *      schema:
 *        type: string
 *      required: false
 *      description: Filter products by category ID
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
 *   description: Return a single product by its ID
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
 *   security:
 *    - BearerAuth: []
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
router.post(
  '/',
  multerMiddleware.upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'images', maxCount: 5 }
  ]) as RequestHandler,
  productController.createProduct
)

/**
 * @swagger
 * /products/edit/{id}:
 *  put:
 *   summary: Update a product
 *   description: Modify an existing product by ID
 *   tags:
 *    - Products
 *   security:
 *     - BearerAuth: []
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
router.put(
  '/edit/:id',
  multerMiddleware.upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'images', maxCount: 5 }
  ]) as RequestHandler,
  // productValidation.update,
  productController.updateProduct
)

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
router.delete('/delete/:id', authMiddleware.isAuthorizedAndAdmin, productController.deleteProduct)

export const productRoute = router
