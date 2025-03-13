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
  maxDiscount: Joi.number().min(0).allow(null),
  expirationDate: Joi.date().iso().required(),
  isActive: Joi.boolean().default(true),
  createdAt: Joi.date().timestamp().default(Date.now()),
  updatedAt: Joi.date().timestamp().default(null),
  _destroy: Joi.boolean().default(false),
  usageLimit: Joi.number().allow(null).default(null),
  usageCount: Joi.number().min(0).default(0),
  applicableCategories: Joi.array()
    .items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE))
    .default([]),
  applicableProducts: Joi.array()
    .items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE))
    .default([])
})

const INVALID_UPDATE_FIELDS = ['_id', 'createdAt', 'updatedAt']

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

const updateVoucher = async (updateData: IVoucher) => {
  if (!OBJECT_ID_RULE.test(updateData?._id?.toString() || '')) throw new Error(OBJECT_ID_RULE_MESSAGE)

  INVALID_UPDATE_FIELDS.forEach((field) => {
    delete (updateData as any)[field]
  })

  return await getDB()
    .collection(VOUCHER_COLLECTION_NAME)
    .findOneAndUpdate(
      { _id: ObjectId.createFromHexString(updateData?._id?.toString() || '') },
      { $set: { ...updateData, updatedAt: Date.now() } },
      { returnDocument: 'after' }
    )
}

const createVoucher = async (voucherData: IVoucher) => {
  const validatedData = await validateData(voucherData)
  const result = await getDB()
    .collection(VOUCHER_COLLECTION_NAME)
    .insertOne({
      ...validatedData,
      applicableCategories: validatedData.applicableCategories.map((id: string) => ObjectId.createFromHexString(id)),
      applicableProducts: validatedData.applicableProducts.map((id: string) => ObjectId.createFromHexString(id))
    })

  return await getDB().collection(VOUCHER_COLLECTION_NAME).findOne({ _id: result.insertedId })
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

const getVoucherByCode = async (code: string) => {
  return await getDB().collection(VOUCHER_COLLECTION_NAME).findOne({ code, _destroy: false })
}

export const voucherModel = {
  VOUCHER_COLLECTION_NAME,
  VOUCHER_COLLECTION_SCHEMA,
  getAllVouchers,
  getVoucherById,
  updateVoucher,
  deleteVoucher,
  createVoucher,
  getVoucherByCode
}
