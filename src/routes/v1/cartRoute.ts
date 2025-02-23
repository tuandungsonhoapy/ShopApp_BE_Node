import express from 'express'
import { cartController } from '~/controllers/cartController.js'
import { cartValidation } from '~/validations/cartValidation.js'
import { authMiddleware } from '~/middlewares/authMiddleware.js'

const router = express.Router()

/**
 * @swagger
 * components:
 *  schemas:
 *    CartItem:
 *      type: object
 *      properties:
 *        productId:
 *          type: MongoDBObjectId
 *          example: 612f3b3b7b8b3b0015b3b3b3
 *        quantity:
 *          type: number
 *          example: 10
 *        size:
 *          type: string
 *          example: L
 *        title:
 *          type: string
 *          example: Áo thun nam
 *        price:
 *          type: number
 *          example: 100000
 *        thumbnail:
 *          type: string
 *          example: https://example.com/image.jpg
 *    Cart:
 *      type: object
 *      properties:
 *        _id:
 *          type: MongoDBObjectId
 *          example: 612f3b3b7b8b3b0015b3b3b3
 *        userId:
 *          type: MongoDBObjectId
 *          example: 612f3b3b7b8b3b0015b3b3b3
 *        products:
 *          type: array
 *          items:
 *            $ref: '#/components/schemas/CartItem'
 *        createdAt:
 *          type: string
 *          example: 1737550282062
 *        updatedAt:
 *          type: string
 *          example: 1737550282062
 *        _destroy:
 *          type: boolean
 *          example: false
 */

/**
 * @swagger
 * /cart/add-to-cart:
 *  post:
 *    summary: Add product to cart
 *    tags:
 *      - Cart
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *     required: true
 *     content:
 *      application/json:
 *        schema:
 *          $ref: '#/components/schemas/CartItem'
 *    responses:
 *      200:
 *        description: Add product to cart successfully
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Cart'
 *      401:
 *        description: Unauthorized
 *      422:
 *        description: Unprocessable Entity
 */

router.post('/add-to-cart', cartValidation.addToCart, authMiddleware.isAuthorized, cartController.addToCart)

/**
 * @swagger
 * /cart/get-cart:
 *  get:
 *    summary: Get cart
 *    tags:
 *      - Cart
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: Get cart successfully
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Cart'
 *      401:
 *        description: Unauthorized
 *      404:
 *        description: Cart not found
 */
router.get('/get-cart', authMiddleware.isAuthorized, cartController.getCart)

export const cartRoute = router
