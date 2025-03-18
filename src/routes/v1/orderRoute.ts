import express from 'express'
import { orderController } from '~/controllers/orderController.js'
import { authMiddleware } from '~/middlewares/authMiddleware.js'
import { orderValidation } from '~/validations/orderValidattion.js'

const router = express.Router()

/**
 * @swagger
 * components:
 *  schemas:
 *   Order:
 *    type: object
 *    properties:
 *     _id:
 *      type: string
 *      example: 612f3b3b7b8b3b0015b3b3b3
 *     fullName:
 *      type: string
 *      example: Nguyễn Văn A
 *     address:
 *      type: string
 *      example: 123 Đường ABC, Quận 1, TP.HCM
 *     email:
 *      type: string
 *      example: nguyenvana@example.com
 *     phoneNumber:
 *      type: string
 *      example: "0987654321"
 *     orderDate:
 *      type: string
 *      example: 1737550282062
 *     status:
 *      type: string
 *      example: PENDING
 *     total:
 *      type: number
 *      example: 1500000
 *     shippingMethod:
 *      type: string
 *      example: Giao hàng nhanh
 *     shippingAddress:
 *      type: string
 *      example: 123 Đường XYZ, Quận 2, TP.HCM
 *     trackingNumber:
 *      type: string
 *      example: "TRACK123456"
 *     paymentMethod:
 *      type: string
 *      example: Chuyển khoản ngân hàng
 *     shippingDate:
 *      type: string
 *      example: null
 *     isActive:
 *      type: boolean
 *      example: true
 *     paymentStatus:
 *      type: string
 *      example: UNPAID
 *     paymentDate:
 *      type: string
 *      example: null
 *     userId:
 *      type: string
 *      example: 612f3b3b7b8b3b0015b3b3b4
 *     orderDetails:
 *      type: array
 *      items:
 *       type: object
 *       properties:
 *        productId:
 *         type: string
 *         example: 612f3b3b7b8b3b0015b3b3b5
 *        quantity:
 *         type: number
 *         example: 2
 *        price:
 *         type: number
 *         example: 500000
 *        total:
 *         type: number
 *         example: 1000000
 *        size:
 *         type: string
 *         example: L
 *        note:
 *         type: string
 *         example: Gói quà sinh nhật
 *     createdAt:
 *      type: string
 *      example: 1737550282062
 *     updatedAt:
 *      type: string
 *      example: 1737550282062
 *     _destroy:
 *      type: boolean
 *      example: false
 *   OrderCreate:
 *    type: object
 *    properties:
 *     fullName:
 *      type: string
 *      example: Nguyễn Văn A
 *     address:
 *      type: string
 *      example: 123 Đường ABC, Quận 1, TP.HCM
 *     email:
 *      type: string
 *      example: nguyenvana@example.com
 *     phoneNumber:
 *      type: string
 *      example: "0987654321"
 *     total:
 *      type: number
 *      example: 1500000
 *     shippingMethod:
 *      type: string
 *      example: Giao hàng nhanh
 *     paymentMethod:
 *      type: string
 *      example: Chuyển khoản ngân hàng
 *     orderDetails:
 *      type: array
 *      items:
 *       type: object
 *       properties:
 *        productId:
 *         type: string
 *         example: 612f3b3b7b8b3b0015b3b3b5
 *        quantity:
 *         type: number
 *         example: 2
 *        price:
 *         type: number
 *         example: 500000
 *        total:
 *         type: number
 *         example: 1000000
 *        size:
 *         type: string
 *         example: L
 *        note:
 *         type: string
 *         example: Gói quà sinh nhật
 */

/**
 * @swagger
 * /orders:
 *  get:
 *   summary: Get orders for admin
 *   description: Retrieve a list of orders for admin
 *   tags:
 *    - Orders
 *   responses:
 *    200:
 *     description: Get all orders successfully
 *     content:
 *      application/json:
 *       schema:
 *        type: array
 *        items:
 *         $ref: '#/components/schemas/Order'
 *        example:
 *         - _id: 612f3b3b7b8b3b0015b3b3b3
 *           fullName: Nguyễn Văn A
 *           address: 123 Đường ABC, Quận 1, TP.HCM
 *           email: nguyenvana@example.com
 *           phoneNumber: "0987654321"
 *           orderDate: 1737550282062
 *           status: PENDING
 *           total: 1500000
 *           shippingMethod: Giao hàng nhanh
 *           trackingNumber: "TRACK123456"
 *           paymentMethod: Chuyển khoản ngân hàng
 *           paymentStatus: UNPAID
 *           userId: 612f3b3b7b8b3b0015b3b3b4
 *           orderDetails:
 *            - productId: 612f3b3b7b8b3b0015b3b3b5
 *              quantity: 2
 *              price: 500000
 *              total: 1000000
 *              color: Đỏ
 *              size: L
 *              note: Gói quà sinh nhật
 *           createdAt: 1737550282062
 *           updatedAt: 1737550282062
 *           _destroy: false
 *    500:
 *     description: Internal server error
 */

