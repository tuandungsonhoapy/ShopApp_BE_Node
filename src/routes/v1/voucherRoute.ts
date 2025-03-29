import express from 'express'
import { authMiddleware } from '~/middlewares/authMiddleware.js'
import { voucherController } from '~/controllers/v1/voucherController.js'
import { voucherValidation } from '~/validations/voucherValidation.js'

const router = express.Router()
/**
 * @swagger
 * components:
 *  schemas:
 *   Voucher:
 *     type: object
 *     required:
 *       - code
 *       - discountType
 *       - discountValue
 *       - expirationDate
 *     properties:
 *       _id:
 *         type: string
 *         description: The unique identifier for the voucher
 *         example: "65f8b2c4e5a7f9b123456789"
 *       code:
 *         type: string
 *         description: Unique voucher code
 *         example: "SUMMER2025"
 *       description:
 *         type: string
 *         description: Detailed description of the voucher
 *         example: "Giảm giá cho đơn hàng trên 500K"
 *       discountType:
 *         type: string
 *         enum: [percent, fixed]
 *         description: Type of discount (percentage-based or fixed amount)
 *         example: "percent"
 *       discountValue:
 *         type: number
 *         minimum: 0
 *         description: Discount value (percentage or fixed amount)
 *         example: 10
 *       minOrderValue:
 *         type: number
 *         minimum: 0
 *         default: 0
 *         description: Minimum order value required to apply the voucher
 *         example: 500000
 *       maxDiscount:
 *         type: number
 *         minimum: 0
 *         nullable: true
 *         default: null
 *         description: Maximum discount amount (null if no limit)
 *         example: 100000
 *       expirationDate:
 *         type: string
 *         format: date
 *         description: Expiration date of the voucher
 *         example: "2025-12-31"
 *       isActive:
 *         type: boolean
 *         default: true
 *         description: Status of the voucher (active or inactive)
 *         example: true
 *       createdAt:
 *         type: string
 *         format: date-time
 *         description: Date and time when the voucher was created
 *         example: "2024-03-01T10:00:00.000Z"
 *       updatedAt:
 *         type: string
 *         format: date-time
 *         nullable: true
 *         description: Date and time when the voucher was last updated
 *         example: null
 *       _destroy:
 *         type: boolean
 *         default: false
 *       usageLimit:
 *         type: number
 *         example: 1000
 *       usageCount:
 *         type: number
 *         example: 0
 *       applicableCategories:
 *         type: array
 *         items:
 *            type: string
 *         example: ["67b2949737b7d0fab7f203b5"]
 *       applicableProducts:
 *         type: array
 *         items:
 *            type: string
 *         example: ["67b0b2c19f1f5fb97f386dfb"]
 */

/**
 * @swagger
 * /vouchers:
 *  get:
 *    summary: Get all vouchers
 *    description: Return a list of all available vouchers
 *    tags:
 *      - Voucher
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: Successfully return the list of vouchers
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Voucher'
 *      401:
 *        description: Unauthorized
 *      500:
 *        description: Internal server error
 */
router.get('/', authMiddleware.isAuthorizedAndAdmin, voucherController.getAllVouchers)

/**
 * @swagger
 * /vouchers/{id}:
 *  get:
 *    summary: Get a voucher by ID
 *    description: Return a single voucher by its unique ID
 *    tags:
 *      - Voucher
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *        description: The ID of the voucher
 *    responses:
 *      200:
 *        description: Voucher found and returned successfully
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Voucher'
 *      400:
 *        description: Invalid voucher ID
 *      404:
 *        description: Voucher not found
 *      401:
 *        description: Unauthorized
 *      500:
 *        description: Internal server error
 */
router.get('/:id', authMiddleware.isAuthorized, voucherController.getVoucherById)

