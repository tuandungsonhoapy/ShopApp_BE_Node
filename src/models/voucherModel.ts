import { ObjectId } from 'mongodb'
import Joi from 'joi'
import { IVoucher } from '~/@types/voucher/interface.js'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators.js'
import { getDB } from '~/configs/mongodb.js'
import { handleThrowError } from '~/middlewares/errorHandlingMiddleware.js'

const VOUCHER_COLLECTION_NAME = 'vouchers'

const VOUCHER_COLLECTION_SCHEMA = Joi.object({
  code: Joi.string().required(),
  description: Joi.string().max(500).default(''),
  discountType: Joi.string().valid('percent', 'fixed').required(),
  discountValue: Joi.number().required().min(0),
  minOrderValue: Joi.number().min(0).default(0),
  maxDiscount: Joi.number().min(0).allow(null).default(null),
  expirationDate: Joi.date().iso().required(),
  isActive: Joi.boolean().default(true),
  createdAt: Joi.date().timestamp('javascript').default(Date.now()),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

const validateData = async (data: IVoucher) => {
  return await VOUCHER_COLLECTION_SCHEMA.validateAsync(data, {
    abortEarly: false
  })
}

const getAllVouchers = async () => {
  try {
    return await getDB().collection(VOUCHER_COLLECTION_NAME).find({ _destroy: false }).toArray()
  } catch (error) {
    handleThrowError(error)
  }
}

const getVoucherById = async (voucherId: string) => {
  if (!OBJECT_ID_RULE.test(voucherId)) throw new Error(OBJECT_ID_RULE_MESSAGE)

  return await getDB()
    .collection(VOUCHER_COLLECTION_NAME)
    .findOne({ _id: new ObjectId(voucherId), _destroy: false })
}

const updateVoucher = async (voucherId: string, updateData: IVoucher) => {
  if (!OBJECT_ID_RULE.test(voucherId)) throw new Error(OBJECT_ID_RULE_MESSAGE)
  delete updateData._id
  const validatedData = await validateData(updateData)

  return await getDB()
    .collection(VOUCHER_COLLECTION_NAME)
    .findOneAndUpdate(
      { _id: new ObjectId(voucherId) },
      { $set: { ...validatedData, updatedAt: Date.now() } },
      { returnDocument: 'after' }
    )
}

const createVoucher = async (voucherData: IVoucher) => {
  const validatedData = await validateData(voucherData)
  return await getDB()
    .collection(VOUCHER_COLLECTION_NAME)
    .insertOne({
      ...validatedData,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      _destroy: false
    })
}

const deleteVoucher = async (voucherId: string) => {
  if (!OBJECT_ID_RULE.test(voucherId)) throw new Error(OBJECT_ID_RULE_MESSAGE)
  return await getDB()
    .collection(VOUCHER_COLLECTION_NAME)
    .findOneAndUpdate(
      { _id: new ObjectId(voucherId) },
      { $set: { _destroy: true, updatedAt: Date.now() } },
      { returnDocument: 'after' }
    )
}

export const voucherModel = {
  VOUCHER_COLLECTION_NAME,
  VOUCHER_COLLECTION_SCHEMA,
  getAllVouchers,
  getVoucherById,
  updateVoucher,
  deleteVoucher,
  createVoucher
}
