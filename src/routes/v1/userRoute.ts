import express from 'express'
import { userController } from '~/controllers/userController.js'
import { authMiddleware } from '~/middlewares/authMiddleware.js'
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
 *  schemas:
 *    User:
 *      type: object
 *      properties:
 *        _id:
 *          type: MongoDBObjectId
 *          example: 612f3b3b7b8b3b0015b3b3b3
 *        email:
 *          type: string
 *          example: tuandung@gmail.com
 *        displayName:
 *          type: string
 *          example: tuandung
 *        avatar:
 *          type: string
 *          example: https://www.google.com
 *        customerId:
 *          type: string
 *          example: KH0001
 *        require_2fa:
 *          type: boolean
 *          example: false
 *        role:
 *          type: string
 *          example: customer
 *        isActive:
 *          type: boolean
 *          example: true
 *        addresses:
 *          type: array
 *          items:
 *            type: object
 *            properties:
 *              address:
 *                type: string
 *                example: 123 Nguyễn Văn Linh
 *              province:
 *                type: string
 *                example: Hồ Chí Minh
 *              district:
 *                type: string
 *                example: Thủ Đức
 *              fullname:
 *                type: string
 *                example: Lê Anh Tuấn Dũng
 *              phoneNumber:
 *                type: string
 *                example: 0987654321
 *              isDefault:
 *                type: boolean
 *                example: true
 *        createdAt:
 *          type: string
 *          example: 1737550282062
 *        updatedAt:
 *          type: string
 *          example: 1737550282062
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

router.route('/logout').post(userController.logout)

/**
 * @swagger
 * /users/forgot-password:
 *  post:
 *    summary: Forgot password
 *    description: Forgot password
 *    tags:
 *      - Auth
 *    requestBody:
 *      description: User forgot password
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *                required: true
 *                format: email
 *                example: tuandung@gmail.com
 *    responses:
 *      200:
 *        description: Forgot password successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: OTP code has been sent to your email!
 *                isSendOTP:
 *                  type: boolean
 *                  example: true
 *                userId:
 *                  type: string
 *                  example: 612f3b3b7b8b3b0015b3b3b3
 *      404:
 *        description: Not found
 */
router.route('/forgot-password').post(userValidation.forgotPassword, userController.forgotPassword)

/**
 * @swagger
 * /users/verify-otp:
 *  post:
 *    summary: Verify OTP
 *    description: Verify OTP
 *    tags:
 *      - Auth
 *    requestBody:
 *      description: User verify OTP
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              userId:
 *                type: string
 *                required: true
 *                example: 612f3b3b7b8b3b0015b3b3b3
 *              otp:
 *                type: string
 *                required: true
 *                example: 123456
 *    responses:
 *      200:
 *        description: Verify OTP successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: OTP code is correct!
 *                isCorrect:
 *                  type: boolean
 *                  example: true
 *      400:
 *        description: Bad request
 *      404:
 *        description: Not found
 */
router.route('/verify-otp').post(userValidation.verifyOTP, userController.verifyOTP)

/**
 * @swagger
 * /users/reset-password:
 *  post:
 *    summary: Reset password
 *    description: Reset password
 *    tags:
 *      - Auth
 *    requestBody:
 *      description: User reset password
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              userId:
 *                type: string
 *                required: true
 *                example: 612f3b3b7b8b3b0015b3b3b3
 *              password:
 *                type: string
 *                required: true
 *                example: 123456
 *              confirmPassword:
 *                type: string
 *                required: true
 *                example: 123456
 *    responses:
 *      200:
 *        description: Reset password successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: Reset password successfully!
 *                isResetPassword:
 *                  type: boolean
 *                  example: true
 *      400:
 *        description: Bad request
 *      404:
 *        description: Not found
 */
router.route('/reset-password').post(userValidation.resetPassword, userController.resetPassword)

router.route('/').get(authMiddleware.isAuthorizedAndAdmin, userController.getAllUsers)

/**
 * @swagger
 * /users:
 *  put:
 *    summary: Update user
 *    description: Update user
 *    tags:
 *      - Auth
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      description: User update
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              displayName:
 *                type: string
 *                example: tuandung
 *                required: false
 *              fullname:
 *                type: string
 *                example: Lê Anh Tuấn Dũng
 *                required: false
 *              phoneNumber:
 *                type: string
 *                example: 0987654321
 *                required: false
 *              dateOfBirth:
 *                type: string
 *                example: 2000-01-01
 *                required: false
 *              gender:
 *                type: string
 *                example: male
 *                required: false
 *              addresses:
 *                type: array
 *                items:
 *                  type: object
 *                  properties:
 *                    address:
 *                      type: string
 *                      example: 123 Nguyễn Văn Linh
 *                    province:
 *                      type: string
 *                      example: Hồ Chí Minh
 *                    district:
 *                      type: string
 *                      example: Thủ Đức
 *                    fullname:
 *                      type: string
 *                      example: Lê Anh Tuấn Dũng
 *                    phoneNumber:
 *                      type: string
 *                      example: 0987654321
 *                    isDefault:
 *                      type: boolean
 *                      example: true
 *    responses:
 *      200:
 *        description: Update user successfully
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/User'
 */
router.route('/').put(authMiddleware.isAuthorized, userValidation.updateUser, userController.updateUser)

/**
 * @swagger
 * /users/change-password:
 *  post:
 *    summary: Change user password
 *    description: Allow authenticated users to change their password
 *    tags:
 *      - Auth
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      description: User change password request
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              old_password:
 *                type: string
 *                required: true
 *                example: oldpassword123
 *              new_password:
 *                type: string
 *                required: true
 *                example: newpassword456
 *              confirm_password:
 *                type: string
 *                required: true
 *                example: newpassword456
 *    responses:
 *      200:
 *        description: Password changed successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: Password changed successfully!
 *                isPasswordChanged:
 *                  type: boolean
 *                  example: true
 *      400:
 *        description: Bad request (incorrect current password, mismatched new passwords)
 *      401:
 *        description: Unauthorized (user not logged in)
 *      404:
 *        description: User not found
 */
router
  .route('/change-password')
  .post(authMiddleware.isAuthorized, userValidation.changePassword, userController.changePasswordUser)

export const userRoute = router
