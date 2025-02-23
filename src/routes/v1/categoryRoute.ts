import express from 'express'
import { categoryController } from '~/controllers/categoryController.js'
import { categoryValidation } from '~/validations/categoryValidation.js'
import { authMiddleware } from '~/middlewares/authMiddleware.js'

const router = express.Router()

/**
 * @swagger
 * components:
 *  schemas:
 *   Category:
 *    type: object
 *    properties:
 *     _id:
 *      type: MongoDBObjectId
 *      example: 612f3b3b7b8b3b0015b3b3b3
 *     name:
 *      type: string
 *      required: true
 *      example: Bánh sinh nhật
 *     description:
 *      type: string
 *      example: Bánh xinh xinh chúc mừng sinh nhật
 *     createdAt:
 *      type: string
 *      example: 1737550282062
 *     updatedAt:
 *      type: string
 *      example: 1737550282062
 *     _destroy:
 *      type: boolean
 *      example: false
 *   CategoryCreate:
 *    type: object
 *    properties:
 *     name:
 *      type: string
 *      required: true
 *      example: Bánh sinh nhật
 *     description:
 *      type: string
 *      example: Bánh xinh xinh chúc mừng sinh nhật
 */

/**
 * @swagger
 * /categories:
 *  get:
 *   summary: Get all categories
 *   description: Get all categories
 *   tags:
 *    - Categories
 *   responses:
 *    200:
 *     description: Get all categories successfully
 *     content:
 *      application/json:
 *       schema:
 *        type: array
 *        items:
 *         $ref: '#/components/schemas/Category'
 *        example:
 *         - _id: 612f3b3b7b8b3b0015b3b3b3
 *           name: Bánh sinh nhật
 *           description: Bánh xinh xinh chúc mừng sinh nhật
 *           createdAt: 1737550282062
 *           updatedAt: 1737550282062
 *           _destroy: false
 *         - _id: 612f3b3b7b8b3b0015b3b3b4
 *           name: Bánh mì & Bánh mặn
 *           description: Bánh mì thơm ngon
 *           createdAt: 1737550282062
 *           updatedAt: 1737550282062
 *           _destroy: false
 *    500:
 *     description: Internal server error
 */
router.route('/').get(categoryController.getAll)

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
router.route('/:id').get(categoryController.getOneById)

/**
 * @swagger
 * /categories:
 *  post:
 *   summary: Create a category
 *   description: Create a category
 *   tags:
 *    - Categories
 *   security:
 *    - BearerAuth: []
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/CategoryCreate'
 *   responses:
 *    201:
 *     description: Create a category successfully
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Category'
 *    400:
 *     description: Bad request
 *    500:
 *     description: Internal server error
 */
router.route('/').post(categoryValidation.create, categoryController.create)

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
router.route('/:id').put(authMiddleware.isAuthorizedAndAdmin, categoryValidation.update, categoryController.update)

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
router.route('/:id').delete(authMiddleware.isAuthorizedAndAdmin, categoryController.deleteOneById)

export const categoryRoute = router
