import express from 'express'
import { authMiddleware } from '~/middlewares/authMiddleware.js'
import { voucherController } from '~/controllers/voucherController.js'
import { voucherValidation } from '~/validations/voucherValidation.js'

const router = express.Router()

router.get('/', voucherController.getAllVouchers)
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

router.put('/:id', voucherController.updateVoucher)
router.delete('/:id', voucherController.deleteVoucher)

export const voucherRoute = router
