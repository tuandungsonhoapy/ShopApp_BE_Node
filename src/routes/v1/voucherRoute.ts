import express from 'express'
import { authMiddleware } from '~/middlewares/authMiddleware.js'
import { voucherController } from '~/controllers/voucherController.js'
import { voucherValidation } from '~/validations/voucherValidation.js'

const router = express.Router()
/**
 components:
  schemas:
    Voucher:
      type: object
      required:
        - code
        - discountType
        - discountValue
        - expirationDate
      properties:
        id:
          type: string
          description: Unique identifier for the voucher
          example: "65f12b3e9c8a4a001c3d1234"
        code:
          type: string
          description: Unique voucher code
          example: "SUMMER2025"
        discountType:
          type: string
          enum: [percent, fixed]
          description: Type of discount (percentage-based or fixed amount)
          example: "percent"
        discountValue:
          type: number
          minimum: 0
          description: Discount value (percentage or fixed amount)
          example: 10
        minOrderValue:
          type: number
          minimum: 0
          default: 0
          description: Minimum order value required to apply the voucher
          example: 500000
        maxDiscount:
          type: number
          minimum: 0
          nullable: true
          default: null
          description: Maximum discount amount (null if no limit)
          example: 100000
        expirationDate:
          type: string
          format: date
          description: Expiration date of the voucher
          example: "2025-12-31"
        isActive:
          type: boolean
          default: true
          description: Status of the voucher (active or inactive)
          example: true
        createdAt:
          type: string
          format: date-time
          description: Date and time when the voucher was created
          example: "2024-03-01T10:00:00.000Z"
        updatedAt:
          type: string
          format: date-time
          nullable: true
          description: Date and time when the voucher was last updated
          example: null
        _destroy:
          type: boolean
          default: false
          description: Soft delete flag (true if deleted)
          example: false
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
 *      401:
 *        description: Unauthorized
 *      500:
 *        description: Internal server error
 */
router.get('/', voucherController.getAllVouchers)

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
 *      400:
 *        description: Invalid voucher ID
 *      404:
 *        description: Voucher not found
 *      401:
 *        description: Unauthorized
 *      500:
 *        description: Internal server error
 */
router.get('/:id', voucherController.getVoucherById)

/**
 * @swagger
 * /vouchers:
 *  post:
 *    summary: Create a new voucher
 *    description: Admin can create discount vouchers
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
 *            properties:
 *              code:
 *                type: string
 *                example: SUMMER2025
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
 *                example: 100000
 *              expirationDate:
 *                type: string
 *                format: date
 *                example: 2025-12-31
 *    responses:
 *      201:
 *        description: Voucher created successfully
 *      400:
 *        description: Bad request
 *      401:
 *        description: Unauthorized
 *      500:
 *        description: Internal server error
 */
router.post('/', voucherController.createVoucher)

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
 *    responses:
 *      200:
 *        description: Voucher updated successfully
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
