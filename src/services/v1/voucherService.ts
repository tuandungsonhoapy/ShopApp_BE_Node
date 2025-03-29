import { voucherModel } from '~/models/v1/voucherModel.js'
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
  const voucher = await voucherModel.getVoucherByCode(data.code)

  if (voucher) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Voucher code already exists!')
  }

  return await voucherModel.createVoucher({
    ...data,
    createdAt: Date.now(),
    updatedAt: Date.now()
  })
}

const updateVoucher = async (updateData: IVoucher) => {
  const updatedVoucher = await voucherModel.updateVoucher({
    ...updateData,
    updatedAt: Date.now()
  })

  if (!updatedVoucher) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Voucher update failed!')
  }

  return updatedVoucher
}

const deleteVoucher = async (id: string) => {
  const deletedVoucher = await voucherModel.deleteVoucher(id)

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
