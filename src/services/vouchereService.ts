import { voucherModel } from '~/models/voucherModel.js'
import ApiError from '~/utils/ApiError.js'
import { StatusCodes } from 'http-status-codes'
import { IVoucher } from '~/@types/voucher/interface.js'
import { getDB } from '~/configs/mongodb.js'

const getAllVouchers = async () => {
  const vouchers = getDB().collection(voucherModel.VOUCHER_COLLECTION_NAME).find({ _destroy: false }).toArray()

  return vouchers
}

const getVoucherById = async (id: string) => {
  const voucher = await voucherModel.getVoucherById(id)
  if (!voucher) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Voucher not found!')
  }
  return voucher
}

const createVoucher = async (data: IVoucher) => {
  return await voucherModel.createVoucher({
    ...data,
    createdAt: Date.now(),
    updatedAt: Date.now()
  })
}
const updateVoucher = async (id: string, updateData: IVoucher) => {
  const existingVoucher = await voucherModel.getVoucherById(id)
  if (!existingVoucher) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Voucher not found!')
  }

  const updatedVoucher = await voucherModel.updateVoucher(id, {
    ...existingVoucher,
    ...updateData,
    updatedAt: Date.now(),
    code: updateData.code ?? existingVoucher.code
  })
  if (!updatedVoucher) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Voucher update failed!')
  }
  return updatedVoucher
}
const deleteVoucher = async (id: string) => {
  const existingVoucher = await voucherModel.getVoucherById(id)
  if (!existingVoucher) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Voucher not found!')
  }

  const deletedVoucher = await voucherModel.updateVoucher(id, {
    _destroy: true,
    updatedAt: Date.now(),
    code: '',
    discountType: 'percent',
    discountValue: 0,
    minOrderValue: 0,
    expirationDate: ''
  })

  if (!deletedVoucher) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to delete voucher!')
  }

  return deletedVoucher
}

export const voucherService = {
  getAllVouchers,
  getVoucherById,
  createVoucher,
  updateVoucher,
  deleteVoucher
}