router.route('/').get(authMiddleware.isAuthorizedAndAdmin, orderController.getOrders)

/**
 * @swagger
 * /orders:
 *  get:
 *   summary: Get orders for user
 *   description: Retrieve a list of orders for user
 *   tags:
 *    - Orders
 *   responses:
 *    200:
 *     description: Get all orders successfully
 *     content:
 *      application/json:
 *       schema:
 *        type: array
 *        items:
 *         $ref: '#/components/schemas/Order'
 *        example:
 *         - _id: 612f3b3b7b8b3b0015b3b3b3
 *           fullName: Nguyễn Văn A
 *           address: 123 Đường ABC, Quận 1, TP.HCM
 *           email: nguyenvana@example.com
 *           phoneNumber: "0987654321"
 *           orderDate: 1737550282062
 *           status: PENDING
 *           total: 1500000
 *           shippingMethod: Giao hàng nhanh
 *           trackingNumber: "TRACK123456"
 *           paymentMethod: Chuyển khoản ngân hàng
 *           paymentStatus: UNPAID
 *           userId: 612f3b3b7b8b3b0015b3b3b4
 *           orderDetails:
 *            - productId: 612f3b3b7b8b3b0015b3b3b5
 *              quantity: 2
 *              price: 500000
 *              total: 1000000
 *              color: Đỏ
 *              size: L
 *              note: Gói quà sinh nhật
 *           createdAt: 1737550282062
 *           updatedAt: 1737550282062
 *           _destroy: false
 *    500:
 *     description: Internal server error
 */

router.route('/userOrders').get(authMiddleware.isAuthorized, orderController.getOrders)

/**
 * @swagger
 * /categories/{id}:
 *  get:
 *   summary: Get a category by id
 *   description: Get a category by id
 *   tags:
 *    - Categories
 *   parameters:
 *    - in: path
 *      name: id
 *      required: true
 *      description: ID of the category
 *      schema:
 *       type: MongoDBObjectId
 *       example: 612f3b3b7b8b3b0015b3b3b3
 *   responses:
 *    200:
 *     description: Get a category successfully
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Category'
 *    404:
 *     description: Category not found
 */
// router.route('/:id').get(categoryController.getOneById)

/**
 * @swagger
 * /orders:
 *  post:
 *   summary: Create a order
 *   description: Create a order
 *   tags:
 *    - Orders
 *   security:
 *    - BearerAuth: []
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/OrderCreate'
 *   responses:
 *    201:
 *     description: Create a order successfully
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Order'
 *    400:
 *     description: Bad request
 *    500:
 *     description: Internal server error
 */
router.route('/').post(authMiddleware.isAuthorized, orderValidation.create, orderController.create)

/**
 * @swagger
 * /categories/{id}:
 *  put:
 *   summary: Update a category by id
 *   description: Update a category by id
 *   tags:
 *     - Categories
 *   security:
 *     - BearerAuth: []
 *   parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       description: ID of the category
 *       schema:
 *         type: string
 *         example: 612f3b3b7b8b3b0015b3b3b3
 *   requestBody:
 *     required: true
 *     content:
 *       application/json:
 *         schema:
 *           $ref: '#/components/schemas/CategoryCreate'
 *   responses:
 *     200:
 *       description: Category updated successfully
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 *     400:
 *       description: Invalid request body
 *     404:
 *       description: Category not found
 */
router
  .route('/updateOrderStatus')
  .put(authMiddleware.isAuthorizedAndAdmin, orderValidation.updateOrderStatus, orderController.updateOrderStatus)

/**
 * @swagger
 * /categories/{id}:
 *  delete:
 *    summary: Delete a category by id
 *    description: Delete a category by id
 *    tags:
 *      - Categories
 *    security:
 *      - BearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: ID of the category
 *        schema:
 *          type: string
 *          example: 612f3b3b7b8b3b0015b3b3b3
 *    responses:
 *      200:
 *        description: Category deleted successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                deletedCount:
 *                  type: number
 *                  example: 1
 *                acknowledged:
 *                  type: boolean
 *                  example: true
 *      404:
 *        description: Category not found
 *      500:
 *        description: Internal server error
 */
// router.route('/:id').delete(authMiddleware.isAuthorizedAndAdmin, categoryController.deleteOneById)

export const orderRoute = router
