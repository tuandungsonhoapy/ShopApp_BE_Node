import express from 'express'
import { userController } from '~/controllers/userController.js'
import { userValidation } from '~/validations/userValidation.js'

const router = express.Router()

/**
 * @swagger
 * components:
 *  securitySchemes:
 *    bearerAuth:
 *      type: http
 *      scheme: bearer
 *      bearerFormat: JWT
 */

/**
 * @swagger
 * /users/login:
 *  post:
 *   summary: Login a user
 *   description: Login a user
 *   tags:
 *    - Auth
 *   requestBody:
 *    description: User login
 *    required: true
 *    content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         email:
 *          type: string
 *          required: true
 *          format: email
 *          example: tuandung@gmail.com
 *         password:
 *          type: string
 *          required: true
 *          format: password
 *          example: 123456
 *   responses:
 *    200:
 *      description: Login successfully
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *             isLogin:
 *              type: boolean
 *              example: true
 *             accessToken:
 *              type: string
 *              example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjI5MzUwNjQyLCJleHAiOjE2MjkzNTA3NDJ91
 *             refreshToken:
 *              type: string
 *              example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjI5MzUwNjQyLCJleHAiOjE2MjkzNTA3NDJ91
 *             _id:
 *              type: string
 *              example: 612f3b3b7b8b3b0015b3b3b3
 *             email:
 *              type: string
 *              example: tuandung@gmail.com
 *             displayName:
 *              type: string
 *              example: tuandung
 *             avatar:
 *              type: string
 *              example: https://www.google.com
 *             require_2fa:
 *              type: boolean
 *              example: false
 *             role:
 *              type: string
 *              example: customer
 *             isActive:
 *              type: boolean
 *              example: true
 *             createdAt:
 *              type: string
 *              example: 1737550282062
 *             updatedAt:
 *              type: string
 *              example: 1737550282062
 *    400:
 *      description: Bad request
 *    401:
 *      description: Unauthorized
 *    404:
 *      description: Not found
 */
router.route('/login').post(userValidation.login, userController.login)

/**
 * @swagger
 * /users/register:
 *  post:
 *   summary: Register a user
 *   description: Register a user
 *   tags:
 *    - Auth
 *   requestBody:
 *    description: User register
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        email:
 *         type: string
 *         required: true
 *         format: email
 *         example: tuandung@gmail.com
 *        password:
 *         type: string
 *         required: true
 *         format: password
 *         example: 123456
 *        confirmPassword:
 *         type: string
 *         required: true
 *         format: password
 *         example: 123456
 *        fullname:
 *         type: string
 *         required: true
 *         example: Lê Anh Tuấn Dũng
 *        phoneNumber:
 *         type: string
 *         required: true
 *         example: 0987654321
 *        address:
 *         type: string
 *         required: true
 *         example: 123 Nguyễn Văn Linh
 *        province:
 *         type: string
 *         required: true
 *         example: Hồ Chí Minh
 *        district:
 *         type: string
 *         required: true
 *         example: Thủ Đức
 *   responses:
 *    200:
 *     description: Register successfully
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: string
 *          example: Register account successfully!
 *         user:
 *          type: object
 *          properties:
 *           _id:
 *            type: string
 *            example: 612f3b3b7b8b3b0015b3b3b3
 *           email:
 *            type: string
 *            example: tuandung@gmail.com
 *           displayName:
 *            type: string
 *            example: tuandung
 *           avatar:
 *            type: string
 *            example: https://www.google.com
 *           require_2fa:
 *            type: boolean
 *            example: false
 *           role:
 *            type: string
 *            example: customer
 *           isActive:
 *            type: boolean
 *            example: true
 *           createdAt:
 *            type: string
 *            example: 1737550282062
 *           updatedAt:
 *            type: string
 *            example: 1737550282062
 *    400:
 *     description: Bad request
 *    401:
 *     description: Unauthorized
 *    404:
 *     description: Not found
 */
router.route('/register').post(userValidation.registerUser, userController.registerUser)

export const userRoute = router