/**
 * @swagger
 * /vouchers:
 *  post:
 *    summary: Create a new voucher
 *    description: Create discount vouchers
 *    tags:
 *      - Voucher
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - code
 *              - discountType
 *              - discountValue
 *              - expirationDate
 *            properties:
 *              code:
 *                type: string
 *                example: SUMMER2025
 *              description:
 *                type: string
 *                description: Detailed description of the voucher
 *                nullable: true
 *                example: "Discount for summer sale"
 *              discountType:
 *                type: string
 *                enum: [percent, fixed]
 *                example: percent
 *              discountValue:
 *                type: number
 *                example: 10
 *              minOrderValue:
 *                type: number
 *                example: 500000
 *              maxDiscount:
 *                type: number
 *                nullable: true
 *                example: 100000
 *              expirationDate:
 *                type: string
 *                format: date-time
 *                example: "2025-12-31T23:59:59.000Z"
 *              isActive:
 *                type: boolean
 *                default: true
 *                example: true
 *              usageLimit:
 *                type: number
 *                nullable: true
 *                example: 1000
 *              usageCount:
 *                type: number
 *                example: 0
 *              applicableCategories:
 *                type: array
 *                items:
 *                  type: string
 *                example: ["67b2949737b7d0fab7f203b5"]
 *              applicableProducts:
 *                type: array
 *                items:
 *                  type: string
 *                example: ["67b0b2c19f1f5fb97f386dfb"]
 *    responses:
 *      201:
 *        description: Voucher created successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *                  example: true
 *                message:
 *                  type: string
 *                  example: "Voucher created successfully"
 *                data:
 *                  type: object
 *                  properties:
 *                    _id:
 *                      type: string
 *                      example: "65f8b2c4e5a7f9b123456789"
 *                    code:
 *                      type: string
 *                      example: "SUMMER2025"
 *                    description:
 *                      type: string
 *                      example: "Discount for summer sale"
 *                    discountType:
 *                      type: string
 *                      example: "percent"
 *                    discountValue:
 *                      type: number
 *                      example: 10
 *                    minOrderValue:
 *                      type: number
 *                      example: 500000
 *                    maxDiscount:
 *                      type: number
 *                      example: 100000
 *                    expirationDate:
 *                      type: string
 *                      format: date-time
 *                      example: "2025-12-31T23:59:59.000Z"
 *                    isActive:
 *                      type: boolean
 *                      example: true
 *                    usageLimit:
 *                      type: number
 *                      example: 1000
 *                    usageCount:
 *                      type: number
 *                      example: 0
 *                    applicableCategories:
 *                      type: array
 *                      items:
 *                        type: string
 *                        example: "67b2949737b7d0fab7f203b5"
 *                    applicableProducts:
 *                      type: array
 *                      items:
 *                        type: string
 *                        example: "67b0b2c19f1f5fb97f386dfb"
 *                    createdAt:
 *                        type: string
 *                        format: date-time
 *                        example: "2024-03-01T10:00:00.000Z"
 *                    updatedAt:
 *                        type: string
 *                        format: date-time
 *                        example: null
 *      400:
 *        description: Bad request (Validation error)
 *      401:
 *        description: Unauthorized
 *      500:
 *        description: Internal server error
 */
router.post('/', authMiddleware.isAuthorizedAndAdmin, voucherValidation.create, voucherController.createVoucher)

/**
 * @swagger
 * /vouchers/{id}:
 *  put:
 *    summary: Update a voucher
 *    description: Admin can update voucher details
 *    tags:
 *      - Voucher
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *        description: The ID of the voucher to update
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              code:
 *                type: string
 *                example: SUMMER2025
 *              description:
 *                type: string
 *              discountType:
 *                type: string
 *                enum: [percent, fixed]
 *                example: fixed
 *              discountValue:
 *                type: number
 *                example: 50000
 *              minOrderValue:
 *                type: number
 *                example: 300000
 *              maxDiscount:
 *                type: number
 *                example: 150000
 *              expirationDate:
 *                type: string
 *                format: date
 *                example: 2026-01-01
 *              isActive:
 *                type: boolean
 *                example: true
 *              usageLimit:
 *                type: number
 *                example: 500
 *              applicableCategories:
 *                type: array
 *                items:
 *                  type: string
 *                example: ["67b0b2c19f1f5fb97f386dfb"]
 *              applicableProducts:
 *                type: array
 *                items:
 *                  type: string
 *                example: ["67b0b2c19f1f5fb97f3863f6"]
 *    responses:
 *      200:
 *        description: Voucher updated successfully
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Voucher'
 *      400:
 *        description: Bad request
 *      401:
 *        description: Unauthorized
 *      404:
 *        description: Voucher not found
 *      500:
 *        description: Internal server error
 */
router.put('/:id', authMiddleware.isAuthorizedAndAdmin, voucherController.updateVoucher)

/**
 * @swagger
 * /vouchers/{id}:
 *  delete:
 *    summary: Delete a voucher
 *    description: Admin can delete a voucher by ID
 *    tags:
 *      - Voucher
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *        description: The ID of the voucher to delete
 *    responses:
 *      200:
 *        description: Voucher deleted successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: "Voucher deleted successfully"
 *                deletedVoucher:
 *                  $ref: '#/components/schemas/Voucher'
 *      400:
 *        description: Invalid voucher ID
 *      401:
 *        description: Unauthorized
 *      404:
 *        description: Voucher not found
 *      500:
 *        description: Internal server error
 */
router.delete('/:id', authMiddleware.isAuthorizedAndAdmin, voucherController.deleteVoucher)

export const voucherRoute = router
