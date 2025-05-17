import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import { voucherService } from '~/services/v1/voucherService.js'

const getAllVouchers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const vouchers = await voucherService.getAllVouchers()
    res.status(StatusCodes.OK).json({ message: 'Get all vouchers succesfully!', vouchers })
  } catch (error) {
    next(error)
  }
}

const getVoucherById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const voucher = await voucherService.getVoucherById(req.params.id)
    res.status(StatusCodes.OK).json({ message: 'Get voucher by id succesfully!', voucher })
  } catch (error) {
    next(error)
  }
}

const createVoucher = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const voucher = await voucherService.createVoucher(req.body)
    res.status(StatusCodes.CREATED).json({ message: 'Voucher created successfully!', voucher })
  } catch (error) {
    next(error)
  }
}

const updateVoucher = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updatedVoucher = await voucherService.updateVoucher({ ...req.body, _id: req.params.id })

    res.status(StatusCodes.OK).json({ message: 'Voucher updated successfully!', updatedVoucher })
  } catch (error) {
    next(error)
  }
}

const deleteVoucher = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const deletedVoucher = await voucherService.deleteVoucher(id)

    res.status(StatusCodes.OK).json({ message: 'Voucher deleted successfully!', deletedVoucher })
  } catch (error) {
    next(error)
  }
}

export const voucherController = {
  getAllVouchers,
  getVoucherById,
  createVoucher,
  updateVoucher,
  deleteVoucher
}
